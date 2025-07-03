import React, { useState } from 'react';
import Header from './components/Header';
import SubjectSelector from './components/SubjectSelector';
import ChatInterface from './components/ChatInterface';
import Analytics from './components/Analytics';
import MockExams from './components/MockExams';
import StudyPlanner from './components/StudyPlanner';
import LearningPath from './components/LearningPath';
import ContentManagement from './components/ContentManagement';
import Navigation from './components/Navigation';
import { Subject } from './types';

function App() {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [currentPage, setCurrentPage] = useState<'chat' | 'analytics' | 'mock-exams' | 'study-planner' | 'learning-path' | 'content-management'>('chat');

  const handleSelectSubject = (subject: Subject) => {
    setSelectedSubject(subject);
  };

  const handleBackToSubjects = () => {
    setSelectedSubject(null);
  };

  const handlePageChange = (page: 'chat' | 'analytics' | 'mock-exams' | 'study-planner' | 'learning-path' | 'content-management') => {
    setCurrentPage(page);
    // Reset subject selection when changing pages
    if (page !== 'chat') {
      setSelectedSubject(null);
    }
  };

  const handleNavigateToChat = (subjectName: string) => {
    // Find the subject by name and navigate to chat
    const subjects = [
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

    const subject = subjects.find(s => s.name === subjectName);
    if (subject) {
      setSelectedSubject(subject);
      setCurrentPage('chat');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Show header only on subject selection page */}
      {!selectedSubject && currentPage === 'chat' && <Header />}
      
      {/* Show navigation when not in chat with a subject */}
      {!(currentPage === 'chat' && selectedSubject) && (
        <Navigation currentPage={currentPage} onPageChange={handlePageChange} />
      )}
      
      {currentPage === 'chat' && (
        selectedSubject ? (
          <ChatInterface 
            subject={selectedSubject} 
            onBack={handleBackToSubjects}
          />
        ) : (
          <SubjectSelector onSelectSubject={handleSelectSubject} />
        )
      )}
      
      {currentPage === 'analytics' && (
        <Analytics selectedSubject={selectedSubject} />
      )}
      
      {currentPage === 'mock-exams' && (
        <MockExams selectedSubject={selectedSubject} />
      )}
      
      {currentPage === 'study-planner' && (
        <StudyPlanner selectedSubject={selectedSubject?.name} />
      )}
      
      {currentPage === 'learning-path' && (
        <LearningPath 
          selectedSubject={selectedSubject?.name} 
          onNavigateToChat={handleNavigateToChat}
        />
      )}
      
      {currentPage === 'content-management' && (
        <ContentManagement />
      )}
    </div>
  );
}

export default App;