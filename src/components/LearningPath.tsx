import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Target, 
  TrendingUp, 
  Clock, 
  Award, 
  CheckCircle, 
  Lock, 
  Play,
  BarChart3,
  Brain,
  Lightbulb,
  ArrowRight,
  Star,
  AlertTriangle,
  Calendar,
  Zap,
  Plus,
  Search,
  Filter,
  Eye,
  MessageCircle,
  FileText,
  ChevronRight,
  Users,
  Flame
} from 'lucide-react';
import { 
  learningPathService, 
  PersonalizedLearningPath, 
  LearningPathNode, 
  ContentRecommendation,
  TopicSuggestion 
} from '../services/learningPathService';
import { contentService } from '../services/contentService';
import ContentViewer from './ContentViewer';

interface LearningPathProps {
  selectedSubject?: string | null;
  onNavigateToChat?: (subject: string) => void;
}

const LearningPath: React.FC<LearningPathProps> = ({ selectedSubject, onNavigateToChat }) => {
  const [learningPaths, setLearningPaths] = useState<PersonalizedLearningPath[]>([]);
  const [currentPath, setCurrentPath] = useState<PersonalizedLearningPath | null>(null);
  const [recommendations, setRecommendations] = useState<ContentRecommendation[]>([]);
  const [topicSuggestions, setTopicSuggestions] = useState<TopicSuggestion[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'path' | 'recommendations' | 'analytics' | 'add-topics'>('overview');
  const [showCreatePath, setShowCreatePath] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [studyingNode, setStudyingNode] = useState<string | null>(null);
  const [viewingContent, setViewingContent] = useState<string | null>(null);

  useEffect(() => {
    loadLearningPaths();
  }, []);

  useEffect(() => {
    if (currentPath) {
      const pathAnalytics = learningPathService.getPathAnalytics(currentPath.id);
      setAnalytics(pathAnalytics);
      setRecommendations(pathAnalytics.recommendations);
      setTopicSuggestions(pathAnalytics.topicSuggestions);
    }
  }, [currentPath]);

  const loadLearningPaths = () => {
    const paths = learningPathService.getAllLearningPaths('current-user');
    setLearningPaths(paths);
    
    if (paths.length > 0) {
      setCurrentPath(paths[0]);
    }
  };

  const handleCreatePath = (pathData: {
    subject: string;
    targetExam: 'JEE Main' | 'JEE Advanced' | 'NEET';
    currentLevel: 'Beginner' | 'Intermediate' | 'Advanced';
    timeAvailable: number;
    examDate: Date;
  }) => {
    const newPath = learningPathService.createLearningPath(
      'current-user',
      pathData.subject,
      pathData.targetExam,
      pathData.currentLevel,
      pathData.timeAvailable,
      pathData.examDate
    );
    
    setLearningPaths(prev => [...prev, newPath]);
    setCurrentPath(newPath);
    setShowCreatePath(false);
  };

  const handleStudyNode = (nodeId: string) => {
    if (!currentPath) return;
    
    // Check if content exists for this node
    const content = contentService.getContent(nodeId);
    if (content) {
      setViewingContent(nodeId);
    } else {
      // Fallback to simulation for nodes without content
      setStudyingNode(nodeId);
      
      setTimeout(() => {
        learningPathService.updatePerformance(
          currentPath.id,
          nodeId,
          45,
          85,
          3
        );
        
        const updatedPath = learningPathService.getLearningPath(currentPath.id);
        if (updatedPath) {
          setCurrentPath(updatedPath);
        }
        
        setStudyingNode(null);
        alert('Great job! You\'ve completed this topic. Your learning path has been updated.');
      }, 2000);
    }
  };

  const handleContentComplete = () => {
    if (!currentPath || !viewingContent) return;
    
    // Update performance for the completed content
    learningPathService.updatePerformance(
      currentPath.id,
      viewingContent,
      30, // 30 minutes
      90, // 90% performance
      3   // Medium difficulty
    );
    
    // Reload the path to see updates
    const updatedPath = learningPathService.getLearningPath(currentPath.id);
    if (updatedPath) {
      setCurrentPath(updatedPath);
    }
    
    setViewingContent(null);
    alert('Excellent! Topic completed successfully. Your progress has been updated.');
  };

  const handleNavigateToAITutor = () => {
    if (currentPath && onNavigateToChat) {
      onNavigateToChat(currentPath.subject);
    } else {
      alert('To use the AI Tutor:\n1. Go to the AI Tutor tab\n2. Select your subject\n3. Ask questions about any topic\n4. The AI will automatically add relevant topics to your learning path!');
    }
  };

  const handleAddTopicFromSuggestion = (suggestionId: string) => {
    if (!currentPath) return;
    
    const addedNode = learningPathService.addTopicFromSuggestion(currentPath.id, suggestionId);
    if (addedNode) {
      const updatedPath = learningPathService.getLearningPath(currentPath.id);
      if (updatedPath) {
        setCurrentPath(updatedPath);
      }
      
      alert(`Added "${addedNode.title}" to your learning path!`);
    }
  };

  const handleStartRecommendation = (nodeId: string) => {
    if (!currentPath) return;
    
    const node = currentPath.nodes.find(n => n.id === nodeId);
    if (node) {
      handleStudyNode(nodeId);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Foundation': return 'bg-green-100 text-green-800 border-green-200';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Advanced': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Expert': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'Critical': return 'bg-red-500';
      case 'High': return 'bg-orange-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getAddedByIcon = (addedBy: string) => {
    switch (addedBy) {
      case 'system': return <BookOpen className="h-4 w-4 text-blue-500" />;
      case 'ai-recommendation': return <Brain className="h-4 w-4 text-purple-500" />;
      case 'student-request': return <MessageCircle className="h-4 w-4 text-green-500" />;
      case 'gap-analysis': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      default: return <BookOpen className="h-4 w-4 text-gray-500" />;
    }
  };

  // If viewing content, show the content viewer
  if (viewingContent) {
    return (
      <ContentViewer
        nodeId={viewingContent}
        onComplete={handleContentComplete}
        onBack={() => setViewingContent(null)}
      />
    );
  }

  const PathCreator = () => {
    const [formData, setFormData] = useState({
      subject: 'Physics',
      targetExam: 'JEE Main' as 'JEE Main' | 'JEE Advanced' | 'NEET',
      currentLevel: 'Intermediate' as 'Beginner' | 'Intermediate' | 'Advanced',
      timeAvailable: 10,
      examDate: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      handleCreatePath({
        ...formData,
        examDate: new Date(formData.examDate)
      });
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h2 className="text-xl font-bold mb-4">Create AI Learning Path</h2>
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>How it works:</strong> The AI will create a personalized learning path with comprehensive JEE/NEET content. 
              Each topic includes theory, examples, and practice questions. You can also ask the AI tutor about specific concepts to add them to your path.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <select
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              >
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Biology">Biology</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Exam</label>
              <select
                value={formData.targetExam}
                onChange={(e) => setFormData({...formData, targetExam: e.target.value as any})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              >
                <option value="JEE Main">JEE Main</option>
                <option value="JEE Advanced">JEE Advanced</option>
                <option value="NEET">NEET</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Level</label>
              <select
                value={formData.currentLevel}
                onChange={(e) => setFormData({...formData, currentLevel: e.target.value as any})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time Available (hours/week)</label>
              <input
                type="number"
                value={formData.timeAvailable}
                onChange={(e) => setFormData({...formData, timeAvailable: parseInt(e.target.value)})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                min="5"
                max="40"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Exam Date</label>
              <input
                type="date"
                value={formData.examDate}
                onChange={(e) => setFormData({...formData, examDate: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowCreatePath(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Path
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* How It Works */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Brain className="h-6 w-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">AI-Powered Learning with Real Content</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 border border-blue-100">
            <div className="flex items-center space-x-2 mb-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <h4 className="font-medium text-gray-900">Rich Educational Content</h4>
            </div>
            <p className="text-sm text-gray-600">
              Each topic includes comprehensive theory, solved examples, practice questions, and detailed explanations - all based on JEE/NEET curriculum.
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-blue-100">
            <div className="flex items-center space-x-2 mb-2">
              <MessageCircle className="h-5 w-5 text-green-600" />
              <h4 className="font-medium text-gray-900">AI Tutor Integration</h4>
            </div>
            <p className="text-sm text-gray-600">
              Ask the AI tutor about any concept and it will automatically add relevant topics to your learning path with complete study materials.
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-blue-100">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <h4 className="font-medium text-gray-900">Adaptive Learning</h4>
            </div>
            <p className="text-sm text-gray-600">
              The AI analyzes your performance and suggests additional topics to fill knowledge gaps, ensuring comprehensive preparation.
            </p>
          </div>
        </div>
      </div>

      {/* Current Path Overview */}
      {currentPath ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{currentPath.subject} Learning Path</h3>
              <p className="text-gray-600">{currentPath.targetExam} • {currentPath.currentLevel} Level</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{Math.round(currentPath.overallProgress)}%</div>
              <div className="text-sm text-gray-500">Complete</div>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div
              className="bg-blue-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${currentPath.overallProgress}%` }}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-lg font-bold text-green-600">{currentPath.completedNodes.length}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-lg font-bold text-blue-600">{currentPath.nodes.length - currentPath.completedNodes.length}</div>
              <div className="text-sm text-gray-600">Remaining</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-lg font-bold text-purple-600">
                {Math.ceil((currentPath.estimatedCompletionDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
              </div>
              <div className="text-sm text-gray-600">Days Left</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-lg font-bold text-orange-600">
                {currentPath.nodes.filter(n => contentService.getContent(n.id)).length}
              </div>
              <div className="text-sm text-gray-600">With Content</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab('path')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <BookOpen className="h-4 w-4" />
              <span>Start Learning</span>
            </button>
            <button
              onClick={handleNavigateToAITutor}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Ask AI Tutor</span>
            </button>
            <button
              onClick={() => setActiveTab('recommendations')}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center space-x-2"
            >
              <Lightbulb className="h-4 w-4" />
              <span>View Recommendations</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">Create Your AI Learning Path</h3>
          <p className="text-gray-600 mb-6">Get a personalized learning path with comprehensive content for JEE/NEET preparation</p>
          <button
            onClick={() => setShowCreatePath(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center space-x-2 mx-auto"
          >
            <Plus className="h-5 w-5" />
            <span>Create Learning Path</span>
          </button>
        </div>
      )}

      {/* Sample Content Preview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Eye className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Sample Learning Content</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <BookOpen className="h-4 w-4 text-blue-600" />
              <h4 className="font-medium text-gray-900">Physics: Motion in a Straight Line</h4>
            </div>
            <p className="text-sm text-gray-600 mb-3">Complete theory with kinematic equations, solved examples, and practice questions</p>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <Clock className="h-3 w-3" />
              <span>25 min read</span>
              <span>•</span>
              <span>Foundation Level</span>
            </div>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <BookOpen className="h-4 w-4 text-green-600" />
              <h4 className="font-medium text-gray-900">Chemistry: Atomic Structure</h4>
            </div>
            <p className="text-sm text-gray-600 mb-3">Quantum numbers, electronic configuration, and periodic trends with examples</p>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <Clock className="h-3 w-3" />
              <span>40 min read</span>
              <span>•</span>
              <span>Foundation Level</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Accuracy</p>
                <p className="text-2xl font-bold text-gray-900">{Math.round(analytics.averageAccuracy)}%</p>
              </div>
              <Target className="h-8 w-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Time Spent</p>
                <p className="text-2xl font-bold text-gray-900">{Math.round(analytics.timeSpent / 60)}h</p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">AI Recommendations</p>
                <p className="text-2xl font-bold text-gray-900">{recommendations.length}</p>
              </div>
              <Lightbulb className="h-8 w-8 text-yellow-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Topic Suggestions</p>
                <p className="text-2xl font-bold text-gray-900">{topicSuggestions.length}</p>
              </div>
              <Plus className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const PathTab = () => (
    <div className="space-y-6">
      {currentPath && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Your Learning Journey</h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="text-sm text-gray-600">
                {currentPath.nodes.filter(n => contentService.getContent(n.id)).length} topics with full content
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            {currentPath.nodes
              .filter(node => 
                searchTerm === '' || 
                node.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                node.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
                node.subtopic.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((node) => {
                const hasContent = contentService.getContent(node.id) !== null;
                
                return (
                  <div key={node.id} className={`border rounded-lg p-4 transition-all hover:shadow-md ${
                    hasContent ? 'border-green-200 bg-green-50' : 'border-gray-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          {node.isCompleted ? (
                            <CheckCircle className="h-6 w-6 text-green-500" />
                          ) : node.isUnlocked ? (
                            studyingNode === node.id ? (
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500" />
                            ) : (
                              <Play className="h-6 w-6 text-blue-500" />
                            )
                          ) : (
                            <Lock className="h-6 w-6 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium text-gray-900">{node.title}</h4>
                            {getAddedByIcon(node.addedBy)}
                            {hasContent && (
                              <div className="flex items-center space-x-1">
                                <FileText className="h-4 w-4 text-green-600" />
                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                                  Full Content Available
                                </span>
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{node.topic} • {node.subtopic}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(node.difficulty)}`}>
                              {node.difficulty}
                            </span>
                            <span className="text-xs text-gray-500">{node.estimatedTime} min</span>
                            {node.attempts > 0 && (
                              <span className="text-xs text-blue-600">{Math.round(node.successRate)}% accuracy</span>
                            )}
                            <span className="text-xs text-gray-400">
                              Added by: {node.addedBy.replace('-', ' ')}
                            </span>
                          </div>
                          {hasContent && (
                            <div className="mt-2 text-xs text-green-700 bg-green-100 px-2 py-1 rounded inline-block">
                              ✓ Theory, Examples & Practice Questions Available
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">{Math.round(node.masteryLevel)}%</div>
                          <div className="text-xs text-gray-500">Mastery</div>
                        </div>
                        {node.isUnlocked && !node.isCompleted && (
                          <button
                            onClick={() => handleStudyNode(node.id)}
                            disabled={studyingNode === node.id}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
                              studyingNode === node.id
                                ? 'bg-gray-400 text-white cursor-not-allowed'
                                : hasContent
                                ? 'bg-green-600 text-white hover:bg-green-700'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                          >
                            {studyingNode === node.id ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                                <span>Studying...</span>
                              </>
                            ) : hasContent ? (
                              <>
                                <BookOpen className="h-4 w-4" />
                                <span>Learn Now</span>
                              </>
                            ) : (
                              <>
                                <Play className="h-4 w-4" />
                                <span>Study</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            node.isCompleted ? 'bg-green-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${node.masteryLevel}%` }}
                        />
                      </div>
                    </div>
                    
                    {/* Learning objectives */}
                    {node.learningObjectives.length > 0 && (
                      <div className="mt-3">
                        <p className="text-xs font-medium text-gray-700 mb-1">Learning Objectives:</p>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {node.learningObjectives.slice(0, 3).map((objective, index) => (
                            <li key={index} className="flex items-start space-x-1">
                              <span className="text-blue-500 mt-0.5">•</span>
                              <span>{objective}</span>
                            </li>
                          ))}
                          {node.learningObjectives.length > 3 && (
                            <li className="text-gray-500">+{node.learningObjectives.length - 3} more objectives</li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>

          {/* Call to Action for Empty Results */}
          {currentPath.nodes.filter(node => 
            searchTerm === '' || 
            node.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            node.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
            node.subtopic.toLowerCase().includes(searchTerm.toLowerCase())
          ).length === 0 && (
            <div className="text-center py-8">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">No topics found</h4>
              <p className="text-gray-600 mb-4">Try adjusting your search or add new topics to your learning path</p>
              <button
                onClick={() => setActiveTab('add-topics')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Add Topics
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const AddTopicsTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Plus className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-900">Add Topics to Your Learning Path</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center space-x-2 mb-2">
              <MessageCircle className="h-5 w-5 text-blue-600" />
              <h4 className="font-medium text-blue-900">Ask AI Tutor</h4>
            </div>
            <p className="text-sm text-blue-800 mb-3">
              Ask the AI tutor about any concept and it will automatically add relevant topics with complete study materials to your path.
            </p>
            <button 
              onClick={handleNavigateToAITutor}
              className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
            >
              Go to AI Tutor
            </button>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center space-x-2 mb-2">
              <Eye className="h-5 w-5 text-green-600" />
              <h4 className="font-medium text-green-900">Upload Images</h4>
            </div>
            <p className="text-sm text-green-800 mb-3">
              Upload images of problems and the AI will extract topics and add them to your path with comprehensive content.
            </p>
            <button 
              onClick={handleNavigateToAITutor}
              className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
            >
              Upload Image
            </button>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center space-x-2 mb-2">
              <Brain className="h-5 w-5 text-purple-600" />
              <h4 className="font-medium text-purple-900">AI Suggestions</h4>
            </div>
            <p className="text-sm text-purple-800 mb-3">
              Browse AI-generated topic suggestions based on your performance and curriculum.
            </p>
            <button 
              onClick={() => setActiveTab('recommendations')}
              className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700"
            >
              View Suggestions
            </button>
          </div>
        </div>

        {/* AI Topic Suggestions */}
        <div>
          <h4 className="font-medium text-gray-900 mb-4">AI-Generated Topic Suggestions</h4>
          {topicSuggestions.length > 0 ? (
            <div className="space-y-3">
              {topicSuggestions.map((suggestion, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h5 className="font-medium text-gray-900">{suggestion.title}</h5>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          {suggestion.source.replace('-', ' ')}
                        </span>
                        <span className="text-xs text-gray-500">
                          {Math.round(suggestion.confidence * 100)}% confidence
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{suggestion.reason}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>Topic: {suggestion.topic}</span>
                        <span>Subtopic: {suggestion.subtopic}</span>
                      </div>
                      {suggestion.relatedConcepts.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs font-medium text-gray-700 mb-1">Related Concepts:</p>
                          <div className="flex flex-wrap gap-1">
                            {suggestion.relatedConcepts.slice(0, 3).map((concept, idx) => (
                              <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                {concept}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => handleAddTopicFromSuggestion(suggestion.id)}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 ml-4"
                    >
                      Add Topic
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Lightbulb className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">No Suggestions Yet</h4>
              <p className="text-gray-600 mb-4">
                Start studying topics or ask the AI tutor questions to get personalized topic suggestions
              </p>
              <button
                onClick={handleNavigateToAITutor}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Ask AI Tutor
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const RecommendationsTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Zap className="h-5 w-5 text-yellow-500" />
          <h3 className="text-lg font-semibold text-gray-900">AI Recommendations</h3>
        </div>
        
        {recommendations.length > 0 ? (
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-medium text-gray-900">{rec.title}</h4>
                      <div className={`w-3 h-3 rounded-full ${getUrgencyColor(rec.urgency)}`} />
                      <span className="text-xs text-gray-500">{rec.urgency} Priority</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{rec.reason}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>Impact: +{rec.estimatedImpact}%</span>
                      <span>Type: {rec.type.replace('-', ' ')}</span>
                      <span>Priority: {rec.priority}/10</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleStartRecommendation(rec.nodeId)}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 ml-4"
                  >
                    Start
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Lightbulb className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No Recommendations Yet</h4>
            <p className="text-gray-600">Complete some topics to get personalized recommendations</p>
          </div>
        )}
      </div>
    </div>
  );

  const AnalyticsTab = () => (
    <div className="space-y-6">
      {analytics && (
        <>
          {/* Topic Progress */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Topic Progress</h3>
            <div className="space-y-3">
              {Object.entries(analytics.topicProgress).map(([topic, progress]) => (
                <div key={topic} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-700">{topic}</span>
                    <span className="text-gray-500">{Math.round(progress as number)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Difficulty Distribution */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Difficulty Distribution</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(analytics.difficultyDistribution).map(([difficulty, progress]) => (
                <div key={difficulty} className="text-center">
                  <div className={`p-3 rounded-lg ${getDifficultyColor(difficulty)}`}>
                    <div className="text-lg font-bold">{Math.round(progress as number)}%</div>
                    <div className="text-sm">{difficulty}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Progress Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Progress</h3>
            <div className="flex items-end space-x-2 h-32">
              {analytics.weeklyProgress.map((progress: number, index: number) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-blue-500 rounded-t"
                    style={{ height: `${(progress / 100) * 100}%` }}
                  />
                  <div className="text-xs text-gray-500 mt-1">W{index + 1}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-3 rounded-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AI Learning Path</h1>
                <p className="text-gray-600">Comprehensive JEE/NEET content with theory, examples, and practice</p>
              </div>
            </div>
            {!currentPath && (
              <button
                onClick={() => setShowCreatePath(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              >
                <Brain className="h-4 w-4" />
                <span>Create Path</span>
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="flex space-x-8 px-6">
            {[
              { id: 'overview', name: 'Overview', icon: BarChart3 },
              { id: 'path', name: 'Learning Path', icon: BookOpen },
              { id: 'add-topics', name: 'Add Topics', icon: Plus },
              { id: 'recommendations', name: 'AI Recommendations', icon: Lightbulb },
              { id: 'analytics', name: 'Analytics', icon: TrendingUp }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                    activeTab === tab.id
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

        {/* Tab Content */}
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'path' && <PathTab />}
        {activeTab === 'add-topics' && <AddTopicsTab />}
        {activeTab === 'recommendations' && <RecommendationsTab />}
        {activeTab === 'analytics' && <AnalyticsTab />}

        {/* Modals */}
        {showCreatePath && <PathCreator />}
      </div>
    </div>
  );
};

export default LearningPath;