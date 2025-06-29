import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Clock, Target, Award, BookOpen, Calendar, Activity } from 'lucide-react';
import { Subject } from '../types';

interface AnalyticsProps {
  selectedSubject: Subject | null;
}

interface StudySession {
  id: string;
  subject: string;
  duration: number; // in minutes
  questionsAsked: number;
  date: Date;
  accuracy: number; // percentage
}

interface WeeklyProgress {
  week: string;
  physics: number;
  chemistry: number;
  biology: number;
  mathematics: number;
}

const Analytics: React.FC<AnalyticsProps> = ({ selectedSubject }) => {
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [weeklyProgress, setWeeklyProgress] = useState<WeeklyProgress[]>([]);

  useEffect(() => {
    // Mock data - in a real app, this would come from your backend
    const mockSessions: StudySession[] = [
      { id: '1', subject: 'Physics', duration: 45, questionsAsked: 12, date: new Date(2024, 0, 15), accuracy: 85 },
      { id: '2', subject: 'Chemistry', duration: 30, questionsAsked: 8, date: new Date(2024, 0, 14), accuracy: 92 },
      { id: '3', subject: 'Mathematics', duration: 60, questionsAsked: 15, date: new Date(2024, 0, 13), accuracy: 78 },
      { id: '4', subject: 'Biology', duration: 40, questionsAsked: 10, date: new Date(2024, 0, 12), accuracy: 88 },
      { id: '5', subject: 'Physics', duration: 35, questionsAsked: 9, date: new Date(2024, 0, 11), accuracy: 90 },
    ];

    const mockWeeklyProgress: WeeklyProgress[] = [
      { week: 'Week 1', physics: 75, chemistry: 80, biology: 85, mathematics: 70 },
      { week: 'Week 2', physics: 80, chemistry: 85, biology: 88, mathematics: 75 },
      { week: 'Week 3', physics: 85, chemistry: 90, biology: 90, mathematics: 80 },
      { week: 'Week 4', physics: 88, chemistry: 92, biology: 92, mathematics: 85 },
    ];

    setStudySessions(mockSessions);
    setWeeklyProgress(mockWeeklyProgress);
  }, []);

  const totalStudyTime = studySessions.reduce((total, session) => total + session.duration, 0);
  const totalQuestions = studySessions.reduce((total, session) => total + session.questionsAsked, 0);
  const averageAccuracy = studySessions.reduce((total, session) => total + session.accuracy, 0) / studySessions.length;

  const subjectStats = {
    physics: studySessions.filter(s => s.subject === 'Physics'),
    chemistry: studySessions.filter(s => s.subject === 'Chemistry'),
    biology: studySessions.filter(s => s.subject === 'Biology'),
    mathematics: studySessions.filter(s => s.subject === 'Mathematics'),
  };

  const StatCard = ({ title, value, icon: Icon, color, subtitle }: {
    title: string;
    value: string | number;
    icon: React.ElementType;
    color: string;
    subtitle?: string;
  }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  const ProgressBar = ({ subject, progress, color }: {
    subject: string;
    progress: number;
    color: string;
  }) => (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="font-medium text-gray-700">{subject}</span>
        <span className="text-gray-500">{progress}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${color}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-lg">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Learning Analytics</h1>
              <p className="text-gray-600">Track your JEE/NEET preparation progress</p>
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Study Time"
            value={`${Math.floor(totalStudyTime / 60)}h ${totalStudyTime % 60}m`}
            icon={Clock}
            color="bg-blue-500"
            subtitle="This month"
          />
          <StatCard
            title="Questions Asked"
            value={totalQuestions}
            icon={BookOpen}
            color="bg-green-500"
            subtitle="Total interactions"
          />
          <StatCard
            title="Average Accuracy"
            value={`${Math.round(averageAccuracy)}%`}
            icon={Target}
            color="bg-purple-500"
            subtitle="Across all subjects"
          />
          <StatCard
            title="Study Streak"
            value="7 days"
            icon={Award}
            color="bg-orange-500"
            subtitle="Keep it up!"
          />
        </div>

        {/* Subject-wise Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-6">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Subject Progress</h2>
            </div>
            <div className="space-y-4">
              <ProgressBar subject="Physics" progress={88} color="bg-blue-500" />
              <ProgressBar subject="Chemistry" progress={92} color="bg-green-500" />
              <ProgressBar subject="Biology" progress={92} color="bg-purple-500" />
              <ProgressBar subject="Mathematics" progress={85} color="bg-orange-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Activity className="h-5 w-5 text-green-600" />
              <h2 className="text-lg font-semibold text-gray-900">Weekly Activity</h2>
            </div>
            <div className="space-y-4">
              {weeklyProgress.map((week, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">{week.week}</span>
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full" title={`Physics: ${week.physics}%`} />
                    <div className="w-3 h-3 bg-green-500 rounded-full" title={`Chemistry: ${week.chemistry}%`} />
                    <div className="w-3 h-3 bg-purple-500 rounded-full" title={`Biology: ${week.biology}%`} />
                    <div className="w-3 h-3 bg-orange-500 rounded-full" title={`Mathematics: ${week.mathematics}%`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Sessions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Calendar className="h-5 w-5 text-purple-600" />
            <h2 className="text-lg font-semibold text-gray-900">Recent Study Sessions</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Subject</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Duration</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Questions</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Accuracy</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                </tr>
              </thead>
              <tbody>
                {studySessions.slice(0, 5).map((session) => (
                  <tr key={session.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        session.subject === 'Physics' ? 'bg-blue-100 text-blue-800' :
                        session.subject === 'Chemistry' ? 'bg-green-100 text-green-800' :
                        session.subject === 'Biology' ? 'bg-purple-100 text-purple-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {session.subject}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{session.duration} min</td>
                    <td className="py-3 px-4 text-gray-600">{session.questionsAsked}</td>
                    <td className="py-3 px-4">
                      <span className={`font-medium ${
                        session.accuracy >= 90 ? 'text-green-600' :
                        session.accuracy >= 80 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {session.accuracy}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {session.date.toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Target className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Personalized Recommendations</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <h3 className="font-medium text-gray-900 mb-2">Focus Areas</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Spend more time on Mathematics - lowest accuracy</li>
                <li>• Practice more Physics numerical problems</li>
                <li>• Review Chemistry organic reactions</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <h3 className="font-medium text-gray-900 mb-2">Study Goals</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Maintain 2-hour daily study streak</li>
                <li>• Improve Mathematics accuracy to 90%</li>
                <li>• Complete 5 mock tests this week</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;