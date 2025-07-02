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
  addedBy: 'system' | 'ai-recommendation' | 'student-request' | 'gap-analysis';
  addedAt: Date;
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

export interface TopicSuggestion {
  id: string;
  title: string;
  subject: string;
  topic: string;
  subtopic: string;
  reason: string;
  confidence: number; // 0-1
  source: 'ai-analysis' | 'performance-gap' | 'curriculum-sequence' | 'student-question';
  relatedConcepts: string[];
}

export class LearningPathService {
  private static instance: LearningPathService;
  private learningPaths: Map<string, PersonalizedLearningPath> = new Map();
  private performanceData: Map<string, PerformanceMetrics[]> = new Map();
  private syllabusData: Map<string, LearningPathNode[]> = new Map();
  private topicSuggestions: Map<string, TopicSuggestion[]> = new Map();

  static getInstance(): LearningPathService {
    if (!LearningPathService.instance) {
      LearningPathService.instance = new LearningPathService();
      LearningPathService.instance.initializeSyllabusData();
    }
    return LearningPathService.instance;
  }

  private initializeSyllabusData(): void {
    // Initialize comprehensive JEE/NEET syllabus data
    const physicsNodes: LearningPathNode[] = [
      // Mechanics - Foundation Level
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
          'Apply kinematic equations for constant acceleration',
          'Solve motion problems with graphs and equations'
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
        nextRecommendations: ['phy-mech-002', 'phy-mech-003'],
        addedBy: 'system',
        addedAt: new Date()
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
          'Analyze projectile motion problems',
          'Solve circular motion and relative velocity'
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
        nextRecommendations: ['phy-mech-004', 'phy-mech-005'],
        addedBy: 'system',
        addedAt: new Date()
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
          'Understand Newton\'s three laws of motion',
          'Apply force analysis and free body diagrams',
          'Solve problems with multiple forces and constraints'
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
        nextRecommendations: ['phy-mech-006', 'phy-mech-007'],
        addedBy: 'system',
        addedAt: new Date()
      },
      {
        id: 'phy-mech-004',
        title: 'Work, Energy and Power',
        subject: 'Physics',
        topic: 'Mechanics',
        subtopic: 'Energy',
        difficulty: 'Intermediate',
        estimatedTime: 160,
        prerequisites: ['phy-mech-002', 'phy-mech-003'],
        learningObjectives: [
          'Understand work-energy theorem',
          'Apply conservation of energy principles',
          'Solve problems involving power and efficiency'
        ],
        contentType: 'concept',
        jeeSyllabus: {
          chapter: 'Work, Energy and Power',
          weightage: 9,
          frequency: 'High'
        },
        masteryLevel: 0,
        timeSpent: 0,
        attempts: 0,
        successRate: 0,
        isUnlocked: false,
        isCompleted: false,
        nextRecommendations: ['phy-mech-008'],
        addedBy: 'system',
        addedAt: new Date()
      },
      {
        id: 'phy-mech-005',
        title: 'Rotational Motion',
        subject: 'Physics',
        topic: 'Mechanics',
        subtopic: 'Rotation',
        difficulty: 'Advanced',
        estimatedTime: 200,
        prerequisites: ['phy-mech-002', 'phy-mech-003'],
        learningObjectives: [
          'Understand rotational kinematics and dynamics',
          'Apply moment of inertia concepts',
          'Solve problems with rolling motion'
        ],
        contentType: 'concept',
        jeeSyllabus: {
          chapter: 'System of Particles and Rotational Motion',
          weightage: 11,
          frequency: 'Medium'
        },
        masteryLevel: 0,
        timeSpent: 0,
        attempts: 0,
        successRate: 0,
        isUnlocked: false,
        isCompleted: false,
        nextRecommendations: ['phy-mech-009'],
        addedBy: 'system',
        addedAt: new Date()
      },
      // Thermodynamics
      {
        id: 'phy-thermo-001',
        title: 'Temperature and Heat',
        subject: 'Physics',
        topic: 'Thermodynamics',
        subtopic: 'Basic Concepts',
        difficulty: 'Foundation',
        estimatedTime: 100,
        prerequisites: [],
        learningObjectives: [
          'Understand temperature scales and thermal expansion',
          'Learn heat transfer mechanisms',
          'Apply calorimetry principles'
        ],
        contentType: 'concept',
        jeeSyllabus: {
          chapter: 'Thermal Properties of Matter',
          weightage: 6,
          frequency: 'Medium'
        },
        masteryLevel: 0,
        timeSpent: 0,
        attempts: 0,
        successRate: 0,
        isUnlocked: true,
        isCompleted: false,
        nextRecommendations: ['phy-thermo-002'],
        addedBy: 'system',
        addedAt: new Date()
      },
      // Optics
      {
        id: 'phy-optics-001',
        title: 'Ray Optics and Optical Instruments',
        subject: 'Physics',
        topic: 'Optics',
        subtopic: 'Geometrical Optics',
        difficulty: 'Intermediate',
        estimatedTime: 140,
        prerequisites: [],
        learningObjectives: [
          'Understand reflection and refraction laws',
          'Apply lens and mirror formulas',
          'Analyze optical instruments'
        ],
        contentType: 'concept',
        jeeSyllabus: {
          chapter: 'Ray Optics and Optical Instruments',
          weightage: 8,
          frequency: 'High'
        },
        masteryLevel: 0,
        timeSpent: 0,
        attempts: 0,
        successRate: 0,
        isUnlocked: true,
        isCompleted: false,
        nextRecommendations: ['phy-optics-002'],
        addedBy: 'system',
        addedAt: new Date()
      }
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
          'Understand atomic models and their evolution',
          'Learn quantum numbers and electronic configuration',
          'Apply Aufbau principle and Hund\'s rule'
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
        nextRecommendations: ['chem-phys-002'],
        addedBy: 'system',
        addedAt: new Date()
      },
      {
        id: 'chem-phys-002',
        title: 'Chemical Bonding and Molecular Structure',
        subject: 'Chemistry',
        topic: 'Physical Chemistry',
        subtopic: 'Chemical Bonding',
        difficulty: 'Intermediate',
        estimatedTime: 120,
        prerequisites: ['chem-phys-001'],
        learningObjectives: [
          'Understand ionic, covalent, and metallic bonding',
          'Apply VSEPR theory for molecular geometry',
          'Learn hybridization and molecular orbital theory'
        ],
        contentType: 'concept',
        jeeSyllabus: {
          chapter: 'Chemical Bonding and Molecular Structure',
          weightage: 8,
          frequency: 'High'
        },
        masteryLevel: 0,
        timeSpent: 0,
        attempts: 0,
        successRate: 0,
        isUnlocked: false,
        isCompleted: false,
        nextRecommendations: ['chem-phys-003'],
        addedBy: 'system',
        addedAt: new Date()
      },
      {
        id: 'chem-org-001',
        title: 'Basic Organic Chemistry',
        subject: 'Chemistry',
        topic: 'Organic Chemistry',
        subtopic: 'Fundamentals',
        difficulty: 'Foundation',
        estimatedTime: 110,
        prerequisites: ['chem-phys-002'],
        learningObjectives: [
          'Understand organic compound classification',
          'Learn IUPAC nomenclature rules',
          'Identify functional groups and isomerism'
        ],
        contentType: 'concept',
        jeeSyllabus: {
          chapter: 'Organic Chemistry - Some Basic Principles',
          weightage: 7,
          frequency: 'High'
        },
        masteryLevel: 0,
        timeSpent: 0,
        attempts: 0,
        successRate: 0,
        isUnlocked: false,
        isCompleted: false,
        nextRecommendations: ['chem-org-002'],
        addedBy: 'system',
        addedAt: new Date()
      }
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
          'Understand the concept of limits',
          'Evaluate limits using various techniques',
          'Apply continuity and discontinuity concepts'
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
        nextRecommendations: ['math-calc-002'],
        addedBy: 'system',
        addedAt: new Date()
      },
      {
        id: 'math-calc-002',
        title: 'Derivatives and Applications',
        subject: 'Mathematics',
        topic: 'Calculus',
        subtopic: 'Differentiation',
        difficulty: 'Intermediate',
        estimatedTime: 150,
        prerequisites: ['math-calc-001'],
        learningObjectives: [
          'Understand derivative as rate of change',
          'Apply differentiation rules and techniques',
          'Solve optimization and related rate problems'
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
        isUnlocked: false,
        isCompleted: false,
        nextRecommendations: ['math-calc-003'],
        addedBy: 'system',
        addedAt: new Date()
      },
      {
        id: 'math-alg-001',
        title: 'Complex Numbers',
        subject: 'Mathematics',
        topic: 'Algebra',
        subtopic: 'Complex Numbers',
        difficulty: 'Intermediate',
        estimatedTime: 100,
        prerequisites: [],
        learningObjectives: [
          'Understand complex number operations',
          'Apply De Moivre\'s theorem',
          'Solve equations with complex roots'
        ],
        contentType: 'concept',
        jeeSyllabus: {
          chapter: 'Complex Numbers and Quadratic Equations',
          weightage: 7,
          frequency: 'Medium'
        },
        masteryLevel: 0,
        timeSpent: 0,
        attempts: 0,
        successRate: 0,
        isUnlocked: true,
        isCompleted: false,
        nextRecommendations: ['math-alg-002'],
        addedBy: 'system',
        addedAt: new Date()
      }
    ];

    const biologyNodes: LearningPathNode[] = [
      {
        id: 'bio-cell-001',
        title: 'Cell Structure and Function',
        subject: 'Biology',
        topic: 'Cell Biology',
        subtopic: 'Cell Structure',
        difficulty: 'Foundation',
        estimatedTime: 90,
        prerequisites: [],
        learningObjectives: [
          'Understand prokaryotic and eukaryotic cell structure',
          'Learn organelle functions and interactions',
          'Compare plant and animal cells'
        ],
        contentType: 'concept',
        jeeSyllabus: {
          chapter: 'Cell: The Unit of Life',
          weightage: 8,
          frequency: 'High'
        },
        masteryLevel: 0,
        timeSpent: 0,
        attempts: 0,
        successRate: 0,
        isUnlocked: true,
        isCompleted: false,
        nextRecommendations: ['bio-cell-002'],
        addedBy: 'system',
        addedAt: new Date()
      },
      {
        id: 'bio-cell-002',
        title: 'Cell Division',
        subject: 'Biology',
        topic: 'Cell Biology',
        subtopic: 'Cell Division',
        difficulty: 'Intermediate',
        estimatedTime: 110,
        prerequisites: ['bio-cell-001'],
        learningObjectives: [
          'Understand mitosis and meiosis processes',
          'Compare different phases of cell division',
          'Learn significance of cell division in growth and reproduction'
        ],
        contentType: 'concept',
        jeeSyllabus: {
          chapter: 'Cell Cycle and Cell Division',
          weightage: 6,
          frequency: 'Medium'
        },
        masteryLevel: 0,
        timeSpent: 0,
        attempts: 0,
        successRate: 0,
        isUnlocked: false,
        isCompleted: false,
        nextRecommendations: ['bio-genetics-001'],
        addedBy: 'system',
        addedAt: new Date()
      }
    ];

    this.syllabusData.set('Physics', physicsNodes);
    this.syllabusData.set('Chemistry', chemistryNodes);
    this.syllabusData.set('Mathematics', mathNodes);
    this.syllabusData.set('Biology', biologyNodes);
  }

  // AI-Powered Topic Addition from Student Questions
  async addTopicFromQuestion(
    pathId: string,
    question: string,
    identifiedConcepts: string[],
    difficulty: 'Easy' | 'Medium' | 'Hard'
  ): Promise<LearningPathNode[]> {
    const path = this.learningPaths.get(pathId);
    if (!path) return [];

    const addedNodes: LearningPathNode[] = [];
    const syllabusNodes = this.syllabusData.get(path.subject) || [];

    // Find relevant nodes from syllabus that match the identified concepts
    identifiedConcepts.forEach(concept => {
      const relevantNodes = syllabusNodes.filter(node => 
        node.title.toLowerCase().includes(concept.toLowerCase()) ||
        node.topic.toLowerCase().includes(concept.toLowerCase()) ||
        node.subtopic.toLowerCase().includes(concept.toLowerCase()) ||
        node.learningObjectives.some(obj => obj.toLowerCase().includes(concept.toLowerCase()))
      );

      relevantNodes.forEach(syllabusNode => {
        // Check if this node is already in the path
        const existingNode = path.nodes.find(n => n.id === syllabusNode.id);
        if (!existingNode) {
          // Add new node to the path
          const newNode: LearningPathNode = {
            ...syllabusNode,
            addedBy: 'ai-recommendation',
            addedAt: new Date(),
            isUnlocked: this.shouldUnlockBasedOnQuestion(syllabusNode, path, difficulty)
          };
          
          path.nodes.push(newNode);
          addedNodes.push(newNode);
        } else if (!existingNode.isUnlocked && this.shouldUnlockBasedOnQuestion(existingNode, path, difficulty)) {
          // Unlock existing node if student is asking about it
          existingNode.isUnlocked = true;
          existingNode.addedBy = 'student-request';
          addedNodes.push(existingNode);
        }
      });
    });

    // If no exact matches found, create a custom node
    if (addedNodes.length === 0 && identifiedConcepts.length > 0) {
      const customNode = this.createCustomNode(path, identifiedConcepts[0], question, difficulty);
      path.nodes.push(customNode);
      addedNodes.push(customNode);
    }

    // Update the path
    this.learningPaths.set(pathId, path);
    
    return addedNodes;
  }

  // Create custom node for concepts not in standard syllabus
  private createCustomNode(
    path: PersonalizedLearningPath,
    concept: string,
    question: string,
    difficulty: 'Easy' | 'Medium' | 'Hard'
  ): LearningPathNode {
    const nodeId = `custom-${Date.now()}`;
    const difficultyMap = {
      'Easy': 'Foundation' as const,
      'Medium': 'Intermediate' as const,
      'Hard': 'Advanced' as const
    };

    return {
      id: nodeId,
      title: `Understanding ${concept}`,
      subject: path.subject,
      topic: 'Custom Topics',
      subtopic: concept,
      difficulty: difficultyMap[difficulty],
      estimatedTime: 60,
      prerequisites: [],
      learningObjectives: [
        `Understand the concept of ${concept}`,
        `Apply ${concept} to solve problems`,
        `Connect ${concept} to related topics`
      ],
      contentType: 'concept',
      jeeSyllabus: {
        chapter: 'Additional Topics',
        weightage: 3,
        frequency: 'Low'
      },
      masteryLevel: 0,
      timeSpent: 0,
      attempts: 0,
      successRate: 0,
      isUnlocked: true,
      isCompleted: false,
      nextRecommendations: [],
      addedBy: 'student-request',
      addedAt: new Date()
    };
  }

  // Analyze performance gaps and suggest topics
  analyzePerformanceGaps(pathId: string): TopicSuggestion[] {
    const path = this.learningPaths.get(pathId);
    if (!path) return [];

    const suggestions: TopicSuggestion[] = [];
    const performanceMetrics = this.performanceData.get(path.subject) || [];
    const syllabusNodes = this.syllabusData.get(path.subject) || [];

    // Find topics with low performance
    performanceMetrics.forEach(metric => {
      if (metric.accuracy < 60) {
        // Find prerequisite topics that might help
        const relatedNodes = syllabusNodes.filter(node => 
          node.topic === metric.topic && 
          !path.nodes.some(pathNode => pathNode.id === node.id)
        );

        relatedNodes.forEach(node => {
          suggestions.push({
            id: `gap-${node.id}`,
            title: node.title,
            subject: node.subject,
            topic: node.topic,
            subtopic: node.subtopic,
            reason: `Low performance (${metric.accuracy.toFixed(1)}%) in ${metric.topic} suggests reviewing fundamentals`,
            confidence: 0.8,
            source: 'performance-gap',
            relatedConcepts: node.learningObjectives
          });
        });
      }
    });

    return suggestions.slice(0, 5); // Return top 5 suggestions
  }

  // Get topic suggestions for student
  getTopicSuggestions(pathId: string): TopicSuggestion[] {
    const path = this.learningPaths.get(pathId);
    if (!path) return [];

    const suggestions: TopicSuggestion[] = [];
    
    // Add performance gap suggestions
    suggestions.push(...this.analyzePerformanceGaps(pathId));
    
    // Add curriculum sequence suggestions
    const nextLogicalTopics = this.getNextLogicalTopics(path);
    suggestions.push(...nextLogicalTopics);

    // Store suggestions
    this.topicSuggestions.set(pathId, suggestions);
    
    return suggestions.sort((a, b) => b.confidence - a.confidence);
  }

  // Add topic from suggestion
  addTopicFromSuggestion(pathId: string, suggestionId: string): LearningPathNode | null {
    const suggestions = this.topicSuggestions.get(pathId) || [];
    const suggestion = suggestions.find(s => s.id === suggestionId);
    
    if (!suggestion) return null;

    const path = this.learningPaths.get(pathId);
    if (!path) return null;

    const syllabusNodes = this.syllabusData.get(path.subject) || [];
    const syllabusNode = syllabusNodes.find(node => 
      node.title === suggestion.title || 
      suggestion.id.includes(node.id)
    );

    if (syllabusNode) {
      const newNode: LearningPathNode = {
        ...syllabusNode,
        addedBy: 'ai-recommendation',
        addedAt: new Date(),
        isUnlocked: true
      };
      
      path.nodes.push(newNode);
      this.learningPaths.set(pathId, path);
      
      return newNode;
    }

    return null;
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
    topicSuggestions: TopicSuggestion[];
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
        recommendations: [],
        topicSuggestions: []
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
      recommendations: this.generateRecommendations(pathId),
      topicSuggestions: this.getTopicSuggestions(pathId)
    };
  }

  // Private helper methods
  private shouldUnlockBasedOnQuestion(node: LearningPathNode, path: PersonalizedLearningPath, difficulty: string): boolean {
    // If student is asking about a topic, they're ready to learn it
    if (difficulty === 'Easy' && node.difficulty === 'Foundation') return true;
    if (difficulty === 'Medium' && ['Foundation', 'Intermediate'].includes(node.difficulty)) return true;
    if (difficulty === 'Hard') return true; // Unlock any difficulty for hard questions
    
    return this.shouldUnlockNode(node, path.currentLevel);
  }

  private getNextLogicalTopics(path: PersonalizedLearningPath): TopicSuggestion[] {
    const suggestions: TopicSuggestion[] = [];
    const syllabusNodes = this.syllabusData.get(path.subject) || [];
    
    // Find topics that are logical next steps
    const completedTopics = new Set(path.completedNodes);
    
    syllabusNodes.forEach(node => {
      if (!path.nodes.some(pathNode => pathNode.id === node.id)) {
        // Check if prerequisites are met
        const prereqsMet = node.prerequisites.every(prereq => completedTopics.has(prereq));
        
        if (prereqsMet || node.prerequisites.length === 0) {
          suggestions.push({
            id: `seq-${node.id}`,
            title: node.title,
            subject: node.subject,
            topic: node.topic,
            subtopic: node.subtopic,
            reason: 'Natural progression in curriculum sequence',
            confidence: 0.7,
            source: 'curriculum-sequence',
            relatedConcepts: node.learningObjectives
          });
        }
      }
    });
    
    return suggestions;
  }

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