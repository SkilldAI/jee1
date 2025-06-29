import React from 'react';
import { Atom, FlaskConical, Dna, Calculator, Target, Brain } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-2xl inline-block mb-6">
            <div className="bg-white p-3 rounded-xl">
              <Atom className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            JEE/NEET AI Tutor
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Your Personal AI Learning Assistant
          </p>
          <p className="text-gray-500">
            Get instant help with Physics, Chemistry, Biology, and Mathematics
          </p>
        </div>

        {/* Subject Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {subjects.map((subject) => {
            const IconComponent = iconMap[subject.icon as keyof typeof iconMap];
            
            return (
              <button
                key={subject.id}
                onClick={() => onSelectSubject(subject)}
                className={`group p-8 rounded-2xl border-2 transition-all duration-300 hover:shadow-xl hover:scale-105 ${subject.bgColor} ${subject.borderColor} hover:border-opacity-50`}
              >
                <div className="flex items-center space-x-6">
                  <div className={`p-4 rounded-xl bg-white shadow-sm group-hover:shadow-md transition-shadow`}>
                    <IconComponent className={`h-8 w-8 ${subject.color}`} />
                  </div>
                  <div className="text-left">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {subject.name}
                    </h3>
                    <p className="text-gray-600">
                      {subject.id === 'physics' && 'Mechanics, Thermodynamics, Optics, and more'}
                      {subject.id === 'chemistry' && 'Organic, Inorganic, Physical Chemistry'}
                      {subject.id === 'biology' && 'Botany, Zoology, Human Physiology'}
                      {subject.id === 'mathematics' && 'Calculus, Algebra, Coordinate Geometry'}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Features */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Why Choose Our AI Tutor?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 p-3 rounded-full inline-block mb-4">
                <Calculator className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Step-by-Step Solutions</h3>
              <p className="text-gray-600 text-sm">
                Get detailed explanations for every problem with clear methodology
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 p-3 rounded-full inline-block mb-4">
                <Target className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">JEE/NEET Focused</h3>
              <p className="text-gray-600 text-sm">
                Tailored specifically for competitive exam preparation
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 p-3 rounded-full inline-block mb-4">
                <Brain className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">24/7 Available</h3>
              <p className="text-gray-600 text-sm">
                Get help anytime, anywhere with instant AI responses
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectSelector;