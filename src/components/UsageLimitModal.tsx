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
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-3 rounded-full inline-block mb-4">
            <Crown className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Upgrade to Premium
          </h2>
          <p className="text-gray-600">
            {message}
          </p>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-6">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
            <Zap className="h-5 w-5 text-yellow-500 mr-2" />
            Premium Features
          </h3>
          <div className="space-y-2">
            {premiumFeatures.slice(0, 4).map((feature, index) => (
              <div key={index} className="flex items-center text-sm text-gray-700">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                {feature}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={onUpgrade}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <Crown className="h-5 w-5" />
            <span>Upgrade Now</span>
            <ArrowRight className="h-4 w-4" />
          </button>
          
          <button
            onClick={onClose}
            className="w-full border border-gray-300 text-gray-700 font-medium py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Continue with Free Plan
          </button>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            ✨ Join 500+ institutes already using Premium
          </p>
        </div>
      </div>
    </div>
  );
};

export default UsageLimitModal;