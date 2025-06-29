import { 
  StudyGoal, 
  StudySession, 
  StudyPlan, 
  StudyCalendarEvent, 
  PomodoroSession, 
  RevisionItem, 
  StudyStreak, 
  TimeBlock,
  Subject 
} from '../types';

export class StudyPlanningService {
  private static instance: StudyPlanningService;
  private studyPlans: Map<string, StudyPlan> = new Map();
  private studyGoals: Map<string, StudyGoal> = new Map();
  private studySessions: Map<string, StudySession> = new Map();
  private calendarEvents: Map<string, StudyCalendarEvent> = new Map();
  private pomodoroSessions: Map<string, PomodoroSession> = new Map();
  private revisionItems: Map<string, RevisionItem> = new Map();
  private studyStreak: StudyStreak = {
    currentStreak: 0,
    longestStreak: 0,
    lastStudyDate: new Date(),
    totalStudyDays: 0,
    weeklyGoal: 6,
    monthlyGoal: 25
  };
  private timeBlocks: Map<string, TimeBlock> = new Map();

  static getInstance(): StudyPlanningService {
    if (!StudyPlanningService.instance) {
      StudyPlanningService.instance = new StudyPlanningService();
    }
    return StudyPlanningService.instance;
  }

  // Study Plan Management
  createStudyPlan(
    examDate: Date,
    examType: 'JEE Main' | 'JEE Advanced' | 'NEET' | 'Custom',
    currentLevel: 'Beginner' | 'Intermediate' | 'Advanced',
    weeklyHours: number,
    subjects: { subject: string; currentStrength: number; targetStrength: number }[]
  ): StudyPlan {
    const id = Date.now().toString();
    const totalWeightage = subjects.reduce((sum, s) => sum + (s.targetStrength - s.currentStrength), 0);
    
    const studyPlan: StudyPlan = {
      id,
      name: `${examType} Study Plan`,
      examDate,
      examType,
      currentLevel,
      weeklyHours,
      subjects: subjects.map(s => ({
        subject: s.subject,
        weightage: totalWeightage > 0 ? ((s.targetStrength - s.currentStrength) / totalWeightage) * 100 : 25,
        currentStrength: s.currentStrength,
        targetStrength: s.targetStrength,
        weeklyHours: totalWeightage > 0 ? (weeklyHours * (s.targetStrength - s.currentStrength)) / totalWeightage : weeklyHours / subjects.length
      })),
      createdAt: new Date(),
      lastUpdated: new Date(),
      isActive: true
    };

    this.studyPlans.set(id, studyPlan);
    this.generateStudyCalendar(studyPlan);
    this.createAutoGoals(studyPlan);
    
    return studyPlan;
  }

  getActiveStudyPlan(): StudyPlan | null {
    for (const plan of this.studyPlans.values()) {
      if (plan.isActive) return plan;
    }
    return null;
  }

  // Goal Management
  createGoal(
    title: string,
    description: string,
    type: 'daily' | 'weekly' | 'monthly' | 'exam-specific',
    targetValue: number,
    unit: 'hours' | 'questions' | 'topics' | 'chapters' | 'mock-tests',
    deadline: Date,
    priority: 'low' | 'medium' | 'high' | 'critical',
    subject?: string
  ): StudyGoal {
    const id = Date.now().toString();
    const goal: StudyGoal = {
      id,
      title,
      description,
      type,
      targetValue,
      currentValue: 0,
      unit,
      subject,
      deadline,
      priority,
      status: 'active',
      createdAt: new Date()
    };

    this.studyGoals.set(id, goal);
    return goal;
  }

  updateGoalProgress(goalId: string, increment: number): StudyGoal | null {
    const goal = this.studyGoals.get(goalId);
    if (!goal) return null;

    goal.currentValue = Math.min(goal.targetValue, goal.currentValue + increment);
    
    if (goal.currentValue >= goal.targetValue) {
      goal.status = 'completed';
      goal.completedAt = new Date();
    }

    this.studyGoals.set(goalId, goal);
    return goal;
  }

  getActiveGoals(): StudyGoal[] {
    return Array.from(this.studyGoals.values())
      .filter(goal => goal.status === 'active')
      .sort((a, b) => {
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });
  }

