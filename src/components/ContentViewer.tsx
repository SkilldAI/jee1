import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Clock, 
  Target, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  Play,
  FileText,
  Lightbulb,
  Calculator,
  Eye,
  Star,
  Award,
  Brain,
  Zap
} from 'lucide-react';
import { contentService, EducationalContent } from '../services/contentService';

interface ContentViewerProps {
  nodeId: string;
  onComplete: () => void;
  onBack: () => void;
}

const ContentViewer: React.FC<ContentViewerProps> = ({ nodeId, onComplete, onBack }) => {
  const [content, setContent] = useState<EducationalContent | null>(null);
  const [currentSection, setCurrentSection] = useState<'theory' | 'examples' | 'practice'>('theory');
  const [currentExampleIndex, setCurrentExampleIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [showResults, setShowResults] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    const loadContent = () => {
      const loadedContent = contentService.getContent(nodeId);
      setContent(loadedContent);
    };

    loadContent();
  }, [nodeId]);

  useEffect(() => {
    // Simulate reading progress
    const timer = setInterval(() => {
      setReadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 1;
      });
    }, 200);

    return () => clearInterval(timer);
  }, [currentSection]);

  if (!content) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading content...</p>
        </div>
      </div>
    );
  }

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }));
  };

  const handleSubmitQuiz = () => {
    setShowResults(true);
  };

  const calculateScore = () => {
    if (!content.content.practiceQuestions) return 0;
    
    let correct = 0;
    content.content.practiceQuestions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correct++;
      }
    });
    
    return Math.round((correct / content.content.practiceQuestions.length) * 100);
  };

  const getSubjectColor = (subject: string) => {
    switch (subject) {
      case 'Physics': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'Chemistry': return 'text-green-600 bg-green-50 border-green-200';
      case 'Biology': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'Mathematics': return 'text-orange-600 bg-orange-50 border-orange-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Foundation': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-orange-100 text-orange-800';
      case 'Expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderTheorySection = () => (
    <div className="space-y-6">
      <div className="prose prose-lg max-w-none">
        <div 
          className="text-gray-800 leading-relaxed"
          dangerouslySetInnerHTML={{ 
            __html: content.content.theory?.replace(/\n/g, '<br>').replace(/#{1,6}\s/g, '<h3 class="text-xl font-bold mt-6 mb-3">').replace(/<h3[^>]*>/g, '<h3 class="text-xl font-bold mt-6 mb-3 text-gray-900">') || ''
          }}
        />
      </div>

      {/* Key Points */}
      {content.content.keyPoints && content.content.keyPoints.length > 0 && (
        <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center space-x-2 mb-4">
            <Lightbulb className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-blue-900">Key Points to Remember</h3>
          </div>
          <ul className="space-y-2">
            {content.content.keyPoints.map((point, index) => (
              <li key={index} className="flex items-start space-x-2">
                <Star className="h-4 w-4 text-blue-600 mt-1 flex-shrink-0" />
                <span className="text-blue-800">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Formulas */}
      {content.content.formulas && content.content.formulas.length > 0 && (
        <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
          <div className="flex items-center space-x-2 mb-4">
            <Calculator className="h-5 w-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-purple-900">Important Formulas</h3>
          </div>
          <div className="space-y-4">
            {content.content.formulas.map((formula, index) => (
              <div key={index} className="bg-white rounded-lg p-4 border border-purple-100">
                <h4 className="font-semibold text-purple-900 mb-2">{formula.name}</h4>
                <div className="bg-gray-100 rounded px-3 py-2 font-mono text-lg mb-2">
                  {formula.formula}
                </div>
                <p className="text-purple-700 text-sm">{formula.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderExamplesSection = () => {
    if (!content.content.examples || content.content.examples.length === 0) {
      return (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No examples available for this topic.</p>
        </div>
      );
    }

    const currentExample = content.content.examples[currentExampleIndex];

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900">
            Example {currentExampleIndex + 1} of {content.content.examples.length}
          </h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentExampleIndex(Math.max(0, currentExampleIndex - 1))}
              disabled={currentExampleIndex === 0}
              className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setCurrentExampleIndex(Math.min(content.content.examples!.length - 1, currentExampleIndex + 1))}
              disabled={currentExampleIndex === content.content.examples.length - 1}
              className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900">{currentExample.title}</h4>
          </div>
          
          <div className="p-6 space-y-6">
            <div>
              <h5 className="font-semibold text-gray-900 mb-3">Problem:</h5>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p className="text-blue-900 whitespace-pre-line">{currentExample.problem}</p>
              </div>
            </div>

            <div>
              <h5 className="font-semibold text-gray-900 mb-3">Solution:</h5>
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <pre className="text-green-900 whitespace-pre-wrap font-sans">{currentExample.solution}</pre>
              </div>
            </div>

            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
              <div className="flex items-start space-x-2">
                <Lightbulb className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h5 className="font-semibold text-yellow-900 mb-2">Explanation:</h5>
                  <p className="text-yellow-800">{currentExample.explanation}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPracticeSection = () => {
    if (!content.content.practiceQuestions || content.content.practiceQuestions.length === 0) {
      return (
        <div className="text-center py-12">
          <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No practice questions available for this topic.</p>
        </div>
      );
    }

    if (showResults) {
      const score = calculateScore();
      return (
        <div className="space-y-6">
          <div className="text-center bg-white rounded-lg p-8 border border-gray-200">
            <Award className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Quiz Complete!</h3>
            <div className="text-4xl font-bold text-blue-600 mb-2">{score}%</div>
            <p className="text-gray-600">
              You got {Object.values(selectedAnswers).filter((answer, index) => 
                answer === content.content.practiceQuestions![index].correctAnswer
              ).length} out of {content.content.practiceQuestions.length} questions correct
            </p>
          </div>

          <div className="space-y-4">
            {content.content.practiceQuestions.map((question, index) => {
              const userAnswer = selectedAnswers[index];
              const isCorrect = userAnswer === question.correctAnswer;
              
              return (
                <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-start space-x-3 mb-4">
                    {isCorrect ? (
                      <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                    ) : (
                      <div className="h-6 w-6 rounded-full bg-red-500 flex items-center justify-center mt-1">
                        <span className="text-white text-sm">✗</span>
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2">Question {index + 1}</h4>
                      <p className="text-gray-700 mb-3">{question.question}</p>
                      
                      <div className="space-y-2">
                        {question.options.map((option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className={`p-3 rounded-lg border ${
                              optionIndex === question.correctAnswer
                                ? 'bg-green-100 border-green-300 text-green-800'
                                : optionIndex === userAnswer && !isCorrect
                                ? 'bg-red-100 border-red-300 text-red-800'
                                : 'bg-gray-50 border-gray-200'
                            }`}
                          >
                            <span className="font-medium mr-2">
                              {String.fromCharCode(65 + optionIndex)}.
                            </span>
                            {option}
                            {optionIndex === question.correctAnswer && (
                              <span className="ml-2 text-green-600">✓ Correct</span>
                            )}
                            {optionIndex === userAnswer && !isCorrect && (
                              <span className="ml-2 text-red-600">✗ Your answer</span>
                            )}
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-blue-800 text-sm">
                          <strong>Explanation:</strong> {question.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={() => {
                setShowResults(false);
                setSelectedAnswers({});
                setCurrentQuestionIndex(0);
              }}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Retake Quiz
            </button>
            <button
              onClick={onComplete}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Mark as Complete
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900">Practice Questions</h3>
          <div className="text-sm text-gray-600">
            {Object.keys(selectedAnswers).length} of {content.content.practiceQuestions.length} answered
          </div>
        </div>

        <div className="space-y-6">
          {content.content.practiceQuestions.map((question, index) => (
            <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start space-x-3 mb-4">
                <div className="bg-blue-100 rounded-full p-2">
                  <span className="text-blue-600 font-semibold text-sm">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      question.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                      question.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {question.difficulty}
                    </span>
                  </div>
                  <p className="text-gray-900 font-medium mb-4">{question.question}</p>
                  
                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => (
                      <button
                        key={optionIndex}
                        onClick={() => handleAnswerSelect(index, optionIndex)}
                        className={`w-full text-left p-3 rounded-lg border transition-colors ${
                          selectedAnswers[index] === optionIndex
                            ? 'bg-blue-100 border-blue-300 text-blue-900'
                            : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        <span className="font-medium mr-3">
                          {String.fromCharCode(65 + optionIndex)}.
                        </span>
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleSubmitQuiz}
            disabled={Object.keys(selectedAnswers).length !== content.content.practiceQuestions.length}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <Target className="h-5 w-5" />
            <span>Submit Quiz</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getSubjectColor(content.subject)}`}>
                    {content.subject}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(content.difficulty)}`}>
                    {content.difficulty}
                  </span>
                </div>
                <h1 className="text-xl font-bold text-gray-900">{content.title}</h1>
                <p className="text-sm text-gray-600">{content.topic} • {content.subtopic}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>{content.estimatedReadTime} min read</span>
              </div>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${readingProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex space-x-8">
            {[
              { id: 'theory', name: 'Theory', icon: BookOpen },
              { id: 'examples', name: 'Examples', icon: Lightbulb },
              { id: 'practice', name: 'Practice', icon: Target }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setCurrentSection(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                    currentSection === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {currentSection === 'theory' && renderTheorySection()}
        {currentSection === 'examples' && renderExamplesSection()}
        {currentSection === 'practice' && renderPracticeSection()}
      </div>

      {/* Exam Relevance Footer */}
      <div className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Exam Relevance</h3>
              <div className="flex space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">JEE Main:</span>
                  <span className="font-medium text-blue-600">{content.examRelevance.jeeMain}%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">JEE Advanced:</span>
                  <span className="font-medium text-purple-600">{content.examRelevance.jeeAdvanced}%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">NEET:</span>
                  <span className="font-medium text-green-600">{content.examRelevance.neet}%</span>
                </div>
              </div>
            </div>
            
            {currentSection === 'theory' && readingProgress === 100 && (
              <button
                onClick={onComplete}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
              >
                <CheckCircle className="h-5 w-5" />
                <span>Mark as Complete</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentViewer;