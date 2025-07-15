import React from 'react';
import { X, Crown, Zap, CheckCircle, ArrowRight } from 'lucide-react';

interface UsageLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  limitType: 'questions' | 'fileUpload' | 'mockTest' | 'studyPlanner' | 'analytics';
  message: string;
  onUpgrade: () => void;
}

const UsageLimitModal: React.FC<UsageLimitModalProps> = ({
  isOpen,
  onClose,
  limitType,
  message,
  onUpgrade
}) => {
  if (!isOpen) return null;

  const getFeatureTitle = () => {
    switch (limitType) {
      case 'questions': return 'Unlimited Questions';
      case 'fileUpload': return 'Unlimited File Uploads';
      case 'mockTest': return 'Unlimited Mock Tests';
      case 'studyPlanner': return 'AI Study Planner';
      case 'analytics': return 'Advanced Analytics';
      default: return 'Premium Features';
    }
  };

  const premiumFeatures = [
    'Unlimited AI questions & answers',
    'Unlimited file uploads with OCR',
    'Unlimited mock tests & practice',
    'AI-powered study planner',
    'Advanced progress analytics',
    'Priority support',
    'Exam-specific content',
    'Performance tracking'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center mb-6">
          <div className="bg-gradient-to-r from-red-400 to-red-500 p-3 rounded-full inline-block mb-4">
            <AlertCircle className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Daily Limit Reached
          </h2>
          <p className="text-gray-600">
            {message}
          </p>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 mb-6">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
            <Clock className="h-5 w-5 text-blue-500 mr-2" />
            Come Back Tomorrow!
          </h3>
          <p className="text-sm text-gray-700">
            Your daily limit helps us provide quality AI responses to all students. 
            Your usage will reset at midnight. Thank you for understanding!
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors"
          >
            Got it, thanks!
          </button>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            ✨ Helping students prepare for JEE/NEET success
          </p>
        </div>
      </div>
    </div>
  );
};

export default UsageLimitModal;