  // Calendar Management
  generateStudyCalendar(studyPlan: StudyPlan): void {
    const now = new Date();
    const examDate = studyPlan.examDate;
    const daysUntilExam = Math.ceil((examDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    // Clear existing events for this plan
    for (const [id, event] of this.calendarEvents.entries()) {
      if (event.startTime >= now) {
        this.calendarEvents.delete(id);
      }
    }

    // Generate daily study schedule
    for (let day = 0; day < Math.min(daysUntilExam, 90); day++) {
      const currentDate = new Date(now);
      currentDate.setDate(now.getDate() + day);
      
      // Skip Sundays for regular study (can be customized)
      if (currentDate.getDay() === 0) continue;

      this.generateDaySchedule(currentDate, studyPlan);
    }
  }

  private generateDaySchedule(date: Date, studyPlan: StudyPlan): void {
    const dailyHours = studyPlan.weeklyHours / 6; // Assuming 6 study days per week
    const subjects = studyPlan.subjects.sort((a, b) => b.weeklyHours - a.weeklyHours);
    
    let currentTime = new Date(date);
    currentTime.setHours(9, 0, 0, 0); // Start at 9 AM

    subjects.forEach((subjectPlan, index) => {
      const sessionDuration = Math.max(30, (subjectPlan.weeklyHours / 6) * 60); // Convert to minutes
      
      const event: StudyCalendarEvent = {
        id: `${date.toISOString().split('T')[0]}-${subjectPlan.subject}-${index}`,
        title: `Study ${subjectPlan.subject}`,
        subject: subjectPlan.subject,
        topic: this.getNextTopic(subjectPlan.subject),
        type: this.getSessionType(date, subjectPlan.subject),
        startTime: new Date(currentTime),
        endTime: new Date(currentTime.getTime() + sessionDuration * 60000),
        duration: sessionDuration,
        priority: this.getPriorityFromWeakness(subjectPlan),
        status: 'scheduled',
        isRecurring: false,
        reminders: [15, 5] // 15 and 5 minutes before
      };

      this.calendarEvents.set(event.id, event);
      
      // Add break between sessions
      currentTime = new Date(event.endTime.getTime() + 15 * 60000); // 15-minute break
    });
  }

  private getSessionType(date: Date, subject: string): 'study' | 'practice' | 'revision' | 'mock-test' {
    const dayOfWeek = date.getDay();
    
    // Saturday for mock tests
    if (dayOfWeek === 6) return 'mock-test';
    
    // Every 3rd day for revision
    if (date.getDate() % 3 === 0) return 'revision';
    
    // Every 5th day for practice
    if (date.getDate() % 5 === 0) return 'practice';
    
    return 'study';
  }

  private getNextTopic(subject: string): string {
    // This would be enhanced with actual curriculum data
    const topics = {
      Physics: ['Mechanics', 'Thermodynamics', 'Optics', 'Electricity', 'Magnetism'],
      Chemistry: ['Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry'],
      Biology: ['Cell Biology', 'Genetics', 'Ecology', 'Human Physiology'],
      Mathematics: ['Calculus', 'Algebra', 'Coordinate Geometry', 'Trigonometry']
    };
    
    const subjectTopics = topics[subject as keyof typeof topics] || ['General Topics'];
    return subjectTopics[Math.floor(Math.random() * subjectTopics.length)];
  }

  private getPriorityFromWeakness(subjectPlan: { currentStrength: number; targetStrength: number }): 'low' | 'medium' | 'high' {
    const gap = subjectPlan.targetStrength - subjectPlan.currentStrength;
    if (gap >= 4) return 'high';
    if (gap >= 2) return 'medium';
    return 'low';
  }

  // Pomodoro Timer Management
  startPomodoroSession(
    subject: string,
    topic: string,
    duration: number = 25,
    breakDuration: number = 5,
    totalCycles: number = 4
  ): PomodoroSession {
    const id = Date.now().toString();
    const session: PomodoroSession = {
      id,
      subject,
      topic,
      duration,
      breakDuration,
      startTime: new Date(),
      status: 'active',
      cycleCount: 1,
      totalCycles,
      productivity: 0,
      distractions: 0
    };

    this.pomodoroSessions.set(id, session);
    return session;
  }

  updatePomodoroSession(sessionId: string, updates: Partial<PomodoroSession>): PomodoroSession | null {
    const session = this.pomodoroSessions.get(sessionId);
    if (!session) return null;

    Object.assign(session, updates);
    this.pomodoroSessions.set(sessionId, session);
    
    return session;
  }

  completePomodoroSession(sessionId: string, productivity: number, distractions: number, notes?: string): void {
    const session = this.pomodoroSessions.get(sessionId);
    if (!session) return;

    session.status = 'completed';
    session.endTime = new Date();
    session.productivity = productivity;
    session.distractions = distractions;
    session.notes = notes;

    // Update study session record
    this.recordStudySession(session);
    
    // Update streak
    this.updateStudyStreak();
  }

  // Revision Scheduler (Spaced Repetition)
  addRevisionItem(
    subject: string,
    topic: string,
    concept: string,
    difficulty: 'Easy' | 'Medium' | 'Hard'
  ): RevisionItem {
    const id = Date.now().toString();
    const now = new Date();
    
    const item: RevisionItem = {
      id,
      subject,
      topic,
      concept,
      difficulty,
      lastReviewed: now,
      nextReview: new Date(now.getTime() + 24 * 60 * 60 * 1000), // 1 day
      reviewCount: 0,
      masteryLevel: 0,
      interval: 1,
      easeFactor: 2.5,
      isActive: true
    };

    this.revisionItems.set(id, item);
    return item;
  }

  reviewItem(itemId: string, quality: number): RevisionItem | null {
    // quality: 0-5 (0 = complete blackout, 5 = perfect response)
    const item = this.revisionItems.get(itemId);
    if (!item) return null;

    item.reviewCount++;
    item.lastReviewed = new Date();

    // Update ease factor
    item.easeFactor = Math.max(1.3, item.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));

    // Calculate next interval
    if (quality < 3) {
      item.interval = 1;
      item.masteryLevel = Math.max(0, item.masteryLevel - 20);
    } else {
      if (item.reviewCount === 1) {
        item.interval = 1;
      } else if (item.reviewCount === 2) {
        item.interval = 6;
      } else {
        item.interval = Math.round(item.interval * item.easeFactor);
      }
      item.masteryLevel = Math.min(100, item.masteryLevel + (quality * 5));
    }

    // Set next review date
    item.nextReview = new Date(item.lastReviewed.getTime() + item.interval * 24 * 60 * 60 * 1000);

    // Deactivate if mastered
    if (item.masteryLevel >= 90 && item.reviewCount >= 5) {
      item.isActive = false;
    }

    this.revisionItems.set(itemId, item);
    return item;
  }

  getDueRevisions(): RevisionItem[] {
    const now = new Date();
    return Array.from(this.revisionItems.values())
      .filter(item => item.isActive && item.nextReview <= now)
      .sort((a, b) => a.nextReview.getTime() - b.nextReview.getTime());
  }

  // Study Session Recording
  private recordStudySession(pomodoroSession: PomodoroSession): void {
    const session: StudySession = {
      id: `session-${pomodoroSession.id}`,
      subject: pomodoroSession.subject,
      topic: pomodoroSession.topic,
      type: 'study',
      duration: pomodoroSession.duration * pomodoroSession.cycleCount,
      plannedDuration: pomodoroSession.duration * pomodoroSession.totalCycles,
      startTime: pomodoroSession.startTime,
      endTime: pomodoroSession.endTime,
      status: 'completed',
      productivity: pomodoroSession.productivity
    };

    this.studySessions.set(session.id, session);
  }

  // Study Streak Management
  private updateStudyStreak(): void {
    const today = new Date();
    const lastStudy = this.studyStreak.lastStudyDate;
    
    // Check if studied today
    const isToday = today.toDateString() === lastStudy.toDateString();
    const isYesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000).toDateString() === lastStudy.toDateString();
    
    if (!isToday) {
      if (isYesterday) {
        this.studyStreak.currentStreak++;
      } else {
        this.studyStreak.currentStreak = 1;
      }
      
      this.studyStreak.lastStudyDate = today;
      this.studyStreak.totalStudyDays++;
      
      if (this.studyStreak.currentStreak > this.studyStreak.longestStreak) {
        this.studyStreak.longestStreak = this.studyStreak.currentStreak;
      }
    }
  }

