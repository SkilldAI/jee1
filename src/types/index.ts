export interface Subject {
  id: string;
  name: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  subject?: Subject;
  analysis?: QuestionAnalysis;
  fileContent?: {
    text: string;
    type: 'image' | 'pdf' | 'text';
    fileName: string;
  };
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  wasCorrect?: boolean;
}

export interface QuestionAnalysis {
  concepts: string[];
  complexityLevel: number;
  complexityJustification: string;
  examRelevance: string;
  commonTraps: string[];
  realWorldApplications: string[];
  furtherStudy: string[];
  progressNote: string;
}

export interface ChatSession {
  id: string;
  subject: Subject;
  messages: ChatMessage[];
  createdAt: Date;
  lastActivity: Date;
}

export interface UserProgress {
  subject: string;
  currentLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  difficultyPreference: 'Easy' | 'Medium' | 'Hard';
  accuracyRate: number;
  totalQuestions: number;
  correctAnswers: number;
  conceptMastery: { [concept: string]: number }; // 0-100 score
  weakAreas: string[];
  strongAreas: string[];
  lastUpdated: Date;
  streakCount: number;
  averageResponseTime: number; // in seconds
}

export interface AdaptiveSuggestion {
  type: 'question' | 'concept_review' | 'practice_more' | 'advance_level';
  content: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  reasoning: string;
  priority: number; // 1-5, higher is more important
}

// Study Planning Types
export interface StudyGoal {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'exam-specific';
  targetValue: number;
  currentValue: number;
  unit: 'hours' | 'questions' | 'topics' | 'chapters' | 'mock-tests';
  subject?: string;
  deadline: Date;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'completed' | 'paused' | 'overdue';
  createdAt: Date;
  completedAt?: Date;
}

export interface StudySession {
  id: string;
  subject: string;
  topic: string;
  type: 'study' | 'practice' | 'revision' | 'mock-test';
  duration: number; // in minutes
  plannedDuration: number;
  startTime: Date;
  endTime?: Date;
  status: 'scheduled' | 'active' | 'completed' | 'skipped';
  productivity: number; // 1-5 rating
  notes?: string;
  questionsAttempted?: number;
  accuracy?: number;
}

export interface StudyPlan {
  id: string;
  name: string;
  examDate: Date;
  examType: 'JEE Main' | 'JEE Advanced' | 'NEET' | 'Custom';
  currentLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  weeklyHours: number;
  subjects: {
    subject: string;
    weightage: number; // percentage
    currentStrength: number; // 1-10
    targetStrength: number; // 1-10
    weeklyHours: number;
  }[];
  createdAt: Date;
  lastUpdated: Date;
  isActive: boolean;
}

export interface StudyCalendarEvent {
  id: string;
  title: string;
  subject: string;
  topic: string;
  type: 'study' | 'practice' | 'revision' | 'mock-test' | 'break';
  startTime: Date;
  endTime: Date;
  duration: number; // in minutes
  priority: 'low' | 'medium' | 'high';
  status: 'scheduled' | 'completed' | 'missed' | 'rescheduled';
  isRecurring: boolean;
  recurringPattern?: 'daily' | 'weekly' | 'monthly';
  description?: string;
  reminders: number[]; // minutes before event
}

export interface PomodoroSession {
  id: string;
  subject: string;
  topic: string;
  duration: number; // 25, 50, or custom
  breakDuration: number; // 5, 10, 15
  startTime: Date;
  endTime?: Date;
  status: 'active' | 'break' | 'completed' | 'paused';
  cycleCount: number;
  totalCycles: number;
  productivity: number; // 1-5 rating
  distractions: number;
  notes?: string;
}

export interface RevisionItem {
  id: string;
  subject: string;
  topic: string;
  concept: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  lastReviewed: Date;
  nextReview: Date;
  reviewCount: number;
  masteryLevel: number; // 0-100
  interval: number; // days until next review
  easeFactor: number; // spaced repetition ease factor
  isActive: boolean;
}

export interface StudyStreak {
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: Date;
  totalStudyDays: number;
  weeklyGoal: number; // days per week
  monthlyGoal: number; // days per month
}

export interface TimeBlock {
  id: string;
  name: string;
  startTime: string; // HH:MM format
  endTime: string;
  subjects: string[];
  isActive: boolean;
  days: ('monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday')[];
  type: 'fixed' | 'flexible';
}