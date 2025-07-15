import React from 'react';
import { Atom, FlaskConical, Dna, Calculator, Target, Brain, Zap, Star, Users, Award, BookOpen, Clock, TrendingUp, CheckCircle } from 'lucide-react';
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

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Learning',
    description: 'Advanced AI that adapts to your learning style and provides personalized explanations',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100'
  },
  {
    icon: Target,
    title: 'JEE/NEET Focused',
    description: 'Specifically designed for competitive exam preparation with targeted content',
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  },
  {
    icon: BookOpen,
    title: 'Comprehensive Database',
    description: '500+ past JEE/NEET questions with detailed solutions and explanations',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100'
  },
  {
    icon: Zap,
    title: '24/7 Available',
    description: 'Get instant help anytime, anywhere with our always-on AI tutor',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100'
  },
  {
    icon: TrendingUp,
    title: 'Progress Tracking',
    description: 'Monitor your improvement with detailed analytics and performance insights',
    color: 'text-pink-600',
    bgColor: 'bg-pink-100'
  },
  {
    icon: Users,
    title: 'Study Planning',
    description: 'Personalized study schedules and goal setting for optimal preparation',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100'
  }
];

const stats = [
  { number: '10,000+', label: 'Students Helped', icon: Users },
  { number: '500+', label: 'Practice Questions', icon: BookOpen },
  { number: '95%', label: 'Success Rate', icon: Award },
  { number: '24/7', label: 'AI Support', icon: Clock }
];

const testimonials = [
  {
    name: 'Arjun Sharma',
    exam: 'JEE Main 2024',
    score: 'AIR 1,247',
    text: 'The AI tutor helped me understand complex physics concepts that I struggled with for months. The personalized explanations made all the difference!',
    avatar: '👨‍🎓'
  },
  {
    name: 'Priya Patel',
    exam: 'NEET 2024',
    score: 'AIR 892',
    text: 'Amazing platform! The biology section is incredibly detailed and the practice questions are exactly like the real exam.',
    avatar: '👩‍🎓'
  },
  {
    name: 'Rohit Kumar',
    exam: 'JEE Advanced 2024',
    score: 'AIR 2,156',
    text: 'The step-by-step solutions and adaptive learning really boosted my confidence. Highly recommend for serious JEE preparation!',
    avatar: '👨‍💻'
  }
];

const SubjectSelector: React.FC<SubjectSelectorProps> = ({ onSelectSubject }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-green-400/20 to-blue-600/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <div className="container mx-auto px-4 pt-16 pb-12">
          <div className="text-center mb-16">
            {/* Logo */}
            <div className="inline-flex items-center space-x-4 mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-lg opacity-75"></div>
                <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-2xl">
                  <Atom className="h-10 w-10 text-white" />
                </div>
              </div>
              <div className="text-left">
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
                  JEE/NEET AI Tutor
                </h1>
                <p className="text-xl text-gray-600 font-medium">Your Personal Learning Assistant</p>
              </div>
            </div>

            {/* Hero Text */}
            <div className="max-w-4xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Master JEE & NEET with
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> AI-Powered </span>
                Learning
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Get personalized tutoring, instant doubt solving, and comprehensive exam preparation 
                with our advanced AI that understands your learning style.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                <button className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  <span className="relative z-10">Start Learning Now</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
                <button className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-blue-500 hover:text-blue-600 transition-all duration-300">
                  Watch Demo
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Trusted by 10,000+ students</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>4.9/5 rating</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="h-4 w-4 text-blue-500" />
                  <span>95% success rate</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                    <Icon className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                    <div className="text-3xl font-bold text-gray-900 mb-1">{stat.number}</div>
                    <div className="text-gray-600 font-medium">{stat.label}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Subject Cards */}
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-center text-gray-900 mb-4">Choose Your Subject</h3>
            <p className="text-xl text-gray-600 text-center mb-12">Start your personalized learning journey</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {subjects.map((subject) => {
                const IconComponent = iconMap[subject.icon as keyof typeof iconMap];
                
                return (
                  <button
                    key={subject.id}
                    onClick={() => onSelectSubject(subject)}
                    className="group relative overflow-hidden bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-500 hover:scale-105"
                  >
                    {/* Gradient overlay on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${subject.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                    
                    <div className="relative z-10 flex items-center space-x-6">
                      <div className={`p-4 rounded-2xl bg-white shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                        <IconComponent className={`h-10 w-10 ${subject.color}`} />
                      </div>
                      <div className="text-left flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-gray-800">
                          {subject.name}
                        </h3>
                        <p className="text-gray-600 group-hover:text-gray-700 transition-colors">
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
          </div>

          {/* Features Section */}
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-center text-gray-900 mb-4">Why Choose Our AI Tutor?</h3>
            <p className="text-xl text-gray-600 text-center mb-12">Advanced features designed for your success</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="group">
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 group-hover:scale-105 h-full">
                      <div className={`${feature.bgColor} p-4 rounded-2xl inline-block mb-6 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className={`h-8 w-8 ${feature.color}`} />
                      </div>
                      <h4 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h4>
                      <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Testimonials Section */}
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-center text-gray-900 mb-4">Success Stories</h3>
            <p className="text-xl text-gray-600 text-center mb-12">Hear from students who achieved their dreams</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="group">
                  <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 group-hover:scale-105 h-full">
                    <div className="flex items-center mb-6">
                      <div className="text-4xl mr-4">{testimonial.avatar}</div>
                      <div>
                        <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                        <p className="text-sm text-gray-600">{testimonial.exam}</p>
                        <p className="text-sm font-semibold text-green-600">{testimonial.score}</p>
                      </div>
                    </div>
                    <p className="text-gray-700 italic leading-relaxed">"{testimonial.text}"</p>
                    <div className="flex text-yellow-400 mt-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Final CTA Section */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10">
                <h3 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Learning?</h3>
                <p className="text-xl mb-8 opacity-90">Join thousands of successful students and start your journey today</p>
                <button className="bg-white text-blue-600 font-bold px-8 py-4 rounded-xl hover:bg-gray-100 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                  Get Started for Free
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectSelector;