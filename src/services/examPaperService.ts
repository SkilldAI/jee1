// JEE/NEET Exam Paper Reference Service
export interface ExamPaper {
  id: string;
  examType: 'JEE Main' | 'JEE Advanced' | 'NEET';
  year: number;
  session?: string; // For JEE Main (January, April, etc.)
  subject: string;
  questionNumber?: number;
  question: string;
  options?: string[];
  correctAnswer?: number;
  solution: string;
  concepts: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic: string;
  subtopic: string;
  marks: number;
  timeToSolve: number; // in minutes
  frequency: number; // how often this type appears (1-10)
  similarQuestions: string[]; // IDs of similar questions
}

export interface ExamPattern {
  examType: 'JEE Main' | 'JEE Advanced' | 'NEET';
  subject: string;
  totalQuestions: number;
  totalMarks: number;
  timeLimit: number; // in minutes
  topicWeightage: { [topic: string]: number };
  difficultyDistribution: { Easy: number; Medium: number; Hard: number };
  frequentConcepts: string[];
  trendingTopics: string[];
}

export class ExamPaperService {
  private static instance: ExamPaperService;
  private examPapers: Map<string, ExamPaper> = new Map();
  private examPatterns: Map<string, ExamPattern> = new Map();

  static getInstance(): ExamPaperService {
    if (!ExamPaperService.instance) {
      ExamPaperService.instance = new ExamPaperService();
      ExamPaperService.instance.initializeExamPapers();
    }
    return ExamPaperService.instance;
  }

