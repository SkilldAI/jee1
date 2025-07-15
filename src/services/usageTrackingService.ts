// Usage Tracking Service for Free vs Paid Users
export interface UsageQuota {
  questionsPerDay: number;
  questionsPerMonth: number;
  fileUploadsPerDay: number;
  mockTestsPerMonth: number;
  studyPlannerAccess: boolean;
  analyticsAccess: boolean;
  prioritySupport: boolean;
}

export interface UserUsage {
  userId: string;
  questionsToday: number;
  questionsThisMonth: number;
  fileUploadsToday: number;
  mockTestsThisMonth: number;
  lastResetDate: Date;
  subscriptionTier: 'free' | 'premium' | 'institute';
}

export class UsageTrackingService {
  private static instance: UsageTrackingService;
  private userUsage: Map<string, UserUsage> = new Map();

  static getInstance(): UsageTrackingService {
    if (!UsageTrackingService.instance) {
      UsageTrackingService.instance = new UsageTrackingService();
    }
    return UsageTrackingService.instance;
  }

  // Define quotas for different tiers
  private getQuotaForTier(tier: 'free' | 'premium' | 'institute'): UsageQuota {
    switch (tier) {
      case 'free':
        return {
          questionsPerDay: 5,
          questionsPerMonth: 100,
          fileUploadsPerDay: 3,
          mockTestsPerMonth: 2,
          studyPlannerAccess: true,
          analyticsAccess: true,
          prioritySupport: false
        };
      case 'premium':
        return {
          questionsPerDay: 100,
          questionsPerMonth: 1000,
          fileUploadsPerDay: 20,
          mockTestsPerMonth: 20,
          studyPlannerAccess: true,
          analyticsAccess: true,
          prioritySupport: true
        };
      case 'institute':
        return {
          questionsPerDay: -1, // Unlimited
          questionsPerMonth: -1,
          fileUploadsPerDay: -1,
          mockTestsPerMonth: -1,
          studyPlannerAccess: true,
          analyticsAccess: true,
          prioritySupport: true
        };
      default:
        return this.getQuotaForTier('free');
    }
  }

  // Initialize user usage tracking
  initializeUser(userId: string, tier: 'free' | 'premium' | 'institute' = 'free'): UserUsage {
    const today = new Date();
    const usage: UserUsage = {
      userId,
      questionsToday: 0,
      questionsThisMonth: 0,
      fileUploadsToday: 0,
      mockTestsThisMonth: 0,
      lastResetDate: today,
      subscriptionTier: tier
    };
    
    this.userUsage.set(userId, usage);
    return usage;
  }

  // Check if user can perform an action
  canPerformAction(userId: string, action: 'question' | 'fileUpload' | 'mockTest' | 'studyPlanner' | 'analytics'): {
    allowed: boolean;
    reason?: string;
    upgradeRequired?: boolean;
  } {
    const usage = this.getUserUsage(userId);
    const quota = this.getQuotaForTier(usage.subscriptionTier);

    // Reset daily/monthly counters if needed
    this.resetCountersIfNeeded(usage);

    switch (action) {
      case 'question':
        if (quota.questionsPerDay !== -1 && usage.questionsToday >= quota.questionsPerDay) {
          return {
            allowed: false,
            reason: `Daily question limit reached (${quota.questionsPerDay}). Upgrade for unlimited questions!`,
            upgradeRequired: true
          };
        }
        if (quota.questionsPerMonth !== -1 && usage.questionsThisMonth >= quota.questionsPerMonth) {
          return {
            allowed: false,
            reason: `Monthly question limit reached (${quota.questionsPerMonth}). Upgrade for more questions!`,
            upgradeRequired: true
          };
        }
        return { allowed: true };

      case 'fileUpload':
        if (quota.fileUploadsPerDay !== -1 && usage.fileUploadsToday >= quota.fileUploadsPerDay) {
          return {
            allowed: false,
            reason: `Daily file upload limit reached (${quota.fileUploadsPerDay}). Upgrade for more uploads!`,
            upgradeRequired: true
          };
        }
        return { allowed: true };

      case 'mockTest':
        if (quota.mockTestsPerMonth !== -1 && usage.mockTestsThisMonth >= quota.mockTestsPerMonth) {
          return {
            allowed: false,
            reason: `Monthly mock test limit reached (${quota.mockTestsPerMonth}). Upgrade for unlimited tests!`,
            upgradeRequired: true
          };
        }
        return { allowed: true };

      case 'studyPlanner':
        if (!quota.studyPlannerAccess) {
          return {
            allowed: false,
            reason: 'Study Planner is a premium feature. Upgrade to access personalized study plans!',
            upgradeRequired: true
          };
        }
        return { allowed: true };

      case 'analytics':
        if (!quota.analyticsAccess) {
          return {
            allowed: false,
            reason: 'Advanced Analytics is a premium feature. Upgrade to track your progress!',
            upgradeRequired: true
          };
        }
        return { allowed: true };

      default:
        return { allowed: true };
    }
  }

