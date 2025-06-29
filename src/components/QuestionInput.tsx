import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Subject } from '../types';

interface QuestionInputProps {
  subject: Subject;
  onSubmitQuestion: (question: string) => void;
  isLoading: boolean;
}

const QuestionInput: React.FC<QuestionInputProps> = ({ subject, onSubmitQuestion, isLoading }) => {
  const [question, setQuestion] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim() && !isLoading) {
      onSubmitQuestion(question);
      setQuestion('');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-lg ${subject.bgColor}`}>
          <div className={`h-4 w-4 ${subject.color}`} />
        </div>
        <h2 className="text-lg font-semibold text-gray-900">
          Ask your {subject.name} question
        </h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={`Enter your ${subject.name} question here...`}
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-32"
            disabled={isLoading}
          />
        </div>
        
        <button
          type="submit"
          disabled={!question.trim() || isLoading}
          className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-colors ${
            !question.trim() || isLoading
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
          <span>{isLoading ? 'Analyzing...' : 'Get Answer'}</span>
        </button>
      </form>
    </div>
  );
};

export default QuestionInput;