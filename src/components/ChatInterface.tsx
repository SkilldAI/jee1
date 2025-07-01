import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, BookOpen, Target, TrendingUp, AlertTriangle, Lightbulb, Paperclip, BarChart3, Award, Eye, Zap } from 'lucide-react';
import { Subject, ChatMessage, QuestionAnalysis } from '../types';
import { generateTutorResponse, generateFollowUpSuggestions } from '../services/geminiService';
import { processUploadedFile, ProcessedFileContent } from '../services/fileProcessingService';
import { adaptiveLearningService } from '../services/adaptiveLearningService';
import FileUpload from './FileUpload';

interface ChatInterfaceProps {
  subject: Subject;
  onBack: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ subject, onBack }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [followUpSuggestions, setFollowUpSuggestions] = useState<string[]>([]);
  const [showAnalysis, setShowAnalysis] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize progress tracking
    adaptiveLearningService.initializeProgress(subject);
    
    // Get personalized welcome message
    const progress = adaptiveLearningService.getProgress(subject);
    const analytics = adaptiveLearningService.getPerformanceAnalytics(subject);
    const suggestions = adaptiveLearningService.generateSuggestions(subject);
    
    let welcomeMessage = `Hello! I'm your ${subject.name} tutor with advanced AI capabilities. `;
    
    if (progress.totalQuestions === 0) {
      welcomeMessage += `I'm here to help you with JEE/NEET preparation. I can read text from images, analyze mathematical content, and adapt to your learning pace. Let's start with some basics!`;
    } else {
      welcomeMessage += `Welcome back! I can see you're at ${analytics.level} level with ${analytics.accuracy}% accuracy. `;
      if (analytics.streak > 0) {
        welcomeMessage += `Great ${analytics.streak}-question streak! `;
      }
      welcomeMessage += `Feel free to upload images of problems or ask questions directly.`;
    }
    
    const welcomeChatMessage: ChatMessage = {
      id: 'welcome',
      content: welcomeMessage,
      isUser: false,
      timestamp: new Date(),
      subject
    };
    
    setMessages([welcomeChatMessage]);
    
    // Set initial suggestions
    if (suggestions.length > 0) {
      setFollowUpSuggestions(suggestions.map(s => s.content));
    }
  }, [subject]);

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    setIsProcessingFile(true);
    
    try {
      const processedContent = await processUploadedFile(file);
      
      // Create a message showing the file was uploaded with enhanced info
      let fileMessage = `📎 Uploaded: ${file.name}`;
      
      if (processedContent.confidence !== undefined) {
        fileMessage += ` (${(processedContent.confidence * 100).toFixed(1)}% text recognition confidence)`;
      }
      
      if (processedContent.mathContent?.hasMath) {
        fileMessage += ` 🧮 Mathematical content detected: ${processedContent.mathContent.mathIndicators.join(', ')}`;
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
      
      // Auto-generate a response about the uploaded file
      const { response, analysis, suggestedDifficulty } = await generateTutorResponse(
        subject,
        processedContent.text,
        [],
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
      
    } catch (error) {
      console.error('Error processing file:', error);
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        content: `I had trouble processing your file: ${error instanceof Error ? error.message : 'Unknown error'}. Please try uploading it again or describe your question in text.`,
        isUser: false,
        timestamp: new Date(),
        subject
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessingFile(false);
      setShowFileUpload(false);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || inputMessage.trim();
    if ((!text && !selectedFile) || isLoading) return;

    let fileContent: ProcessedFileContent | undefined;
    
    // Process file if one is selected
    if (selectedFile && !isProcessingFile) {
      setIsProcessingFile(true);
      try {
        fileContent = await processUploadedFile(selectedFile);
      } catch (error) {
        console.error('Error processing file:', error);
        setIsProcessingFile(false);
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
    setFollowUpSuggestions([]);

    try {
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

      // Generate follow-up suggestions
      const suggestions = await generateFollowUpSuggestions(subject, text || 'file upload question');
      setFollowUpSuggestions(suggestions);

      // Update progress (simulate user understanding - in real app, you'd have user feedback)
      // For demo purposes, we'll assume moderate success rate
      const wasCorrect = Math.random() > 0.3; // 70% success rate simulation
      adaptiveLearningService.updateProgress(
        subject,
        wasCorrect,
        suggestedDifficulty,
        analysis.concepts,
        30 // Average response time
      );

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: "I'm having trouble connecting right now. Please try again in a moment.",
        isUser: false,
        timestamp: new Date(),
        subject
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCorrectAnswer = (messageId: string, wasCorrect: boolean) => {
    // Update the message to track if it was correct
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, wasCorrect } : msg
    ));

    // Find the message and update progress
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

  const AnalysisPanel = ({ analysis, messageId }: { analysis: QuestionAnalysis; messageId: string }) => (
    <div className="mt-3 bg-gray-50 rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Target className="h-4 w-4 text-blue-600" />
          <h4 className="font-semibold text-gray-900">Question Analysis</h4>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => handleCorrectAnswer(messageId, true)}
            className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200"
          >
            ✓ Got it right
          </button>
          <button
            onClick={() => handleCorrectAnswer(messageId, false)}
            className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200"
          >
            ✗ Need help
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <h5 className="font-medium text-gray-700 mb-1">Concepts</h5>
          <div className="flex flex-wrap gap-1">
            {analysis.concepts.map((concept, idx) => (
              <span key={idx} className={`px-2 py-1 rounded text-xs ${subject.bgColor} ${subject.color}`}>
                {concept}
              </span>
            ))}
          </div>
        </div>
        
        <div>
          <h5 className="font-medium text-gray-700 mb-1">Difficulty</h5>
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i <= analysis.complexityLevel ? 'bg-red-500' : 'bg-gray-200'
                }`}
              />
            ))}
            <span className="text-xs text-gray-600 ml-1">({analysis.complexityLevel}/5)</span>
          </div>
        </div>
      </div>

      {analysis.commonTraps.length > 0 && (
        <div>
          <h5 className="font-medium text-gray-700 mb-1 flex items-center space-x-1">
            <AlertTriangle className="h-3 w-3 text-orange-500" />
            <span>Common Traps</span>
          </h5>
          <ul className="text-xs space-y-1">
            {analysis.commonTraps.map((trap, idx) => (
              <li key={idx} className="text-orange-700">• {trap}</li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h5 className="font-medium text-gray-700 mb-1 flex items-center space-x-1">
          <TrendingUp className="h-3 w-3 text-green-500" />
          <span>Study Tip</span>
        </h5>
        <p className="text-xs text-green-700">{analysis.progressNote}</p>
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
          <h3 className="font-semibold text-gray-900">Your Progress</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-lg font-bold text-blue-600">{analytics.level}</div>
            <div className="text-xs text-gray-600">Current Level</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-lg font-bold text-green-600">{analytics.accuracy}%</div>
            <div className="text-xs text-gray-600">Accuracy</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-lg font-bold text-purple-600">{analytics.streak}</div>
            <div className="text-xs text-gray-600">Current Streak</div>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <div className="text-lg font-bold text-orange-600">{analytics.totalQuestions}</div>
            <div className="text-xs text-gray-600">Questions Asked</div>
          </div>
        </div>
        
        <div>
          <h4 className="font-medium text-gray-700 mb-2">Study Recommendations</h4>
          <ul className="text-sm space-y-1">
            {recommendations.slice(0, 3).map((rec, idx) => (
              <li key={idx} className="text-gray-600">• {rec}</li>
            ))}
          </ul>
        </div>
        
        {progress.weakAreas.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Focus Areas</h4>
            <div className="flex flex-wrap gap-1">
              {progress.weakAreas.slice(0, 3).map((area, idx) => (
                <span key={idx} className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                  {area}
                </span>
              ))}
            </div>
          </div>
        )}
        
        <div className="text-center">
          <p className="text-sm text-gray-600">{analytics.nextGoal}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className={`${subject.bgColor} ${subject.borderColor} border-b-2 p-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={onBack}
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              ←
            </button>
            <div className={`p-2 rounded-lg bg-white`}>
              <div className={`h-5 w-5 ${subject.color}`} />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">{subject.name} AI Tutor</h2>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Eye className="h-3 w-3" />
                  <span>Vision AI</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Zap className="h-3 w-3" />
                  <span>Adaptive Learning</span>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowProgress(!showProgress)}
            className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Award className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium">Progress</span>
          </button>
        </div>
      </div>

      {/* Progress Panel */}
      {showProgress && (
        <div className="p-4 border-b border-gray-200">
          <ProgressPanel />
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-3xl rounded-lg p-4 ${
                message.isUser
                  ? `${subject.color.replace('text', 'bg')} text-white`
                  : 'bg-white border border-gray-200 text-gray-800'
              }`}
            >
              <div className="whitespace-pre-wrap">{message.content}</div>
              
              {message.difficulty && !message.isUser && (
                <div className="mt-2 flex items-center space-x-2">
                  <span className={`text-xs px-2 py-1 rounded ${
                    message.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                    message.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {message.difficulty} Level
                  </span>
                  {message.wasCorrect !== undefined && (
                    <span className={`text-xs px-2 py-1 rounded ${
                      message.wasCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {message.wasCorrect ? '✓ Correct' : '✗ Needs Review'}
                    </span>
                  )}
                </div>
              )}
              
              {message.fileContent && (
                <div className="mt-2 p-2 bg-gray-100 rounded text-xs text-gray-600">
                  <div className="flex items-center space-x-2">
                    <span>📎 {message.fileContent.type.toUpperCase()} file: {message.fileContent.fileName}</span>
                    {message.fileContent.confidence !== undefined && (
                      <span className="text-blue-600">
                        ({(message.fileContent.confidence * 100).toFixed(1)}% confidence)
                      </span>
                    )}
                  </div>
                  {message.fileContent.mathContent?.hasMath && (
                    <div className="mt-1 text-green-600">
                      🧮 Math detected: {message.fileContent.mathContent.mathIndicators.join(', ')}
                    </div>
                  )}
                </div>
              )}
              
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
                      {showAnalysis === message.id ? 'Hide' : 'Show'} Analysis
                    </span>
                  </button>
                  
                  {showAnalysis === message.id && (
                    <AnalysisPanel analysis={message.analysis} messageId={message.id} />
                  )}
                </div>
              )}
              
              <div className="text-xs opacity-70 mt-2">
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        
        {(isLoading || isProcessingFile) && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
              <span className="text-gray-600">
                {isProcessingFile ? 'Reading text from image with AI...' : 'Thinking...'}
              </span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Follow-up Suggestions */}
      {followUpSuggestions.length > 0 && (
        <div className="px-4 py-2 bg-white border-t border-gray-200">
          <div className="flex items-center space-x-2 mb-2">
            <Lightbulb className="h-4 w-4 text-yellow-500" />
            <span className="text-sm font-medium text-gray-700">Suggested questions:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {followUpSuggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(suggestion)}
                className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors"
                disabled={isLoading}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* File Upload Area */}
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

      {/* Input */}
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
            title="Upload images, PDFs, or text files"
          >
            <Paperclip className="h-5 w-5" />
          </button>
          <textarea
            ref={inputRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Ask your ${subject.name} question or upload an image with AI text recognition...`}
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={2}
            disabled={isLoading || isProcessingFile}
          />
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
  );
};

export default ChatInterface;