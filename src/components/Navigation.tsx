import React from 'react';
import { BarChart3, BookOpen, MessageCircle, Target, Calendar, Brain } from 'lucide-react';

interface NavigationProps {
  currentPage: 'chat' | 'analytics' | 'mock-exams' | 'study-planner' | 'learning-path';
  onPageChange: (page: 'chat' | 'analytics' | 'mock-exams' | 'study-planner' | 'learning-path') => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage, onPageChange }) => {
  const navItems = [
    {
      id: 'chat' as const,
      name: 'AI Tutor',
      icon: MessageCircle,
      description: 'Chat with AI'
    },
    {
      id: 'learning-path' as const,
      name: 'Learning Path',
      icon: Brain,
      description: 'AI Recommendations'
    },
    {
      id: 'study-planner' as const,
      name: 'Study Planner',
      icon: Calendar,
      description: 'Plan & Schedule'
    },
    {
      id: 'analytics' as const,
      name: 'Analytics',
      icon: BarChart3,
      description: 'Track Progress'
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
              onClick={() => onPageChange(item.id)}
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
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;