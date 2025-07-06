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

When a student uploads a file (image, PDF, or document), acknowledge the upload and provide detailed analysis of the content.

IMPORTANT: When you identify new concepts or topics in the student's question that aren't in their current learning path, you should mention these concepts clearly so they can be automatically added to their personalized learning path.

Format your responses with proper markdown for better readability:
- Use **bold** for important terms
- Use bullet points for lists
- Use numbered lists for step-by-step solutions
- Use code blocks for formulas when appropriate
- Use emojis sparingly but effectively for engagement`;

export const generateTutorResponse = async (
  subject: Subject,
  question: string,
  conversationHistory: string[] = [],
  fileContent?: string,
  targetDifficulty?: 'Easy' | 'Medium' | 'Hard'
): Promise<{ response: string; analysis: QuestionAnalysis; suggestedDifficulty: 'Easy' | 'Medium' | 'Hard' }> => {
  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 2048,
      }
    });
    
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
      ? `**Previous conversation:**\n${conversationHistory.slice(-4).join('\n')}\n\n`
      : '';

    // Include file content if provided
    const fileContext = fileContent 
      ? `**Uploaded content analysis:**\n${fileContent}\n\n`
      : '';

    // Add adaptive learning context
    let adaptiveContext = `
**Student Progress Context:**
- **Current Level:** ${analytics.level}
- **Accuracy Rate:** ${analytics.accuracy}%
- **Current Streak:** ${analytics.streak}
- **Total Questions:** ${analytics.totalQuestions}
- **Target Difficulty:** ${difficulty}
- **Weak Areas:** ${progress.weakAreas.join(', ') || 'None identified yet'}
- **Strong Areas:** ${progress.strongAreas.join(', ') || 'Building foundation'}
`;

    // Add learning path context if available
    if (currentPath) {
      const pathAnalytics = learningPathService.getPathAnalytics(currentPath.id);
      adaptiveContext += `
**Learning Path Context:**
- **Overall Progress:** ${Math.round(currentPath.overallProgress)}%
- **Completed Topics:** ${currentPath.completedNodes.length}/${currentPath.nodes.length}
- **Current Focus Areas:** ${currentPath.weakAreas.join(', ') || 'Balanced learning'}
- **Recommended Next Topics:** ${pathAnalytics.recommendations.slice(0, 3).map(r => r.title).join(', ')}

When relevant, suggest specific topics from their learning path or identify prerequisite concepts they should review.
`;
    }

    adaptiveContext += `
Please adapt your response to match the student's current level and target difficulty. Provide personalized recommendations based on their learning path progress.

**IMPORTANT:** If you identify any new concepts or topics in the student's question that would benefit their learning, mention them clearly in your response so they can be added to their learning path automatically.
`;

    const prompt = `${TUTOR_SYSTEM_PROMPT}

${adaptiveContext}

**Subject:** ${subject.name}
${context}${fileContext}**Student Question:** ${question}

Please provide a helpful, conversational response appropriate for their ${analytics.level} level. Target difficulty should be ${difficulty}. Be encouraging and educational. If relevant, reference their learning path progress and suggest specific next steps. Clearly mention any new concepts or topics that should be added to their learning path.

Use proper markdown formatting for better readability.`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    // Extract concepts from the response and question for learning path integration
    const conceptExtractionPrompt = `Analyze this ${subject.name} question and AI tutor response to identify key concepts that should be added to the student's learning path:

**Question:** "${question}"
**Response:** "${response.substring(0, 1000)}..."

Extract and list the main concepts, topics, and subtopics mentioned. Format as a JSON array of strings:
["concept1", "concept2", "concept3"]

Focus on specific, actionable topics that can be studied, not general statements. Limit to 5 most important concepts.`;

    let identifiedConcepts: string[] = [];
    try {
      const conceptResult = await model.generateContent(conceptExtractionPrompt);
      const conceptText = conceptResult.response.text();
      const jsonMatch = conceptText.match(/\[[\s\S]*?\]/);
      if (jsonMatch) {
        identifiedConcepts = JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.warn('Could not extract concepts:', error);
    }

    // Add topics to learning path if concepts were identified
    if (currentPath && identifiedConcepts.length > 0) {
      try {
        await learningPathService.addTopicFromQuestion(
          currentPath.id,
          question,
          identifiedConcepts,
          difficulty
        );
      } catch (error) {
        console.warn('Could not add topics to learning path:', error);
      }
    }

    // Generate analysis with adaptive considerations and learning path integration
    const analysisPrompt = `Analyze this ${subject.name} question for JEE/NEET preparation: "${question}"
