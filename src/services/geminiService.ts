import { GoogleGenerativeAI } from '@google/generative-ai';
import { Subject, QuestionAnalysis } from '../types';
import { adaptiveLearningService } from './adaptiveLearningService';
import { learningPathService } from './learningPathService';
import { examPaperService } from './examPaperService';

// Connection test function
export const testGeminiConnection = async (): Promise<{
  success: boolean;
  error?: string;
  responseTime?: number;
}> => {
  const startTime = Date.now();
  
  try {
    // Check if API key is configured
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey || apiKey === 'demo-key') {
      return {
        success: false,
        error: 'Gemini API key not configured. Please add VITE_GEMINI_API_KEY to your .env file.'
      };
    }

    // Test with a simple prompt
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 50,
      }
    });

    const result = await model.generateContent('Respond with exactly: "Connection test successful"');
    const response = result.response.text();
    const responseTime = Date.now() - startTime;

    if (response.toLowerCase().includes('connection test successful')) {
      return {
        success: true,
        responseTime
      };
    } else {
      return {
        success: false,
        error: 'Unexpected response from Gemini API'
      };
    }
  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    if (error instanceof Error) {
      let errorMessage = error.message;
      
      // Provide more specific error messages
      if (errorMessage.includes('API_KEY_INVALID')) {
        errorMessage = 'Invalid Gemini API key. Please check your VITE_GEMINI_API_KEY.';
      } else if (errorMessage.includes('PERMISSION_DENIED')) {
        errorMessage = 'Permission denied. Please check your API key permissions.';
      } else if (errorMessage.includes('QUOTA_EXCEEDED')) {
        errorMessage = 'API quota exceeded. Please check your Google AI Studio usage.';
      } else if (errorMessage.includes('Failed to fetch')) {
        errorMessage = 'Network error. Please check your internet connection.';
      }
      
      return {
        success: false,
        error: errorMessage,
        responseTime
      };
    }
    
    return {
      success: false,
      error: 'Unknown error occurred during connection test',
      responseTime
    };
  }
};

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || 'demo-key');

const TUTOR_SYSTEM_PROMPT = `You are an advanced AI tutor specializing in JEE (Joint Entrance Examination) and NEET (National Eligibility cum Entrance Test) subjects, with extensive knowledge in Physics, Chemistry, Biology, and Mathematics. Your primary goal is to provide clear, systematic, and helpful answers to students' questions, tailoring your explanations to the JEE/NEET level.

You have access to:
1. Student's learning progress and personalized learning path data
2. Comprehensive database of past JEE/NEET exam papers (2020-2024)
3. Exam patterns, weightages, and trending topics
4. Similar questions from previous years
5. High-frequency concepts and common question types

When a student asks a question, you should:

1. Provide a clear, conversational response that directly addresses their question
2. Reference similar questions from past JEE/NEET papers when relevant
3. Include step-by-step solutions when applicable
4. Mention key concepts and formulas with exam context
5. Be encouraging and supportive
6. Ask follow-up questions to ensure understanding
7. Relate concepts to exam patterns and real-world applications
8. Show exam statistics and trends when helpful
9. Recommend specific topics from their learning path when relevant
10. Identify knowledge gaps and suggest prerequisite concepts if needed

IMPORTANT: When referencing past exam papers, always mention:
- The specific exam (JEE Main 2024, NEET 2023, etc.)
- Question difficulty and frequency in exams
- Similar questions from other years
- Topic weightage and importance for the exam

Keep your responses conversational but educational. If the question is complex, break it down into digestible parts. Always maintain an encouraging tone and help build the student's confidence.

For mathematical problems, show clear step-by-step solutions. For conceptual questions, provide thorough explanations with examples. Always end with a question or suggestion to keep the conversation going.

When a student uploads a file (image, PDF, or document), acknowledge the upload and provide detailed analysis of the content with references to similar exam questions.

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
    
    // Get exam paper context
    const examPattern = examPaperService.getExamPattern('JEE Main', subject.name) || 
                       examPaperService.getExamPattern('NEET', subject.name);
    
    // Extract concepts from question for finding similar papers
    const questionConcepts = extractConceptsFromQuestion(question, subject.name);
    const similarPapers = examPaperService.getSimilarQuestions(questionConcepts, subject.name, difficulty);
    const trendingQuestions = examPaperService.getTrendingQuestions(subject.name, 3);
    const highFrequencyConcepts = examPaperService.getHighFrequencyConcepts(subject.name);
    
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

    // Add exam paper context
    let examContext = `