  private initializeExamPapers(): void {
    // JEE Main Physics Papers
    this.addExamPaper({
      id: 'jee-main-2024-jan-phy-1',
      examType: 'JEE Main',
      year: 2024,
      session: 'January',
      subject: 'Physics',
      questionNumber: 1,
      question: 'A particle moves in a straight line with constant acceleration. If it covers 10 m in the first 2 seconds and 20 m in the next 2 seconds, find its initial velocity.',
      options: ['2.5 m/s', '5 m/s', '7.5 m/s', '10 m/s'],
      correctAnswer: 0,
      solution: 'Using kinematic equations: s = ut + (1/2)at². For first 2s: 10 = 2u + 2a. For next 2s: 20 = 2(u+2a) + 2a. Solving: u = 2.5 m/s',
      concepts: ['Kinematics', 'Constant Acceleration', 'Motion in Straight Line'],
      difficulty: 'Medium',
      topic: 'Mechanics',
      subtopic: 'Kinematics',
      marks: 4,
      timeToSolve: 3,
      frequency: 9,
      similarQuestions: ['jee-main-2023-apr-phy-3', 'jee-adv-2023-phy-12']
    });

    this.addExamPaper({
      id: 'jee-main-2024-jan-phy-15',
      examType: 'JEE Main',
      year: 2024,
      session: 'January',
      subject: 'Physics',
      questionNumber: 15,
      question: 'A conducting rod of length L moves with velocity v perpendicular to a magnetic field B. The induced EMF is:',
      options: ['BLv', 'BL/v', 'BLv²', 'B/Lv'],
      correctAnswer: 0,
      solution: 'Using Faraday\'s law of electromagnetic induction: EMF = BLv (motional EMF formula)',
      concepts: ['Electromagnetic Induction', 'Motional EMF', 'Faraday\'s Law'],
      difficulty: 'Easy',
      topic: 'Electromagnetism',
      subtopic: 'Electromagnetic Induction',
      marks: 4,
      timeToSolve: 2,
      frequency: 8,
      similarQuestions: ['jee-main-2023-jul-phy-18', 'neet-2024-phy-45']
    });

    // JEE Advanced Physics
    this.addExamPaper({
      id: 'jee-adv-2024-phy-8',
      examType: 'JEE Advanced',
      year: 2024,
      subject: 'Physics',
      questionNumber: 8,
      question: 'A uniform rod of mass M and length L is pivoted at one end. Find the minimum horizontal force F applied at the free end to just lift the rod from horizontal position.',
      solution: 'Taking torque about pivot: F×L = Mg×(L/2). Therefore, F = Mg/2. This is the minimum force required.',
      concepts: ['Rotational Mechanics', 'Torque', 'Equilibrium'],
      difficulty: 'Hard',
      topic: 'Mechanics',
      subtopic: 'Rotational Motion',
      marks: 4,
      timeToSolve: 5,
      frequency: 6,
      similarQuestions: ['jee-adv-2023-phy-15', 'jee-adv-2022-phy-11']
    });

    // NEET Physics
    this.addExamPaper({
      id: 'neet-2024-phy-23',
      examType: 'NEET',
      year: 2024,
      subject: 'Physics',
      questionNumber: 23,
      question: 'The de Broglie wavelength of an electron accelerated through a potential difference of 100 V is:',
      options: ['1.23 Å', '2.46 Å', '0.123 Å', '12.3 Å'],
      correctAnswer: 0,
      solution: 'λ = h/p = h/√(2meV) = 6.626×10⁻³⁴/√(2×9.1×10⁻³¹×1.6×10⁻¹⁹×100) = 1.23 Å',
      concepts: ['de Broglie Wavelength', 'Wave-Particle Duality', 'Modern Physics'],
      difficulty: 'Medium',
      topic: 'Modern Physics',
      subtopic: 'Dual Nature of Matter',
      marks: 4,
      timeToSolve: 3,
      frequency: 7,
      similarQuestions: ['neet-2023-phy-28', 'jee-main-2024-apr-phy-22']
    });

    // JEE Main Chemistry
    this.addExamPaper({
      id: 'jee-main-2024-jan-chem-5',
      examType: 'JEE Main',
      year: 2024,
      session: 'January',
      subject: 'Chemistry',
      questionNumber: 5,
      question: 'The hybridization of carbon atoms in benzene is:',
      options: ['sp³', 'sp²', 'sp', 'sp³d'],
      correctAnswer: 1,
      solution: 'In benzene, each carbon forms 3 sigma bonds (2 C-C and 1 C-H) and 1 pi bond. This requires sp² hybridization.',
      concepts: ['Hybridization', 'Aromatic Compounds', 'Chemical Bonding'],
      difficulty: 'Easy',
      topic: 'Organic Chemistry',
      subtopic: 'Chemical Bonding',
      marks: 4,
      timeToSolve: 2,
      frequency: 9,
      similarQuestions: ['neet-2024-chem-12', 'jee-main-2023-jul-chem-8']
    });

    // NEET Chemistry
    this.addExamPaper({
      id: 'neet-2024-chem-18',
      examType: 'NEET',
      year: 2024,
      subject: 'Chemistry',
      questionNumber: 18,
      question: 'Which of the following has the highest boiling point?',
      options: ['CH₄', 'C₂H₆', 'C₃H₈', 'C₄H₁₀'],
      correctAnswer: 3,
      solution: 'Boiling point increases with molecular mass and surface area. C₄H₁₀ (butane) has the highest molecular mass and strongest van der Waals forces.',
      concepts: ['Intermolecular Forces', 'Boiling Point', 'Alkanes'],
      difficulty: 'Easy',
      topic: 'Organic Chemistry',
      subtopic: 'Hydrocarbons',
      marks: 4,
      timeToSolve: 2,
      frequency: 8,
      similarQuestions: ['neet-2023-chem-15', 'jee-main-2024-apr-chem-11']
    });

    // JEE Main Mathematics
    this.addExamPaper({
      id: 'jee-main-2024-jan-math-12',
      examType: 'JEE Main',
      year: 2024,
      session: 'January',
      subject: 'Mathematics',
      questionNumber: 12,
      question: 'Find the value of lim(x→0) (sin x - x)/x³',
      options: ['-1/6', '1/6', '0', '∞'],
      correctAnswer: 0,
      solution: 'Using Taylor series: sin x = x - x³/6 + x⁵/120 - ... So (sin x - x)/x³ = -1/6 + x²/120 - ... As x→0, limit = -1/6',
      concepts: ['Limits', 'Taylor Series', 'L\'Hôpital\'s Rule'],
      difficulty: 'Hard',
      topic: 'Calculus',
      subtopic: 'Limits',
      marks: 4,
      timeToSolve: 4,
      frequency: 7,
      similarQuestions: ['jee-adv-2024-math-18', 'jee-main-2023-apr-math-15']
    });

    // NEET Biology
    this.addExamPaper({
      id: 'neet-2024-bio-35',
      examType: 'NEET',
      year: 2024,
      subject: 'Biology',
      questionNumber: 35,
      question: 'Which phase of mitosis is characterized by chromosome alignment at the cell equator?',
      options: ['Prophase', 'Metaphase', 'Anaphase', 'Telophase'],
      correctAnswer: 1,
      solution: 'During metaphase, chromosomes align at the metaphase plate (cell equator) with spindle fibers attached to kinetochores.',
      concepts: ['Cell Division', 'Mitosis', 'Chromosome Behavior'],
      difficulty: 'Easy',
      topic: 'Cell Biology',
      subtopic: 'Cell Division',
      marks: 4,
      timeToSolve: 1,
      frequency: 9,
      similarQuestions: ['neet-2023-bio-42', 'neet-2022-bio-38']
    });

    // Initialize exam patterns
    this.initializeExamPatterns();
  }

