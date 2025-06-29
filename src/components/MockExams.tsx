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
  difficulty: 'Easy' | 'Medium' | 'Hard';
  type: 'JEE Main' | 'JEE Advanced' | 'NEET' | 'Chapter Test' | 'Previous Year';
  completed: boolean;
  score?: number;
  accuracy?: number;
  timeSpent?: number;
  completedAt?: Date;
  description: string;
  topics: string[];
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
    // Comprehensive mock exam data
    const mockExamData: MockExam[] = [
      // JEE Main Tests
      {
        id: '1',
        title: 'JEE Main Physics Mock Test 1',
        subject: 'Physics',
        duration: 60,
        totalQuestions: 25,
        difficulty: 'Medium',
        type: 'JEE Main',
        completed: true,
        score: 85,
        accuracy: 85,
        timeSpent: 55,
        completedAt: new Date(2024, 0, 10),
        description: 'Comprehensive test covering Mechanics, Thermodynamics, and Optics',
        topics: ['Mechanics', 'Thermodynamics', 'Optics']
      },
      {
        id: '2',
        title: 'JEE Main Physics Mock Test 2',
        subject: 'Physics',
        duration: 60,
        totalQuestions: 25,
        difficulty: 'Medium',
        type: 'JEE Main',
        completed: false,
        description: 'Focus on Electricity, Magnetism, and Modern Physics',
        topics: ['Electricity', 'Magnetism', 'Modern Physics']
      },
      {
        id: '3',
        title: 'JEE Main Chemistry Mock Test 1',
        subject: 'Chemistry',
        duration: 60,
        totalQuestions: 25,
        difficulty: 'Medium',
        type: 'JEE Main',
        completed: true,
        score: 78,
        accuracy: 78,
        timeSpent: 58,
        completedAt: new Date(2024, 0, 8),
        description: 'Organic, Inorganic, and Physical Chemistry',
        topics: ['Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry']
      },
      {
        id: '4',
        title: 'JEE Main Mathematics Mock Test 1',
        subject: 'Mathematics',
        duration: 60,
        totalQuestions: 25,
        difficulty: 'Medium',
        type: 'JEE Main',
        completed: false,
        description: 'Calculus, Algebra, and Coordinate Geometry',
        topics: ['Calculus', 'Algebra', 'Coordinate Geometry']
      },

      // JEE Advanced Tests
      {
        id: '5',
        title: 'JEE Advanced Physics Paper 1',
        subject: 'Physics',
        duration: 180,
        totalQuestions: 54,
        difficulty: 'Hard',
        type: 'JEE Advanced',
        completed: false,
        description: 'Advanced level physics with numerical and multiple choice questions',
        topics: ['Advanced Mechanics', 'Electrodynamics', 'Quantum Physics']
      },
      {
        id: '6',
        title: 'JEE Advanced Chemistry Paper 1',
        subject: 'Chemistry',
        duration: 180,
        totalQuestions: 54,
        difficulty: 'Hard',
        type: 'JEE Advanced',
        completed: false,
        description: 'Complex problems in all three branches of chemistry',
        topics: ['Advanced Organic', 'Coordination Chemistry', 'Chemical Kinetics']
      },
      {
        id: '7',
        title: 'JEE Advanced Mathematics Paper 1',
        subject: 'Mathematics',
        duration: 180,
        totalQuestions: 54,
        difficulty: 'Hard',
        type: 'JEE Advanced',
        completed: false,
        description: 'Higher level mathematics with complex problem solving',
        topics: ['Advanced Calculus', 'Complex Numbers', 'Probability']
      },

      // NEET Tests
      {
        id: '8',
        title: 'NEET Physics Mock Test 1',
        subject: 'Physics',
        duration: 45,
        totalQuestions: 45,
        difficulty: 'Medium',
        type: 'NEET',
        completed: false,
        description: 'NEET Physics covering all important topics',
        topics: ['Mechanics', 'Thermodynamics', 'Optics', 'Modern Physics']
      },
      {
        id: '9',
        title: 'NEET Chemistry Mock Test 1',
        subject: 'Chemistry',
        duration: 45,
        totalQuestions: 45,
        difficulty: 'Medium',
        type: 'NEET',
        completed: true,
        score: 92,
        accuracy: 92,
        timeSpent: 42,
        completedAt: new Date(2024, 0, 5),
        description: 'Complete NEET Chemistry preparation test',
        topics: ['Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry']
      },
      {
        id: '10',
        title: 'NEET Biology Mock Test 1',
        subject: 'Biology',
        duration: 45,
        totalQuestions: 45,
        difficulty: 'Medium',
        type: 'NEET',
        completed: true,
        score: 88,
        accuracy: 88,
        timeSpent: 43,
        completedAt: new Date(2024, 0, 3),
        description: 'Botany and Zoology comprehensive test',
        topics: ['Cell Biology', 'Genetics', 'Ecology', 'Human Physiology']
      },
      {
        id: '11',
        title: 'NEET Biology Mock Test 2',
        subject: 'Biology',
        duration: 45,
        totalQuestions: 45,
        difficulty: 'Medium',
        type: 'NEET',
        completed: false,
        description: 'Advanced Biology concepts for NEET',
        topics: ['Plant Physiology', 'Animal Physiology', 'Biotechnology']
      },

      // Chapter Tests
      {
        id: '12',
        title: 'Mechanics Chapter Test',
        subject: 'Physics',
        duration: 30,
        totalQuestions: 15,
        difficulty: 'Easy',
        type: 'Chapter Test',
        completed: false,
        description: 'Focused test on Classical Mechanics',
        topics: ['Kinematics', 'Dynamics', 'Work Energy']
      },
      {
        id: '13',
        title: 'Organic Chemistry Chapter Test',
        subject: 'Chemistry',
        duration: 30,
        totalQuestions: 15,
        difficulty: 'Medium',
        type: 'Chapter Test',
        completed: false,
        description: 'Organic reactions and mechanisms',
        topics: ['Hydrocarbons', 'Functional Groups', 'Reaction Mechanisms']
      },
      {
        id: '14',
        title: 'Calculus Chapter Test',
        subject: 'Mathematics',
        duration: 30,
        totalQuestions: 15,
        difficulty: 'Medium',
        type: 'Chapter Test',
        completed: false,
        description: 'Limits, derivatives, and integrals',
        topics: ['Limits', 'Derivatives', 'Integration']
      },
      {
        id: '15',
        title: 'Cell Biology Chapter Test',
        subject: 'Biology',
        duration: 30,
        totalQuestions: 15,
        difficulty: 'Easy',
        type: 'Chapter Test',
        completed: false,
        description: 'Cell structure and functions',
        topics: ['Cell Structure', 'Cell Division', 'Biomolecules']
      },

      // Previous Year Papers
      {
        id: '16',
        title: 'JEE Main 2023 Physics',
        subject: 'Physics',
        duration: 60,
        totalQuestions: 25,
        difficulty: 'Medium',
        type: 'Previous Year',
        completed: false,
        description: 'Actual JEE Main 2023 Physics paper',
        topics: ['All Physics Topics']
      },
      {
        id: '17',
        title: 'NEET 2023 Biology',
        subject: 'Biology',
        duration: 45,
        totalQuestions: 45,
        difficulty: 'Medium',
        type: 'Previous Year',
        completed: false,
        description: 'Actual NEET 2023 Biology paper',
        topics: ['All Biology Topics']
      },
      {
        id: '18',
        title: 'JEE Advanced 2022 Mathematics',
        subject: 'Mathematics',
        duration: 180,
        totalQuestions: 54,
        difficulty: 'Hard',
        type: 'Previous Year',
        completed: false,
        description: 'Actual JEE Advanced 2022 Mathematics paper',
        topics: ['All Mathematics Topics']
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
        exam.topics.some(topic => topic.toLowerCase().includes(searchTerm.toLowerCase()))
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
    // Comprehensive question bank
    const questionBank: Question[] = [
      // Physics Questions
      {
        id: 'p1',
        question: 'A particle moves in a straight line with constant acceleration. If it covers 100m in the first 10s and 150m in the next 10s, what is its acceleration?',
        options: ['2.5 m/s²', '5 m/s²', '7.5 m/s²', '10 m/s²'],
        correctAnswer: 0,
        explanation: 'Using kinematic equations: For the first 10s: s₁ = u₁t + ½at² = 100. For the next 10s: s₂ = u₂t + ½at² = 150. Since u₂ = u₁ + at, solving gives a = 2.5 m/s².',
        concept: 'Kinematics',
        difficulty: 'Medium',
        subject: 'Physics',
        topic: 'Mechanics'
      },
      {
        id: 'p2',
        question: 'The electric field at a distance r from a point charge Q is E. What is the electric field at distance 2r?',
        options: ['E/4', 'E/2', '2E', '4E'],
        correctAnswer: 0,
        explanation: 'Electric field E ∝ 1/r². At distance 2r, field becomes E/(2)² = E/4.',
        concept: 'Electric Field',
        difficulty: 'Easy',
        subject: 'Physics',
        topic: 'Electricity'
      },
      {
        id: 'p3',
        question: 'A convex lens of focal length 20 cm forms a real image at 60 cm. What is the object distance?',
        options: ['30 cm', '15 cm', '12 cm', '10 cm'],
        correctAnswer: 0,
        explanation: 'Using lens formula: 1/f = 1/v - 1/u. Given f = 20 cm, v = 60 cm. So 1/20 = 1/60 - 1/u. Solving: u = 30 cm.',
        concept: 'Lens Formula',
        difficulty: 'Medium',
        subject: 'Physics',
        topic: 'Optics'
      },

      // Chemistry Questions
      {
        id: 'c1',
        question: 'What is the molecular formula of benzene?',
        options: ['C₆H₆', 'C₆H₁₂', 'C₆H₁₄', 'C₆H₁₀'],
        correctAnswer: 0,
        explanation: 'Benzene has the molecular formula C₆H₆ with a ring structure containing alternating double bonds.',
        concept: 'Aromatic Compounds',
        difficulty: 'Easy',
        subject: 'Chemistry',
        topic: 'Organic Chemistry'
      },
      {
        id: 'c2',
        question: 'For the reaction N₂ + 3H₂ ⇌ 2NH₃, if Kc = 4 at 400°C, what is the value of Kc for 2NH₃ ⇌ N₂ + 3H₂?',
        options: ['0.25', '4', '16', '0.5'],
        correctAnswer: 0,
        explanation: 'For the reverse reaction, Kc(reverse) = 1/Kc(forward) = 1/4 = 0.25.',
        concept: 'Chemical Equilibrium',
        difficulty: 'Medium',
        subject: 'Chemistry',
        topic: 'Physical Chemistry'
      },
      {
        id: 'c3',
        question: 'Which of the following has the highest oxidation state of chromium?',
        options: ['CrO₄²⁻', 'Cr₂O₇²⁻', 'CrO₃', 'All have same'],
        correctAnswer: 3,
        explanation: 'In CrO₄²⁻, Cr₂O₇²⁻, and CrO₃, chromium has oxidation state +6 in all cases.',
        concept: 'Oxidation States',
        difficulty: 'Medium',
        subject: 'Chemistry',
        topic: 'Inorganic Chemistry'
      },

      // Mathematics Questions
      {
        id: 'm1',
        question: 'What is the value of lim(x→0) (sin x)/x?',
        options: ['0', '1', '∞', 'Does not exist'],
        correctAnswer: 1,
        explanation: 'This is a standard limit. lim(x→0) (sin x)/x = 1. This can be proved using L\'Hôpital\'s rule or geometric methods.',
        concept: 'Limits',
        difficulty: 'Easy',
        subject: 'Mathematics',
        topic: 'Calculus'
      },
      {
        id: 'm2',
        question: 'If the roots of x² - 5x + 6 = 0 are α and β, what is the value of α² + β²?',
        options: ['13', '11', '25', '17'],
        correctAnswer: 0,
        explanation: 'From Vieta\'s formulas: α + β = 5, αβ = 6. Now α² + β² = (α + β)² - 2αβ = 25 - 12 = 13.',
        concept: 'Quadratic Equations',
        difficulty: 'Medium',
        subject: 'Mathematics',
        topic: 'Algebra'
      },
      {
        id: 'm3',
        question: 'The derivative of x³ + 2x² - 5x + 1 is:',
        options: ['3x² + 4x - 5', '3x² + 2x - 5', 'x² + 4x - 5', '3x² + 4x + 5'],
        correctAnswer: 0,
        explanation: 'd/dx(x³ + 2x² - 5x + 1) = 3x² + 4x - 5 using power rule of differentiation.',
        concept: 'Differentiation',
        difficulty: 'Easy',
        subject: 'Mathematics',
        topic: 'Calculus'
      },

      // Biology Questions
      {
        id: 'b1',
        question: 'Which phase of mitosis is characterized by chromosome alignment at the cell equator?',
        options: ['Prophase', 'Metaphase', 'Anaphase', 'Telophase'],
        correctAnswer: 1,
        explanation: 'During metaphase, chromosomes align at the metaphase plate (cell equator) before separation.',
        concept: 'Cell Division',
        difficulty: 'Easy',
        subject: 'Biology',
        topic: 'Cell Biology'
      },
      {
        id: 'b2',
        question: 'What is the primary function of the loop of Henle in the nephron?',
        options: ['Filtration', 'Concentration of urine', 'Secretion', 'Reabsorption of glucose'],
        correctAnswer: 1,
        explanation: 'The loop of Henle creates a concentration gradient that allows for the concentration of urine through counter-current mechanism.',
        concept: 'Excretory System',
        difficulty: 'Medium',
        subject: 'Biology',
        topic: 'Human Physiology'
      },
      {
        id: 'b3',
        question: 'In which organelle does photosynthesis occur?',
        options: ['Mitochondria', 'Chloroplast', 'Nucleus', 'Ribosome'],
        correctAnswer: 1,
        explanation: 'Photosynthesis occurs in chloroplasts, which contain chlorophyll and other pigments necessary for capturing light energy.',
        concept: 'Photosynthesis',
        difficulty: 'Easy',
        subject: 'Biology',
        topic: 'Plant Physiology'
      },
      {
        id: 'b4',
        question: 'What type of inheritance is shown by ABO blood groups?',
        options: ['Complete dominance', 'Incomplete dominance', 'Codominance', 'Multiple allelism'],
        correctAnswer: 3,
        explanation: 'ABO blood groups show multiple allelism (IA, IB, i) with codominance between IA and IB alleles.',
        concept: 'Genetics',
        difficulty: 'Medium',
        subject: 'Biology',
        topic: 'Genetics'
      }
    ];

    // Filter questions based on exam subject and select appropriate number
    let examQuestions = questionBank.filter(q => q.subject === exam.subject);
    
    // If not enough subject-specific questions, add some general ones
    if (examQuestions.length < exam.totalQuestions) {
      const additionalQuestions = questionBank.filter(q => q.subject !== exam.subject);
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
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'JEE Main': return 'bg-blue-100 text-blue-800';
      case 'JEE Advanced': return 'bg-purple-100 text-purple-800';
      case 'NEET': return 'bg-green-100 text-green-800';
      case 'Chapter Test': return 'bg-orange-100 text-orange-800';
      case 'Previous Year': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
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
                <p className="text-gray-600">Question {currentQuestion + 1} of {questions.length}</p>
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
                <span className="text-sm text-gray-500">{questions[currentQuestion]?.concept}</span>
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
          <div className="flex justify-between">
            <button
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <div className="flex space-x-2">
              <span className="text-sm text-gray-500 flex items-center">
                Answered: {answers.filter(a => a !== -1).length}/{questions.length}
              </span>
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
            </div>

            <div className="space-y-4 mb-8">
              <h3 className="font-semibold text-gray-900">Question Review</h3>
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
                        <p className="font-medium text-gray-900 mb-2">{question.question}</p>
                        <p className="text-sm text-gray-600 mb-2">
                          <span className="font-medium">Your answer:</span> {
                            answers[index] !== -1 ? question.options[answers[index]] : 'Not answered'
                          }
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                          <span className="font-medium">Correct answer:</span> {question.options[question.correctAnswer]}
                        </p>
                        <p className="text-sm text-gray-500">{question.explanation}</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Mock Exams</h1>
              <p className="text-gray-600">Practice with {mockExams.length} comprehensive JEE/NEET mock tests</p>
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
                <p className="text-sm font-medium text-gray-600">Best Subject</p>
                <p className="text-2xl font-bold text-gray-900">Biology</p>
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
                <option value="JEE Main">JEE Main</option>
                <option value="JEE Advanced">JEE Advanced</option>
                <option value="NEET">NEET</option>
                <option value="Chapter Test">Chapter Test</option>
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
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
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
      </div>
    </div>
  );
};

export default MockExams;