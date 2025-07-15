import React from 'react';
import { GraduationCap, Brain } from 'lucide-react';
import UserProfile from './UserProfile';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const { user } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">JEE/NEET AI Tutor</h1>
              <p className="text-sm text-gray-500">Powered by Gemini AI</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Brain className="h-4 w-4" />
              <span>Advanced AI Chat</span>
            </div>
            {user && <UserProfile />}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;