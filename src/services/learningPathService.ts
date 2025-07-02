import { Subject } from '../types';

export interface LearningPathNode {
  id: string;
  title: string;
  subject: string;
  topic: string;
  subtopic: string;
  difficulty: 'Foundation' | 'Intermediate' | 'Advanced' | 'Expert';
  estimatedTime: number; // in minutes
  prerequisites: string[];
  learningObjectives: string[];
  contentType: 'concept' | 'example' | 'practice' | 'assessment' | 'revision';
  jeeSyllabus: {
    chapter: string;
    weightage: number; // percentage in JEE
    frequency: 'High' | 'Medium' | 'Low'; // frequency in past papers
  };
  masteryLevel: number; // 0-100
  lastStudied?: Date;
  timeSpent: number; // total time spent in minutes
  attempts: number;
  successRate: number; // percentage
  isUnlocked: boolean;
  isCompleted: boolean;
  nextRecommendations: string[]; // IDs of next nodes
}

export interface PersonalizedLearningPath {
  id: string;
  studentId: string;
  subject: string;
  targetExam: 'JEE Main' | 'JEE Advanced' | 'NEET';
  currentLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  nodes: LearningPathNode[];
  currentNode: string;
  completedNodes: string[];
  recommendedNodes: string[];
  weakAreas: string[];
  strongAreas: string[];
  overallProgress: number; // 0-100
  estimatedCompletionDate: Date;
  adaptiveSettings: {
    difficultyAdjustment: 'Conservative' | 'Moderate' | 'Aggressive';
    focusMode: 'Balanced' | 'Weakness-Focused' | 'Strength-Building';
    pacePreference: 'Slow' | 'Medium' | 'Fast';
  };
  createdAt: Date;
  lastUpdated: Date;
}

export interface PerformanceMetrics {
  subject: string;
  topic: string;
  accuracy: number;
  speed: number; // problems per minute
  consistency: number; // variance in performance
  improvement: number; // rate of improvement
  difficulty: number; // average difficulty of problems solved
  timeDistribution: { [timeRange: string]: number };
  errorPatterns: string[];
  strengthIndicators: string[];
}

export interface ContentRecommendation {
  nodeId: string;
  title: string;
  reason: string;
  priority: number; // 1-10
  estimatedImpact: number; // expected improvement percentage
  type: 'fill-gap' | 'reinforce' | 'advance' | 'review';
  urgency: 'Low' | 'Medium' | 'High' | 'Critical';
}

export class LearningPathService {
  private static instance: LearningPathService;
  private learningPaths: Map<string, PersonalizedLearningPath> = new Map();
  private performanceData: Map<string, PerformanceMetrics[]> = new Map();
  private syllabusData: Map<string, LearningPathNode[]> = new Map();

  static getInstance(): LearningPathService {
    if (!LearningPathService.instance) {
      LearningPathService.instance = new LearningPathService();
      LearningPathService.instance.initializeSyllabusData();
    }
    return LearningPathService.instance;
  }

  private initializeSyllabusData(): void {
    // Initialize comprehensive JEE syllabus data
    const physicsNodes: LearningPathNode[] = [
      // Mechanics
      {
        id: 'phy-mech-001',
        title: 'Kinematics in One Dimension',
        subject: 'Physics',
        topic: 'Mechanics',
        subtopic: 'Kinematics',
        difficulty: 'Foundation',
        estimatedTime: 120,
        prerequisites: [],
        learningObjectives: [
          'Understand position, velocity, and acceleration',
          'Apply kinematic equations',
          'Solve motion problems with constant acceleration'
        ],
        contentType: 'concept',
        jeeSyllabus: {
          chapter: 'Motion in a Straight Line',
          weightage: 8,
          frequency: 'High'
        },
        masteryLevel: 0,
        timeSpent: 0,
        attempts: 0,
        successRate: 0,
        isUnlocked: true,
        isCompleted: false,
        nextRecommendations: ['phy-mech-002', 'phy-mech-003']
      },
      {
        id: 'phy-mech-002',
        title: 'Kinematics in Two Dimensions',
        subject: 'Physics',
        topic: 'Mechanics',
        subtopic: 'Kinematics',
        difficulty: 'Intermediate',
        estimatedTime: 150,
        prerequisites: ['phy-mech-001'],
        learningObjectives: [
          'Understand vector nature of motion',
          'Analyze projectile motion',
          'Solve circular motion problems'
        ],
        contentType: 'concept',
        jeeSyllabus: {
          chapter: 'Motion in a Plane',
          weightage: 10,
          frequency: 'High'
        },
        masteryLevel: 0,
        timeSpent: 0,
        attempts: 0,
        successRate: 0,
        isUnlocked: false,
        isCompleted: false,
        nextRecommendations: ['phy-mech-004', 'phy-mech-005']
      },
      {
        id: 'phy-mech-003',
        title: 'Newton\'s Laws of Motion',
        subject: 'Physics',
        topic: 'Mechanics',
        subtopic: 'Dynamics',
        difficulty: 'Foundation',
        estimatedTime: 180,
        prerequisites: ['phy-mech-001'],
        learningObjectives: [
          'Understand Newton\'s three laws',
          'Apply force analysis',
          'Solve problems with multiple forces'
        ],
        contentType: 'concept',
        jeeSyllabus: {
          chapter: 'Laws of Motion',
          weightage: 12,
          frequency: 'High'
        },
        masteryLevel: 0,
        timeSpent: 0,
        attempts: 0,
        successRate: 0,
        isUnlocked: false,
        isCompleted: false,
        nextRecommendations: ['phy-mech-006', 'phy-mech-007']
      },
      // Add more physics nodes...
    ];

    const chemistryNodes: LearningPathNode[] = [
      {
        id: 'chem-phys-001',
        title: 'Atomic Structure Fundamentals',
        subject: 'Chemistry',
        topic: 'Physical Chemistry',
        subtopic: 'Atomic Structure',
        difficulty: 'Foundation',
        estimatedTime: 90,
        prerequisites: [],
        learningObjectives: [
          'Understand atomic models',
          'Learn quantum numbers',
          'Electronic configuration'
        ],
        contentType: 'concept',
        jeeSyllabus: {
          chapter: 'Structure of Atom',
          weightage: 6,
          frequency: 'Medium'
        },
        masteryLevel: 0,
        timeSpent: 0,
        attempts: 0,
        successRate: 0,
        isUnlocked: true,
        isCompleted: false,
        nextRecommendations: ['chem-phys-002']
      },
      // Add more chemistry nodes...
    ];

    const mathNodes: LearningPathNode[] = [
      {
        id: 'math-calc-001',
        title: 'Limits and Continuity',
        subject: 'Mathematics',
        topic: 'Calculus',
        subtopic: 'Limits',
        difficulty: 'Foundation',
        estimatedTime: 120,
        prerequisites: [],
        learningObjectives: [
          'Understand concept of limits',
          'Evaluate limits using various methods',
          'Understand continuity'
        ],
        contentType: 'concept',
        jeeSyllabus: {
          chapter: 'Limits and Derivatives',
          weightage: 15,
          frequency: 'High'
        },
        masteryLevel: 0,
        timeSpent: 0,
        attempts: 0,
        successRate: 0,
        isUnlocked: true,
        isCompleted: false,
        nextRecommendations: ['math-calc-002']
      },
      // Add more math nodes...
    ];

    this.syllabusData.set('Physics', physicsNodes);
    this.syllabusData.set('Chemistry', chemistryNodes);
    this.syllabusData.set('Mathematics', mathNodes);
  }

