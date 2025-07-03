// Content Management Service for bulk content operations
import { EducationalContent, contentService } from './contentService';

export interface ContentImportResult {
  success: boolean;
  imported: number;
  failed: number;
  errors: string[];
}

export interface BulkContentData {
  id: string;
  title: string;
  subject: string;
  topic: string;
  subtopic: string;
  difficulty: string;
  theory?: string;
  examples?: string; // JSON string of examples array
  practiceQuestions?: string; // JSON string of questions array
  keyPoints?: string; // Comma-separated or JSON string
  formulas?: string; // JSON string of formulas array
  estimatedReadTime?: number;
  jeeMainWeightage?: number;
  jeeAdvancedWeightage?: number;
  neetWeightage?: number;
}

export class ContentManagementService {
  private static instance: ContentManagementService;

  static getInstance(): ContentManagementService {
    if (!ContentManagementService.instance) {
      ContentManagementService.instance = new ContentManagementService();
    }
    return ContentManagementService.instance;
  }

  // CSV Import functionality
  async importFromCSV(csvContent: string): Promise<ContentImportResult> {
    const result: ContentImportResult = {
      success: true,
      imported: 0,
      failed: 0,
      errors: []
    };

    try {
      const lines = csvContent.split('\n');
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      
      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        
        try {
          const values = this.parseCSVLine(lines[i]);
          const contentData: BulkContentData = {};
          
          headers.forEach((header, index) => {
            if (values[index]) {
              (contentData as any)[header] = values[index].replace(/"/g, '');
            }
          });

          const educationalContent = this.convertToEducationalContent(contentData);
          contentService.addCustomContent(educationalContent);
          result.imported++;
        } catch (error) {
          result.failed++;
          result.errors.push(`Line ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    } catch (error) {
      result.success = false;
      result.errors.push(`CSV parsing error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return result;
  }

  // JSON Import functionality
  async importFromJSON(jsonContent: string): Promise<ContentImportResult> {
    const result: ContentImportResult = {
      success: true,
      imported: 0,
      failed: 0,
      errors: []
    };

    try {
      const data = JSON.parse(jsonContent);
      const contentArray = Array.isArray(data) ? data : [data];

      for (const [index, item] of contentArray.entries()) {
        try {
          const educationalContent = this.convertToEducationalContent(item);
          contentService.addCustomContent(educationalContent);
          result.imported++;
        } catch (error) {
          result.failed++;
          result.errors.push(`Item ${index + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    } catch (error) {
      result.success = false;
      result.errors.push(`JSON parsing error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return result;
  }

  // Bulk edit functionality
  bulkUpdateContent(updates: Partial<EducationalContent>, filter: {
    subject?: string;
    topic?: string;
    difficulty?: string;
  }): number {
    const allContent = contentService.getAllContent();
    let updatedCount = 0;

    allContent.forEach(content => {
      let shouldUpdate = true;

      if (filter.subject && content.subject !== filter.subject) shouldUpdate = false;
      if (filter.topic && content.topic !== filter.topic) shouldUpdate = false;
      if (filter.difficulty && content.difficulty !== filter.difficulty) shouldUpdate = false;

      if (shouldUpdate) {
        contentService.updateContent(content.id, updates);
        updatedCount++;
      }
    });

    return updatedCount;
  }

  // Export functionality
  exportToCSV(filter?: {
    subject?: string;
    topic?: string;
    difficulty?: string;
  }): string {
    let content = contentService.getAllContent();

    if (filter) {
      content = content.filter(item => {
        if (filter.subject && item.subject !== filter.subject) return false;
        if (filter.topic && item.topic !== filter.topic) return false;
        if (filter.difficulty && item.difficulty !== filter.difficulty) return false;
        return true;
      });
    }

    const headers = [
      'id', 'title', 'subject', 'topic', 'subtopic', 'difficulty',
      'theory', 'examples', 'practiceQuestions', 'keyPoints', 'formulas',
      'estimatedReadTime', 'jeeMainWeightage', 'jeeAdvancedWeightage', 'neetWeightage'
    ];

    const csvLines = [headers.join(',')];

    content.forEach(item => {
      const row = [
        item.id,
        `"${item.title}"`,
        item.subject,
        item.topic,
        item.subtopic,
        item.difficulty,
        `"${item.content.theory?.replace(/"/g, '""') || ''}"`,
        `"${JSON.stringify(item.content.examples || []).replace(/"/g, '""')}"`,
        `"${JSON.stringify(item.content.practiceQuestions || []).replace(/"/g, '""')}"`,
        `"${JSON.stringify(item.content.keyPoints || []).replace(/"/g, '""')}"`,
        `"${JSON.stringify(item.content.formulas || []).replace(/"/g, '""')}"`,
        item.estimatedReadTime,
        item.examRelevance.jeeMain,
        item.examRelevance.jeeAdvanced,
        item.examRelevance.neet
      ];
      csvLines.push(row.join(','));
    });

    return csvLines.join('\n');
  }

  exportToJSON(filter?: {
    subject?: string;
    topic?: string;
    difficulty?: string;
  }): string {
    let content = contentService.getAllContent();

    if (filter) {
      content = content.filter(item => {
        if (filter.subject && item.subject !== filter.subject) return false;
        if (filter.topic && item.topic !== filter.topic) return false;
        if (filter.difficulty && item.difficulty !== filter.difficulty) return false;
        return true;
      });
    }

    return JSON.stringify(content, null, 2);
  }

  // Generate content templates
  generateContentTemplate(type: 'csv' | 'json'): string {
    const sampleContent: BulkContentData = {
      id: 'sample-001',
      title: 'Sample Topic Title',
      subject: 'Physics',
      topic: 'Mechanics',
      subtopic: 'Kinematics',
      difficulty: 'Foundation',
      theory: 'Detailed theory content here...',
      examples: JSON.stringify([
        {
          title: 'Example 1',
          problem: 'Problem statement',
          solution: 'Step-by-step solution',
          explanation: 'Explanation of the solution'
        }
      ]),
      practiceQuestions: JSON.stringify([
        {
          question: 'Sample question?',
          options: ['Option A', 'Option B', 'Option C', 'Option D'],
          correctAnswer: 0,
          explanation: 'Explanation of correct answer',
          difficulty: 'Easy'
        }
      ]),
      keyPoints: JSON.stringify(['Key point 1', 'Key point 2', 'Key point 3']),
      formulas: JSON.stringify([
        {
          name: 'Formula Name',
          formula: 'F = ma',
          description: 'Description of the formula'
        }
      ]),
      estimatedReadTime: 25,
      jeeMainWeightage: 10,
      jeeAdvancedWeightage: 8,
      neetWeightage: 5
    };

    if (type === 'csv') {
      const headers = Object.keys(sampleContent).join(',');
      const values = Object.values(sampleContent).map(v => 
        typeof v === 'string' ? `"${v.replace(/"/g, '""')}"` : v
      ).join(',');
      return `${headers}\n${values}`;
    } else {
      return JSON.stringify([sampleContent], null, 2);
    }
  }

  // Private helper methods
  private parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++; // Skip next quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current);
    return result;
  }

  private convertToEducationalContent(data: BulkContentData): EducationalContent {
    // Parse JSON strings
    let examples: any[] = [];
    let practiceQuestions: any[] = [];
    let keyPoints: string[] = [];
    let formulas: any[] = [];

    try {
      if (data.examples) {
        examples = typeof data.examples === 'string' ? JSON.parse(data.examples) : data.examples;
      }
    } catch (e) {
      console.warn('Failed to parse examples:', e);
    }

    try {
      if (data.practiceQuestions) {
        practiceQuestions = typeof data.practiceQuestions === 'string' ? JSON.parse(data.practiceQuestions) : data.practiceQuestions;
      }
    } catch (e) {
      console.warn('Failed to parse practice questions:', e);
    }

    try {
      if (data.keyPoints) {
        keyPoints = typeof data.keyPoints === 'string' ? 
          (data.keyPoints.startsWith('[') ? JSON.parse(data.keyPoints) : data.keyPoints.split(',').map(s => s.trim())) :
          data.keyPoints;
      }
    } catch (e) {
      console.warn('Failed to parse key points:', e);
    }

    try {
      if (data.formulas) {
        formulas = typeof data.formulas === 'string' ? JSON.parse(data.formulas) : data.formulas;
      }
    } catch (e) {
      console.warn('Failed to parse formulas:', e);
    }

    const educationalContent: EducationalContent = {
      id: data.id || `content-${Date.now()}`,
      title: data.title || 'Untitled',
      subject: data.subject || 'General',
      topic: data.topic || 'General',
      subtopic: data.subtopic || 'General',
      difficulty: (data.difficulty as any) || 'Foundation',
      contentType: 'theory',
      content: {
        theory: data.theory,
        examples: examples.length > 0 ? examples : undefined,
        practiceQuestions: practiceQuestions.length > 0 ? practiceQuestions : undefined,
        keyPoints: keyPoints.length > 0 ? keyPoints : undefined,
        formulas: formulas.length > 0 ? formulas : undefined
      },
      estimatedReadTime: data.estimatedReadTime || 20,
      prerequisites: [],
      nextTopics: [],
      examRelevance: {
        jeeMain: data.jeeMainWeightage || 0,
        jeeAdvanced: data.jeeAdvancedWeightage || 0,
        neet: data.neetWeightage || 0
      },
      lastUpdated: new Date()
    };

    return educationalContent;
  }

  // Content statistics
  getContentStatistics(): {
    totalContent: number;
    bySubject: { [subject: string]: number };
    byDifficulty: { [difficulty: string]: number };
    byTopic: { [topic: string]: number };
    averageReadTime: number;
  } {
    const allContent = contentService.getAllContent();
    
    const stats = {
      totalContent: allContent.length,
      bySubject: {} as { [subject: string]: number },
      byDifficulty: {} as { [difficulty: string]: number },
      byTopic: {} as { [topic: string]: number },
      averageReadTime: 0
    };

    let totalReadTime = 0;

    allContent.forEach(content => {
      // By subject
      stats.bySubject[content.subject] = (stats.bySubject[content.subject] || 0) + 1;
      
      // By difficulty
      stats.byDifficulty[content.difficulty] = (stats.byDifficulty[content.difficulty] || 0) + 1;
      
      // By topic
      stats.byTopic[content.topic] = (stats.byTopic[content.topic] || 0) + 1;
      
      // Read time
      totalReadTime += content.estimatedReadTime;
    });

    stats.averageReadTime = allContent.length > 0 ? Math.round(totalReadTime / allContent.length) : 0;

    return stats;
  }
}

export const contentManagementService = ContentManagementService.getInstance();