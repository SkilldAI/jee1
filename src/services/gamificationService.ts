// Gamification Service for Student Engagement
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'streak' | 'accuracy' | 'speed' | 'topic' | 'special';
  requirement: {
    type: 'streak' | 'accuracy' | 'questions' | 'time' | 'topic_mastery';
    value: number;
    subject?: string;
  };
  points: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: Date;
}

export interface DailyChallenge {
  id: string;
  date: string;
  subject: string;
  questionId: string;
  bonusPoints: number;
  completed: boolean;
  completedAt?: Date;
}

export interface StudentStats {
  level: number;
  totalPoints: number;
  currentStreak: number;
  longestStreak: number;
  questionsAnswered: number;
  averageAccuracy: number;
  timeSpent: number; // in minutes
  achievements: Achievement[];
  dailyChallenges: DailyChallenge[];
  subjectMastery: { [subject: string]: number }; // 0-100
}

export class GamificationService {
  private static instance: GamificationService;
  private studentStats: Map<string, StudentStats> = new Map();
  private achievements: Achievement[] = [];

  static getInstance(): GamificationService {
    if (!GamificationService.instance) {
      GamificationService.instance = new GamificationService();
      GamificationService.instance.initializeAchievements();
    }
    return GamificationService.instance;
  }

  private initializeAchievements(): void {
    this.achievements = [
      // Streak Achievements
      {
        id: 'first_streak',
        title: '🔥 Getting Started',
        description: 'Answer 3 questions in a row correctly',
        icon: '🔥',
        category: 'streak',
        requirement: { type: 'streak', value: 3 },
        points: 50,
        rarity: 'common'
      },
      {
        id: 'fire_streak',
        title: '🔥 On Fire!',
        description: 'Maintain a 10-question streak',
        icon: '🔥',
        category: 'streak',
        requirement: { type: 'streak', value: 10 },
        points: 200,
        rarity: 'rare'
      },
      {
        id: 'unstoppable',
        title: '⚡ Unstoppable',
        description: 'Achieve a 25-question streak',
        icon: '⚡',
        category: 'streak',
        requirement: { type: 'streak', value: 25 },
        points: 500,
        rarity: 'epic'
      },

      // Accuracy Achievements
      {
        id: 'sharp_shooter',
        title: '🎯 Sharp Shooter',
        description: 'Maintain 90% accuracy over 20 questions',
        icon: '🎯',
        category: 'accuracy',
        requirement: { type: 'accuracy', value: 90 },
        points: 300,
        rarity: 'rare'
      },
      {
        id: 'perfectionist',
        title: '💎 Perfectionist',
        description: 'Achieve 100% accuracy on 10 consecutive questions',
        icon: '💎',
        category: 'accuracy',
        requirement: { type: 'accuracy', value: 100 },
        points: 750,
        rarity: 'legendary'
      },

      // Volume Achievements
      {
        id: 'century',
        title: '💯 Century',
        description: 'Answer 100 questions correctly',
        icon: '💯',
        category: 'streak',
        requirement: { type: 'questions', value: 100 },
        points: 400,
        rarity: 'epic'
      },
      {
        id: 'marathon',
        title: '🏃 Marathon Runner',
        description: 'Answer 500 questions',
        icon: '🏃',
        category: 'streak',
        requirement: { type: 'questions', value: 500 },
        points: 1000,
        rarity: 'legendary'
      },

      // Subject Mastery
      {
        id: 'physics_master',
        title: '⚛️ Physics Master',
        description: 'Achieve 85% mastery in Physics',
        icon: '⚛️',
        category: 'topic',
        requirement: { type: 'topic_mastery', value: 85, subject: 'Physics' },
        points: 600,
        rarity: 'epic'
      },
      {
        id: 'chemistry_wizard',
        title: '🧪 Chemistry Wizard',
        description: 'Achieve 85% mastery in Chemistry',
        icon: '🧪',
        category: 'topic',
        requirement: { type: 'topic_mastery', value: 85, subject: 'Chemistry' },
        points: 600,
        rarity: 'epic'
      },
      {
        id: 'bio_expert',
        title: '🧬 Biology Expert',
        description: 'Achieve 85% mastery in Biology',
        icon: '🧬',
        category: 'topic',
        requirement: { type: 'topic_mastery', value: 85, subject: 'Biology' },
        points: 600,
        rarity: 'epic'
      },
      {
        id: 'math_genius',
        title: '📐 Math Genius',
        description: 'Achieve 85% mastery in Mathematics',
        icon: '📐',
        category: 'topic',
        requirement: { type: 'topic_mastery', value: 85, subject: 'Mathematics' },
        points: 600,
        rarity: 'epic'
      },

      // Speed Achievements
      {
        id: 'speed_demon',
        title: '⚡ Speed Demon',
        description: 'Answer 10 questions in under 5 minutes',
        icon: '⚡',
        category: 'speed',
        requirement: { type: 'time', value: 300 }, // 5 minutes in seconds
        points: 250,
        rarity: 'rare'
      },

      // Special Achievements
      {
        id: 'daily_warrior',
        title: '🗓️ Daily Warrior',
        description: 'Complete daily challenges for 7 days straight',
        icon: '🗓️',
        category: 'special',
        requirement: { type: 'streak', value: 7 },
        points: 400,
        rarity: 'epic'
      },
      {
        id: 'jee_champion',
        title: '🏆 JEE Champion',
        description: 'Score 90%+ on a full JEE mock test',
        icon: '🏆',
        category: 'special',
        requirement: { type: 'accuracy', value: 90 },
        points: 1000,
        rarity: 'legendary'
      }
    ];
  }