  // Record usage
  recordUsage(userId: string, action: 'question' | 'fileUpload' | 'mockTest'): void {
    const usage = this.getUserUsage(userId);
    this.resetCountersIfNeeded(usage);

    switch (action) {
      case 'question':
        usage.questionsToday++;
        usage.questionsThisMonth++;
        break;
      case 'fileUpload':
        usage.fileUploadsToday++;
        break;
      case 'mockTest':
        usage.mockTestsThisMonth++;
        break;
    }

    this.userUsage.set(userId, usage);
  }

  // Get user's current usage
  getUserUsage(userId: string): UserUsage {
    if (!this.userUsage.has(userId)) {
      return this.initializeUser(userId);
    }
    return this.userUsage.get(userId)!;
  }

  // Get usage statistics for display
  getUsageStats(userId: string): {
    questionsUsed: { today: number; month: number };
    questionsLimit: { today: number; month: number };
    fileUploadsUsed: number;
    fileUploadsLimit: number;
    mockTestsUsed: number;
    mockTestsLimit: number;
    tier: string;
    upgradeAvailable: boolean;
  } {
    const usage = this.getUserUsage(userId);
    const quota = this.getQuotaForTier(usage.subscriptionTier);

    return {
      questionsUsed: {
        today: usage.questionsToday,
        month: usage.questionsThisMonth
      },
      questionsLimit: {
        today: quota.questionsPerDay,
        month: quota.questionsPerMonth
      },
      fileUploadsUsed: usage.fileUploadsToday,
      fileUploadsLimit: quota.fileUploadsPerDay,
      mockTestsUsed: usage.mockTestsThisMonth,
      mockTestsLimit: quota.mockTestsPerMonth,
      tier: usage.subscriptionTier,
      upgradeAvailable: usage.subscriptionTier === 'free'
    };
  }

  // Reset counters if day/month has changed
  private resetCountersIfNeeded(usage: UserUsage): void {
    const now = new Date();
    const lastReset = usage.lastResetDate;

    // Reset daily counters
    if (now.getDate() !== lastReset.getDate() || 
        now.getMonth() !== lastReset.getMonth() || 
        now.getFullYear() !== lastReset.getFullYear()) {
      usage.questionsToday = 0;
      usage.fileUploadsToday = 0;
    }

    // Reset monthly counters
    if (now.getMonth() !== lastReset.getMonth() || 
        now.getFullYear() !== lastReset.getFullYear()) {
      usage.questionsThisMonth = 0;
      usage.mockTestsThisMonth = 0;
    }

    usage.lastResetDate = now;
  }

  // Upgrade user subscription
  upgradeUser(userId: string, newTier: 'premium' | 'institute'): void {
    const usage = this.getUserUsage(userId);
    usage.subscriptionTier = newTier;
    this.userUsage.set(userId, usage);
  }
}

export const usageTrackingService = UsageTrackingService.getInstance();