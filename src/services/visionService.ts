// Google Cloud Vision API service for text extraction from images
export interface VisionTextResult {
  text: string;
  confidence: number;
  boundingBoxes?: Array<{
    text: string;
    vertices: Array<{ x: number; y: number }>;
  }>;
}

export class VisionService {
  private static instance: VisionService;
  private apiKey: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_GOOGLE_CLOUD_VISION_API_KEY || '';
  }

  static getInstance(): VisionService {
    if (!VisionService.instance) {
      VisionService.instance = new VisionService();
    }
    return VisionService.instance;
  }

  async extractTextFromImage(imageFile: File): Promise<VisionTextResult> {
    if (!this.apiKey) {
      throw new Error('Google Cloud Vision API key not configured. Please add VITE_GOOGLE_CLOUD_VISION_API_KEY to your .env file.');
    }

    try {
      // Convert image to base64
      const base64Image = await this.fileToBase64(imageFile);
      
      // Remove data URL prefix
      const base64Data = base64Image.split(',')[1];

      // Call Google Cloud Vision API with enhanced configuration
      const response = await fetch(
        `https://vision.googleapis.com/v1/images:annotate?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            requests: [
              {
                image: {
                  content: base64Data,
                },
                features: [
                  {
                    type: 'TEXT_DETECTION',
                    maxResults: 50,
                  },
                  {
                    type: 'DOCUMENT_TEXT_DETECTION',
                    maxResults: 50,
                  },
                ],
                imageContext: {
                  languageHints: ['en', 'hi'], // English and Hindi support
                  textDetectionParams: {
                    enableTextDetectionConfidenceScore: true,
                  },
                },
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Vision API error: ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      const annotations = data.responses[0];

      if (annotations.error) {
        throw new Error(`Vision API error: ${annotations.error.message}`);
      }

      // Extract full text with enhanced processing
      const fullTextAnnotation = annotations.fullTextAnnotation;
      const textAnnotations = annotations.textAnnotations;

      let extractedText = '';
      let confidence = 0;
      const boundingBoxes: Array<{
        text: string;
        vertices: Array<{ x: number; y: number }>;
      }> = [];

      if (fullTextAnnotation) {
        extractedText = fullTextAnnotation.text;
        
        // Calculate average confidence with better accuracy
        const pages = fullTextAnnotation.pages || [];
        let totalConfidence = 0;
        let confidenceCount = 0;

        pages.forEach(page => {
          page.blocks?.forEach(block => {
            if (block.confidence !== undefined) {
              totalConfidence += block.confidence;
              confidenceCount++;
            }
            
            // Also check paragraphs and words for more granular confidence
            block.paragraphs?.forEach(paragraph => {
              if (paragraph.confidence !== undefined) {
                totalConfidence += paragraph.confidence;
                confidenceCount++;
              }
            });
          });
        });

        confidence = confidenceCount > 0 ? totalConfidence / confidenceCount : 0.8;
      } else if (textAnnotations && textAnnotations.length > 0) {
        // Fallback to text annotations
        extractedText = textAnnotations[0].description || '';
        
        // Extract bounding boxes for individual text elements
        textAnnotations.slice(1).forEach(annotation => {
          if (annotation.boundingPoly && annotation.boundingPoly.vertices) {
            boundingBoxes.push({
              text: annotation.description || '',
              vertices: annotation.boundingPoly.vertices,
            });
          }
        });

        confidence = 0.75; // Default confidence for text annotations
      }

      if (!extractedText.trim()) {
        throw new Error('No text found in the image. Please ensure the image contains clear, readable text with good lighting and contrast.');
      }

      // Clean and enhance the extracted text
      const cleanedText = this.cleanExtractedText(extractedText);

      return {
        text: cleanedText,
        confidence: Math.round(confidence * 100) / 100,
        boundingBoxes: boundingBoxes.length > 0 ? boundingBoxes : undefined,
      };

    } catch (error) {
      console.error('Vision API error:', error);
      
      if (error instanceof Error) {
        // Provide more helpful error messages
        if (error.message.includes('API key')) {
          throw new Error('Google Cloud Vision API key is not configured. Please check your environment variables.');
        } else if (error.message.includes('quota')) {
          throw new Error('API quota exceeded. Please try again later or check your Google Cloud billing.');
        } else if (error.message.includes('permission')) {
          throw new Error('API permission denied. Please check your Google Cloud Vision API settings.');
        }
        throw error;
      }
      
      throw new Error('Failed to extract text from image. Please try again with a clearer image.');
    }
  }

  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to convert file to base64'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }

  // Enhanced method to detect mathematical content with better accuracy
  detectMathContent(text: string): {
    hasMath: boolean;
    mathIndicators: string[];
    confidence: number;
  } {
    const mathPatterns = [
      { pattern: /\d+\s*[+\-×÷*/]\s*\d+/g, indicator: 'arithmetic operations', weight: 2 },
      { pattern: /[a-zA-Z]\s*[=]\s*\d+/g, indicator: 'algebraic equations', weight: 3 },
      { pattern: /\b(sin|cos|tan|log|ln|sqrt|integral|derivative|limit|lim)\b/gi, indicator: 'mathematical functions', weight: 4 },
      { pattern: /[∫∑∏√∞±≤≥≠≈∝∆∇αβγδεθλμπσφψω]/g, indicator: 'mathematical symbols', weight: 3 },
      { pattern: /\b(equation|formula|solve|calculate|find|prove|theorem|lemma)\b/gi, indicator: 'mathematical keywords', weight: 2 },
      { pattern: /\d+\s*[°]\s*|\b(angle|triangle|circle|radius|diameter|area|volume)\b/gi, indicator: 'geometric terms', weight: 2 },
      { pattern: /\b(physics|chemistry|biology|mathematics|calculus|algebra|geometry|trigonometry)\b/gi, indicator: 'subject-specific terms', weight: 1 },
      { pattern: /\b(JEE|NEET|IIT|AIIMS|entrance|exam|test|mock)\b/gi, indicator: 'exam-related terms', weight: 1 },
      { pattern: /x\^?\d+|[a-z]\^?\d+|\d+x|\dx/gi, indicator: 'algebraic expressions', weight: 3 },
      { pattern: /\b(matrix|vector|determinant|eigenvalue|derivative|integral)\b/gi, indicator: 'advanced math terms', weight: 4 },
    ];

    const mathIndicators: string[] = [];
    let totalScore = 0;
    let maxPossibleScore = 0;

    mathPatterns.forEach(({ pattern, indicator, weight }) => {
      const matches = text.match(pattern);
      maxPossibleScore += weight;
      
      if (matches) {
        totalScore += Math.min(weight, matches.length * 0.5); // Diminishing returns for multiple matches
        if (!mathIndicators.includes(indicator)) {
          mathIndicators.push(indicator);
        }
      }
    });

    const confidence = maxPossibleScore > 0 ? Math.min(1, totalScore / maxPossibleScore) : 0;
    const hasMath = totalScore > 1; // Threshold for considering content as mathematical

    return {
      hasMath,
      mathIndicators: [...new Set(mathIndicators)], // Remove duplicates
      confidence: Math.round(confidence * 100) / 100,
    };
  }

  // Enhanced method to clean and format extracted text for better AI processing
  cleanExtractedText(text: string): string {
    return text
      // Fix common OCR errors
      .replace(/[|]/g, 'I') // Vertical bars often misread as I
      .replace(/[0O]/g, (match, offset, string) => {
        // Context-aware O/0 correction
        const before = string[offset - 1];
        const after = string[offset + 1];
        if (/\d/.test(before) || /\d/.test(after)) return '0';
        return 'O';
      })
      // Clean up spacing and formatting
      .replace(/\s+/g, ' ')
      .replace(/\n\s*\n/g, '\n')
      .replace(/([.!?])\s*\n/g, '$1\n\n') // Add proper paragraph breaks
      // Fix common mathematical notation
      .replace(/\bx\s*\^\s*(\d+)/g, 'x^$1')
      .replace(/\b(\d+)\s*\^\s*(\d+)/g, '$1^$2')
      .replace(/\b(\d+)\s*\/\s*(\d+)/g, '$1/$2')
      // Fix fractions and mathematical expressions
      .replace(/(\d+)\s+(\d+)\/(\d+)/g, '$1 $2/$3') // Mixed numbers
      .replace(/√\s*(\d+)/g, '√$1')
      // Clean up common OCR artifacts
      .replace(/[""]/g, '"')
      .replace(/['']/g, "'")
      .replace(/…/g, '...')
      // Remove excessive whitespace
      .trim();
  }

  // Method to provide OCR quality assessment and suggestions
  assessImageQuality(text: string, confidence: number): {
    quality: 'excellent' | 'good' | 'fair' | 'poor';
    suggestions: string[];
  } {
    const suggestions: string[] = [];
    let quality: 'excellent' | 'good' | 'fair' | 'poor' = 'excellent';

    if (confidence < 0.5) {
      quality = 'poor';
      suggestions.push('Image quality is low - try better lighting');
      suggestions.push('Ensure text is clearly visible and in focus');
      suggestions.push('Avoid shadows and reflections');
    } else if (confidence < 0.7) {
      quality = 'fair';
      suggestions.push('Image could be clearer - check focus and lighting');
      suggestions.push('Try to minimize background noise');
    } else if (confidence < 0.9) {
      quality = 'good';
      suggestions.push('Good quality - minor improvements possible');
    }

    // Check for potential issues based on text characteristics
    const hasShortWords = text.split(' ').filter(word => word.length < 3).length > text.split(' ').length * 0.3;
    if (hasShortWords) {
      suggestions.push('Many short/fragmented words detected - check image clarity');
    }

    const hasSpecialChars = /[^\w\s\d.,!?;:()\-+*/=<>{}[\]]/g.test(text);
    if (hasSpecialChars && quality !== 'poor') {
      suggestions.push('Mathematical symbols detected - ensure they are clearly visible');
    }

    return { quality, suggestions };
  }
}

export const visionService = VisionService.getInstance();