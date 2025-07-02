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
  Zap
} from 'lucide-react';
import { 
  learningPathService, 
  PersonalizedLearningPath, 
  LearningPathNode, 
  ContentRecommendation 
} from '../services/learningPathService';

interface LearningPathProps {
  selectedSubject?: string | null;
}

const LearningPath: React.FC<LearningPathProps> = ({ selectedSubject }) => {
  const [learningPaths, setLearningPaths] = useState<PersonalizedLearningPath[]>([]);
  const [currentPath, setCurrentPath] = useState<PersonalizedLearningPath | null>(null);
  const [recommendations, setRecommendations] = useState<ContentRecommendation[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'path' | 'recommendations' | 'analytics'>('overview');
  const [showCreatePath, setShowCreatePath] = useState(false);

  useEffect(() => {
    loadLearningPaths();
  }, []);

  useEffect(() => {
    if (currentPath) {
      const pathAnalytics = learningPathService.getPathAnalytics(currentPath.id);
      setAnalytics(pathAnalytics);
      setRecommendations(pathAnalytics.recommendations);
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

  const handleNodeComplete = (nodeId: string) => {
    if (!currentPath) return;
    
    // Simulate completing a node with good performance
    learningPathService.updatePerformance(
      currentPath.id,
      nodeId,
      45, // 45 minutes spent
      85, // 85% accuracy
      3   // Medium difficulty
    );
    
    // Reload the path to see updates
    const updatedPath = learningPathService.getLearningPath(currentPath.id);
    if (updatedPath) {
      setCurrentPath(updatedPath);
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
          <h2 className="text-xl font-bold mb-4">Create Learning Path</h2>
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
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-lg font-bold text-green-600">{currentPath.completedNodes.length}</div>
              <div className="text-sm text-gray-600">Completed Topics</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-lg font-bold text-blue-600">{currentPath.nodes.length - currentPath.completedNodes.length}</div>
              <div className="text-sm text-gray-600">Remaining Topics</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-lg font-bold text-purple-600">
                {Math.ceil((currentPath.estimatedCompletionDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
              </div>
              <div className="text-sm text-gray-600">Days to Complete</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Learning Path Yet</h3>
          <p className="text-gray-600 mb-4">Create a personalized learning path to get started</p>
          <button
            onClick={() => setShowCreatePath(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Create Learning Path
          </button>
        </div>
      )}

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
                <p className="text-sm font-medium text-gray-600">Recommendations</p>
                <p className="text-2xl font-bold text-gray-900">{recommendations.length}</p>
              </div>
              <Lightbulb className="h-8 w-8 text-yellow-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completion</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.predictedCompletion.toLocaleDateString()}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </div>
      )}

      {/* Weak & Strong Areas */}
      {currentPath && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <h3 className="text-lg font-semibold text-gray-900">Areas to Focus</h3>
            </div>
            <div className="space-y-2">
              {currentPath.weakAreas.length > 0 ? (
                currentPath.weakAreas.map((area, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-orange-50 rounded">
                    <span className="text-orange-800">{area}</span>
                    <span className="text-xs bg-orange-200 text-orange-700 px-2 py-1 rounded">Needs Work</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No weak areas identified yet</p>
              )}
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Star className="h-5 w-5 text-green-500" />
              <h3 className="text-lg font-semibold text-gray-900">Strong Areas</h3>
            </div>
            <div className="space-y-2">
              {currentPath.strongAreas.length > 0 ? (
                currentPath.strongAreas.map((area, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded">
                    <span className="text-green-800">{area}</span>
                    <span className="text-xs bg-green-200 text-green-700 px-2 py-1 rounded">Strong</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">Building strengths...</p>
              )}
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
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Path Progress</h3>
          <div className="space-y-4">
            {currentPath.nodes.map((node) => (
              <div key={node.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      {node.isCompleted ? (
                        <CheckCircle className="h-6 w-6 text-green-500" />
                      ) : node.isUnlocked ? (
                        <Play className="h-6 w-6 text-blue-500" />
                      ) : (
                        <Lock className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{node.title}</h4>
                      <p className="text-sm text-gray-600">{node.topic} • {node.subtopic}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(node.difficulty)}`}>
                          {node.difficulty}
                        </span>
                        <span className="text-xs text-gray-500">{node.estimatedTime} min</span>
                        {node.attempts > 0 && (
                          <span className="text-xs text-blue-600">{Math.round(node.successRate)}% accuracy</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">{Math.round(node.masteryLevel)}%</div>
                      <div className="text-xs text-gray-500">Mastery</div>
                    </div>
                    {node.isUnlocked && !node.isCompleted && (
                      <button
                        onClick={() => handleNodeComplete(node.id)}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                      >
                        Study
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
                      {node.learningObjectives.map((objective, index) => (
                        <li key={index}>• {objective}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
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
                  <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 ml-4">
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
                <h1 className="text-2xl font-bold text-gray-900">AI-Powered Learning Path</h1>
                <p className="text-gray-600">Personalized content recommendations based on your performance</p>
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
              { id: 'recommendations', name: 'Recommendations', icon: Lightbulb },
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
        {activeTab === 'recommendations' && <RecommendationsTab />}
        {activeTab === 'analytics' && <AnalyticsTab />}

        {/* Modals */}
        {showCreatePath && <PathCreator />}
      </div>
    </div>
  );
};

export default LearningPath;