  // Auto Goal Creation
  private createAutoGoals(studyPlan: StudyPlan): void {
    const now = new Date();
    
    // Daily study goal
    this.createGoal(
      'Daily Study Target',
      `Study for ${Math.round(studyPlan.weeklyHours / 6)} hours today`,
      'daily',
      Math.round(studyPlan.weeklyHours / 6),
      'hours',
      new Date(now.getTime() + 24 * 60 * 60 * 1000),
      'high'
    );

    // Weekly goals for each subject
    studyPlan.subjects.forEach(subject => {
      this.createGoal(
        `Weekly ${subject.subject} Goal`,
        `Complete ${Math.round(subject.weeklyHours)} hours of ${subject.subject} study`,
        'weekly',
        Math.round(subject.weeklyHours),
        'hours',
        new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
        'medium',
        subject.subject
      );
    });

    // Monthly mock test goal
    this.createGoal(
      'Monthly Mock Tests',
      'Complete 8 mock tests this month',
      'monthly',
      8,
      'mock-tests',
      new Date(now.getFullYear(), now.getMonth() + 1, 0),
      'high'
    );
  }

  // Getters
  getStudyPlans(): StudyPlan[] {
    return Array.from(this.studyPlans.values());
  }

  getCalendarEvents(startDate: Date, endDate: Date): StudyCalendarEvent[] {
    return Array.from(this.calendarEvents.values())
      .filter(event => event.startTime >= startDate && event.startTime <= endDate)
      .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  }