  private initializeExamPatterns(): void {
    // JEE Main Physics Pattern
    this.examPatterns.set('JEE Main-Physics', {
      examType: 'JEE Main',
      subject: 'Physics',
      totalQuestions: 30,
      totalMarks: 120,
      timeLimit: 180,
      topicWeightage: {
        'Mechanics': 25,
        'Thermodynamics': 10,
        'Electromagnetism': 20,
        'Optics': 15,
        'Modern Physics': 15,
        'Waves': 10,
        'SHM': 5
      },
      difficultyDistribution: { Easy: 30, Medium: 50, Hard: 20 },
      frequentConcepts: ['Kinematics', 'Newton\'s Laws', 'Work-Energy', 'Electromagnetic Induction', 'Ray Optics'],
      trendingTopics: ['Semiconductor Physics', 'Communication Systems', 'Dual Nature of Matter']
    });

    // NEET Physics Pattern
    this.examPatterns.set('NEET-Physics', {
      examType: 'NEET',
      subject: 'Physics',
      totalQuestions: 45,
      totalMarks: 180,
      timeLimit: 180,
      topicWeightage: {
        'Mechanics': 20,
        'Thermodynamics': 8,
        'Electromagnetism': 18,
        'Optics': 12,
        'Modern Physics': 12,
        'Waves': 8,
        'Current Electricity': 10,
        'Magnetism': 12
      },
      difficultyDistribution: { Easy: 40, Medium: 45, Hard: 15 },
      frequentConcepts: ['Motion in Straight Line', 'Laws of Motion', 'Current Electricity', 'Magnetic Effects'],
      trendingTopics: ['Semiconductor Devices', 'Communication Systems', 'Nuclei']
    });

    // NEET Biology Pattern
    this.examPatterns.set('NEET-Biology', {
      examType: 'NEET',
      subject: 'Biology',
      totalQuestions: 90,
      totalMarks: 360,
      timeLimit: 180,
      topicWeightage: {
        'Cell Biology': 12,
        'Genetics': 15,
        'Plant Physiology': 12,
        'Human Physiology': 18,
        'Ecology': 10,
        'Evolution': 8,
        'Reproduction': 10,
        'Biotechnology': 8,
        'Diversity': 7
      },
      difficultyDistribution: { Easy: 45, Medium: 40, Hard: 15 },
      frequentConcepts: ['Cell Structure', 'Photosynthesis', 'Respiration', 'Genetics', 'Human Physiology'],
      trendingTopics: ['Biotechnology', 'Molecular Biology', 'Environmental Issues']
    });
  }

  private addExamPaper(paper: ExamPaper): void {
    this.examPapers.set(paper.id, paper);
  }

  // Get similar questions from past papers
  getSimilarQuestions(concepts: string[], subject: string, difficulty?: string): ExamPaper[] {
    const papers = Array.from(this.examPapers.values())
      .filter(paper => 
        paper.subject === subject &&
        paper.concepts.some(concept => concepts.includes(concept)) &&
        (!difficulty || paper.difficulty === difficulty)
      )
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 5);

