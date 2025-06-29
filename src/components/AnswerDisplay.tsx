import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Target, BookOpen, TrendingUp, AlertTriangle } from 'lucide-react';
import { TutorResponse, Subject } from '../types';

interface AnswerDisplayProps {
  response: TutorResponse;
  subject: Subject;
}

const AnswerDisplay: React.FC<AnswerDisplayProps> = ({ response, subject }) => {
  const [showBreakdown, setShowBreakdown] = useState(false);

  const ComplexityBar = ({ level }: { level: number }) => (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium">Difficulty:</span>
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full ${
              i <= level ? 'bg-red-500' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      <span className="text-sm text-gray-600">({level}/5)</span>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Main Answer */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className={`${subject.bgColor} ${subject.borderColor} border-l-4 p-4`}>
          <div className="flex items-center space-x-2">
            <Target className={`h-5 w-5 ${subject.color}`} />
            <h3 className="font-semibold text-gray-900">Answer</h3>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Concept */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Core Concept</h4>
            <p className={`p-3 rounded-lg ${subject.bgColor} text-gray-800`}>
              {response.answer.concept}
            </p>
          </div>

          {/* Explanation */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Detailed Explanation</h4>
            <div className="prose prose-sm max-w-none text-gray-700">
              {response.answer.explanation.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-2">{paragraph}</p>
              ))}
            </div>
          </div>

          {/* Key Points */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Key Points</h4>
            <ul className="space-y-2">
              {response.answer.keyPoints.map((point, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <div className={`w-2 h-2 rounded-full ${subject.color.replace('text', 'bg')} mt-2 flex-shrink-0`} />
                  <span className="text-gray-700">{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Further Study */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <h4 className="font-semibold text-blue-900">Further Study Recommendations</h4>
            </div>
            <ul className="space-y-1">
              {response.answer.furtherStudy.map((topic, index) => (
                <li key={index} className="text-blue-800">• {topic}</li>
              ))}
            </ul>
          </div>

          {/* Progress Note */}
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <h4 className="font-semibold text-green-900">Progress & Preparation Note</h4>
            </div>
            <p className="text-green-800">{response.answer.progressNote}</p>
          </div>
        </div>
      </div>

      {/* Question Breakdown (Collapsible) */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <button
          onClick={() => setShowBreakdown(!showBreakdown)}
          className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            <h3 className="font-semibold text-gray-900">Detailed Question Analysis</h3>
          </div>
          {showBreakdown ? (
            <ChevronUp className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          )}
        </button>
        
        {showBreakdown && (
          <div className="p-6 border-t border-gray-200 space-y-6">
            {/* Complexity Level */}
            <div>
              <ComplexityBar level={response.breakdown.complexityLevel} />
              <p className="text-sm text-gray-600 mt-2">{response.breakdown.complexityJustification}</p>
            </div>

            {/* Concepts Involved */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Concepts Involved</h4>
              <div className="flex flex-wrap gap-2">
                {response.breakdown.concepts.map((concept, index) => (
                  <span key={index} className={`px-3 py-1 rounded-full text-sm ${subject.bgColor} ${subject.color}`}>
                    {concept}
                  </span>
                ))}
              </div>
            </div>

            {/* Common Traps */}
            {response.breakdown.commonTraps.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Common Misconceptions</h4>
                <ul className="space-y-1">
                  {response.breakdown.commonTraps.map((trap, index) => (
                    <li key={index} className="text-red-700 bg-red-50 p-2 rounded">⚠️ {trap}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Real World Applications */}
            {response.breakdown.realWorldApplications.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Real-World Applications</h4>
                <ul className="space-y-1">
                  {response.breakdown.realWorldApplications.map((app, index) => (
                    <li key={index} className="text-gray-700">🌍 {app}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Exam Relevance */}
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-semibold text-yellow-900 mb-2">JEE/NEET Exam Relevance</h4>
              <p className="text-yellow-800">{response.breakdown.examRelevance}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnswerDisplay;