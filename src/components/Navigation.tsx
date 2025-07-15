import React from 'react';
import { BarChart3, BookOpen, MessageCircle, Target, Calendar, Brain, Database } from 'lucide-react';
import { usageTrackingService } from '../services/usageTrackingService';
import { useAuth } from '../contexts/AuthContext';

interface NavigationProps {
  currentPage: 'chat' | 'mock-exams' | 'study-planner';
  onPageChange: (page: 'chat' | 'mock-exams' | 'study-planner') => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage, onPageChange }) => {
  const { user } = useAuth();
  const userId = user?.id || 'anonymous';

  const handlePageChange = (page: 'chat' | 'mock-exams' | 'study-planner') => {
    // Check access for premium features
    if (page === 'study-planner') {
      const canAccess = usageTrackingService.canPerformAction(userId, 'studyPlanner');
      if (!canAccess.allowed) {
        alert(canAccess.reason + '\n\nUpgrade to Premium to access the Study Planner!');
        return;
      }
    }
    
    if (page === 'mock-exams') {
      const canAccess = usageTrackingService.canPerformAction(userId, 'mockTest');
      if (!canAccess.allowed) {
        alert(canAccess.reason + '\n\nUpgrade to Premium for unlimited mock tests!');
        return;
      }
    }
    
    onPageChange(page);
  };

  const navItems = [
    {
      id: 'chat' as const,
      name: 'AI Tutor',
      icon: MessageCircle,
      description: 'Chat with AI'
    },
    {
      id: 'study-planner' as const,
      name: 'Study Planner',
      icon: Calendar,
      description: 'Plan & Schedule'
    },
    {
      id: 'mock-exams' as const,
      name: 'Mock Exams',
      icon: Target,
      description: 'Practice Tests'
    }
  ];

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-center space-x-8">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => handlePageChange(item.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Icon className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">{item.name}</div>
                <div className="text-xs opacity-75">{item.description}</div>
              </div>
              {/* Premium badge for restricted features */}
              {(item.id === 'study-planner' || item.id === 'mock-exams') && 
               !usageTrackingService.canPerformAction(userId, item.id === 'study-planner' ? 'studyPlanner' : 'mockTest').allowed && (
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                  Pro
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;