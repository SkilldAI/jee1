import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, BookOpen, Target, TrendingUp, AlertTriangle, Lightbulb, Paperclip, BarChart3, Award, Eye, Zap, RefreshCw, Copy, ThumbsUp, ThumbsDown, MessageSquare, Clock, CheckCircle2, FileText, Calendar, Trophy } from 'lucide-react';
import { Subject, ChatMessage, QuestionAnalysis } from '../types';
import { generateTutorResponse, generateFollowUpSuggestions, testGeminiConnection } from '../services/geminiService';
import { processUploadedFile, ProcessedFileContent } from '../services/fileProcessingService';
import { adaptiveLearningService } from '../services/adaptiveLearningService';
import { examPaperService } from '../services/examPaperService';
import { usageTrackingService } from '../services/usageTrackingService';
import { useAuth } from '../contexts/AuthContext';
import ConnectionStatus from './ConnectionStatus';
import FileUpload from './FileUpload';
import UsageLimitModal from './UsageLimitModal';
import UsageIndicator from './UsageIndicator';

interface ChatInterfaceProps {
  subject: Subject;
  onBack: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ subject, onBack }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [followUpSuggestions, setFollowUpSuggestions] = useState<string[]>([]);
  const [showAnalysis, setShowAnalysis] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [showExamContext, setShowExamContext] = useState(false);
  const [showUsage, setShowUsage] = useState(false);
  const [typingIndicator, setTypingIndicator] = useState(false);
  const [messageRatings, setMessageRatings] = useState<{ [messageId: string]: 'up' | 'down' | null }>({});
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [usageLimitModal, setUsageLimitModal] = useState<{
    isOpen: boolean;
    limitType: 'questions' | 'fileUpload' | 'mockTest' | 'studyPlanner' | 'analytics';
    message: string;
  }>({
    isOpen: false,
    limitType: 'questions',
    message: ''
  });
  const [sessionStats, setSessionStats] = useState({
    questionsAsked: 0,
    timeSpent: 0,
    accuracy: 0
  });
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const sessionStartTime = useRef<Date>(new Date());

  const userId = user?.id || 'anonymous';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize progress tracking
    adaptiveLearningService.initializeProgress(subject);
    
    // Initialize usage tracking
    usageTrackingService.initializeUser(userId, 'free'); // Default to free tier
    
    // Get personalized welcome message with exam context
    const progress = adaptiveLearningService.getProgress(subject);
    const analytics = adaptiveLearningService.getPerformanceAnalytics(subject);
    const suggestions = adaptiveLearningService.generateSuggestions(subject);
    
    // Get exam context
    const examPattern = examPaperService.getExamPattern('JEE Main', subject.name) || 
                       examPaperService.getExamPattern('NEET', subject.name);
    const highFrequencyConcepts = examPaperService.getHighFrequencyConcepts(subject.name);
    const trendingQuestions = examPaperService.getTrendingQuestions(subject.name, 2);
    
    let welcomeMessage = `Hello! I'm your advanced ${subject.name} AI tutor powered by **Gemini AI** with access to **comprehensive JEE/NEET exam database** (2020-2024). `;
    
    if (progress.totalQuestions === 0) {
      welcomeMessage += `I'm here to help you excel in competitive exam preparation with:\n\n`;
      welcomeMessage += `🔍 **AI Text Recognition** - Upload images of problems\n`;
      welcomeMessage += `🧮 **Math Detection** - Automatic formula recognition\n`;
      welcomeMessage += `📊 **Adaptive Learning** - Personalized difficulty adjustment\n`;
      welcomeMessage += `💡 **Smart Analysis** - Detailed problem breakdowns\n`;
      welcomeMessage += `📚 **Exam Database** - ${examPaperService.getAllPapers().length}+ past JEE/NEET questions\n\n`;
      
      if (examPattern) {
        welcomeMessage += `**📋 ${examPattern.examType} ${subject.name} Pattern:**\n`;
        welcomeMessage += `• **Questions:** ${examPattern.totalQuestions} | **Marks:** ${examPattern.totalMarks} | **Time:** ${examPattern.timeLimit} min\n`;
        welcomeMessage += `• **High-frequency topics:** ${highFrequencyConcepts.slice(0, 3).join(', ')}\n\n`;
      }
      
      welcomeMessage += `Let's start with some fundamentals! What would you like to learn about?`;
    } else {
      welcomeMessage += `Welcome back! Here's your progress:\n\n`;
      welcomeMessage += `📈 **Level:** ${analytics.level}\n`;
      welcomeMessage += `🎯 **Accuracy:** ${analytics.accuracy}%\n`;
      if (analytics.streak > 0) {
        welcomeMessage += `🔥 **Streak:** ${analytics.streak} questions\n`;
      }
      welcomeMessage += `📚 **Total Questions:** ${analytics.totalQuestions}\n\n`;
      
      if (trendingQuestions.length > 0) {
        welcomeMessage += `**🔥 Recent Trending Topics:**\n`;
        trendingQuestions.forEach(q => {
          welcomeMessage += `• **${q.examType} ${q.year}:** ${q.concepts[0]} (${q.difficulty})\n`;
        });
        welcomeMessage += `\n`;
      }
      
      welcomeMessage += `Ready to continue your learning journey? Upload an image or ask me anything!`;
    }
    
    const welcomeChatMessage: ChatMessage = {
      id: 'welcome',
      content: welcomeMessage,
      isUser: false,
      timestamp: new Date(),
      subject
    };
    
    setMessages([welcomeChatMessage]);
    
    // Set initial suggestions with exam context
    if (suggestions.length > 0) {
      setFollowUpSuggestions(suggestions.map(s => s.content));
    } else {
      // Default suggestions with exam context
      const examSuggestions = [
        `Explain ${highFrequencyConcepts[0]} - high frequency in JEE/NEET`,
        `Show me ${subject.name} exam patterns and weightages`,
        `Practice problems from past year papers`
      ];
      setFollowUpSuggestions(examSuggestions);
    }

    // Update session stats periodically
    const statsInterval = setInterval(() => {
      const timeSpent = Math.floor((new Date().getTime() - sessionStartTime.current.getTime()) / 1000 / 60);
      setSessionStats(prev => ({ ...prev, timeSpent }));
    }, 60000); // Update every minute

    return () => clearInterval(statsInterval);
  }, [subject]);

  const handleFileSelect = async (file: File) => {
    // Check file upload limit
    const canUpload = usageTrackingService.canPerformAction(userId, 'fileUpload');
    if (!canUpload.allowed) {
      setUsageLimitModal({
        isOpen: true,
        limitType: 'fileUpload',
        message: canUpload.reason || 'File upload limit reached'
      });
      return;
    }

    setSelectedFile(file);
    setIsProcessingFile(true);
    setTypingIndicator(true);
    
    try {
      const processedContent = await processUploadedFile(file);
      
      // Record file upload usage
      usageTrackingService.recordUsage(userId, 'fileUpload');
      
      // Create a message showing the file was uploaded with enhanced info
      let fileMessage = `📎 **Uploaded:** ${file.name}`;
      
      if (processedContent.confidence !== undefined) {
        const confidenceColor = processedContent.confidence > 0.8 ? '🟢' : processedContent.confidence > 0.6 ? '🟡' : '🔴';
        fileMessage += `\n${confidenceColor} **Text Recognition:** ${(processedContent.confidence * 100).toFixed(1)}% confidence`;
      }
      
      if (processedContent.mathContent?.hasMath) {
        fileMessage += `\n🧮 **Math Content Detected:** ${processedContent.mathContent.mathIndicators.join(', ')}`;
        fileMessage += `\n📊 **Math Confidence:** ${(processedContent.mathContent.confidence * 100).toFixed(1)}%`;
      }
      
      const fileUploadMessage: ChatMessage = {
        id: Date.now().toString(),
        content: fileMessage,
        isUser: true,
        timestamp: new Date(),
        subject,
        fileContent: processedContent
      };
      
      setMessages(prev => [...prev, fileUploadMessage]);
      
      // Auto-generate a response about the uploaded file with exam context
      setTypingIndicator(true);
      const { response, analysis, suggestedDifficulty } = await generateTutorResponse(
        subject,
        processedContent.text,
        messages.slice(-6).map(msg => `${msg.isUser ? 'Student' : 'Tutor'}: ${msg.content}`),
        processedContent.text
      );
      
      const tutorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: response,
        isUser: false,
        timestamp: new Date(),
        subject,
        analysis,
        difficulty: suggestedDifficulty
      };
      
      setMessages(prev => [...prev, tutorMessage]);
      
      // Generate follow-up suggestions based on the file content
      const suggestions = await generateFollowUpSuggestions(subject, processedContent.text);
      setFollowUpSuggestions(suggestions);
      
      // Update session stats
      setSessionStats(prev => ({ 
        ...prev, 
        questionsAsked: prev.questionsAsked + 1 
      }));
      
    } catch (error) {
      console.error('Error processing file:', error);
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        content: `❌ **Processing Error:** ${error instanceof Error ? error.message : 'Unknown error'}\n\nPlease try:\n• Uploading a clearer image\n• Ensuring good lighting and contrast\n• Describing your question in text\n• Checking if it's a past JEE/NEET question - I can help identify it!`,
        isUser: false,
        timestamp: new Date(),
        subject
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessingFile(false);
      setShowFileUpload(false);
      setTypingIndicator(false);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || inputMessage.trim();
    if ((!text && !selectedFile) || isLoading) return;

    // Check question limit
    const canAsk = usageTrackingService.canPerformAction(userId, 'question');
    if (!canAsk.allowed) {
      setUsageLimitModal({
        isOpen: true,
        limitType: 'questions',
        message: canAsk.reason || 'Question limit reached'
      });
      return;
    }
    let fileContent: ProcessedFileContent | undefined;
    
    // Process file if one is selected
    if (selectedFile && !isProcessingFile) {
      // Check file upload limit again
      const canUpload = usageTrackingService.canPerformAction(userId, 'fileUpload');
      if (!canUpload.allowed) {
        setUsageLimitModal({
          isOpen: true,
          limitType: 'fileUpload',
          message: canUpload.reason || 'File upload limit reached'
        });
        return;
      }

      setIsProcessingFile(true);
      setTypingIndicator(true);
      try {
        fileContent = await processUploadedFile(selectedFile);
        // Record file upload usage
        usageTrackingService.recordUsage(userId, 'fileUpload');
      } catch (error) {
        console.error('Error processing file:', error);
        setIsProcessingFile(false);
        setTypingIndicator(false);
        return;
      }
      setIsProcessingFile(false);
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: text || `📎 ${selectedFile?.name}`,
      isUser: true,
      timestamp: new Date(),
      subject,
      fileContent
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setSelectedFile(null);
    setIsLoading(true);
    setTypingIndicator(true);
    setFollowUpSuggestions([]);
    setConnectionError(null);

    try {
      // Test connection before making the request
      const connectionTest = await testGeminiConnection();
      if (!connectionTest.success) {
        setConnectionError(connectionTest.error || 'AI connection failed');
        throw new Error(connectionTest.error || 'AI connection failed');
      }

      const conversationHistory = messages
        .slice(-6) // Last 6 messages for context
        .map(msg => `${msg.isUser ? 'Student' : 'Tutor'}: ${msg.content}`);

      const { response, analysis, suggestedDifficulty } = await generateTutorResponse(
        subject,
        text || `Help me with this uploaded file: ${selectedFile?.name}`,
        conversationHistory,
        fileContent?.text
      );

      const tutorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: response,
        isUser: false,
        timestamp: new Date(),
        subject,
        analysis,
        difficulty: suggestedDifficulty
      };

      setMessages(prev => [...prev, tutorMessage]);

      // Generate follow-up suggestions with exam context
      const suggestions = await generateFollowUpSuggestions(subject, text || 'file upload question');
      setFollowUpSuggestions(suggestions);

      // Record question usage
      usageTrackingService.recordUsage(userId, 'question');

      // Update progress (simulate user understanding - in real app, you'd have user feedback)
      const wasCorrect = Math.random() > 0.3; // 70% success rate simulation
      adaptiveLearningService.updateProgress(
        subject,
        wasCorrect,
        suggestedDifficulty,
        analysis.concepts,
        30 // Average response time
      );

      // Update session stats
      setSessionStats(prev => ({ 
        ...prev, 
        questionsAsked: prev.questionsAsked + 1,
        accuracy: Math.round(((prev.accuracy * (prev.questionsAsked - 1)) + (wasCorrect ? 100 : 0)) / prev.questionsAsked)
      }));

    } catch (error) {
      console.error('Error sending message:', error);
      
      // Set connection error for display
      if (error instanceof Error) {
        setConnectionError(error.message);
      }
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: `🔄 **Connection Issue:** ${error instanceof Error ? error.message : 'Unknown error'}\n\nPossible solutions:\n• Check your internet connection\n• Verify API key configuration\n• Try again in a moment\n• Contact support if the issue persists`,
        isUser: false,
        timestamp: new Date(),
        subject
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setTypingIndicator(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCorrectAnswer = (messageId: string, wasCorrect: boolean) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, wasCorrect } : msg
    ));

    const message = messages.find(msg => msg.id === messageId);
    if (message && message.analysis && message.difficulty) {
      adaptiveLearningService.updateProgress(
        subject,
        wasCorrect,
        message.difficulty,
        message.analysis.concepts,
        30
      );
    }
  };

  const handleRateMessage = (messageId: string, rating: 'up' | 'down') => {
    setMessageRatings(prev => ({
      ...prev,
      [messageId]: prev[messageId] === rating ? null : rating
    }));
  };

  const handleCopyMessage = async (messageId: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (error) {
      console.error('Failed to copy message:', error);
    }
  };

  const handleRegenerateResponse = async (messageId: string) => {
    const messageIndex = messages.findIndex(msg => msg.id === messageId);
    if (messageIndex === -1) return;

    const userMessage = messages[messageIndex - 1];
    if (!userMessage || !userMessage.isUser) return;

    setIsLoading(true);
    setTypingIndicator(true);

    try {
      const conversationHistory = messages
        .slice(Math.max(0, messageIndex - 6), messageIndex - 1)
        .map(msg => `${msg.isUser ? 'Student' : 'Tutor'}: ${msg.content}`);

      const { response, analysis, suggestedDifficulty } = await generateTutorResponse(
        subject,
        userMessage.content,
        conversationHistory,
        userMessage.fileContent?.text
      );

      const newTutorMessage: ChatMessage = {
        ...messages[messageIndex],
        content: response,
        analysis,
        difficulty: suggestedDifficulty,
        timestamp: new Date()
      };

      setMessages(prev => prev.map((msg, idx) => 
        idx === messageIndex ? newTutorMessage : msg
      ));

    } catch (error) {
      console.error('Error regenerating response:', error);
    } finally {
      setIsLoading(false);
      setTypingIndicator(false);
    }
  };

  const handleUpgrade = () => {
    // In a real app, this would redirect to payment/subscription page
    alert('Redirecting to upgrade page...');
    setUsageLimitModal({ ...usageLimitModal, isOpen: false });
  };

  const AnalysisPanel = ({ analysis, messageId }: { analysis: QuestionAnalysis; messageId: string }) => (
    <div className="mt-3 bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Target className="h-4 w-4 text-blue-600" />
          <h4 className="font-semibold text-gray-900">📊 Question Analysis</h4>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => handleCorrectAnswer(messageId, true)}
            className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full hover:bg-green-200 transition-colors flex items-center space-x-1"
          >
            <CheckCircle2 className="h-3 w-3" />
            <span>Got it right</span>
          </button>
          <button
            onClick={() => handleCorrectAnswer(messageId, false)}
            className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded-full hover:bg-red-200 transition-colors flex items-center space-x-1"
          >
            <AlertTriangle className="h-3 w-3" />
            <span>Need help</span>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <h5 className="font-medium text-gray-700 mb-2 flex items-center space-x-1">
            <BookOpen className="h-3 w-3" />
            <span>Concepts</span>
          </h5>
          <div className="flex flex-wrap gap-1">
            {analysis.concepts.map((concept, idx) => (
              <span key={idx} className={`px-2 py-1 rounded-full text-xs ${subject.bgColor} ${subject.color} border ${subject.borderColor}`}>
                {concept}
              </span>
            ))}
          </div>
        </div>
        
        <div>
          <h5 className="font-medium text-gray-700 mb-2 flex items-center space-x-1">
            <Target className="h-3 w-3" />
            <span>Difficulty Level</span>
          </h5>
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i <= analysis.complexityLevel ? 'bg-red-500' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-600">({analysis.complexityLevel}/5)</span>
          </div>
          <p className="text-xs text-gray-600 mt-1">{analysis.complexityJustification}</p>
        </div>
      </div>

      {analysis.commonTraps.length > 0 && (
        <div>
          <h5 className="font-medium text-gray-700 mb-2 flex items-center space-x-1">
            <AlertTriangle className="h-3 w-3 text-orange-500" />
            <span>⚠️ Common Mistakes</span>
          </h5>
          <ul className="text-xs space-y-1">
            {analysis.commonTraps.map((trap, idx) => (
              <li key={idx} className="text-orange-700 bg-orange-50 p-2 rounded border-l-2 border-orange-300">
                • {trap}
              </li>
            ))}
          </ul>
        </div>
      )}

      {analysis.realWorldApplications.length > 0 && (
        <div>
          <h5 className="font-medium text-gray-700 mb-2 flex items-center space-x-1">
            <Zap className="h-3 w-3 text-purple-500" />
            <span>🌍 Real-World Applications</span>
          </h5>
          <ul className="text-xs space-y-1">
            {analysis.realWorldApplications.map((app, idx) => (
              <li key={idx} className="text-purple-700 bg-purple-50 p-2 rounded">
                • {app}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="bg-blue-50 p-3 rounded border border-blue-200">
        <h5 className="font-medium text-blue-900 mb-1 flex items-center space-x-1">
          <TrendingUp className="h-3 w-3" />
          <span>📈 JEE/NEET Exam Relevance</span>
        </h5>
        <p className="text-xs text-blue-800">{analysis.examRelevance}</p>
      </div>

      <div className="bg-green-50 p-3 rounded border border-green-200">
        <h5 className="font-medium text-green-900 mb-1 flex items-center space-x-1">
          <Lightbulb className="h-3 w-3" />
          <span>💡 Study Recommendation</span>
        </h5>
        <p className="text-xs text-green-800">{analysis.progressNote}</p>
      </div>
    </div>
  );

  const ProgressPanel = () => {
    const analytics = adaptiveLearningService.getPerformanceAnalytics(subject);
    const progress = adaptiveLearningService.getProgress(subject);
    const recommendations = adaptiveLearningService.getStudyRecommendations(subject);
    
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
        <div className="flex items-center space-x-2">
          <BarChart3 className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">📊 Your Progress</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-lg font-bold text-blue-600">{analytics.level}</div>
            <div className="text-xs text-gray-600">Current Level</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="text-lg font-bold text-green-600">{analytics.accuracy}%</div>
            <div className="text-xs text-gray-600">Accuracy</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
            <div className="text-lg font-bold text-purple-600">{analytics.streak}</div>
            <div className="text-xs text-gray-600">Current Streak</div>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-200">
            <div className="text-lg font-bold text-orange-600">{sessionStats.questionsAsked}</div>
            <div className="text-xs text-gray-600">This Session</div>
          </div>
        </div>
        
        <div>
          <h4 className="font-medium text-gray-700 mb-2 flex items-center space-x-1">
            <Lightbulb className="h-4 w-4 text-yellow-500" />
            <span>💡 Study Recommendations</span>
          </h4>
          <ul className="text-sm space-y-1">
            {recommendations.slice(0, 3).map((rec, idx) => (
              <li key={idx} className="text-gray-600 bg-gray-50 p-2 rounded">• {rec}</li>
            ))}
          </ul>
        </div>
        
        {progress.weakAreas.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-700 mb-2 flex items-center space-x-1">
              <Target className="h-4 w-4 text-red-500" />
              <span>🎯 Focus Areas</span>
            </h4>
            <div className="flex flex-wrap gap-1">
              {progress.weakAreas.slice(0, 3).map((area, idx) => (
                <span key={idx} className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full border border-red-200">
                  {area}
                </span>
              ))}
            </div>
          </div>
        )}
        
        <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg border">
          <p className="text-sm text-gray-700 font-medium">{analytics.nextGoal}</p>
          <div className="flex items-center justify-center space-x-2 mt-2 text-xs text-gray-600">
            <Clock className="h-3 w-3" />
            <span>Session time: {sessionStats.timeSpent} min</span>
          </div>
        </div>
      </div>
    );
  };

  const ExamContextPanel = () => {
    const examPattern = examPaperService.getExamPattern('JEE Main', subject.name) || 
                       examPaperService.getExamPattern('NEET', subject.name);
    const highFrequencyConcepts = examPaperService.getHighFrequencyConcepts(subject.name);
    const trendingQuestions = examPaperService.getTrendingQuestions(subject.name, 3);
    const examStats = examPaperService.getExamStatistics('JEE Main', subject.name);
    
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
        <div className="flex items-center space-x-2">
          <FileText className="h-5 w-5 text-purple-600" />
          <h3 className="font-semibold text-gray-900">📚 JEE/NEET Exam Context</h3>
        </div>
        
        {examPattern && (
          <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
            <h4 className="font-medium text-purple-900 mb-2">{examPattern.examType} Pattern</h4>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-center">
                <div className="font-bold text-purple-700">{examPattern.totalQuestions}</div>
                <div className="text-purple-600">Questions</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-purple-700">{examPattern.totalMarks}</div>
                <div className="text-purple-600">Marks</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-purple-700">{examPattern.timeLimit}</div>
                <div className="text-purple-600">Minutes</div>
              </div>
            </div>
          </div>
        )}
        
        <div>
          <h4 className="font-medium text-gray-700 mb-2 flex items-center space-x-1">
            <Trophy className="h-4 w-4 text-yellow-500" />
            <span>🔥 High-Frequency Topics</span>
          </h4>
          <div className="flex flex-wrap gap-1">
            {highFrequencyConcepts.slice(0, 5).map((concept, idx) => (
              <span key={idx} className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full border border-yellow-200">
                {concept}
              </span>
            ))}
          </div>
        </div>
        
        {trendingQuestions.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-700 mb-2 flex items-center space-x-1">
              <Calendar className="h-4 w-4 text-green-500" />
              <span>📈 Recent Trends</span>
            </h4>
            <div className="space-y-2">
              {trendingQuestions.map((question, idx) => (
                <div key={idx} className="text-xs bg-green-50 p-2 rounded border border-green-200">
                  <div className="font-medium text-green-800">
                    {question.examType} {question.year} - {question.concepts[0]}
                  </div>
                  <div className="text-green-600">
                    {question.difficulty} level • Frequency: {question.frequency}/10
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-2">📊 Database Stats</h4>
          <div className="text-xs text-blue-800">
            <div>Total Questions: {examPaperService.getAllPapers().length}+</div>
            <div>Years Covered: 2020-2024</div>
            <div>Exams: JEE Main, JEE Advanced, NEET</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Enhanced Header */}
      <div className={`${subject.bgColor} ${subject.borderColor} border-b-2 p-4 shadow-sm`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={onBack}
              className="text-gray-600 hover:text-gray-800 transition-colors p-2 hover:bg-white/50 rounded-lg"
            >
              ←
            </button>
            <div className={`p-2 rounded-lg bg-white shadow-sm`}>
              <div className={`h-5 w-5 ${subject.color}`} />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">{subject.name} AI Tutor</h2>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Eye className="h-3 w-3" />
                  <span>Vision AI</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Zap className="h-3 w-3" />
                  <span>Adaptive Learning</span>
                </div>
                <div className="flex items-center space-x-1">
                  <FileText className="h-3 w-3" />
                  <span>Exam Database</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageSquare className="h-3 w-3" />
                  <span>{sessionStats.questionsAsked} questions</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <ConnectionStatus className="hidden md:block" />
            <button
              onClick={() => setShowUsage(!showUsage)}
              className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors shadow-sm border border-gray-200"
            >
              <BarChart3 className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Usage</span>
            </button>
            <button
              onClick={() => setShowExamContext(!showExamContext)}
              className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors shadow-sm border border-gray-200"
            >
              <FileText className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium">Exam Context</span>
            </button>
            <button
              onClick={() => setShowProgress(!showProgress)}
              className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors shadow-sm border border-gray-200"
            >
              <Award className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Progress</span>
            </button>
          </div>
        </div>
      </div>

      {/* Connection Error Banner */}
      {connectionError && (
        <div className="bg-red-50 border-b border-red-200 p-3">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span className="text-sm text-red-800">
                <strong>AI Connection Issue:</strong> {connectionError}
              </span>
            </div>
            <button
              onClick={() => setConnectionError(null)}
              className="text-red-600 hover:text-red-800"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Progress and Exam Context Panels */}
      <div className="flex">
        {showUsage && (
          <div className="w-80 p-4 border-r border-gray-200 bg-white">
            <UsageIndicator userId={userId} onUpgrade={handleUpgrade} />
          </div>
        )}
        {showProgress && (
          <div className="w-80 p-4 border-r border-gray-200 bg-white">
            <ProgressPanel />
          </div>
        )}
        {showExamContext && (
          <div className="w-80 p-4 border-r border-gray-200 bg-white">
            <ExamContextPanel />
          </div>
        )}
        
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Enhanced Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-3xl rounded-lg p-4 shadow-sm ${
                    message.isUser
                      ? `${subject.color.replace('text', 'bg')} text-white`
                      : 'bg-white border border-gray-200 text-gray-800'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{message.content}</div>
                  
                  {/* Message metadata */}
                  {message.difficulty && !message.isUser && (
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          message.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                          message.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {message.difficulty} Level
                        </span>
                        {message.wasCorrect !== undefined && (
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            message.wasCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {message.wasCorrect ? '✓ Correct' : '✗ Needs Review'}
                          </span>
                        )}
                      </div>
                      
                      {/* Message actions */}
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleRateMessage(message.id, 'up')}
                          className={`p-1 rounded hover:bg-gray-100 transition-colors ${
                            messageRatings[message.id] === 'up' ? 'text-green-600' : 'text-gray-400'
                          }`}
                        >
                          <ThumbsUp className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => handleRateMessage(message.id, 'down')}
                          className={`p-1 rounded hover:bg-gray-100 transition-colors ${
                            messageRatings[message.id] === 'down' ? 'text-red-600' : 'text-gray-400'
                          }`}
                        >
                          <ThumbsDown className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => handleCopyMessage(message.id, message.content)}
                          className="p-1 rounded hover:bg-gray-100 transition-colors text-gray-400"
                        >
                          {copiedMessageId === message.id ? (
                            <CheckCircle2 className="h-3 w-3 text-green-600" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </button>
                        <button
                          onClick={() => handleRegenerateResponse(message.id)}
                          className="p-1 rounded hover:bg-gray-100 transition-colors text-gray-400"
                        >
                          <RefreshCw className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {/* File content display */}
                  {message.fileContent && (
                    <div className="mt-3 p-3 bg-gray-100 rounded-lg text-xs text-gray-600 border">
                      <div className="flex items-center space-x-2 mb-2">
                        <span>📎 {message.fileContent.type.toUpperCase()} file: {message.fileContent.fileName}</span>
                        {message.fileContent.confidence !== undefined && (
                          <span className="text-blue-600 font-medium">
                            ({(message.fileContent.confidence * 100).toFixed(1)}% confidence)
                          </span>
                        )}
                      </div>
                      {message.fileContent.mathContent?.hasMath && (
                        <div className="text-green-600 font-medium">
                          🧮 Math detected: {message.fileContent.mathContent.mathIndicators.join(', ')}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Analysis panel */}
                  {!message.isUser && message.analysis && (
                    <div className="mt-3">
                      <button
                        onClick={() => setShowAnalysis(
                          showAnalysis === message.id ? null : message.id
                        )}
                        className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <BookOpen className="h-4 w-4" />
                        <span>
                          {showAnalysis === message.id ? 'Hide' : 'Show'} Detailed Analysis
                        </span>
                      </button>
                      
                      {showAnalysis === message.id && (
                        <AnalysisPanel analysis={message.analysis} messageId={message.id} />
                      )}
                    </div>
                  )}
                  
                  <div className="text-xs opacity-70 mt-2 flex items-center space-x-2">
                    <Clock className="h-3 w-3" />
                    <span>{message.timestamp.toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Enhanced typing indicator */}
            {(isLoading || isProcessingFile || typingIndicator) && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center space-x-3 shadow-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <span className="text-gray-600 text-sm">
                    {isProcessingFile ? 'Reading text from image with AI...' : 'AI is analyzing with exam database...'}
                  </span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Enhanced Follow-up Suggestions */}
          {followUpSuggestions.length > 0 && (
            <div className="px-4 py-3 bg-white border-t border-gray-200">
              <div className="flex items-center space-x-2 mb-3">
                <Lightbulb className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium text-gray-700">💡 Suggested questions:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {followUpSuggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(suggestion)}
                    className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-full transition-colors border border-gray-300 hover:border-gray-400"
                    disabled={isLoading}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Enhanced File Upload Area */}
          {showFileUpload && (
            <div className="px-4 py-3 bg-white border-t border-gray-200">
              <FileUpload
                onFileSelect={handleFileSelect}
                onRemoveFile={handleRemoveFile}
                selectedFile={selectedFile}
                isUploading={isProcessingFile}
              />
            </div>
          )}

          {/* Enhanced Input */}
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex space-x-2">
              <button
                onClick={() => setShowFileUpload(!showFileUpload)}
                className={`p-3 rounded-lg transition-colors ${
                  showFileUpload
                    ? `${subject.color.replace('text', 'bg')} text-white`
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }`}
                disabled={isLoading || isProcessingFile}
                title="Upload images, PDFs, or text files with AI text recognition"
              >
                <Paperclip className="h-5 w-5" />
              </button>
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={`Ask your ${subject.name} question, upload an image, or ask about JEE/NEET exam patterns...`}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={2}
                  disabled={isLoading || isProcessingFile}
                />
                <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                  Press Enter to send, Shift+Enter for new line
                </div>
              </div>
              <button
                onClick={() => handleSendMessage()}
                disabled={(!inputMessage.trim() && !selectedFile) || isLoading || isProcessingFile}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  (!inputMessage.trim() && !selectedFile) || isLoading || isProcessingFile
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : `${subject.color.replace('text', 'bg')} text-white hover:opacity-90`
                }`}
              >
                {isLoading || isProcessingFile ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Usage Limit Modal */}
        <UsageLimitModal
          isOpen={usageLimitModal.isOpen}
          onClose={() => setUsageLimitModal({ ...usageLimitModal, isOpen: false })}
          limitType={usageLimitModal.limitType}
          message={usageLimitModal.message}
          onUpgrade={handleUpgrade}
        />
      </div>
    </div>
  );
};

export default ChatInterface;