  // Create personalized learning path
  createLearningPath(
    studentId: string,
    subject: string,
    targetExam: 'JEE Main' | 'JEE Advanced' | 'NEET',
    currentLevel: 'Beginner' | 'Intermediate' | 'Advanced',
    timeAvailable: number, // hours per week
    examDate: Date
  ): PersonalizedLearningPath {
    const syllabusNodes = this.syllabusData.get(subject) || [];
    const pathId = `${studentId}-${subject}-${Date.now()}`;

    // Clone and customize nodes based on student level
    const customizedNodes = syllabusNodes.map(node => ({
      ...node,
      isUnlocked: this.shouldUnlockNode(node, currentLevel),
      masteryLevel: this.getInitialMasteryLevel(node, currentLevel)
    }));

    const learningPath: PersonalizedLearningPath = {
      id: pathId,
      studentId,
      subject,
      targetExam,
      currentLevel,
      nodes: customizedNodes,
      currentNode: this.findStartingNode(customizedNodes, currentLevel),
      completedNodes: [],
      recommendedNodes: this.generateInitialRecommendations(customizedNodes, currentLevel),
      weakAreas: [],
      strongAreas: [],
      overallProgress: 0,
      estimatedCompletionDate: this.calculateCompletionDate(customizedNodes, timeAvailable, examDate),
      adaptiveSettings: {
        difficultyAdjustment: 'Moderate',
        focusMode: 'Balanced',
        pacePreference: 'Medium'
      },
      createdAt: new Date(),
      lastUpdated: new Date()
    };

    this.learningPaths.set(pathId, learningPath);
    return learningPath;
  }

  // Update performance and adapt path
  updatePerformance(
    pathId: string,
    nodeId: string,
    timeSpent: number,
    accuracy: number,
    difficulty: number
  ): void {
    const path = this.learningPaths.get(pathId);
    if (!path) return;

    const node = path.nodes.find(n => n.id === nodeId);
    if (!node) return;

    // Update node performance
    node.timeSpent += timeSpent;
    node.attempts += 1;
    node.successRate = ((node.successRate * (node.attempts - 1)) + accuracy) / node.attempts;
    
    // Update mastery level based on performance
    const masteryIncrease = this.calculateMasteryIncrease(accuracy, difficulty, node.difficulty);
    node.masteryLevel = Math.min(100, node.masteryLevel + masteryIncrease);

    // Mark as completed if mastery threshold reached
    if (node.masteryLevel >= 80 && !node.isCompleted) {
      node.isCompleted = true;
      path.completedNodes.push(nodeId);
      this.unlockNextNodes(path, nodeId);
    }

    // Update performance metrics
    this.updatePerformanceMetrics(path.subject, node.topic, accuracy, timeSpent, difficulty);

    // Adapt the learning path
    this.adaptLearningPath(path);

    path.lastUpdated = new Date();
    this.learningPaths.set(pathId, path);
  }

  // Generate adaptive content recommendations
  generateRecommendations(pathId: string): ContentRecommendation[] {
    const path = this.learningPaths.get(pathId);
    if (!path) return [];

    const recommendations: ContentRecommendation[] = [];
    const performanceMetrics = this.performanceData.get(path.subject) || [];

    // Identify weak areas that need attention
    const weakTopics = performanceMetrics
      .filter(metric => metric.accuracy < 60)
      .sort((a, b) => a.accuracy - b.accuracy);

    weakTopics.forEach((metric, index) => {
      const relevantNodes = path.nodes.filter(node => 
        node.topic === metric.topic && 
        !node.isCompleted && 
        node.isUnlocked
      );

      relevantNodes.forEach(node => {
        recommendations.push({
          nodeId: node.id,
          title: node.title,
          reason: `Low accuracy (${metric.accuracy.toFixed(1)}%) in ${metric.topic}`,
          priority: 10 - index,
          estimatedImpact: this.calculateEstimatedImpact(metric, node),
          type: 'fill-gap',
          urgency: metric.accuracy < 40 ? 'Critical' : metric.accuracy < 60 ? 'High' : 'Medium'
        });
      });
    });

    // Recommend next logical progression
    const currentNode = path.nodes.find(n => n.id === path.currentNode);
    if (currentNode && currentNode.isCompleted) {
      currentNode.nextRecommendations.forEach(nextNodeId => {
        const nextNode = path.nodes.find(n => n.id === nextNodeId);
        if (nextNode && nextNode.isUnlocked && !nextNode.isCompleted) {
          recommendations.push({
            nodeId: nextNode.id,
            title: nextNode.title,
            reason: 'Natural progression from completed topic',
            priority: 8,
            estimatedImpact: 15,
            type: 'advance',
            urgency: 'Medium'
          });
        }
      });
    }

    // Recommend reinforcement for strong areas
    const strongTopics = performanceMetrics
      .filter(metric => metric.accuracy > 80)
      .sort((a, b) => b.accuracy - a.accuracy);

    strongTopics.slice(0, 2).forEach(metric => {
      const advancedNodes = path.nodes.filter(node => 
        node.topic === metric.topic && 
        node.difficulty === 'Advanced' && 
        !node.isCompleted && 
        node.isUnlocked
      );

      advancedNodes.forEach(node => {
        recommendations.push({
          nodeId: node.id,
          title: node.title,
          reason: `Strong performance (${metric.accuracy.toFixed(1)}%) - ready for advanced concepts`,
          priority: 6,
          estimatedImpact: 10,
          type: 'reinforce',
          urgency: 'Low'
        });
      });
    });

    return recommendations
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 5); // Return top 5 recommendations
  }

  // Get learning path analytics
  getPathAnalytics(pathId: string): {
    overallProgress: number;
    timeSpent: number;
    averageAccuracy: number;
    topicProgress: { [topic: string]: number };
    difficultyDistribution: { [difficulty: string]: number };
    weeklyProgress: number[];
    predictedCompletion: Date;
    recommendations: ContentRecommendation[];
  } {
    const path = this.learningPaths.get(pathId);
    if (!path) {
      return {
        overallProgress: 0,
        timeSpent: 0,
        averageAccuracy: 0,
        topicProgress: {},
        difficultyDistribution: {},
        weeklyProgress: [],
        predictedCompletion: new Date(),
        recommendations: []
      };
    }

    const completedNodes = path.nodes.filter(n => n.isCompleted);
    const overallProgress = (completedNodes.length / path.nodes.length) * 100;
    
    const totalTimeSpent = path.nodes.reduce((sum, node) => sum + node.timeSpent, 0);
    
    const nodesWithAttempts = path.nodes.filter(n => n.attempts > 0);
    const averageAccuracy = nodesWithAttempts.length > 0
      ? nodesWithAttempts.reduce((sum, node) => sum + node.successRate, 0) / nodesWithAttempts.length
      : 0;

    // Topic progress
    const topicProgress: { [topic: string]: number } = {};
    const topics = [...new Set(path.nodes.map(n => n.topic))];
    topics.forEach(topic => {
      const topicNodes = path.nodes.filter(n => n.topic === topic);
      const completedTopicNodes = topicNodes.filter(n => n.isCompleted);
      topicProgress[topic] = (completedTopicNodes.length / topicNodes.length) * 100;
    });

    // Difficulty distribution
    const difficultyDistribution: { [difficulty: string]: number } = {};
    const difficulties = ['Foundation', 'Intermediate', 'Advanced', 'Expert'];
    difficulties.forEach(difficulty => {
      const difficultyNodes = path.nodes.filter(n => n.difficulty === difficulty);
      const completedDifficultyNodes = difficultyNodes.filter(n => n.isCompleted);
      difficultyDistribution[difficulty] = difficultyNodes.length > 0
        ? (completedDifficultyNodes.length / difficultyNodes.length) * 100
        : 0;
    });

    return {
      overallProgress,
      timeSpent: totalTimeSpent,
      averageAccuracy,
      topicProgress,
      difficultyDistribution,
      weeklyProgress: this.calculateWeeklyProgress(path),
      predictedCompletion: this.predictCompletionDate(path),
      recommendations: this.generateRecommendations(pathId)
    };
  }

  // Private helper methods
  private shouldUnlockNode(node: LearningPathNode, currentLevel: string): boolean {
    if (node.prerequisites.length === 0) return true;
    
    // For demo purposes, unlock foundation nodes for all levels
    if (node.difficulty === 'Foundation') return true;
    if (node.difficulty === 'Intermediate' && currentLevel !== 'Beginner') return true;
    if (node.difficulty === 'Advanced' && currentLevel === 'Advanced') return true;
    
    return false;
  }

  private getInitialMasteryLevel(node: LearningPathNode, currentLevel: string): number {
    const levelMultipliers = {
      'Beginner': 0,
      'Intermediate': 20,
      'Advanced': 40
    };
    
    const difficultyAdjustments = {
      'Foundation': 10,
      'Intermediate': 0,
      'Advanced': -10,
      'Expert': -20
    };
    
    return Math.max(0, 
      levelMultipliers[currentLevel as keyof typeof levelMultipliers] + 
      difficultyAdjustments[node.difficulty as keyof typeof difficultyAdjustments]
    );
  }

  private findStartingNode(nodes: LearningPathNode[], currentLevel: string): string {
    const unlockedNodes = nodes.filter(n => n.isUnlocked && !n.isCompleted);
    if (unlockedNodes.length === 0) return nodes[0]?.id || '';
    
    // Find the most appropriate starting node based on level
    const foundationNodes = unlockedNodes.filter(n => n.difficulty === 'Foundation');
    if (foundationNodes.length > 0) return foundationNodes[0].id;
    
    return unlockedNodes[0].id;
  }

  private generateInitialRecommendations(nodes: LearningPathNode[], currentLevel: string): string[] {
    const unlockedNodes = nodes.filter(n => n.isUnlocked && !n.isCompleted);
    return unlockedNodes.slice(0, 3).map(n => n.id);
  }

  private calculateCompletionDate(nodes: LearningPathNode[], hoursPerWeek: number, examDate: Date): Date {
    const totalEstimatedTime = nodes.reduce((sum, node) => sum + node.estimatedTime, 0);
    const weeksNeeded = Math.ceil(totalEstimatedTime / (hoursPerWeek * 60));
    
    const completionDate = new Date();
    completionDate.setDate(completionDate.getDate() + (weeksNeeded * 7));
    
    return completionDate < examDate ? completionDate : examDate;
  }

  private calculateMasteryIncrease(accuracy: number, difficulty: number, nodeDifficulty: string): number {
    const baseIncrease = accuracy / 10; // 0-10 based on accuracy
    const difficultyMultiplier = difficulty / 5; // Adjust based on problem difficulty
    
    const nodeDifficultyMultipliers = {
      'Foundation': 1.2,
      'Intermediate': 1.0,
      'Advanced': 0.8,
      'Expert': 0.6
    };
    
    return baseIncrease * difficultyMultiplier * nodeDifficultyMultipliers[nodeDifficulty as keyof typeof nodeDifficultyMultipliers];
  }

  private unlockNextNodes(path: PersonalizedLearningPath, completedNodeId: string): void {
    const completedNode = path.nodes.find(n => n.id === completedNodeId);
    if (!completedNode) return;

    completedNode.nextRecommendations.forEach(nextNodeId => {
      const nextNode = path.nodes.find(n => n.id === nextNodeId);
      if (nextNode && !nextNode.isUnlocked) {
        // Check if all prerequisites are met
        const allPrereqsMet = nextNode.prerequisites.every(prereqId =>
          path.completedNodes.includes(prereqId)
        );
        
        if (allPrereqsMet) {
          nextNode.isUnlocked = true;
        }
      }
    });
  }

  private updatePerformanceMetrics(subject: string, topic: string, accuracy: number, timeSpent: number, difficulty: number): void {
    const metrics = this.performanceData.get(subject) || [];
    const existingMetric = metrics.find(m => m.topic === topic);

    if (existingMetric) {
      // Update existing metric
      existingMetric.accuracy = (existingMetric.accuracy + accuracy) / 2;
      existingMetric.speed = timeSpent > 0 ? 1 / timeSpent : existingMetric.speed;
      existingMetric.difficulty = (existingMetric.difficulty + difficulty) / 2;
    } else {
      // Create new metric
      metrics.push({
        subject,
        topic,
        accuracy,
        speed: timeSpent > 0 ? 1 / timeSpent : 0,
        consistency: 100, // Start with perfect consistency
        improvement: 0,
        difficulty,
        timeDistribution: {},
        errorPatterns: [],
        strengthIndicators: []
      });
    }

    this.performanceData.set(subject, metrics);
  }

  private adaptLearningPath(path: PersonalizedLearningPath): void {
    // Update weak and strong areas
    const performanceMetrics = this.performanceData.get(path.subject) || [];
    
    path.weakAreas = performanceMetrics
      .filter(m => m.accuracy < 60)
      .map(m => m.topic)
      .slice(0, 5);
    
    path.strongAreas = performanceMetrics
      .filter(m => m.accuracy > 80)
      .map(m => m.topic)
      .slice(0, 5);

    // Update overall progress
    const completedNodes = path.nodes.filter(n => n.isCompleted);
    path.overallProgress = (completedNodes.length / path.nodes.length) * 100;

    // Update recommended nodes
    path.recommendedNodes = this.generateRecommendations(path.id)
      .slice(0, 3)
      .map(r => r.nodeId);
  }

  private calculateEstimatedImpact(metric: PerformanceMetrics, node: LearningPathNode): number {
    // Estimate how much improvement this node could provide
    const currentGap = 100 - metric.accuracy;
    const difficultyFactor = node.difficulty === 'Foundation' ? 0.8 : 
                           node.difficulty === 'Intermediate' ? 0.6 : 0.4;
    
    return Math.min(30, currentGap * difficultyFactor);
  }

  private calculateWeeklyProgress(path: PersonalizedLearningPath): number[] {
    // Mock weekly progress data - in real implementation, track actual progress
    const weeks = 8;
    const progress = [];
    const currentProgress = path.overallProgress;
    
    for (let i = 0; i < weeks; i++) {
      progress.push(Math.min(100, (currentProgress / weeks) * (i + 1) + Math.random() * 10));
    }
    
    return progress;
  }

  private predictCompletionDate(path: PersonalizedLearningPath): Date {
    const remainingNodes = path.nodes.filter(n => !n.isCompleted);
    const averageTimePerNode = path.nodes
      .filter(n => n.timeSpent > 0)
      .reduce((sum, n) => sum + n.timeSpent, 0) / Math.max(1, path.completedNodes.length);
    
    const estimatedRemainingTime = remainingNodes.length * (averageTimePerNode || 60); // minutes
    const daysNeeded = Math.ceil(estimatedRemainingTime / (2 * 60)); // Assuming 2 hours per day
    
    const completionDate = new Date();
    completionDate.setDate(completionDate.getDate() + daysNeeded);
    
    return completionDate;
  }

  // Public getters
  getLearningPath(pathId: string): PersonalizedLearningPath | null {
    return this.learningPaths.get(pathId) || null;
  }

  getAllLearningPaths(studentId: string): PersonalizedLearningPath[] {
    return Array.from(this.learningPaths.values())
      .filter(path => path.studentId === studentId);
  }

  getPerformanceMetrics(subject: string): PerformanceMetrics[] {
    return this.performanceData.get(subject) || [];
  }
}

export const learningPathService = LearningPathService.getInstance();