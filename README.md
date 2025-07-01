# JEE/NEET AI Chat Tutor

A comprehensive AI-powered chat application for JEE and NEET exam preparation, built with React, TypeScript, Google's Gemini AI, and Google Cloud Vision API.

## Features

### 🤖 Advanced AI Tutoring
- **Interactive Chat Interface**: Real-time conversations with AI tutor
- **Subject-Specific Guidance**: Physics, Chemistry, Biology, and Mathematics
- **Adaptive Learning**: AI adjusts difficulty based on your performance
- **Question Analysis**: Detailed breakdown of complexity, concepts, and exam relevance
- **Follow-up Suggestions**: AI-generated questions to deepen understanding

### 📸 Smart Image Processing
- **AI Text Recognition**: Upload images of homework, textbooks, or handwritten notes
- **Google Cloud Vision API**: Accurate text extraction from images
- **Mathematical Content Detection**: Automatically identifies math problems and formulas
- **Image Quality Validation**: Tips for better text recognition results
- **Multi-format Support**: JPG, PNG, GIF, WebP, PDF, and text files

### 📊 Comprehensive Analytics
- **Progress Tracking**: Monitor your learning journey across all subjects
- **Performance Analytics**: Accuracy rates, study streaks, and improvement trends
- **Weak Area Identification**: AI identifies concepts that need more practice
- **Study Recommendations**: Personalized suggestions based on your performance

### 📅 Study Planning & Time Management
- **Personalized Study Calendar**: AI-generated schedules based on exam dates and current level
- **Daily/Weekly Goals**: Automatic goal setting with progress tracking
- **Pomodoro Timer**: Focused study sessions with productivity tracking
- **Spaced Repetition**: Intelligent revision scheduler for optimal memory retention

### 🎯 Mock Exams & Practice
- **Comprehensive Mock Tests**: JEE Main, JEE Advanced, and NEET practice tests
- **Chapter-wise Tests**: Focused practice on specific topics
- **Previous Year Papers**: Actual exam papers for realistic practice
- **Detailed Analysis**: Performance breakdown with improvement suggestions

### 🎨 Beautiful UI/UX
- **Modern Design**: Clean, intuitive interface with subject-specific theming
- **Responsive Layout**: Works perfectly on desktop and mobile devices
- **Real-time Feedback**: Instant visual feedback and progress indicators
- **Accessibility**: Designed for optimal user experience

## Setup Instructions

### Prerequisites
1. **Gemini AI API Key**:
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Copy the API key

2. **Google Cloud Vision API Key**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
   - Enable the Vision API
   - Create credentials (API key)
   - Copy the API key

### Installation

1. **Clone and Install**:
   ```bash
   git clone <repository-url>
   cd jee-neet-ai-tutor
   npm install
   ```

2. **Environment Setup**:
   - Copy `.env.example` to `.env`
   - Add your API keys:
     ```
     VITE_GEMINI_API_KEY=your_gemini_api_key_here
     VITE_GOOGLE_CLOUD_VISION_API_KEY=your_google_cloud_vision_api_key_here
     ```

3. **Run the Application**:
   ```bash
   npm run dev
   ```

## Usage Guide

### Getting Started
1. **Select Your Subject**: Choose from Physics, Chemistry, Biology, or Mathematics
2. **Start Learning**: Ask questions directly or upload images of problems
3. **Track Progress**: Monitor your improvement with built-in analytics
4. **Plan Studies**: Use the study planner for structured preparation

### Image Upload Features
- **Homework Help**: Upload photos of textbook problems or homework
- **Handwritten Notes**: AI can read handwritten mathematical expressions
- **Quality Tips**: Get suggestions for better image recognition
- **Math Detection**: Automatic identification of mathematical content

### Adaptive Learning
- **Difficulty Adjustment**: AI automatically adjusts question difficulty
- **Personalized Suggestions**: Get recommendations based on your weak areas
- **Progress Tracking**: Monitor accuracy, streaks, and improvement over time
- **Smart Recommendations**: AI suggests optimal study strategies

### Study Planning
- **Custom Study Plans**: Create plans based on your exam date and current level
- **Goal Setting**: Automatic daily, weekly, and monthly goal creation
- **Time Management**: Pomodoro sessions with productivity tracking
- **Revision Scheduling**: Spaced repetition for optimal memory retention

## Technologies Used

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS for responsive design
- **AI Integration**: Google Generative AI (Gemini)
- **Image Processing**: Google Cloud Vision API
- **Icons**: Lucide React
- **Build Tool**: Vite
- **State Management**: React Hooks

## Architecture

### Component Structure
- **Modular Design**: Clean separation of concerns
- **Reusable Components**: Efficient code organization
- **Type Safety**: Full TypeScript implementation
- **Responsive Design**: Mobile-first approach

### Services
- **Gemini AI Service**: Advanced tutoring and question analysis
- **Vision Service**: Image text extraction and processing
- **Adaptive Learning**: Personalized difficulty adjustment
- **Study Planning**: Comprehensive scheduling and goal management
- **File Processing**: Multi-format file handling

### Key Features Implementation
- **Real-time Chat**: Instant AI responses with typing indicators
- **File Upload**: Drag-and-drop with progress tracking
- **Progress Analytics**: Comprehensive performance tracking
- **Study Tools**: Integrated planning and revision systems

## API Configuration

### Gemini AI Setup
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new project or select existing
3. Generate API key
4. Add to `.env` file

### Google Cloud Vision Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Vision API
4. Create credentials (API key)
5. Add to `.env` file

## Contributing

This application provides a comprehensive learning experience with AI-powered tutoring specifically designed for JEE and NEET preparation. The combination of advanced AI, image processing, and adaptive learning creates a powerful tool for exam success.

## Support

For issues or questions:
1. Check the console for API key configuration errors
2. Ensure image files are clear and well-lit for best text recognition
3. Verify internet connection for AI services
4. Review the README for setup instructions

---

**Built with ❤️ for JEE/NEET aspirants**