    return papers;
  }

  // Get questions by topic
  getQuestionsByTopic(subject: string, topic: string, limit: number = 10): ExamPaper[] {
    return Array.from(this.examPapers.values())
      .filter(paper => paper.subject === subject && paper.topic === topic)
      .sort((a, b) => b.year - a.year)
      .slice(0, limit);
  }

  // Get trending questions (recent years, high frequency)
  getTrendingQuestions(subject: string, limit: number = 5): ExamPaper[] {
    return Array.from(this.examPapers.values())
      .filter(paper => paper.subject === subject && paper.year >= 2022)
      .sort((a, b) => (b.frequency * b.year) - (a.frequency * a.year))
      .slice(0, limit);
  }

  // Get exam pattern
  getExamPattern(examType: string, subject: string): ExamPattern | null {
    return this.examPatterns.get(`${examType}-${subject}`) || null;
  }

  // Get questions by year and exam
  getQuestionsByExam(examType: 'JEE Main' | 'JEE Advanced' | 'NEET', year: number, subject: string): ExamPaper[] {
    return Array.from(this.examPapers.values())
      .filter(paper => 
        paper.examType === examType && 
        paper.year === year && 
        paper.subject === subject
      )
      .sort((a, b) => (a.questionNumber || 0) - (b.questionNumber || 0));
  }

  // Get high-frequency concepts
  getHighFrequencyConcepts(subject: string, examType?: string): string[] {
    const papers = Array.from(this.examPapers.values())
      .filter(paper => 
        paper.subject === subject &&
        (!examType || paper.examType === examType)
      );

    const conceptFrequency: { [concept: string]: number } = {};
    
    papers.forEach(paper => {
      paper.concepts.forEach(concept => {
        conceptFrequency[concept] = (conceptFrequency[concept] || 0) + paper.frequency;
      });
    });

    return Object.entries(conceptFrequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([concept]) => concept);
  }

  // Get exam statistics
  getExamStatistics(examType: string, subject: string): {
    totalQuestions: number;
    averageDifficulty: number;
    topicDistribution: { [topic: string]: number };
    yearlyTrends: { [year: number]: number };
  } {
    const papers = Array.from(this.examPapers.values())
      .filter(paper => paper.examType === examType && paper.subject === subject);

    const difficultyMap = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
    const averageDifficulty = papers.reduce((sum, paper) => 
      sum + difficultyMap[paper.difficulty], 0) / papers.length;

    const topicDistribution: { [topic: string]: number } = {};
    const yearlyTrends: { [year: number]: number } = {};

    papers.forEach(paper => {
      topicDistribution[paper.topic] = (topicDistribution[paper.topic] || 0) + 1;
      yearlyTrends[paper.year] = (yearlyTrends[paper.year] || 0) + 1;
    });

    return {
      totalQuestions: papers.length,
      averageDifficulty,
      topicDistribution,
      yearlyTrends
    };
  }

  // Search questions by text
  searchQuestions(query: string, subject?: string): ExamPaper[] {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.examPapers.values())
      .filter(paper => 
        (!subject || paper.subject === subject) &&
        (paper.question.toLowerCase().includes(lowercaseQuery) ||
         paper.concepts.some(concept => concept.toLowerCase().includes(lowercaseQuery)) ||
         paper.topic.toLowerCase().includes(lowercaseQuery))
      )
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 10);
  }

  // Get all exam papers
  getAllPapers(): ExamPaper[] {
    return Array.from(this.examPapers.values());
  }

  // Get papers by difficulty
  getPapersByDifficulty(difficulty: 'Easy' | 'Medium' | 'Hard', subject?: string): ExamPaper[] {
    return Array.from(this.examPapers.values())
      .filter(paper => 
        paper.difficulty === difficulty &&
        (!subject || paper.subject === subject)
      )
      .sort((a, b) => b.frequency - a.frequency);
  }
}

export const examPaperService = ExamPaperService.getInstance();