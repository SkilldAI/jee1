import { GoogleGenerativeAI } from '@google/generative-ai';
import { Subject, QuestionAnalysis } from '../types';
import { adaptiveLearningService } from './adaptiveLearningService';
import { learningPathService } from './learningPathService';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || 'demo-key');

const TUTOR_SYSTEM_PROMPT = `You are an advanced AI tutor specializing in JEE (Joint Entrance Examination) and NEET (National Eligibility cum Entrance Test) subjects, with extensive knowledge in Physics, Chemistry, Biology, and Mathematics. Your primary goal is to provide clear, systematic, and helpful answers to students' questions, tailoring your explanations to the JEE/NEET level.

You have access to the student's learning progress and personalized learning path data, and should adapt your responses accordingly:
- For beginners: Use simpler language, more examples, step-by-step explanations
- For intermediate: Provide moderate complexity with some advanced concepts
- For advanced: Use technical terminology, complex problem-solving approaches

When a student asks a question, you should:

1. Provide a clear, conversational response that directly addresses their question
2. Use scientific terminology appropriate for their current level
3. Include step-by-step solutions when applicable
4. Mention key concepts and formulas
5. Be encouraging and supportive
6. Ask follow-up questions to ensure understanding
7. Relate concepts to exam patterns and real-world applications
8. Adjust difficulty based on their performance history and learning path progress
9. Recommend specific topics from their learning path when relevant
10. Identify knowledge gaps and suggest prerequisite concepts if needed

Keep your responses conversational but educational. If the question is complex, break it down into digestible parts. Always maintain an encouraging tone and help build the student's confidence.

For mathematical problems, show clear step-by-step solutions. For conceptual questions, provide thorough explanations with examples. Always end with a question or suggestion to keep the conversation going.

When a student uploads a file (image, PDF, or document), acknowledge the upload and ask them to describe what specific help they need with the content.`;

export const generateTutorResponse = async (
  subject: Subject,
  question: string,
  conversationHistory: string[] = [],
  fileContent?: string,
  targetDifficulty?: 'Easy' | 'Medium' | 'Hard'
): Promise<{ response: string; analysis: QuestionAnalysis; suggestedDifficulty: 'Easy' | 'Medium' | 'Hard' }> => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    // Get user progress for adaptive responses
    const progress = adaptiveLearningService.getProgress(subject);
    const analytics = adaptiveLearningService.getPerformanceAnalytics(subject);
    
    // Get learning path data for enhanced recommendations
    const learningPaths = learningPathService.getAllLearningPaths('current-user');
    const currentPath = learningPaths.find(path => path.subject === subject.name);
    
    // Determine appropriate difficulty if not specified
    const difficulty = targetDifficulty || adaptiveLearningService.getNextDifficulty(subject);
    
    // Build conversation context
    const context = conversationHistory.length > 0 
      ? `Previous conversation:\n${conversationHistory.join('\n')}\n\n`
      : '';

    // Include file content if provided
    const fileContext = fileContent 
      ? `Uploaded file content:\n${fileContent}\n\n`
      : '';

    // Add adaptive learning context
    let adaptiveContext = `
Student Progress Context:
- Current Level: ${analytics.level}
- Accuracy Rate: ${analytics.accuracy}%
- Current Streak: ${analytics.streak}
- Total Questions Attempted: ${analytics.totalQuestions}
- Target Difficulty: ${difficulty}
- Weak Areas: ${progress.weakAreas.join(', ') || 'None identified yet'}
- Strong Areas: ${progress.strongAreas.join(', ') || 'Building foundation'}
`;

    // Add learning path context if available
    if (currentPath) {
      const pathAnalytics = learningPathService.getPathAnalytics(currentPath.id);
      adaptiveContext += `
Learning Path Context:
- Overall Progress: ${Math.round(currentPath.overallProgress)}%
- Completed Topics: ${currentPath.completedNodes.length}/${currentPath.nodes.length}
- Current Focus Areas: ${currentPath.weakAreas.join(', ') || 'Balanced learning'}
- Recommended Next Topics: ${pathAnalytics.recommendations.slice(0, 3).map(r => r.title).join(', ')}
- Estimated Completion: ${pathAnalytics.predictedCompletion.toLocaleDateString()}

When relevant, suggest specific topics from their learning path or identify prerequisite concepts they should review.
`;
    }

    adaptiveContext += `
Please adapt your response to match the student's current level and target difficulty. Provide personalized recommendations based on their learning path progress.
`;

    const prompt = `${TUTOR_SYSTEM_PROMPT}

${adaptiveContext}

Subject: ${subject.name}
${context}${fileContext}Student Question: ${question}

Please provide a helpful, conversational response appropriate for their ${analytics.level} level. Target difficulty should be ${difficulty}. Be encouraging and educational. If relevant, reference their learning path progress and suggest specific next steps.`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    // Generate analysis with adaptive considerations and learning path integration
    const analysisPrompt = `Analyze this ${subject.name} question for JEE/NEET preparation: "${question}"
${fileContent ? `\nContext from uploaded file: ${fileContent.substring(0, 500)}...` : ''}

Student Context:
- Level: ${analytics.level}
- Current Accuracy: ${analytics.accuracy}%
- Target Difficulty: ${difficulty}
${currentPath ? `- Learning Path Progress: ${Math.round(currentPath.overallProgress)}%` : ''}

Provide analysis in this JSON format:
{
  "concepts": ["concept1", "concept2"],
  "complexityLevel": 1-5,
  "complexityJustification": "explanation considering student level and learning path",
  "examRelevance": "how this relates to JEE/NEET for their level",
  "commonTraps": ["trap1", "trap2"],
  "realWorldApplications": ["application1", "application2"],
  "furtherStudy": ["topic1", "topic2"],
  "progressNote": "personalized study recommendations based on their progress and learning path"
}`;

    const analysisResult = await model.generateContent(analysisPrompt);
    let analysis: QuestionAnalysis;
    
    try {
      const analysisText = analysisResult.response.text();
      // Extract JSON from the response
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in analysis response');
      }
    } catch (error) {
      // Fallback analysis if parsing fails
      analysis = {
        concepts: [subject.name + ' concepts'],
        complexityLevel: difficulty === 'Easy' ? 2 : difficulty === 'Medium' ? 3 : 4,
        complexityJustification: `${difficulty} level question appropriate for ${analytics.level} student`,
        examRelevance: 'This topic is important for JEE/NEET examinations',
        commonTraps: ['Pay attention to units and signs'],
        realWorldApplications: ['Applied in engineering and medical fields'],
        furtherStudy: ['Practice more problems in this area'],
        progressNote: `Continue practicing similar problems to build confidence. Current accuracy: ${analytics.accuracy}%${currentPath ? ` Learning path progress: ${Math.round(currentPath.overallProgress)}%` : ''}`
      };
    }

    // Update learning path performance if applicable
    if (currentPath) {
      // Find relevant node based on concepts
      const relevantNode = currentPath.nodes.find(node => 
        analysis.concepts.some(concept => 
          node.title.toLowerCase().includes(concept.toLowerCase()) ||
          node.topic.toLowerCase().includes(concept.toLowerCase()) ||
          node.subtopic.toLowerCase().includes(concept.toLowerCase())
        )
      );
      
      if (relevantNode) {
        // Simulate performance update (in real app, this would be based on actual user interaction)
        const simulatedAccuracy = Math.random() * 40 + 60; // 60-100% range
        learningPathService.updatePerformance(
          currentPath.id,
          relevantNode.id,
          30, // 30 minutes
          simulatedAccuracy,
          analysis.complexityLevel
        );
      }
    }

    return { response, analysis, suggestedDifficulty: difficulty };
  } catch (error) {
    console.error('Error generating tutor response:', error);
    
    const fallbackDifficulty = targetDifficulty || 'Medium';
    
    // Fallback response
    return {
      response: `I understand you're asking about ${subject.name}. While I'm having trouble connecting to my advanced AI right now, I can still help! Could you rephrase your question or break it down into smaller parts? I'm here to support your JEE/NEET preparation journey.`,
      analysis: {
        concepts: [subject.name],
        complexityLevel: 3,
        complexityJustification: 'Unable to analyze due to connection issue',
        examRelevance: 'Important for JEE/NEET preparation',
        commonTraps: ['Ensure clear understanding of fundamentals'],
        realWorldApplications: ['Widely applicable in science and engineering'],
        furtherStudy: ['Review basic concepts and practice problems'],
        progressNote: 'Keep practicing and asking questions'
      },
      suggestedDifficulty: fallbackDifficulty
    };
  }
};

