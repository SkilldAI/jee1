import React, { useState, useEffect } from 'react';
import { Clock, Target, Play, CheckCircle, XCircle, Award, BookOpen, BarChart3, Filter, Search } from 'lucide-react';
import { Subject } from '../types';

interface MockExamsProps {
  selectedSubject: Subject | null;
}

interface MockExam {
  id: string;
  title: string;
  subject: string;
  duration: number; // in minutes
  totalQuestions: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  type: 'JEE Main' | 'JEE Advanced' | 'NEET' | 'Chapter Test' | 'Previous Year' | 'Foundation Test';
  completed: boolean;
  score?: number;
  accuracy?: number;
  timeSpent?: number;
  completedAt?: Date;
  description: string;
  topics: string[];
  syllabus: string[];
  learningObjectives: string[];
}

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  concept: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  subject: string;
  topic: string;
  subtopic: string;
  bloomsLevel: 'Remember' | 'Understand' | 'Apply' | 'Analyze' | 'Evaluate' | 'Create';
  estimatedTime: number; // in seconds
}

const MockExams: React.FC<MockExamsProps> = ({ selectedSubject }) => {
  const [mockExams, setMockExams] = useState<MockExam[]>([]);
  const [filteredExams, setFilteredExams] = useState<MockExam[]>([]);
  const [currentExam, setCurrentExam] = useState<MockExam | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [examStarted, setExamStarted] = useState(false);
  const [examCompleted, setExamCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [filterType, setFilterType] = useState<string>('All');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Comprehensive mock exam data with all difficulty levels
    const mockExamData: MockExam[] = [
      // PHYSICS EXAMS - ALL LEVELS
      
      // BEGINNER PHYSICS
      {
        id: 'phy-begin-001',
        title: 'Physics Foundation - Basic Mechanics',
        subject: 'Physics',
        duration: 45,
        totalQuestions: 20,
        difficulty: 'Beginner',
        type: 'Foundation Test',
        completed: false,
        description: 'Basic concepts of motion, force, and energy for beginners',
        topics: ['Motion in Straight Line', 'Basic Forces', 'Work and Energy Basics'],
        syllabus: ['Kinematics fundamentals', 'Newton\'s first law', 'Simple work calculations'],
        learningObjectives: [
          'Understand basic motion concepts',
          'Apply simple kinematic equations',
          'Calculate basic work and energy'
        ]
      },
      {
        id: 'phy-begin-002',
        title: 'Physics Foundation - Heat and Temperature',
        subject: 'Physics',
        duration: 40,
        totalQuestions: 18,
        difficulty: 'Beginner',
        type: 'Foundation Test',
        completed: false,
        description: 'Introduction to thermal physics and heat transfer',
        topics: ['Temperature Scales', 'Heat Transfer', 'Thermal Expansion'],
        syllabus: ['Celsius and Kelvin scales', 'Conduction basics', 'Linear expansion'],
        learningObjectives: [
          'Convert between temperature scales',
          'Understand heat transfer methods',
          'Calculate thermal expansion'
        ]
      },
      {
        id: 'phy-begin-003',
        title: 'Physics Foundation - Light and Optics Basics',
        subject: 'Physics',
        duration: 35,
        totalQuestions: 15,
        difficulty: 'Beginner',
        type: 'Foundation Test',
        completed: false,
        description: 'Basic properties of light and simple optical phenomena',
        topics: ['Properties of Light', 'Reflection', 'Refraction Basics'],
        syllabus: ['Light as wave and particle', 'Laws of reflection', 'Snell\'s law introduction'],
        learningObjectives: [
          'Understand light properties',
          'Apply reflection laws',
          'Solve basic refraction problems'
        ]
      },

      // INTERMEDIATE PHYSICS
      {
        id: 'phy-inter-001',
        title: 'JEE Main Physics - Mechanics Mastery',
        subject: 'Physics',
        duration: 60,
        totalQuestions: 25,
        difficulty: 'Intermediate',
        type: 'JEE Main',
        completed: true,
        score: 85,
        accuracy: 85,
        timeSpent: 55,
        completedAt: new Date(2024, 0, 10),
        description: 'Comprehensive mechanics test covering kinematics, dynamics, and energy',
        topics: ['Kinematics 2D', 'Newton\'s Laws', 'Work-Energy Theorem', 'Rotational Motion'],
        syllabus: ['Projectile motion', 'Force analysis', 'Conservation laws', 'Moment of inertia'],
        learningObjectives: [
          'Solve complex motion problems',
          'Apply Newton\'s laws in multiple dimensions',
          'Use energy conservation principles'
        ]
      },
      {
        id: 'phy-inter-002',
        title: 'JEE Main Physics - Waves and Oscillations',
        subject: 'Physics',
        duration: 55,
        totalQuestions: 22,
        difficulty: 'Intermediate',
        type: 'JEE Main',
        completed: false,
        description: 'Wave motion, sound waves, and simple harmonic motion',
        topics: ['SHM', 'Wave Motion', 'Sound Waves', 'Doppler Effect'],
        syllabus: ['Pendulum motion', 'Wave equation', 'Sound properties', 'Frequency changes'],
        learningObjectives: [
          'Analyze oscillatory motion',
          'Understand wave propagation',
          'Calculate Doppler shifts'
        ]
      },
      {
        id: 'phy-inter-003',
        title: 'JEE Main Physics - Electricity and Magnetism',
        subject: 'Physics',
        duration: 65,
        totalQuestions: 28,
        difficulty: 'Intermediate',
        type: 'JEE Main',
        completed: false,
        description: 'Electric fields, circuits, and magnetic phenomena',
        topics: ['Electric Field', 'Current Electricity', 'Magnetic Field', 'Electromagnetic Induction'],
        syllabus: ['Coulomb\'s law', 'Ohm\'s law', 'Lorentz force', 'Faraday\'s law'],
        learningObjectives: [
          'Calculate electric fields and potentials',
          'Analyze electrical circuits',
          'Understand electromagnetic induction'
        ]
      },

      // ADVANCED PHYSICS
      {
        id: 'phy-adv-001',
        title: 'JEE Advanced Physics - Complex Mechanics',
        subject: 'Physics',
        duration: 90,
        totalQuestions: 35,
        difficulty: 'Advanced',
        type: 'JEE Advanced',
        completed: false,
        description: 'Advanced mechanics with complex problem-solving',
        topics: ['Lagrangian Mechanics', 'Rigid Body Dynamics', 'Collision Theory', 'Gravitation'],
        syllabus: ['Generalized coordinates', 'Angular momentum', 'Elastic collisions', 'Orbital mechanics'],
        learningObjectives: [
          'Apply advanced mechanical principles',
          'Solve multi-body problems',
          'Understand conservation laws deeply'
        ]
      },
      {
        id: 'phy-adv-002',
        title: 'JEE Advanced Physics - Modern Physics',
        subject: 'Physics',
        duration: 85,
        totalQuestions: 32,
        difficulty: 'Advanced',
        type: 'JEE Advanced',
        completed: false,
        description: 'Quantum mechanics, atomic physics, and nuclear physics',
        topics: ['Quantum Mechanics', 'Atomic Structure', 'Nuclear Physics', 'Relativity'],
        syllabus: ['Wave-particle duality', 'Bohr model', 'Radioactivity', 'Time dilation'],
        learningObjectives: [
          'Understand quantum principles',
          'Analyze atomic phenomena',
          'Apply relativistic concepts'
        ]
      },

      // CHEMISTRY EXAMS - ALL LEVELS

      // BEGINNER CHEMISTRY
      {
        id: 'chem-begin-001',
        title: 'Chemistry Foundation - Atomic Structure Basics',
        subject: 'Chemistry',
        duration: 40,
        totalQuestions: 18,
        difficulty: 'Beginner',
        type: 'Foundation Test',
        completed: false,
        description: 'Introduction to atoms, elements, and periodic table',
        topics: ['Atomic Structure', 'Periodic Table', 'Chemical Bonding Basics'],
        syllabus: ['Protons, neutrons, electrons', 'Element properties', 'Ionic and covalent bonds'],
        learningObjectives: [
          'Identify atomic components',
          'Navigate periodic table',
          'Understand basic bonding'
        ]
      },
      {
        id: 'chem-begin-002',
        title: 'Chemistry Foundation - Chemical Reactions',
        subject: 'Chemistry',
        duration: 45,
        totalQuestions: 20,
        difficulty: 'Beginner',
        type: 'Foundation Test',
        completed: false,
        description: 'Basic chemical reactions and equation balancing',
        topics: ['Chemical Equations', 'Types of Reactions', 'Stoichiometry Basics'],
        syllabus: ['Balancing equations', 'Synthesis and decomposition', 'Mole concept'],
        learningObjectives: [
          'Balance chemical equations',
          'Classify reaction types',
          'Perform basic stoichiometry'
        ]
      },

      // INTERMEDIATE CHEMISTRY
      {
        id: 'chem-inter-001',
        title: 'JEE Main Chemistry - Physical Chemistry',
        subject: 'Chemistry',
        duration: 60,
        totalQuestions: 25,
        difficulty: 'Intermediate',
        type: 'JEE Main',
        completed: true,
        score: 78,
        accuracy: 78,
        timeSpent: 58,
        completedAt: new Date(2024, 0, 8),
        description: 'Thermodynamics, kinetics, and equilibrium',
        topics: ['Thermodynamics', 'Chemical Kinetics', 'Equilibrium', 'Solutions'],
        syllabus: ['Enthalpy changes', 'Rate laws', 'Le Chatelier principle', 'Colligative properties'],
        learningObjectives: [
          'Calculate thermodynamic quantities',
          'Determine reaction rates',
          'Predict equilibrium shifts'
        ]
      },
      {
        id: 'chem-inter-002',
        title: 'JEE Main Chemistry - Organic Chemistry',
        subject: 'Chemistry',
        duration: 65,
        totalQuestions: 28,
        difficulty: 'Intermediate',
        type: 'JEE Main',
        completed: false,
        description: 'Organic compounds, reactions, and mechanisms',
        topics: ['Hydrocarbons', 'Functional Groups', 'Reaction Mechanisms', 'Stereochemistry'],
        syllabus: ['Alkanes, alkenes, alkynes', 'Alcohols, ethers, carbonyls', 'SN1, SN2, E1, E2', 'Optical isomerism'],
        learningObjectives: [
          'Identify organic compounds',
          'Predict reaction products',
          'Understand stereochemistry'
        ]
      },

      // ADVANCED CHEMISTRY
      {
        id: 'chem-adv-001',
        title: 'JEE Advanced Chemistry - Complex Equilibria',
        subject: 'Chemistry',
        duration: 90,
        totalQuestions: 35,
        difficulty: 'Advanced',
        type: 'JEE Advanced',
        completed: false,
        description: 'Advanced equilibrium concepts and calculations',
        topics: ['Ionic Equilibria', 'Buffer Systems', 'Solubility Equilibria', 'Electrochemistry'],
        syllabus: ['Acid-base equilibria', 'Henderson-Hasselbalch', 'Ksp calculations', 'Nernst equation'],
        learningObjectives: [
          'Solve complex equilibrium problems',
          'Design buffer systems',
          'Calculate electrode potentials'
        ]
      },

      // MATHEMATICS EXAMS - ALL LEVELS

      // BEGINNER MATHEMATICS
      {
        id: 'math-begin-001',
        title: 'Mathematics Foundation - Algebra Basics',
        subject: 'Mathematics',
        duration: 45,
        totalQuestions: 20,
        difficulty: 'Beginner',
        type: 'Foundation Test',
        completed: false,
        description: 'Basic algebraic operations and linear equations',
        topics: ['Linear Equations', 'Quadratic Equations', 'Polynomials', 'Factorization'],
        syllabus: ['Solving linear equations', 'Quadratic formula', 'Polynomial operations', 'Factoring techniques'],
        learningObjectives: [
          'Solve linear and quadratic equations',
          'Perform polynomial operations',
          'Apply factorization methods'
        ]
      },
      {
        id: 'math-begin-002',
        title: 'Mathematics Foundation - Geometry Basics',
        subject: 'Mathematics',
        duration: 40,
        totalQuestions: 18,
        difficulty: 'Beginner',
        type: 'Foundation Test',
        completed: false,
        description: 'Basic geometric shapes and properties',
        topics: ['Triangles', 'Circles', 'Coordinate Geometry', 'Mensuration'],
        syllabus: ['Triangle properties', 'Circle theorems', 'Distance formula', 'Area and volume'],
        learningObjectives: [
          'Apply geometric theorems',
          'Calculate areas and volumes',
          'Use coordinate geometry'
        ]
      },

      // INTERMEDIATE MATHEMATICS
      {
        id: 'math-inter-001',
        title: 'JEE Main Mathematics - Calculus',
        subject: 'Mathematics',
        duration: 60,
        totalQuestions: 25,
        difficulty: 'Intermediate',
        type: 'JEE Main',
        completed: false,
        description: 'Limits, derivatives, and integration',
        topics: ['Limits', 'Derivatives', 'Integration', 'Applications of Calculus'],
        syllabus: ['Limit evaluation', 'Differentiation rules', 'Integration techniques', 'Optimization problems'],
        learningObjectives: [
          'Evaluate complex limits',
          'Apply differentiation rules',
          'Solve integration problems'
        ]
      },
      {
        id: 'math-inter-002',
        title: 'JEE Main Mathematics - Coordinate Geometry',
        subject: 'Mathematics',
        duration: 55,
        totalQuestions: 22,
        difficulty: 'Intermediate',
        type: 'JEE Main',
        completed: false,
        description: 'Lines, circles, parabolas, and conic sections',
        topics: ['Straight Lines', 'Circles', 'Parabola', 'Ellipse', 'Hyperbola'],
        syllabus: ['Line equations', 'Circle properties', 'Conic section equations', 'Parametric forms'],
        learningObjectives: [
          'Derive equations of curves',
          'Solve geometric problems analytically',
          'Understand conic properties'
        ]
      },

      // ADVANCED MATHEMATICS
      {
        id: 'math-adv-001',
        title: 'JEE Advanced Mathematics - Complex Analysis',
        subject: 'Mathematics',
        duration: 90,
        totalQuestions: 35,
        difficulty: 'Advanced',
        type: 'JEE Advanced',
        completed: false,
        description: 'Complex numbers, functions, and advanced calculus',
        topics: ['Complex Numbers', 'Functions', 'Differential Equations', 'Vector Calculus'],
        syllabus: ['Complex plane', 'Function properties', 'DE solutions', 'Vector operations'],
        learningObjectives: [
          'Manipulate complex numbers',
          'Analyze function behavior',
          'Solve differential equations'
        ]
      },

      // BIOLOGY EXAMS - ALL LEVELS (NEET FOCUSED)

      // BEGINNER BIOLOGY
      {
        id: 'bio-begin-001',
        title: 'Biology Foundation - Cell Biology Basics',
        subject: 'Biology',
        duration: 40,
        totalQuestions: 18,
        difficulty: 'Beginner',
        type: 'Foundation Test',
        completed: false,
        description: 'Introduction to cells and basic life processes',
        topics: ['Cell Structure', 'Cell Functions', 'Cell Division Basics', 'Biomolecules'],
        syllabus: ['Prokaryotic vs eukaryotic', 'Organelle functions', 'Mitosis basics', 'Proteins and carbohydrates'],
        learningObjectives: [
          'Identify cell components',
          'Understand cell functions',
          'Recognize biomolecules'
        ]
      },
      {
        id: 'bio-begin-002',
        title: 'Biology Foundation - Plant Biology',
        subject: 'Biology',
        duration: 45,
        totalQuestions: 20,
        difficulty: 'Beginner',
        type: 'Foundation Test',
        completed: false,
        description: 'Basic plant structure and photosynthesis',
        topics: ['Plant Structure', 'Photosynthesis', 'Plant Nutrition', 'Plant Growth'],
        syllabus: ['Root, stem, leaf structure', 'Light and dark reactions', 'Mineral nutrition', 'Growth hormones'],
        learningObjectives: [
          'Understand plant anatomy',
          'Explain photosynthesis process',
          'Identify plant nutrients'
        ]
      },

      // INTERMEDIATE BIOLOGY
      {
        id: 'bio-inter-001',
        title: 'NEET Biology - Human Physiology',
        subject: 'Biology',
        duration: 60,
        totalQuestions: 45,
        difficulty: 'Intermediate',
        type: 'NEET',
        completed: true,
        score: 88,
        accuracy: 88,
        timeSpent: 43,
        completedAt: new Date(2024, 0, 3),
        description: 'Human organ systems and their functions',
        topics: ['Digestive System', 'Respiratory System', 'Circulatory System', 'Nervous System'],
        syllabus: ['Digestion process', 'Gas exchange', 'Heart function', 'Neuron structure'],
        learningObjectives: [
          'Understand organ system functions',
          'Explain physiological processes',
          'Relate structure to function'
        ]
      },
      {
        id: 'bio-inter-002',
        title: 'NEET Biology - Genetics and Evolution',
        subject: 'Biology',
        duration: 55,
        totalQuestions: 40,
        difficulty: 'Intermediate',
        type: 'NEET',
        completed: false,
        description: 'Heredity, genetic disorders, and evolutionary concepts',
        topics: ['Mendelian Genetics', 'Molecular Genetics', 'Evolution', 'Biotechnology'],
        syllabus: ['Inheritance patterns', 'DNA structure', 'Natural selection', 'Genetic engineering'],
        learningObjectives: [
          'Solve genetic problems',
          'Understand DNA function',
          'Explain evolutionary mechanisms'
        ]
      },

      // ADVANCED BIOLOGY
      {
        id: 'bio-adv-001',
        title: 'NEET Biology - Advanced Ecology and Environment',
        subject: 'Biology',
        duration: 70,
        totalQuestions: 50,
        difficulty: 'Advanced',
        type: 'NEET',
        completed: false,
        description: 'Complex ecological interactions and environmental issues',
        topics: ['Ecosystem Dynamics', 'Biodiversity', 'Environmental Issues', 'Conservation Biology'],
        syllabus: ['Food webs', 'Species interactions', 'Pollution effects', 'Conservation strategies'],
        learningObjectives: [
          'Analyze ecosystem relationships',
          'Evaluate environmental impacts',
          'Propose conservation solutions'
        ]
      },

      // PREVIOUS YEAR PAPERS
      {
        id: 'prev-phy-001',
        title: 'JEE Main 2023 Physics Paper',
        subject: 'Physics',
        duration: 60,
        totalQuestions: 25,
        difficulty: 'Intermediate',
        type: 'Previous Year',
        completed: false,
        description: 'Actual JEE Main 2023 Physics paper with solutions',
        topics: ['All Physics Topics'],
        syllabus: ['Complete JEE Main Physics syllabus'],
        learningObjectives: [
          'Experience actual exam difficulty',
          'Practice time management',
          'Identify knowledge gaps'
        ]
      },
      {
        id: 'prev-chem-001',
        title: 'JEE Advanced 2023 Chemistry Paper 1',
        subject: 'Chemistry',
        duration: 90,
        totalQuestions: 35,
        difficulty: 'Advanced',
        type: 'Previous Year',
        completed: false,
        description: 'Actual JEE Advanced 2023 Chemistry paper',
        topics: ['All Chemistry Topics'],
        syllabus: ['Complete JEE Advanced Chemistry syllabus'],
        learningObjectives: [
          'Handle advanced problem complexity',
          'Apply multiple concepts together',
          'Develop exam strategy'
        ]
      },
      {
        id: 'prev-bio-001',
        title: 'NEET 2023 Biology Paper',
        subject: 'Biology',
        duration: 45,
        totalQuestions: 45,
        difficulty: 'Intermediate',
        type: 'Previous Year',
        completed: false,
        description: 'Actual NEET 2023 Biology paper',
        topics: ['All Biology Topics'],
        syllabus: ['Complete NEET Biology syllabus'],
        learningObjectives: [
          'Practice NEET question patterns',
          'Improve speed and accuracy',
          'Review all biology concepts'
        ]
      },
      {
        id: 'prev-math-001',
        title: 'JEE Main 2023 Mathematics Paper',
        subject: 'Mathematics',
        duration: 60,
        totalQuestions: 25,
        difficulty: 'Intermediate',
        type: 'Previous Year',
        completed: false,
        description: 'Actual JEE Main 2023 Mathematics paper',
        topics: ['All Mathematics Topics'],
        syllabus: ['Complete JEE Main Mathematics syllabus'],
        learningObjectives: [
          'Master calculation techniques',
          'Handle time pressure',
          'Perfect problem-solving approach'
        ]
      }
    ];

    setMockExams(mockExamData);
    setFilteredExams(mockExamData);
  }, []);

  useEffect(() => {
    let filtered = mockExams;

    // Filter by type
    if (filterType !== 'All') {
      filtered = filtered.filter(exam => exam.type === filterType);
    }

    // Filter by difficulty
    if (filterDifficulty !== 'All') {
      filtered = filtered.filter(exam => exam.difficulty === filterDifficulty);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(exam => 
        exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exam.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exam.topics.some(topic => topic.toLowerCase().includes(searchTerm.toLowerCase())) ||
        exam.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredExams(filtered);
  }, [mockExams, filterType, filterDifficulty, searchTerm]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (examStarted && timeLeft > 0 && !examCompleted) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && examStarted) {
      handleExamComplete();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, examStarted, examCompleted]);

  const generateQuestions = (exam: MockExam): Question[] => {
    // Comprehensive question bank organized by difficulty and subject
    const questionBank: Question[] = [
      // PHYSICS QUESTIONS - BEGINNER
      {
        id: 'phy-beg-1',
        question: 'A car travels 60 km in 1 hour. What is its speed in m/s?',
        options: ['16.67 m/s', '60 m/s', '3600 m/s', '1 m/s'],
        correctAnswer: 0,
        explanation: 'Speed = Distance/Time = 60 km/h = 60 × (1000/3600) = 16.67 m/s',
        concept: 'Speed and Velocity',
        difficulty: 'Easy',
        subject: 'Physics',
        topic: 'Kinematics',
        subtopic: 'Speed',
        bloomsLevel: 'Apply',
        estimatedTime: 60
      },
      {
        id: 'phy-beg-2',
        question: 'Which of the following is a vector quantity?',
        options: ['Speed', 'Distance', 'Velocity', 'Time'],
        correctAnswer: 2,
        explanation: 'Velocity has both magnitude and direction, making it a vector quantity.',
        concept: 'Scalars and Vectors',
        difficulty: 'Easy',
        subject: 'Physics',
        topic: 'Kinematics',
        subtopic: 'Vectors',
        bloomsLevel: 'Remember',
        estimatedTime: 30
      },
      {
        id: 'phy-beg-3',
        question: 'What is the SI unit of force?',
        options: ['Joule', 'Newton', 'Watt', 'Pascal'],
        correctAnswer: 1,
        explanation: 'The SI unit of force is Newton (N), named after Sir Isaac Newton.',
        concept: 'Units and Measurements',
        difficulty: 'Easy',
        subject: 'Physics',
        topic: 'Mechanics',
        subtopic: 'Force',
        bloomsLevel: 'Remember',
        estimatedTime: 20
      },

      // PHYSICS QUESTIONS - INTERMEDIATE
      {
        id: 'phy-int-1',
        question: 'A projectile is launched at 45° with initial velocity 20 m/s. What is the maximum height reached? (g = 10 m/s²)',
        options: ['5 m', '10 m', '15 m', '20 m'],
        correctAnswer: 1,
        explanation: 'Maximum height = (u²sin²θ)/(2g) = (20² × sin²45°)/(2×10) = (400 × 0.5)/20 = 10 m',
        concept: 'Projectile Motion',
        difficulty: 'Medium',
        subject: 'Physics',
        topic: 'Kinematics',
        subtopic: 'Projectile Motion',
        bloomsLevel: 'Apply',
        estimatedTime: 120
      },
      {
        id: 'phy-int-2',
        question: 'Two masses 3 kg and 5 kg are connected by a string over a pulley. What is the acceleration of the system?',
        options: ['2.5 m/s²', '5 m/s²', '7.5 m/s²', '10 m/s²'],
        correctAnswer: 0,
        explanation: 'For Atwood machine: a = (m₂-m₁)g/(m₁+m₂) = (5-3)×10/(3+5) = 20/8 = 2.5 m/s²',
        concept: 'Newton\'s Laws',
        difficulty: 'Medium',
        subject: 'Physics',
        topic: 'Mechanics',
        subtopic: 'Dynamics',
        bloomsLevel: 'Apply',
        estimatedTime: 180
      },

      // PHYSICS QUESTIONS - ADVANCED
      {
        id: 'phy-adv-1',
        question: 'A uniform rod of length L and mass M rotates about one end. What is its moment of inertia?',
        options: ['ML²/12', 'ML²/3', 'ML²/2', 'ML²'],
        correctAnswer: 1,
        explanation: 'For a rod rotating about one end: I = ∫r²dm = ML²/3',
        concept: 'Rotational Inertia',
        difficulty: 'Hard',
        subject: 'Physics',
        topic: 'Mechanics',
        subtopic: 'Rotational Motion',
        bloomsLevel: 'Analyze',
        estimatedTime: 240
      },

      // CHEMISTRY QUESTIONS - BEGINNER
      {
        id: 'chem-beg-1',
        question: 'What is the atomic number of carbon?',
        options: ['4', '6', '8', '12'],
        correctAnswer: 1,
        explanation: 'Carbon has 6 protons, so its atomic number is 6.',
        concept: 'Atomic Structure',
        difficulty: 'Easy',
        subject: 'Chemistry',
        topic: 'Atomic Structure',
        subtopic: 'Atomic Number',
        bloomsLevel: 'Remember',
        estimatedTime: 20
      },
      {
        id: 'chem-beg-2',
        question: 'Which of the following is a noble gas?',
        options: ['Oxygen', 'Nitrogen', 'Helium', 'Hydrogen'],
        correctAnswer: 2,
        explanation: 'Helium is a noble gas with complete electron configuration.',
        concept: 'Periodic Table',
        difficulty: 'Easy',
        subject: 'Chemistry',
        topic: 'Periodic Table',
        subtopic: 'Noble Gases',
        bloomsLevel: 'Remember',
        estimatedTime: 30
      },

      // CHEMISTRY QUESTIONS - INTERMEDIATE
      {
        id: 'chem-int-1',
        question: 'For the reaction N₂ + 3H₂ ⇌ 2NH₃, if Kc = 4, what is Kc for the reverse reaction?',
        options: ['0.25', '4', '16', '0.5'],
        correctAnswer: 0,
        explanation: 'For reverse reaction, Kc(reverse) = 1/Kc(forward) = 1/4 = 0.25',
        concept: 'Chemical Equilibrium',
        difficulty: 'Medium',
        subject: 'Chemistry',
        topic: 'Physical Chemistry',
        subtopic: 'Equilibrium',
        bloomsLevel: 'Apply',
        estimatedTime: 90
      },

      // MATHEMATICS QUESTIONS - BEGINNER
      {
        id: 'math-beg-1',
        question: 'Solve for x: 2x + 5 = 13',
        options: ['x = 3', 'x = 4', 'x = 5', 'x = 6'],
        correctAnswer: 1,
        explanation: '2x + 5 = 13 → 2x = 8 → x = 4',
        concept: 'Linear Equations',
        difficulty: 'Easy',
        subject: 'Mathematics',
        topic: 'Algebra',
        subtopic: 'Linear Equations',
        bloomsLevel: 'Apply',
        estimatedTime: 45
      },
      {
        id: 'math-beg-2',
        question: 'What is the area of a circle with radius 7 cm? (π = 22/7)',
        options: ['154 cm²', '44 cm²', '22 cm²', '308 cm²'],
        correctAnswer: 0,
        explanation: 'Area = πr² = (22/7) × 7² = 22 × 7 = 154 cm²',
        concept: 'Mensuration',
        difficulty: 'Easy',
        subject: 'Mathematics',
        topic: 'Geometry',
        subtopic: 'Circle',
        bloomsLevel: 'Apply',
        estimatedTime: 60
      },

      // MATHEMATICS QUESTIONS - INTERMEDIATE
      {
        id: 'math-int-1',
        question: 'What is lim(x→0) (sin x)/x?',
        options: ['0', '1', '∞', 'Does not exist'],
        correctAnswer: 1,
        explanation: 'This is a standard limit: lim(x→0) (sin x)/x = 1',
        concept: 'Limits',
        difficulty: 'Medium',
        subject: 'Mathematics',
        topic: 'Calculus',
        subtopic: 'Limits',
        bloomsLevel: 'Apply',
        estimatedTime: 90
      },

      // BIOLOGY QUESTIONS - BEGINNER
      {
        id: 'bio-beg-1',
        question: 'Which organelle is known as the "powerhouse of the cell"?',
        options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Golgi apparatus'],
        correctAnswer: 1,
        explanation: 'Mitochondria produce ATP through cellular respiration, earning the nickname "powerhouse of the cell".',
        concept: 'Cell Organelles',
        difficulty: 'Easy',
        subject: 'Biology',
        topic: 'Cell Biology',
        subtopic: 'Organelles',
        bloomsLevel: 'Remember',
        estimatedTime: 30
      },
      {
        id: 'bio-beg-2',
        question: 'What is the basic unit of life?',
        options: ['Tissue', 'Organ', 'Cell', 'Organism'],
        correctAnswer: 2,
        explanation: 'The cell is the basic structural and functional unit of all living organisms.',
        concept: 'Cell Theory',
        difficulty: 'Easy',
        subject: 'Biology',
        topic: 'Cell Biology',
        subtopic: 'Cell Theory',
        bloomsLevel: 'Remember',
        estimatedTime: 20
      },

      // BIOLOGY QUESTIONS - INTERMEDIATE
      {
        id: 'bio-int-1',
        question: 'During which phase of mitosis do chromosomes align at the cell equator?',
        options: ['Prophase', 'Metaphase', 'Anaphase', 'Telophase'],
        correctAnswer: 1,
        explanation: 'During metaphase, chromosomes align at the metaphase plate (cell equator).',
        concept: 'Cell Division',
        difficulty: 'Medium',
        subject: 'Biology',
        topic: 'Cell Biology',
        subtopic: 'Mitosis',
        bloomsLevel: 'Understand',
        estimatedTime: 60
      },
      {
        id: 'bio-int-2',
        question: 'What type of inheritance is shown by ABO blood groups?',
        options: ['Complete dominance', 'Incomplete dominance', 'Codominance', 'Multiple allelism'],
        correctAnswer: 3,
        explanation: 'ABO blood groups show multiple allelism with three alleles (IA, IB, i) and codominance between IA and IB.',
        concept: 'Genetics',
        difficulty: 'Medium',
        subject: 'Biology',
        topic: 'Genetics',
        subtopic: 'Inheritance',
        bloomsLevel: 'Understand',
        estimatedTime: 90
      }
    ];

    // Filter questions based on exam subject and difficulty
    let examQuestions = questionBank.filter(q => {
      const subjectMatch = q.subject === exam.subject;
      const difficultyMatch = 
        (exam.difficulty === 'Beginner' && q.difficulty === 'Easy') ||
        (exam.difficulty === 'Intermediate' && ['Easy', 'Medium'].includes(q.difficulty)) ||
        (exam.difficulty === 'Advanced' && ['Medium', 'Hard'].includes(q.difficulty));
      
      return subjectMatch && difficultyMatch;
    });

    // If not enough questions, add some from other difficulties
    if (examQuestions.length < exam.totalQuestions) {
      const additionalQuestions = questionBank.filter(q => 
        q.subject === exam.subject && !examQuestions.includes(q)
      );
      examQuestions = [...examQuestions, ...additionalQuestions];
    }

    // Shuffle and select required number of questions
    const shuffled = examQuestions.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(exam.totalQuestions, shuffled.length));
  };

  const startExam = (exam: MockExam) => {
    const examQuestions = generateQuestions(exam);
    
    setCurrentExam(exam);
    setQuestions(examQuestions);
    setAnswers(new Array(examQuestions.length).fill(-1));
    setCurrentQuestion(0);
    setTimeLeft(exam.duration * 60);
    setExamStarted(true);
    setExamCompleted(false);
    setShowResults(false);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleExamComplete = () => {
    setExamStarted(false);
    setExamCompleted(true);
    
    // Calculate results
    const correctAnswers = answers.filter((answer, index) => 
      answer === questions[index]?.correctAnswer
    ).length;
    
    const accuracy = Math.round((correctAnswers / questions.length) * 100);
    const timeSpent = (currentExam!.duration * 60 - timeLeft) / 60;
    
    // Update exam data
    const updatedExam = {
      ...currentExam!,
      completed: true,
      score: accuracy,
      accuracy,
      timeSpent: Math.round(timeSpent),
      completedAt: new Date()
    };
    
    setMockExams(prev => prev.map(exam => 
      exam.id === updatedExam.id ? updatedExam : exam
    ));
    
    setShowResults(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Foundation Test': return 'bg-green-100 text-green-800';
      case 'JEE Main': return 'bg-blue-100 text-blue-800';
      case 'JEE Advanced': return 'bg-purple-100 text-purple-800';
      case 'NEET': return 'bg-pink-100 text-pink-800';
      case 'Chapter Test': return 'bg-orange-100 text-orange-800';
      case 'Previous Year': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getBloomsColor = (level: string) => {
    switch (level) {
      case 'Remember': return 'bg-blue-50 text-blue-700';
      case 'Understand': return 'bg-green-50 text-green-700';
      case 'Apply': return 'bg-yellow-50 text-yellow-700';
      case 'Analyze': return 'bg-orange-50 text-orange-700';
      case 'Evaluate': return 'bg-red-50 text-red-700';
      case 'Create': return 'bg-purple-50 text-purple-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  if (examStarted && currentExam) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Exam Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-gray-900">{currentExam.title}</h1>
                <div className="flex items-center space-x-4 mt-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(currentExam.difficulty)}`}>
                    {currentExam.difficulty}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(currentExam.type)}`}>
                    {currentExam.type}
                  </span>
                  <span className="text-sm text-gray-600">
                    Question {currentQuestion + 1} of {questions.length}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-red-600">
                  <Clock className="h-5 w-5" />
                  <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
                </div>
                <button
                  onClick={handleExamComplete}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Submit Exam
                </button>
              </div>
            </div>
          </div>

          {/* Question */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(questions[currentQuestion]?.difficulty || 'Medium')}`}>
                  {questions[currentQuestion]?.difficulty}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBloomsColor(questions[currentQuestion]?.bloomsLevel || 'Apply')}`}>
                  {questions[currentQuestion]?.bloomsLevel}
                </span>
                <span className="text-sm text-gray-500">{questions[currentQuestion]?.concept}</span>
                <span className="text-sm text-gray-400">
                  Est. {Math.round((questions[currentQuestion]?.estimatedTime || 60) / 60)} min
                </span>
              </div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                {questions[currentQuestion]?.question}
              </h2>
            </div>

            <div className="space-y-3">
              {questions[currentQuestion]?.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full text-left p-4 rounded-lg border transition-colors ${
                    answers[currentQuestion] === index
                      ? 'border-blue-500 bg-blue-50 text-blue-900'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <span className="font-medium mr-3">{String.fromCharCode(65 + index)}.</span>
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Answered: {answers.filter(a => a !== -1).length}/{questions.length}
              </span>
              <div className="flex space-x-1">
                {questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestion(index)}
                    className={`w-8 h-8 rounded text-xs font-medium ${
                      index === currentQuestion
                        ? 'bg-blue-600 text-white'
                        : answers[index] !== -1
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
            
            <button
              onClick={() => setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1))}
              disabled={currentQuestion === questions.length - 1}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showResults && currentExam) {
    const correctAnswers = answers.filter((answer, index) => 
      answer === questions[index]?.correctAnswer
    ).length;

    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="text-center mb-8">
              <div className="bg-green-100 p-4 rounded-full inline-block mb-4">
                <Award className="h-8 w-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Exam Completed!</h1>
              <p className="text-gray-600">{currentExam.title}</p>
              <div className="flex items-center justify-center space-x-2 mt-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(currentExam.difficulty)}`}>
                  {currentExam.difficulty}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(currentExam.type)}`}>
                  {currentExam.type}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{currentExam.accuracy}%</div>
                <div className="text-sm text-gray-600">Accuracy</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{correctAnswers}/{questions.length}</div>
                <div className="text-sm text-gray-600">Correct Answers</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{currentExam.timeSpent}m</div>
                <div className="text-sm text-gray-600">Time Taken</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {Math.round((correctAnswers / questions.length) * 100) >= 80 ? 'Excellent' :
                   Math.round((correctAnswers / questions.length) * 100) >= 60 ? 'Good' :
                   Math.round((correctAnswers / questions.length) * 100) >= 40 ? 'Average' : 'Needs Work'}
                </div>
                <div className="text-sm text-gray-600">Performance</div>
              </div>
            </div>

            {/* Learning Objectives Review */}
            <div className="mb-8">
              <h3 className="font-semibold text-gray-900 mb-4">Learning Objectives Covered</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentExam.learningObjectives.map((objective, index) => (
                  <div key={index} className="flex items-start space-x-2 p-3 bg-gray-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{objective}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <h3 className="font-semibold text-gray-900">Detailed Question Review</h3>
              <div className="max-h-96 overflow-y-auto space-y-4">
                {questions.map((question, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        {answers[index] === question.correctAnswer ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                            {question.difficulty}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBloomsColor(question.bloomsLevel)}`}>
                            {question.bloomsLevel}
                          </span>
                          <span className="text-xs text-gray-500">{question.concept}</span>
                        </div>
                        <p className="font-medium text-gray-900 mb-2">{question.question}</p>
                        <p className="text-sm text-gray-600 mb-2">
                          <span className="font-medium">Your answer:</span> {
                            answers[index] !== -1 ? question.options[answers[index]] : 'Not answered'
                          }
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                          <span className="font-medium">Correct answer:</span> {question.options[question.correctAnswer]}
                        </p>
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <p className="text-sm text-blue-800">{question.explanation}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={() => {
                  setCurrentExam(null);
                  setShowResults(false);
                }}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Back to Exams
              </button>
              <button
                onClick={() => startExam(currentExam)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Retake Exam
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-green-600 to-blue-600 p-3 rounded-lg">
              <Target className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Comprehensive Mock Exams</h1>
              <p className="text-gray-600">Complete test series covering all difficulty levels - {mockExams.length} exams available</p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tests Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {mockExams.filter(exam => exam.completed).length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(mockExams.filter(exam => exam.completed).reduce((acc, exam) => acc + (exam.score || 0), 0) / mockExams.filter(exam => exam.completed).length) || 0}%
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Available Tests</p>
                <p className="text-2xl font-bold text-gray-900">{mockExams.length}</p>
              </div>
              <BookOpen className="h-8 w-8 text-purple-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Difficulty Levels</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
                <p className="text-xs text-gray-500">Beginner to Advanced</p>
              </div>
              <Award className="h-8 w-8 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <Search className="h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search exams..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="All">All Types</option>
                <option value="Foundation Test">Foundation Tests</option>
                <option value="JEE Main">JEE Main</option>
                <option value="JEE Advanced">JEE Advanced</option>
                <option value="NEET">NEET</option>
                <option value="Chapter Test">Chapter Tests</option>
                <option value="Previous Year">Previous Year</option>
              </select>
            </div>
            <div>
              <select
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="All">All Difficulties</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>
        </div>

        {/* Mock Exams List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-6">
            <BookOpen className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Available Mock Exams ({filteredExams.length})
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExams.map((exam) => (
              <div key={exam.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">{exam.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{exam.description}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(exam.type)}`}>
                        {exam.type}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(exam.difficulty)}`}>
                        {exam.difficulty}
                      </span>
                    </div>
                  </div>
                  {exam.completed && (
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  )}
                </div>
                
                <div className="space-y-2 mb-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>{exam.duration} minutes</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Target className="h-4 w-4" />
                    <span>{exam.totalQuestions} questions</span>
                  </div>
                  {exam.completed && (
                    <div className="flex items-center space-x-2 text-green-600">
                      <Award className="h-4 w-4" />
                      <span>Score: {exam.score}%</span>
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-2">Learning Objectives:</p>
                  <div className="space-y-1">
                    {exam.learningObjectives.slice(0, 2).map((objective, index) => (
                      <div key={index} className="flex items-start space-x-1">
                        <div className="w-1 h-1 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-xs text-gray-600">{objective}</span>
                      </div>
                    ))}
                    {exam.learningObjectives.length > 2 && (
                      <span className="text-xs text-gray-500">+{exam.learningObjectives.length - 2} more objectives</span>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-1">Topics:</p>
                  <div className="flex flex-wrap gap-1">
                    {exam.topics.slice(0, 3).map((topic, index) => (
                      <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {topic}
                      </span>
                    ))}
                    {exam.topics.length > 3 && (
                      <span className="text-xs text-gray-500">+{exam.topics.length - 3} more</span>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={() => startExam(exam)}
                  className={`w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-lg font-medium transition-colors ${
                    exam.completed
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  <Play className="h-4 w-4" />
                  <span>{exam.completed ? 'Retake' : 'Start'} Exam</span>
                </button>
              </div>
            ))}
          </div>

          {filteredExams.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No exams found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>

        {/* Difficulty Level Guide */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Target className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Difficulty Level Guide</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 border border-green-100">
              <div className="flex items-center space-x-2 mb-2">
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Beginner</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Foundation Level</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Basic concepts and definitions</li>
                <li>• Simple numerical problems</li>
                <li>• Fundamental understanding</li>
                <li>• Perfect for starting your preparation</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-4 border border-yellow-100">
              <div className="flex items-center space-x-2 mb-2">
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Intermediate</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-2">JEE Main / NEET Level</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Application of concepts</li>
                <li>• Multi-step problem solving</li>
                <li>• Exam-pattern questions</li>
                <li>• Builds competitive exam readiness</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-4 border border-red-100">
              <div className="flex items-center space-x-2 mb-2">
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Advanced</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-2">JEE Advanced Level</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Complex problem solving</li>
                <li>• Multiple concept integration</li>
                <li>• High-order thinking skills</li>
                <li>• Prepares for top-tier exams</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockExams;