import React, { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import AuthGuard from './components/AuthGuard';
import Header from './components/Header';
import SubjectSelector from './components/SubjectSelector';
import ChatInterface from './components/ChatInterface';
import MockExams from './components/MockExams';
import StudyPlanner from './components/StudyPlanner';
import Navigation from './components/Navigation';
import { Subject } from './types';

function App() {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [currentPage, setCurrentPage] = useState<'chat' | 'mock-exams' | 'study-planner'>('chat');

  const handleSelectSubject = (subject: Subject) => {
    setSelectedSubject(subject);
  };

  const handleBackToSubjects = () => {
    setSelectedSubject(null);
  };

  const handlePageChange = (page: 'chat' | 'mock-exams' | 'study-planner') => {
    setCurrentPage(page);
    // Reset subject selection when changing pages
    if (page !== 'chat') {
      setSelectedSubject(null);
    }
  };

  return (
    <AuthProvider>
      <AuthGuard>
        <div className="min-h-screen bg-gray-50">
          {/* Show header on all pages except when in chat with a subject */}
          {!(currentPage === 'chat' && selectedSubject) && <Header />}
          
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
          
          {currentPage === 'mock-exams' && (
            <MockExams selectedSubject={selectedSubject} />
          )}
          
          {currentPage === 'study-planner' && (
            <StudyPlanner selectedSubject={selectedSubject?.name} />
          )}
        </div>
      </AuthGuard>
    </AuthProvider>
  );
}

export default App;