export const generateFollowUpSuggestions = async (
  subject: Subject,
  lastQuestion: string
): Promise<string[]> => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    // Get adaptive suggestions
    const adaptiveSuggestions = adaptiveLearningService.generateSuggestions(subject);
    const progress = adaptiveLearningService.getProgress(subject);
    
    // Get learning path recommendations
    const learningPaths = learningPathService.getAllLearningPaths('current-user');
    const currentPath = learningPaths.find(path => path.subject === subject.name);
    let pathRecommendations: string[] = [];
    
    if (currentPath) {
      const pathAnalytics = learningPathService.getPathAnalytics(currentPath.id);
      pathRecommendations = pathAnalytics.recommendations
        .slice(0, 2)
        .map(rec => `Study ${rec.title} - ${rec.reason}`);
    }
    
    const prompt = `Based on this ${subject.name} question: "${lastQuestion}"

Student Progress Context:
- Current Level: ${progress.currentLevel}
- Accuracy Rate: ${progress.accuracyRate.toFixed(1)}%
- Weak Areas: ${progress.weakAreas.join(', ') || 'None identified'}
- Strong Areas: ${progress.strongAreas.join(', ') || 'Building foundation'}
${currentPath ? `- Learning Path Progress: ${Math.round(currentPath.overallProgress)}%` : ''}

Learning Path Recommendations:
${pathRecommendations.join('\n')}

Generate 3 adaptive follow-up questions that would help the student improve based on their current level, performance, and learning path. Make them specific and relevant to JEE/NEET preparation.

Consider:
1. If they have weak areas, suggest questions targeting those concepts
2. If they're doing well, suggest slightly more challenging questions
3. Include a mix of conceptual and problem-solving questions
4. Reference their learning path progress when relevant

Format as a simple list:
1. Question 1
2. Question 2  
3. Question 3`;

    const result = await model.generateContent(prompt);
    const suggestions = result.response.text()
      .split('\n')
      .filter(line => line.trim().match(/^\d+\./))
      .map(line => line.replace(/^\d+\.\s*/, '').trim())
      .slice(0, 3);

    // If AI suggestions are available, use them; otherwise use adaptive suggestions
    if (suggestions.length > 0) {
      return suggestions;
    } else {
      return adaptiveSuggestions
        .filter(s => s.type === 'question')
        .map(s => s.content)
        .slice(0, 3);
    }
  } catch (error) {
    console.error('Error generating follow-up suggestions:', error);
    
    // Use adaptive suggestions as fallback
    const adaptiveSuggestions = adaptiveLearningService.generateSuggestions(subject);
    const questionSuggestions = adaptiveSuggestions
      .filter(s => s.type === 'question')
      .map(s => s.content);
    
    if (questionSuggestions.length > 0) {
      return questionSuggestions.slice(0, 3);
    }
    
    return [
      `Can you explain more about the key concepts in ${subject.name}?`,
      `What are some common mistakes in this type of problem?`,
      `How does this relate to other ${subject.name} topics?`
    ];
  }
};