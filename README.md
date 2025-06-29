# JEE/NEET AI Chat Tutor

A comprehensive AI-powered chat application for JEE and NEET exam preparation, built with React, TypeScript, and Google's Gemini AI.

## Features

- **Interactive Chat Interface**: Real-time conversations with AI tutor
- **Subject-Specific Guidance**: Physics, Chemistry, Biology, and Mathematics
- **Question Analysis**: Detailed breakdown of complexity, concepts, and exam relevance
- **Follow-up Suggestions**: AI-generated questions to deepen understanding
- **Beautiful UI**: Modern, responsive design with subject-specific theming
- **Powered by Gemini AI**: Advanced language model for accurate responses

## Setup

1. **Get Gemini API Key**:
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Copy the API key

2. **Environment Setup**:
   - Copy `.env.example` to `.env`
   - Add your Gemini API key:
     ```
     VITE_GEMINI_API_KEY=your_actual_api_key_here
     ```

3. **Install and Run**:
   ```bash
   npm install
   npm run dev
   ```

## Usage

1. Select your subject (Physics, Chemistry, Biology, or Mathematics)
2. Start chatting with the AI tutor
3. Ask questions, get detailed explanations
4. View question analysis for deeper insights
5. Use follow-up suggestions to explore topics further

## Technologies

- React 18 with TypeScript
- Tailwind CSS for styling
- Google Generative AI (Gemini)
- Lucide React for icons
- Vite for development

## Architecture

- **Components**: Modular React components for chat interface
- **Services**: Gemini AI integration with error handling
- **Types**: TypeScript interfaces for type safety
- **Responsive Design**: Works on desktop and mobile devices

The application provides a comprehensive learning experience with AI-powered tutoring specifically designed for JEE and NEET preparation.