**JEE/NEET Exam Context:**
- **High-Frequency Concepts:** ${highFrequencyConcepts.slice(0, 5).join(', ')}
`;

    if (examPattern) {
      examContext += `
- **Exam Pattern (${examPattern.examType}):** ${examPattern.totalQuestions} questions, ${examPattern.totalMarks} marks
- **Topic Weightage:** ${Object.entries(examPattern.topicWeightage).slice(0, 3).map(([topic, weight]) => `${topic} (${weight}%)`).join(', ')}
- **Trending Topics:** ${examPattern.trendingTopics.join(', ')}
`;
    }

    if (similarPapers.length > 0) {
      examContext += `
**Similar Past Exam Questions:**
${similarPapers.slice(0, 3).map(paper => 
  `- **${paper.examType} ${paper.year}** (Q${paper.questionNumber || 'N/A'}): ${paper.question.substring(0, 100)}... [${paper.difficulty} level, Frequency: ${paper.frequency}/10]`
).join('\n')}
`;
    }

    if (trendingQuestions.length > 0) {
      examContext += `
**Recent Trending Questions:**
${trendingQuestions.map(paper => 
  `- **${paper.examType} ${paper.year}**: ${paper.concepts.join(', ')} [${paper.difficulty}]`
).join('\n')}
`;
    }

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
Please adapt your response to match the student's current level and target difficulty. Provide personalized recommendations based on their learning path progress and reference relevant past exam questions.

**IMPORTANT:** 
1. Reference specific past JEE/NEET questions when they relate to the student's question
2. Mention exam patterns, weightages, and frequency of similar questions
3. If you identify any new concepts or topics in the student's question that would benefit their learning, mention them clearly in your response so they can be added to their learning path automatically
4. Always provide exam-specific context and preparation tips
`;

    const prompt = `${TUTOR_SYSTEM_PROMPT}

${adaptiveContext}

${examContext}

**Subject:** ${subject.name}
${context}${fileContext}**Student Question:** ${question}

Please provide a helpful, conversational response appropriate for their ${analytics.level} level. Target difficulty should be ${difficulty}. Be encouraging and educational. Reference relevant past exam questions and patterns. If relevant, reference their learning path progress and suggest specific next steps. Clearly mention any new concepts or topics that should be added to their learning path.

Use proper markdown formatting for better readability and include specific exam references where applicable.`;

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

    // Generate enhanced analysis with exam paper references
    const analysisPrompt = `Analyze this ${subject.name} question for JEE/NEET preparation: "${question}"
${fileContent ? `\nContext from uploaded file: ${fileContent.substring(0, 500)}...` : ''}

**Student Context:**
- Level: ${analytics.level}
- Current Accuracy: ${analytics.accuracy}%
- Target Difficulty: ${difficulty}
${currentPath ? `- Learning Path Progress: ${Math.round(currentPath.overallProgress)}%` : ''}

**Exam Context:**
- High-frequency concepts: ${highFrequencyConcepts.slice(0, 5).join(', ')}
- Similar past questions available: ${similarPapers.length}
- Recent exam trends: ${trendingQuestions.map(p => p.concepts[0]).join(', ')}

Provide analysis in this exact JSON format (ensure valid JSON):
{
  "concepts": ["concept1", "concept2", "concept3"],
  "complexityLevel": 3,
  "complexityJustification": "explanation considering student level, learning path, and exam frequency",
  "examRelevance": "how this relates to JEE/NEET with specific exam references and frequency data",
  "commonTraps": ["trap1", "trap2"],
  "realWorldApplications": ["application1", "application2"],
  "furtherStudy": ["topic1", "topic2"],
  "progressNote": "personalized study recommendations based on progress, learning path, and exam patterns"
}

Ensure the response is valid JSON only, no additional text. Include specific exam references in examRelevance.`;

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
      // Enhanced fallback analysis with exam context
      const examRef = similarPapers.length > 0 ? 
        `Similar to ${similarPapers[0].examType} ${similarPapers[0].year} Q${similarPapers[0].questionNumber}` :
        'Important for JEE/NEET examinations';
      
      analysis = {
        concepts: identifiedConcepts.length > 0 ? identifiedConcepts : [subject.name + ' concepts'],
        complexityLevel: difficulty === 'Easy' ? 2 : difficulty === 'Medium' ? 3 : 4,
        complexityJustification: `${difficulty} level question appropriate for ${analytics.level} student. ${examRef}`,
        examRelevance: `This topic appears frequently in JEE/NEET exams. ${examRef}. High-frequency concepts include: ${highFrequencyConcepts.slice(0, 3).join(', ')}.`,
        commonTraps: ['Pay attention to units and signs', 'Verify your final answer', 'Check for special cases'],
        realWorldApplications: ['Applied in engineering and medical fields', 'Used in scientific research', 'Important for technology development'],
        furtherStudy: ['Practice more problems in this area', 'Review related concepts', 'Solve past year questions'],
        progressNote: `Continue practicing similar problems to build confidence. Current accuracy: ${analytics.accuracy}%. Focus on ${highFrequencyConcepts[0]} as it's high-frequency in exams.${currentPath ? ` Learning path progress: ${Math.round(currentPath.overallProgress)}%` : ''}`
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
    
    // Enhanced fallback response with exam context
    return {
      response: `I understand you're asking about **${subject.name}**. While I'm having trouble connecting to my advanced AI right now, I can still help! 

**📚 Quick Exam Tips:**
- This topic frequently appears in JEE/NEET exams
- Focus on understanding concepts rather than memorization
- Practice with past year questions for better preparation

Could you try:
- **Rephrasing your question** or breaking it down into smaller parts
- **Uploading an image** if you have a specific problem
- **Describing the specific concept** you're struggling with

I'm here to support your **JEE/NEET preparation** journey! 🚀`,
      analysis: {
        concepts: [subject.name],
        complexityLevel: 3,
        complexityJustification: 'Unable to analyze due to connection issue',
        examRelevance: 'Important for JEE/NEET preparation - appears frequently in competitive exams',
        commonTraps: ['Ensure clear understanding of fundamentals', 'Practice with past year questions'],
        realWorldApplications: ['Widely applicable in science and engineering', 'Foundation for advanced studies'],
        furtherStudy: ['Review basic concepts and practice problems', 'Solve previous year questions'],
        progressNote: 'Keep practicing and asking questions - consistency is key to success in competitive exams!'
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
    
    // Get exam paper context
    const questionConcepts = extractConceptsFromQuestion(lastQuestion, subject.name);
    const similarPapers = examPaperService.getSimilarQuestions(questionConcepts, subject.name);
    const trendingQuestions = examPaperService.getTrendingQuestions(subject.name, 2);
    const highFrequencyConcepts = examPaperService.getHighFrequencyConcepts(subject.name);
    
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

**Exam Context:**
- High-frequency concepts: ${highFrequencyConcepts.slice(0, 3).join(', ')}
- Similar past questions: ${similarPapers.length} found
- Recent trending topics: ${trendingQuestions.map(q => q.concepts[0]).join(', ')}

**Learning Path Recommendations:**
${pathRecommendations.join('\n')}

Generate 3 adaptive follow-up questions that would help the student improve based on their current level, performance, learning path, and exam patterns. Make them specific and relevant to JEE/NEET preparation.

Consider:
1. If they have weak areas, suggest questions targeting those concepts
2. If they're doing well, suggest slightly more challenging questions
3. Include references to past exam questions or high-frequency topics
4. Reference their learning path progress when relevant
5. Include exam-specific preparation tips

Format as a simple numbered list:
1. Question 1
2. Question 2  
3. Question 3

Keep each question under 15 words and make them engaging with exam context.`;

    const result = await model.generateContent(prompt);
    const suggestions = result.response.text()
      .split('\n')
      .filter(line => line.trim().match(/^\d+\./))
      .map(line => line.replace(/^\d+\.\s*/, '').trim())
      .slice(0, 3);

    // If AI suggestions are available, use them; otherwise use adaptive suggestions with exam context
    if (suggestions.length > 0) {
      return suggestions;
    } else {
      const examContextSuggestions = [
        `Practice ${highFrequencyConcepts[0]} - high frequency in JEE/NEET`,
        `Solve similar problems from past ${subject.name} papers`,
        `Review ${progress.weakAreas[0] || 'fundamental concepts'} for exam prep`
      ];
      
      return adaptiveSuggestions
        .filter(s => s.type === 'question')
        .map(s => s.content)
        .slice(0, 2)
        .concat(examContextSuggestions.slice(0, 1));
    }
  } catch (error) {
    console.error('Error generating follow-up suggestions:', error);
    
    // Enhanced fallback with exam context
    const highFrequencyConcepts = examPaperService.getHighFrequencyConcepts(subject.name);
    const adaptiveSuggestions = adaptiveLearningService.generateSuggestions(subject);
    const questionSuggestions = adaptiveSuggestions
      .filter(s => s.type === 'question')
      .map(s => s.content);
    
    if (questionSuggestions.length > 0) {
      return questionSuggestions.slice(0, 2).concat([
        `Practice ${highFrequencyConcepts[0]} - appears frequently in exams`
      ]);
    }
    
    // Ultimate fallback suggestions with exam context
    return [
      `Explain key ${subject.name} concepts for JEE/NEET`,
      `Show me past year questions on this topic`,
      `What are exam patterns for ${subject.name}?`
    ];
  }
};

// Helper function to extract concepts from question text
function extractConceptsFromQuestion(question: string, subject: string): string[] {
  const concepts: string[] = [];
  const lowercaseQuestion = question.toLowerCase();
  
  // Subject-specific concept extraction
  if (subject === 'Physics') {
    const physicsTerms = [
      'kinematics', 'dynamics', 'force', 'motion', 'velocity', 'acceleration',
      'energy', 'work', 'power', 'momentum', 'collision', 'rotation',
      'oscillation', 'wave', 'sound', 'light', 'optics', 'electricity',
      'magnetism', 'electromagnetic', 'thermodynamics', 'heat', 'temperature',
      'modern physics', 'quantum', 'nuclear', 'semiconductor'
    ];
    physicsTerms.forEach(term => {
      if (lowercaseQuestion.includes(term)) concepts.push(term);
    });
  } else if (subject === 'Chemistry') {
    const chemistryTerms = [
      'atomic structure', 'periodic table', 'chemical bonding', 'molecular structure',
      'thermodynamics', 'equilibrium', 'kinetics', 'electrochemistry',
      'organic chemistry', 'inorganic chemistry', 'coordination compounds',
      'biomolecules', 'polymers', 'environmental chemistry'
    ];
    chemistryTerms.forEach(term => {
      if (lowercaseQuestion.includes(term)) concepts.push(term);
    });
  } else if (subject === 'Biology') {
    const biologyTerms = [
      'cell biology', 'genetics', 'evolution', 'plant physiology',
      'human physiology', 'reproduction', 'ecology', 'biotechnology',
      'molecular biology', 'diversity', 'classification'
    ];
    biologyTerms.forEach(term => {
      if (lowercaseQuestion.includes(term)) concepts.push(term);
    });
  } else if (subject === 'Mathematics') {
    const mathTerms = [
      'algebra', 'calculus', 'coordinate geometry', 'trigonometry',
      'statistics', 'probability', 'vectors', 'complex numbers',
      'matrices', 'determinants', 'limits', 'derivatives', 'integrals'
    ];
    mathTerms.forEach(term => {
      if (lowercaseQuestion.includes(term)) concepts.push(term);
    });
  }
  
  return concepts.length > 0 ? concepts : [subject.toLowerCase()];
}