import { visionService, VisionTextResult } from './visionService';

// File processing service for handling uploaded files
export interface ProcessedFileContent {
  text: string;
  type: 'image' | 'pdf' | 'text';
  fileName: string;
  confidence?: number;
  mathContent?: {
    hasMath: boolean;
    mathIndicators: string[];
    confidence: number;
  };
  originalText?: string; // Store original OCR text before cleaning
}

export const processUploadedFile = async (file: File): Promise<ProcessedFileContent> => {
  return new Promise(async (resolve, reject) => {
    try {
      if (file.type.startsWith('image/')) {
        // Process image with Google Cloud Vision API
        try {
          const visionResult: VisionTextResult = await visionService.extractTextFromImage(file);
          
          // Clean the extracted text
          const cleanedText = visionService.cleanExtractedText(visionResult.text);
          
          // Detect mathematical content
          const mathContent = visionService.detectMathContent(cleanedText);
          
          // Create enhanced prompt for AI
          let enhancedText = `[Image Analysis Results]\n`;
          enhancedText += `File: ${file.name}\n`;
          enhancedText += `Text Extraction Confidence: ${(visionResult.confidence * 100).toFixed(1)}%\n`;
          
          if (mathContent.hasMath) {
            enhancedText += `Mathematical Content Detected: ${mathContent.mathIndicators.join(', ')}\n`;
            enhancedText += `Math Confidence: ${(mathContent.confidence * 100).toFixed(1)}%\n`;
          }
          
          enhancedText += `\nExtracted Text:\n${cleanedText}\n\n`;
          enhancedText += `Please help me understand and solve the problems shown in this image. `;
          
          if (mathContent.hasMath) {
            enhancedText += `I can see this contains mathematical content including ${mathContent.mathIndicators.join(', ')}. `;
            enhancedText += `Please provide step-by-step solutions and explanations for any problems or concepts shown.`;
          } else {
            enhancedText += `Please explain the concepts and provide detailed answers to any questions shown.`;
          }

          resolve({
            text: enhancedText,
            type: 'image',
            fileName: file.name,
            confidence: visionResult.confidence,
            mathContent,
            originalText: visionResult.text
          });
          
        } catch (visionError) {
          console.error('Vision API error:', visionError);
          
          // Fallback to basic image handling
          const fallbackText = `[Image uploaded: ${file.name}]\n\n` +
            `I can see you've uploaded an image, but I'm having trouble reading the text from it. ` +
            `This could be due to:\n` +
            `• Image quality or resolution issues\n` +
            `• Handwritten text that's difficult to recognize\n` +
            `• Missing Google Cloud Vision API configuration\n\n` +
            `Please try:\n` +
            `1. Describing the problem or question in text\n` +
            `2. Uploading a clearer image\n` +
            `3. Typing out the specific parts you need help with\n\n` +
            `Error details: ${visionError instanceof Error ? visionError.message : 'Unknown error'}`;

          resolve({
            text: fallbackText,
            type: 'image',
            fileName: file.name,
            confidence: 0
          });
        }
        
      } else if (file.type === 'application/pdf') {
        // For PDFs, we'll provide a placeholder
        // In a real implementation, you'd use a PDF parsing library
        resolve({
          text: `[PDF uploaded: ${file.name}]\n\nI can see you've uploaded a PDF document. Please describe the specific questions or problems you'd like help with from this document, or consider converting the relevant pages to images for better text recognition.`,
          type: 'pdf',
          fileName: file.name
        });
        
      } else if (file.type === 'text/plain') {
        // For text files, read the content directly
        const reader = new FileReader();
        
        reader.onload = (event) => {
          const textContent = event.target?.result as string;
          
          // Detect mathematical content in text files too
          const mathContent = visionService.detectMathContent(textContent);
          
          resolve({
            text: textContent,
            type: 'text',
            fileName: file.name,
            confidence: 1.0,
            mathContent
          });
        };
        
        reader.onerror = () => {
          reject(new Error('Failed to read text file'));
        };
        
        reader.readAsText(file);
        
      } else {
        reject(new Error('Unsupported file type. Please upload an image (JPG, PNG, GIF, WebP), PDF, or text file.'));
      }
      
    } catch (error) {
      reject(error);
    }
  });
};

// Helper function to validate image quality for OCR
export const validateImageForOCR = (file: File): Promise<{
  isValid: boolean;
  suggestions: string[];
  estimatedQuality: number;
}> => {
  return new Promise((resolve) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      
      const suggestions: string[] = [];
      let qualityScore = 100;
      
      // Check resolution
      if (img.width < 800 || img.height < 600) {
        suggestions.push('Image resolution is low. Try uploading a higher resolution image (at least 800x600).');
        qualityScore -= 20;
      }
      
      // Check aspect ratio (very wide or tall images might have issues)
      const aspectRatio = img.width / img.height;
      if (aspectRatio > 3 || aspectRatio < 0.33) {
        suggestions.push('Image has an unusual aspect ratio. Consider cropping to focus on the text area.');
        qualityScore -= 10;
      }
      
      // Check file size (very small files might be low quality)
      if (file.size < 50000) { // 50KB
        suggestions.push('File size is very small. This might indicate low image quality.');
        qualityScore -= 15;
      }
      
      // Check if image is too large (might cause processing issues)
      if (file.size > 10000000) { // 10MB
        suggestions.push('File size is very large. Consider compressing the image while maintaining text clarity.');
        qualityScore -= 5;
      }
      
      const isValid = qualityScore >= 60;
      
      if (!isValid) {
        suggestions.unshift('For best results with text recognition:');
        suggestions.push('• Ensure text is clearly visible and well-lit');
        suggestions.push('• Avoid blurry or skewed images');
        suggestions.push('• Use high contrast between text and background');
      }
      
      resolve({
        isValid,
        suggestions,
        estimatedQuality: Math.max(0, qualityScore)
      });
    };
    
    img.onerror = () => {
      resolve({
        isValid: false,
        suggestions: ['Unable to analyze image. Please ensure the file is a valid image format.'],
        estimatedQuality: 0
      });
    };
    
    img.src = URL.createObjectURL(file);
  });
};