  getStudySessions(limit: number = 10): StudySession[] {
    return Array.from(this.studySessions.values())
      .sort((a, b) => b.startTime.getTime() - a.startTime.getTime())
      .slice(0, limit);
  }

  getStudyStreak(): StudyStreak {
    return this.studyStreak;
  }

  getPomodoroSessions(): PomodoroSession[] {
    return Array.from(this.pomodoroSessions.values())
      .sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
  }

  // Analytics
  getStudyAnalytics(): {
    totalStudyTime: number;
    averageSessionDuration: number;
    mostStudiedSubject: string;
    weeklyProgress: number;
    productivityScore: number;
  } {
    const sessions = Array.from(this.studySessions.values());
    const totalStudyTime = sessions.reduce((sum, session) => sum + session.duration, 0);
    const averageSessionDuration = sessions.length > 0 ? totalStudyTime / sessions.length : 0;
    
    // Most studied subject
    const subjectTime: { [key: string]: number } = {};
    sessions.forEach(session => {
      subjectTime[session.subject] = (subjectTime[session.subject] || 0) + session.duration;
    });
    const mostStudiedSubject = Object.keys(subjectTime).reduce((a, b) => 
      subjectTime[a] > subjectTime[b] ? a : b, 'None'
    );

    // Weekly progress (percentage of weekly goal achieved)
    const weeklyGoalHours = this.getActiveStudyPlan()?.weeklyHours || 40;
    const thisWeekSessions = sessions.filter(session => {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return session.startTime >= weekAgo;
    });
    const thisWeekHours = thisWeekSessions.reduce((sum, session) => sum + session.duration, 0) / 60;
    const weeklyProgress = Math.min(100, (thisWeekHours / weeklyGoalHours) * 100);

    // Productivity score (average of all session productivity ratings)
    const productivitySessions = sessions.filter(session => session.productivity > 0);
    const productivityScore = productivitySessions.length > 0 
      ? productivitySessions.reduce((sum, session) => sum + session.productivity, 0) / productivitySessions.length
      : 0;

    return {
      totalStudyTime: Math.round(totalStudyTime),
      averageSessionDuration: Math.round(averageSessionDuration),
      mostStudiedSubject,
      weeklyProgress: Math.round(weeklyProgress),
      productivityScore: Math.round(productivityScore * 20) // Convert to percentage
    };
  }
}

export const studyPlanningService = StudyPlanningService.getInstance();