${fileContent ? `\nContext from uploaded file: ${fileContent.substring(0, 500)}...` : ''}

**Student Context:**
- Level: ${analytics.level}
- Current Accuracy: ${analytics.accuracy}%
- Target Difficulty: ${difficulty}
${currentPath ? `- Learning Path Progress: ${Math.round(currentPath.overallProgress)}%` : ''}

Provide analysis in this exact JSON format (ensure valid JSON):
{
  "concepts": ["concept1", "concept2", "concept3"],
  "complexityLevel": 3,
  "complexityJustification": "explanation considering student level and learning path",
  "examRelevance": "how this relates to JEE/NEET for their level",
  "commonTraps": ["trap1", "trap2"],
  "realWorldApplications": ["application1", "application2"],
  "furtherStudy": ["topic1", "topic2"],
  "progressNote": "personalized study recommendations based on their progress and learning path"
}

Ensure the response is valid JSON only, no additional text.`;

    const analysisResult = await model.generateContent(analysisPrompt);
    let analysis: QuestionAnalysis;
    
    try {
      const analysisText = analysisResult.response.text();
      // Clean the response to extract only JSON
      const cleanedText = analysisText.replace(/```json\n?|\n?```/g, '').trim();
      const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in analysis response');
      }
    } catch (error) {
      console.warn('Analysis parsing failed:', error);
      // Fallback analysis if parsing fails
      analysis = {
        concepts: identifiedConcepts.length > 0 ? identifiedConcepts : [subject.name + ' concepts'],
        complexityLevel: difficulty === 'Easy' ? 2 : difficulty === 'Medium' ? 3 : 4,
        complexityJustification: `${difficulty} level question appropriate for ${analytics.level} student`,
        examRelevance: 'This topic is important for JEE/NEET examinations and appears frequently in competitive exams',
        commonTraps: ['Pay attention to units and signs', 'Verify your final answer'],
        realWorldApplications: ['Applied in engineering and medical fields', 'Used in scientific research'],
        furtherStudy: ['Practice more problems in this area', 'Review related concepts'],
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
    
    // Enhanced fallback response
    return {
      response: `I understand you're asking about **${subject.name}**. While I'm having trouble connecting to my advanced AI right now, I can still help! 

Could you try:
- **Rephrasing your question** or breaking it down into smaller parts
- **Uploading an image** if you have a specific problem
- **Describing the specific concept** you're struggling with

I'm here to support your **JEE/NEET preparation** journey! 🚀`,
      analysis: {
        concepts: [subject.name],
        complexityLevel: 3,
        complexityJustification: 'Unable to analyze due to connection issue',
        examRelevance: 'Important for JEE/NEET preparation',
        commonTraps: ['Ensure clear understanding of fundamentals'],
        realWorldApplications: ['Widely applicable in science and engineering'],
        furtherStudy: ['Review basic concepts and practice problems'],
        progressNote: 'Keep practicing and asking questions - consistency is key to success!'
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
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.8,
        topP: 0.9,
        maxOutputTokens: 512,
      }
    });
    
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

**Student Progress Context:**
- Current Level: ${progress.currentLevel}
- Accuracy Rate: ${progress.accuracyRate.toFixed(1)}%
- Weak Areas: ${progress.weakAreas.join(', ') || 'None identified'}
- Strong Areas: ${progress.strongAreas.join(', ') || 'Building foundation'}
${currentPath ? `- Learning Path Progress: ${Math.round(currentPath.overallProgress)}%` : ''}

**Learning Path Recommendations:**
${pathRecommendations.join('\n')}

Generate 3 adaptive follow-up questions that would help the student improve based on their current level, performance, and learning path. Make them specific and relevant to JEE/NEET preparation.

Consider:
1. If they have weak areas, suggest questions targeting those concepts
2. If they're doing well, suggest slightly more challenging questions
3. Include a mix of conceptual and problem-solving questions
4. Reference their learning path progress when relevant

Format as a simple numbered list:
1. Question 1
2. Question 2  
3. Question 3

Keep each question under 15 words and make them engaging.`;

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
    
    // Ultimate fallback suggestions
    return [
      `Explain key ${subject.name} concepts for JEE/NEET`,
      `What are common mistakes in this topic?`,
      `How does this relate to exam questions?`
    ];
  }
};