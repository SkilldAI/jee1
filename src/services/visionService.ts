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

      // Call Google Cloud Vision API
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

      // Extract full text
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
        
        // Calculate average confidence
        const pages = fullTextAnnotation.pages || [];
        let totalConfidence = 0;
        let confidenceCount = 0;

        pages.forEach(page => {
          page.blocks?.forEach(block => {
            if (block.confidence !== undefined) {
              totalConfidence += block.confidence;
              confidenceCount++;
            }
          });
        });

        confidence = confidenceCount > 0 ? totalConfidence / confidenceCount : 0;
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

        confidence = 0.8; // Default confidence for text annotations
      }

      if (!extractedText.trim()) {
        throw new Error('No text found in the image. Please ensure the image contains clear, readable text.');
      }

      return {
        text: extractedText.trim(),
        confidence: Math.round(confidence * 100) / 100,
        boundingBoxes: boundingBoxes.length > 0 ? boundingBoxes : undefined,
      };

    } catch (error) {
      console.error('Vision API error:', error);
      
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error('Failed to extract text from image. Please try again.');
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

  // Helper method to detect if image likely contains mathematical content
  detectMathContent(text: string): {
    hasMath: boolean;
    mathIndicators: string[];
    confidence: number;
  } {
    const mathPatterns = [
      /\d+\s*[+\-×÷*/]\s*\d+/g, // Basic arithmetic
      /[a-zA-Z]\s*[=]\s*\d+/g, // Variable equations
      /\b(sin|cos|tan|log|ln|sqrt|integral|derivative|limit)\b/gi, // Math functions
      /[∫∑∏√∞±≤≥≠≈∝∆∇]/g, // Math symbols
      /\b(equation|formula|solve|calculate|find|prove)\b/gi, // Math keywords
      /\d+\s*[°]\s*|\b(angle|triangle|circle|radius)\b/gi, // Geometry
      /\b(physics|chemistry|biology|mathematics)\b/gi, // Subject keywords
    ];

    const mathIndicators: string[] = [];
    let totalMatches = 0;

    mathPatterns.forEach((pattern, index) => {
      const matches = text.match(pattern);
      if (matches) {
        totalMatches += matches.length;
        switch (index) {
          case 0: mathIndicators.push('arithmetic operations'); break;
          case 1: mathIndicators.push('algebraic equations'); break;
          case 2: mathIndicators.push('mathematical functions'); break;
          case 3: mathIndicators.push('mathematical symbols'); break;
          case 4: mathIndicators.push('mathematical keywords'); break;
          case 5: mathIndicators.push('geometric terms'); break;
          case 6: mathIndicators.push('subject-specific terms'); break;
        }
      }
    });

    const confidence = Math.min(1, totalMatches / 10); // Normalize to 0-1
    const hasMath = totalMatches > 0;

    return {
      hasMath,
      mathIndicators: [...new Set(mathIndicators)], // Remove duplicates
      confidence,
    };
  }

  // Method to clean and format extracted text for better AI processing
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
      // Clean up spacing
      .replace(/\s+/g, ' ')
      .replace(/\n\s*\n/g, '\n')
      // Fix common mathematical notation
      .replace(/\bx\s*\^\s*(\d+)/g, 'x^$1')
      .replace(/\b(\d+)\s*\^\s*(\d+)/g, '$1^$2')
      .trim();
  }
}

export const visionService = VisionService.getInstance();