  // Initialize student stats
  initializeStudent(studentId: string): StudentStats {
    if (!this.studentStats.has(studentId)) {
      const stats: StudentStats = {
        level: 1,
        totalPoints: 0,
        currentStreak: 0,
        longestStreak: 0,
        questionsAnswered: 0,
        averageAccuracy: 0,
        timeSpent: 0,
        achievements: [],
        dailyChallenges: [],
        subjectMastery: {
          Physics: 0,
          Chemistry: 0,
          Biology: 0,
          Mathematics: 0
        }
      };
      this.studentStats.set(studentId, stats);
    }
    return this.studentStats.get(studentId)!;
  }

  // Update stats after answering a question
  updateStats(
    studentId: string, 
    subject: string, 
    wasCorrect: boolean, 
    timeSpent: number,
    difficulty: 'Easy' | 'Medium' | 'Hard'
  ): { newAchievements: Achievement[]; levelUp: boolean } {
    const stats = this.initializeStudent(studentId);
    
    // Update basic stats
    stats.questionsAnswered++;
    stats.timeSpent += timeSpent;
    
    // Update accuracy
    const totalCorrect = Math.round(stats.averageAccuracy * (stats.questionsAnswered - 1) / 100) + (wasCorrect ? 1 : 0);
    stats.averageAccuracy = Math.round((totalCorrect / stats.questionsAnswered) * 100);
    
    // Update streak
    if (wasCorrect) {
      stats.currentStreak++;
      if (stats.currentStreak > stats.longestStreak) {
        stats.longestStreak = stats.currentStreak;
      }
    } else {
      stats.currentStreak = 0;
    }
    
    // Update subject mastery
    const difficultyMultiplier = { Easy: 1, Medium: 1.5, Hard: 2 }[difficulty];
    const masteryGain = wasCorrect ? (5 * difficultyMultiplier) : -2;
    stats.subjectMastery[subject] = Math.max(0, Math.min(100, stats.subjectMastery[subject] + masteryGain));
    
    // Award points
    const basePoints = { Easy: 10, Medium: 20, Hard: 30 }[difficulty];
    const streakBonus = Math.min(stats.currentStreak * 2, 50);
    const points = wasCorrect ? (basePoints + streakBonus) : 0;
    stats.totalPoints += points;
    
    // Check for level up
    const newLevel = Math.floor(stats.totalPoints / 1000) + 1;
    const levelUp = newLevel > stats.level;
    stats.level = newLevel;
    
    // Check for new achievements
    const newAchievements = this.checkAchievements(studentId, stats);
    
    this.studentStats.set(studentId, stats);
    
    return { newAchievements, levelUp };
  }

  // Check for new achievements
  private checkAchievements(studentId: string, stats: StudentStats): Achievement[] {
    const newAchievements: Achievement[] = [];
    const unlockedIds = stats.achievements.map(a => a.id);
    
    for (const achievement of this.achievements) {
      if (unlockedIds.includes(achievement.id)) continue;
      
      let unlocked = false;
      
      switch (achievement.requirement.type) {
        case 'streak':
          unlocked = stats.currentStreak >= achievement.requirement.value;
          break;
        case 'accuracy':
          unlocked = stats.averageAccuracy >= achievement.requirement.value;
          break;
        case 'questions':
          unlocked = stats.questionsAnswered >= achievement.requirement.value;
          break;
        case 'topic_mastery':
          if (achievement.requirement.subject) {
            unlocked = stats.subjectMastery[achievement.requirement.subject] >= achievement.requirement.value;
          }
          break;
      }
      
      if (unlocked) {
        const unlockedAchievement = { ...achievement, unlockedAt: new Date() };
        stats.achievements.push(unlockedAchievement);
        stats.totalPoints += achievement.points;
        newAchievements.push(unlockedAchievement);
      }
    }
    
    return newAchievements;
  }

  // Get student stats
  getStats(studentId: string): StudentStats {
    return this.initializeStudent(studentId);
  }

  // Generate daily challenge
  generateDailyChallenge(studentId: string, subject: string): DailyChallenge {
    const today = new Date().toISOString().split('T')[0];
    const challengeId = `daily-${today}-${subject}`;
    
    const challenge: DailyChallenge = {
      id: challengeId,
      date: today,
      subject,
      questionId: `challenge-${subject}-${today}`,
      bonusPoints: 100,
      completed: false
    };
    
    const stats = this.initializeStudent(studentId);
    const existingChallenge = stats.dailyChallenges.find(c => c.id === challengeId);
    
    if (!existingChallenge) {
      stats.dailyChallenges.push(challenge);
      this.studentStats.set(studentId, stats);
    }
    
    return existingChallenge || challenge;
  }

  // Complete daily challenge
  completeDailyChallenge(studentId: string, challengeId: string): void {
    const stats = this.initializeStudent(studentId);
    const challenge = stats.dailyChallenges.find(c => c.id === challengeId);
    
    if (challenge && !challenge.completed) {
      challenge.completed = true;
      challenge.completedAt = new Date();
      stats.totalPoints += challenge.bonusPoints;
      this.studentStats.set(studentId, stats);
    }
  }

  // Get leaderboard
  getLeaderboard(limit: number = 10): Array<{
    studentId: string;
    level: number;
    totalPoints: number;
    averageAccuracy: number;
    currentStreak: number;
  }> {
    return Array.from(this.studentStats.entries())
      .map(([studentId, stats]) => ({
        studentId,
        level: stats.level,
        totalPoints: stats.totalPoints,
        averageAccuracy: stats.averageAccuracy,
        currentStreak: stats.currentStreak
      }))
      .sort((a, b) => b.totalPoints - a.totalPoints)
      .slice(0, limit);
  }
}

export const gamificationService = GamificationService.getInstance();