import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Target, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  BookOpen,
  Timer,
  Award,
  Settings,
  Plus,
  Filter,
  BarChart3
} from 'lucide-react';
import { studyPlanningService } from '../services/studyPlanningService';
import { 
  StudyGoal, 
  StudyPlan, 
  StudyCalendarEvent, 
  PomodoroSession, 
  RevisionItem, 
  StudyStreak 
} from '../types';

interface StudyPlannerProps {
  selectedSubject?: string | null;
}

const StudyPlanner: React.FC<StudyPlannerProps> = ({ selectedSubject }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'calendar' | 'goals' | 'pomodoro' | 'revision'>('overview');
  const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(null);
  const [goals, setGoals] = useState<StudyGoal[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<StudyCalendarEvent[]>([]);
  const [activePomodoroSession, setActivePomodoroSession] = useState<PomodoroSession | null>(null);
  const [revisionItems, setRevisionItems] = useState<RevisionItem[]>([]);
  const [studyStreak, setStudyStreak] = useState<StudyStreak | null>(null);
  const [showCreatePlan, setShowCreatePlan] = useState(false);
  const [showCreateGoal, setShowCreateGoal] = useState(false);
  const [pomodoroTimer, setPomodoroTimer] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && pomodoroTimer > 0) {
      interval = setInterval(() => {
        setPomodoroTimer(prev => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            handlePomodoroComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, pomodoroTimer]);

  const loadData = () => {
    setStudyPlan(studyPlanningService.getActiveStudyPlan());
    setGoals(studyPlanningService.getActiveGoals());
    setStudyStreak(studyPlanningService.getStudyStreak());
    setRevisionItems(studyPlanningService.getDueRevisions());
    
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    setCalendarEvents(studyPlanningService.getCalendarEvents(today, nextWeek));
  };

  const handleCreateStudyPlan = (planData: {
    examDate: Date;
    examType: 'JEE Main' | 'JEE Advanced' | 'NEET' | 'Custom';
    currentLevel: 'Beginner' | 'Intermediate' | 'Advanced';
    weeklyHours: number;
    subjects: { subject: string; currentStrength: number; targetStrength: number }[];
  }) => {
    const newPlan = studyPlanningService.createStudyPlan(
      planData.examDate,
      planData.examType,
      planData.currentLevel,
      planData.weeklyHours,
      planData.subjects
    );
    setStudyPlan(newPlan);
    setShowCreatePlan(false);
    loadData();
  };

  const handleStartPomodoro = (subject: string, topic: string, duration: number = 25) => {
    const session = studyPlanningService.startPomodoroSession(subject, topic, duration);
    setActivePomodoroSession(session);
    setPomodoroTimer(duration * 60);
    setIsTimerRunning(true);
  };

  const handlePomodoroComplete = () => {
    if (activePomodoroSession) {
      studyPlanningService.completePomodoroSession(
        activePomodoroSession.id,
        4, // Default productivity rating
        0, // Default distractions
        'Completed successfully'
      );
      setActivePomodoroSession(null);
      loadData();
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressColor = (percentage: number): string => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-yellow-500';
    if (percentage >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const StudyPlanCreator = () => {
    const [formData, setFormData] = useState({
      examDate: '',
      examType: 'JEE Main' as 'JEE Main' | 'JEE Advanced' | 'NEET' | 'Custom',
      currentLevel: 'Intermediate' as 'Beginner' | 'Intermediate' | 'Advanced',
      weeklyHours: 40,
      subjects: [
        { subject: 'Physics', currentStrength: 5, targetStrength: 8 },
        { subject: 'Chemistry', currentStrength: 6, targetStrength: 8 },
        { subject: 'Mathematics', currentStrength: 4, targetStrength: 8 }
      ]
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      handleCreateStudyPlan({
        ...formData,
        examDate: new Date(formData.examDate)
      });
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Create Study Plan</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Exam Type</label>
                <select
                  value={formData.examType}
                  onChange={(e) => setFormData({...formData, examType: e.target.value as any})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="JEE Main">JEE Main</option>
                  <option value="JEE Advanced">JEE Advanced</option>
                  <option value="NEET">NEET</option>
                  <option value="Custom">Custom</option>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Weekly Hours</label>
                <input
                  type="number"
                  value={formData.weeklyHours}
                  onChange={(e) => setFormData({...formData, weeklyHours: parseInt(e.target.value)})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  min="10"
                  max="80"
                />
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-3">Subject Strengths (1-10 scale)</h3>
              <div className="space-y-3">
                {formData.subjects.map((subject, index) => (
                  <div key={subject.subject} className="grid grid-cols-3 gap-4 items-center">
                    <span className="font-medium">{subject.subject}</span>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Current</label>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={subject.currentStrength}
                        onChange={(e) => {
                          const newSubjects = [...formData.subjects];
                          newSubjects[index].currentStrength = parseInt(e.target.value);
                          setFormData({...formData, subjects: newSubjects});
                        }}
                        className="w-full"
                      />
                      <span className="text-xs text-gray-500">{subject.currentStrength}/10</span>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Target</label>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={subject.targetStrength}
                        onChange={(e) => {
                          const newSubjects = [...formData.subjects];
                          newSubjects[index].targetStrength = parseInt(e.target.value);
                          setFormData({...formData, subjects: newSubjects});
                        }}
                        className="w-full"
                      />
                      <span className="text-xs text-gray-500">{subject.targetStrength}/10</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowCreatePlan(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Plan
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const OverviewTab = () => {
    const analytics = studyPlanningService.getStudyAnalytics();
    
    return (
      <div className="space-y-6">
        {/* Study Plan Status */}
        {studyPlan ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Current Study Plan</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                studyPlan.examType === 'JEE Main' ? 'bg-blue-100 text-blue-800' :
                studyPlan.examType === 'JEE Advanced' ? 'bg-purple-100 text-purple-800' :
                studyPlan.examType === 'NEET' ? 'bg-green-100 text-green-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {studyPlan.examType}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-lg font-bold text-blue-600">
                  {Math.ceil((studyPlan.examDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
                </div>
                <div className="text-sm text-gray-600">Days to Exam</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-lg font-bold text-green-600">{studyPlan.weeklyHours}h</div>
                <div className="text-sm text-gray-600">Weekly Target</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-lg font-bold text-purple-600">{studyPlan.currentLevel}</div>
                <div className="text-sm text-gray-600">Current Level</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Study Plan Yet</h3>
            <p className="text-gray-600 mb-4">Create a personalized study plan to get started</p>
            <button
              onClick={() => setShowCreatePlan(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Create Study Plan
            </button>
          </div>
        )}

        {/* Study Streak */}
        {studyStreak && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Award className="h-6 w-6 text-orange-500" />
              <h3 className="text-lg font-semibold text-gray-900">Study Streak</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{studyStreak.currentStreak}</div>
                <div className="text-sm text-gray-600">Current Streak</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{studyStreak.longestStreak}</div>
                <div className="text-sm text-gray-600">Best Streak</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{studyStreak.totalStudyDays}</div>
                <div className="text-sm text-gray-600">Total Days</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{studyStreak.weeklyGoal}</div>
                <div className="text-sm text-gray-600">Weekly Goal</div>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Overview */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <BarChart3 className="h-6 w-6 text-blue-500" />
            <h3 className="text-lg font-semibold text-gray-900">Study Analytics</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-lg font-bold text-blue-600">{Math.round(analytics.totalStudyTime / 60)}h</div>
              <div className="text-sm text-gray-600">Total Study Time</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-lg font-bold text-green-600">{analytics.averageSessionDuration}m</div>
              <div className="text-sm text-gray-600">Avg Session</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-lg font-bold text-purple-600">{analytics.mostStudiedSubject}</div>
              <div className="text-sm text-gray-600">Top Subject</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-lg font-bold text-orange-600">{analytics.weeklyProgress}%</div>
              <div className="text-sm text-gray-600">Weekly Progress</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-lg font-bold text-red-600">{analytics.productivityScore}%</div>
              <div className="text-sm text-gray-600">Productivity</div>
            </div>
          </div>
        </div>

        {/* Active Goals */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Target className="h-6 w-6 text-green-500" />
              <h3 className="text-lg font-semibold text-gray-900">Active Goals</h3>
            </div>
            <button
              onClick={() => setShowCreateGoal(true)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Add Goal
            </button>
          </div>
          <div className="space-y-3">
            {goals.slice(0, 3).map((goal) => (
              <div key={goal.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{goal.title}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getProgressColor((goal.currentValue / goal.targetValue) * 100)}`}
                        style={{ width: `${Math.min(100, (goal.currentValue / goal.targetValue) * 100)}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600">
                      {goal.currentValue}/{goal.targetValue} {goal.unit}
                    </span>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  goal.priority === 'critical' ? 'bg-red-100 text-red-800' :
                  goal.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                  goal.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {goal.priority}
                </span>
              </div>
            ))}
            {goals.length === 0 && (
              <p className="text-gray-500 text-center py-4">No active goals. Create one to get started!</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  const PomodoroTab = () => (
    <div className="space-y-6">
      {/* Active Pomodoro Session */}
      {activePomodoroSession ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-center">
            <div className="bg-red-100 p-4 rounded-full inline-block mb-4">
              <Timer className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {activePomodoroSession.subject} - {activePomodoroSession.topic}
            </h3>
            <div className="text-6xl font-bold text-red-600 mb-4">
              {formatTime(pomodoroTimer)}
            </div>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className={`px-6 py-3 rounded-lg font-medium ${
                  isTimerRunning 
                    ? 'bg-yellow-600 text-white hover:bg-yellow-700' 
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {isTimerRunning ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </button>
              <button
                onClick={() => {
                  setActivePomodoroSession(null);
                  setIsTimerRunning(false);
                  setPomodoroTimer(0);
                }}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <RotateCcw className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-center">
            <Timer className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Start a Pomodoro Session</h3>
            <p className="text-gray-600 mb-6">Focus on your studies with timed sessions</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-md mx-auto">
              {['Physics', 'Chemistry', 'Mathematics'].map((subject) => (
                <button
                  key={subject}
                  onClick={() => handleStartPomodoro(subject, 'General Study')}
                  className="p-4 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                >
                  <div className="font-medium text-gray-900">{subject}</div>
                  <div className="text-sm text-gray-600">25 min session</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Pomodoro Settings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Settings className="h-6 w-6 text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-900">Pomodoro Settings</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Work Duration</label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
              <option value="25">25 minutes</option>
              <option value="45">45 minutes</option>
              <option value="50">50 minutes</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Short Break</label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
              <option value="5">5 minutes</option>
              <option value="10">10 minutes</option>
              <option value="15">15 minutes</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Long Break</label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
              <option value="15">15 minutes</option>
              <option value="20">20 minutes</option>
              <option value="30">30 minutes</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const RevisionTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <RotateCcw className="h-6 w-6 text-purple-500" />
          <h3 className="text-lg font-semibold text-gray-900">Due for Revision</h3>
        </div>
        <div className="space-y-3">
          {revisionItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{item.concept}</h4>
                <p className="text-sm text-gray-600">{item.subject} - {item.topic}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 bg-purple-500 rounded-full"
                      style={{ width: `${item.masteryLevel}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">{item.masteryLevel}% mastered</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  item.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                  item.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {item.difficulty}
                </span>
                <button
                  onClick={() => {
                    // Simulate review with random quality
                    const quality = Math.floor(Math.random() * 3) + 3; // 3-5 quality
                    studyPlanningService.reviewItem(item.id, quality);
                    loadData();
                  }}
                  className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700"
                >
                  Review
                </button>
              </div>
            </div>
          ))}
          {revisionItems.length === 0 && (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">All caught up!</h4>
              <p className="text-gray-600">No items due for revision right now.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Study Planner</h1>
                <p className="text-gray-600">Personalized study scheduling and time management</p>
              </div>
            </div>
            {!studyPlan && (
              <button
                onClick={() => setShowCreatePlan(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Create Plan</span>
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="flex space-x-8 px-6">
            {[
              { id: 'overview', name: 'Overview', icon: BarChart3 },
              { id: 'calendar', name: 'Calendar', icon: Calendar },
              { id: 'goals', name: 'Goals', icon: Target },
              { id: 'pomodoro', name: 'Pomodoro', icon: Timer },
              { id: 'revision', name: 'Revision', icon: RotateCcw }
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
        {activeTab === 'pomodoro' && <PomodoroTab />}
        {activeTab === 'revision' && <RevisionTab />}

        {/* Modals */}
        {showCreatePlan && <StudyPlanCreator />}
      </div>
    </div>
  );
};

export default StudyPlanner;