import React from 'react';
import { BarChart3, Crown, Zap } from 'lucide-react';
import { usageTrackingService } from '../services/usageTrackingService';

interface UsageIndicatorProps {
  userId: string;
  onUpgrade: () => void;
}

const UsageIndicator: React.FC<UsageIndicatorProps> = ({ userId, onUpgrade }) => {
  const stats = usageTrackingService.getUsageStats(userId);

  const getProgressColor = (used: number, limit: number) => {
    if (limit === -1) return 'bg-green-500'; // Unlimited
    const percentage = (used / limit) * 100;
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  const formatLimit = (limit: number) => {
    return limit === -1 ? '∞' : limit.toString();
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <BarChart3 className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">Daily Usage</h3>
        </div>
      </div>

      <div className="space-y-3">
        {/* Questions Usage */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Questions</span>
            <span className="font-medium">
              {stats.questionsUsed.today}/{formatLimit(stats.questionsLimit.today)}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${getProgressColor(
                stats.questionsUsed.today,
                stats.questionsLimit.today
              )}`}
              style={{
                width: stats.questionsLimit.today === -1 
                  ? '100%' 
                  : `${Math.min(100, (stats.questionsUsed.today / stats.questionsLimit.today) * 100)}%`
              }}
            />
          </div>
        </div>

        {/* File Uploads Usage */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">File Uploads</span>
            <span className="font-medium">
              {stats.fileUploadsUsed}/{formatLimit(stats.fileUploadsLimit)}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${getProgressColor(
                stats.fileUploadsUsed,
                stats.fileUploadsLimit
              )}`}
              style={{
                width: stats.fileUploadsLimit === -1 
                  ? '100%' 
                  : `${Math.min(100, (stats.fileUploadsUsed / stats.fileUploadsLimit) * 100)}%`
              }}
            />
          </div>
        </div>

        {/* Mock Tests Usage */}
      </div>

      {/* Tier Display */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="text-center">
          <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
            JEE/NEET AI Tutor - MVP
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Limits reset daily at midnight
          </p>
        </div>
      </div>
    </div>
  );
};

export default UsageIndicator;