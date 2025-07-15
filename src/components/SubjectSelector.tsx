import React from 'react';
import { Atom, FlaskConical, Dna, Calculator } from 'lucide-react';
import { Subject } from '../types';

interface SubjectSelectorProps {
  onSelectSubject: (subject: Subject) => void;
}

const subjects: Subject[] = [
  {
    id: 'physics',
    name: 'Physics',
    icon: 'Atom',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200'
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    icon: 'FlaskConical',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200'
  },
  {
    id: 'biology',
    name: 'Biology',
    icon: 'Dna',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200'
  },
  {
    id: 'mathematics',
    name: 'Mathematics',
    icon: 'Calculator',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200'
  }
];

const iconMap = {
  Atom,
  FlaskConical,
  Dna,
  Calculator
};

const SubjectSelector: React.FC<SubjectSelectorProps> = ({ onSelectSubject }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Subject
          </h1>
          <p className="text-xl text-gray-600">
            Select a subject to start your AI-powered learning session
          </p>
        </div>

        {/* Subject Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {subjects.map((subject) => {
            const IconComponent = iconMap[subject.icon as keyof typeof iconMap];
            
            return (
              <button
                key={subject.id}
                onClick={() => onSelectSubject(subject)}
                className={`group p-8 rounded-xl border-2 ${subject.borderColor} ${subject.bgColor} hover:shadow-lg transition-all duration-300 hover:scale-105 text-left`}
              >
                <div className="flex items-center space-x-6">
                  <div className={`p-4 rounded-lg bg-white shadow-sm group-hover:shadow-md transition-shadow`}>
                    <IconComponent className={`h-8 w-8 ${subject.color}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {subject.name}
                    </h3>
                    <p className="text-gray-600">
                      {subject.id === 'physics' && 'Mechanics, Thermodynamics, Optics, Electromagnetism'}
                      {subject.id === 'chemistry' && 'Organic, Inorganic, Physical Chemistry'}
                      {subject.id === 'biology' && 'Botany, Zoology, Human Physiology, Genetics'}
                      {subject.id === 'mathematics' && 'Calculus, Algebra, Coordinate Geometry, Trigonometry'}
                    </p>
                  </div>
                  <div className="text-gray-400 group-hover:text-gray-600 transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Simple footer note */}
        <div className="text-center mt-12">
          <p className="text-gray-500">
            Powered by advanced AI • Available 24/7 • Personalized learning
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubjectSelector;