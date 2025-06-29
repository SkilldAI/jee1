import { Subject, UserProgress, AdaptiveSuggestion } from '../types';

// Adaptive Learning Service for personalized difficulty adjustment
export class AdaptiveLearningService {
  private static instance: AdaptiveLearningService;
  private userProgress: Map<string, UserProgress> = new Map();

  static getInstance(): AdaptiveLearningService {
    if (!AdaptiveLearningService.instance) {
      AdaptiveLearningService.instance = new AdaptiveLearningService();
    }
    return AdaptiveLearningService.instance;
  }

  // Initialize user progress for a subject
  initializeProgress(subject: Subject): UserProgress {
    const key = subject.id;
    if (!this.userProgress.has(key)) {
      const progress: UserProgress = {
        subject: subject.name,
        currentLevel: 'Beginner',
        difficultyPreference: 'Easy',
        accuracyRate: 0,
        totalQuestions: 0,
        correctAnswers: 0,
        conceptMastery: {},
        weakAreas: [],
        strongAreas: [],
        lastUpdated: new Date(),
        streakCount: 0,
        averageResponseTime: 0
      };
      this.userProgress.set(key, progress);
    }
    return this.userProgress.get(key)!;
  }

  // Get current user progress
  getProgress(subject: Subject): UserProgress {
    return this.initializeProgress(subject);
  }

  // Update progress based on user interaction
  updateProgress(
    subject: Subject, 
    wasCorrect: boolean, 
    difficulty: 'Easy' | 'Medium' | 'Hard',
    concepts: string[],
    responseTime: number = 30
  ): UserProgress {
    const progress = this.getProgress(subject);
    
    // Update basic stats
    progress.totalQuestions++;
    if (wasCorrect) {
      progress.correctAnswers++;
      progress.streakCount++;
    } else {
      progress.streakCount = 0;
    }
    
    // Calculate accuracy rate
    progress.accuracyRate = (progress.correctAnswers / progress.totalQuestions) * 100;
    
    // Update average response time
    progress.averageResponseTime = (progress.averageResponseTime + responseTime) / 2;
    
    // Update concept mastery
    concepts.forEach(concept => {
      if (!progress.conceptMastery[concept]) {
        progress.conceptMastery[concept] = 50; // Start at neutral
      }
      
      if (wasCorrect) {
        progress.conceptMastery[concept] = Math.min(100, progress.conceptMastery[concept] + 10);
      } else {
        progress.conceptMastery[concept] = Math.max(0, progress.conceptMastery[concept] - 5);
      }
    });
    
    // Update weak and strong areas
    this.updateAreasOfStrength(progress);
    
    // Update difficulty preference and level
    this.adjustDifficultyPreference(progress, wasCorrect, difficulty);
    this.updateCurrentLevel(progress);
    
    progress.lastUpdated = new Date();
    this.userProgress.set(subject.id, progress);
    
    return progress;
  }

  // Determine next question difficulty
  getNextDifficulty(subject: Subject, currentStreak: number = 0): 'Easy' | 'Medium' | 'Hard' {
    const progress = this.getProgress(subject);
    
    // If user is new or struggling, start with easier questions
    if (progress.totalQuestions < 5 || progress.accuracyRate < 40) {
      return 'Easy';
    }
    
    // If user is doing well, gradually increase difficulty
    if (progress.accuracyRate > 80 && progress.streakCount >= 3) {
      if (progress.currentLevel === 'Advanced') return 'Hard';
      if (progress.currentLevel === 'Intermediate') return 'Medium';
    }
    
    // If user is struggling with current difficulty, step down
    if (progress.accuracyRate < 60 && progress.streakCount === 0) {
      if (progress.difficultyPreference === 'Hard') return 'Medium';
      if (progress.difficultyPreference === 'Medium') return 'Easy';
    }
    
    // Default to current preference with some variation
    const difficulties: ('Easy' | 'Medium' | 'Hard')[] = ['Easy', 'Medium', 'Hard'];
    const currentIndex = difficulties.indexOf(progress.difficultyPreference);
    
    // Add some randomness to prevent monotony
    const variation = Math.random();
    if (variation < 0.1 && currentIndex > 0) return difficulties[currentIndex - 1];
    if (variation > 0.9 && currentIndex < 2) return difficulties[currentIndex + 1];
    
    return progress.difficultyPreference;
  }

  // Generate adaptive suggestions
  generateSuggestions(subject: Subject): AdaptiveSuggestion[] {
    const progress = this.getProgress(subject);
    const suggestions: AdaptiveSuggestion[] = [];
    
    // Suggest reviewing weak areas
    if (progress.weakAreas.length > 0) {
      suggestions.push({
        type: 'concept_review',
        content: `Let's review ${progress.weakAreas[0]} - you can improve here!`,
        difficulty: 'Easy',
        reasoning: 'Based on your recent performance, this concept needs attention',
        priority: 5
      });
    }
    
    // Suggest advancing if doing well
    if (progress.accuracyRate > 85 && progress.streakCount >= 5) {
      suggestions.push({
        type: 'advance_level',
        content: `You're doing great! Ready for more challenging ${subject.name} problems?`,
        difficulty: progress.difficultyPreference === 'Easy' ? 'Medium' : 'Hard',
        reasoning: 'Your high accuracy suggests you can handle harder questions',
        priority: 4
      });
    }
    
    // Suggest practice if accuracy is moderate
    if (progress.accuracyRate >= 60 && progress.accuracyRate <= 80) {
      suggestions.push({
        type: 'practice_more',
        content: `Practice a few more ${subject.name} problems to build confidence`,
        difficulty: progress.difficultyPreference,
        reasoning: 'Consistent practice will help improve your accuracy',
        priority: 3
      });
    }
    
    // Generate adaptive questions based on weak areas
    progress.weakAreas.slice(0, 2).forEach((area, index) => {
      suggestions.push({
        type: 'question',
        content: `Can you solve a problem about ${area}?`,
        difficulty: 'Easy',
        reasoning: `Targeting your weak area: ${area}`,
        priority: 4 - index
      });
    });
    
    // Generate questions for strong areas to maintain proficiency
    if (progress.strongAreas.length > 0) {
      suggestions.push({
        type: 'question',
        content: `Let's try a challenging problem in ${progress.strongAreas[0]}`,
        difficulty: 'Medium',
        reasoning: 'Maintaining strength in areas you excel at',
        priority: 2
      });
    }
    
    return suggestions.sort((a, b) => b.priority - a.priority).slice(0, 3);
  }

  // Get personalized study recommendations
  getStudyRecommendations(subject: Subject): string[] {
    const progress = this.getProgress(subject);
    const recommendations: string[] = [];
    
    if (progress.accuracyRate < 50) {
      recommendations.push(`Focus on fundamentals in ${subject.name} - review basic concepts first`);
      recommendations.push('Take your time with each problem and understand the solution steps');
    } else if (progress.accuracyRate < 75) {
      recommendations.push('You\'re making good progress! Practice regularly to improve consistency');
      recommendations.push('Focus on your weak areas while maintaining strong concepts');
    } else {
      recommendations.push('Excellent work! Challenge yourself with harder problems');
      recommendations.push('Consider helping others or teaching concepts to deepen understanding');
    }
    
    if (progress.averageResponseTime > 60) {
      recommendations.push('Work on solving problems faster - practice time management');
    }
    
    if (progress.streakCount >= 5) {
      recommendations.push('Great streak! You\'re building strong momentum');
    }
    
    return recommendations;
  }

  // Private helper methods
  private updateAreasOfStrength(progress: UserProgress): void {
    const concepts = Object.entries(progress.conceptMastery);
    
    progress.strongAreas = concepts
      .filter(([_, score]) => score >= 80)
      .map(([concept, _]) => concept)
      .slice(0, 5);
    
    progress.weakAreas = concepts
      .filter(([_, score]) => score <= 40)
      .map(([concept, _]) => concept)
      .slice(0, 5);
  }

  private adjustDifficultyPreference(
    progress: UserProgress, 
    wasCorrect: boolean, 
    currentDifficulty: 'Easy' | 'Medium' | 'Hard'
  ): void {
    // If user is consistently correct, increase difficulty preference
    if (wasCorrect && progress.streakCount >= 3 && progress.accuracyRate > 75) {
      if (currentDifficulty === 'Easy') progress.difficultyPreference = 'Medium';
      else if (currentDifficulty === 'Medium') progress.difficultyPreference = 'Hard';
    }
    
    // If user is struggling, decrease difficulty preference
    if (!wasCorrect && progress.accuracyRate < 60) {
      if (currentDifficulty === 'Hard') progress.difficultyPreference = 'Medium';
      else if (currentDifficulty === 'Medium') progress.difficultyPreference = 'Easy';
    }
  }

  private updateCurrentLevel(progress: UserProgress): void {
    if (progress.accuracyRate >= 85 && progress.totalQuestions >= 20) {
      progress.currentLevel = 'Advanced';
    } else if (progress.accuracyRate >= 65 && progress.totalQuestions >= 10) {
      progress.currentLevel = 'Intermediate';
    } else {
      progress.currentLevel = 'Beginner';
    }
  }

  // Get performance analytics
  getPerformanceAnalytics(subject: Subject): {
    level: string;
    accuracy: number;
    streak: number;
    totalQuestions: number;
    improvement: string;
    nextGoal: string;
  } {
    const progress = this.getProgress(subject);
    
    let improvement = 'Keep practicing!';
    if (progress.accuracyRate > 80) improvement = 'Excellent performance!';
    else if (progress.accuracyRate > 60) improvement = 'Good progress!';
    else if (progress.accuracyRate > 40) improvement = 'Getting better!';
    
    let nextGoal = 'Reach 50% accuracy';
    if (progress.accuracyRate >= 50) nextGoal = 'Reach 70% accuracy';
    if (progress.accuracyRate >= 70) nextGoal = 'Reach 85% accuracy';
    if (progress.accuracyRate >= 85) nextGoal = 'Maintain excellence!';
    
    return {
      level: progress.currentLevel,
      accuracy: Math.round(progress.accuracyRate),
      streak: progress.streakCount,
      totalQuestions: progress.totalQuestions,
      improvement,
      nextGoal
    };
  }
}

export const adaptiveLearningService = AdaptiveLearningService.getInstance();