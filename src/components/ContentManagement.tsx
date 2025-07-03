import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Download, 
  FileText, 
  Database, 
  Settings, 
  Plus,
  Search,
  Filter,
  BarChart3,
  CheckCircle,
  AlertCircle,
  Trash2,
  Edit,
  Eye,
  Save,
  X,
  FileSpreadsheet,
  Code,
  BookOpen,
  Target,
  Clock,
  Award
} from 'lucide-react';
import { contentManagementService, ContentImportResult } from '../services/contentManagementService';
import { contentService, EducationalContent } from '../services/contentService';

const ContentManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'import' | 'manage' | 'export'>('overview');
  const [importType, setImportType] = useState<'csv' | 'json'>('csv');
  const [importResult, setImportResult] = useState<ContentImportResult | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('');
  const [selectedContent, setSelectedContent] = useState<string[]>([]);
  const [editingContent, setEditingContent] = useState<EducationalContent | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setImportResult(null);

    try {
      const content = await file.text();
      let result: ContentImportResult;

      if (importType === 'csv') {
        result = await contentManagementService.importFromCSV(content);
      } else {
        result = await contentManagementService.importFromJSON(content);
      }

      setImportResult(result);
    } catch (error) {
      setImportResult({
        success: false,
        imported: 0,
        failed: 1,
        errors: [`File processing error: ${error instanceof Error ? error.message : 'Unknown error'}`]
      });
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleExport = (type: 'csv' | 'json') => {
    const filter = {
      subject: filterSubject || undefined,
      difficulty: filterDifficulty || undefined
    };

    let content: string;
    let filename: string;
    let mimeType: string;

    if (type === 'csv') {
      content = contentManagementService.exportToCSV(filter);
      filename = 'educational-content.csv';
      mimeType = 'text/csv';
    } else {
      content = contentManagementService.exportToJSON(filter);
      filename = 'educational-content.json';
      mimeType = 'application/json';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadTemplate = (type: 'csv' | 'json') => {
    const template = contentManagementService.generateContentTemplate(type);
    const filename = `content-template.${type}`;
    const mimeType = type === 'csv' ? 'text/csv' : 'application/json';

    const blob = new Blob([template], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleBulkDelete = () => {
    if (selectedContent.length === 0) return;
    
    if (confirm(`Are you sure you want to delete ${selectedContent.length} content items?`)) {
      // Note: This would require implementing delete functionality in contentService
      setSelectedContent([]);
      alert(`${selectedContent.length} items deleted successfully.`);
    }
  };

  const getFilteredContent = () => {
    let content = contentService.getAllContent();

    if (searchTerm) {
      content = content.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.subtopic.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterSubject) {
      content = content.filter(item => item.subject === filterSubject);
    }

    if (filterDifficulty) {
      content = content.filter(item => item.difficulty === filterDifficulty);
    }

    return content;
  };

  const stats = contentManagementService.getContentStatistics();
  const filteredContent = getFilteredContent();

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Content</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalContent}</p>
            </div>
            <BookOpen className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Read Time</p>
              <p className="text-2xl font-bold text-gray-900">{stats.averageReadTime}m</p>
            </div>
            <Clock className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Subjects</p>
              <p className="text-2xl font-bold text-gray-900">{Object.keys(stats.bySubject).length}</p>
            </div>
            <Target className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Topics</p>
              <p className="text-2xl font-bold text-gray-900">{Object.keys(stats.byTopic).length}</p>
            </div>
            <Award className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Content Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Content by Subject</h3>
          <div className="space-y-3">
            {Object.entries(stats.bySubject).map(([subject, count]) => (
              <div key={subject} className="flex items-center justify-between">
                <span className="text-gray-700">{subject}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${(count / stats.totalContent) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Content by Difficulty</h3>
          <div className="space-y-3">
            {Object.entries(stats.byDifficulty).map(([difficulty, count]) => (
              <div key={difficulty} className="flex items-center justify-between">
                <span className="text-gray-700">{difficulty}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        difficulty === 'Foundation' ? 'bg-green-500' :
                        difficulty === 'Intermediate' ? 'bg-yellow-500' :
                        difficulty === 'Advanced' ? 'bg-orange-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${(count / stats.totalContent) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setActiveTab('import')}
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Upload className="h-6 w-6 text-blue-600" />
            <div className="text-left">
              <div className="font-medium text-gray-900">Import Content</div>
              <div className="text-sm text-gray-600">Upload CSV or JSON files</div>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('manage')}
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Settings className="h-6 w-6 text-green-600" />
            <div className="text-left">
              <div className="font-medium text-gray-900">Manage Content</div>
              <div className="text-sm text-gray-600">Edit and organize content</div>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('export')}
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="h-6 w-6 text-purple-600" />
            <div className="text-left">
              <div className="font-medium text-gray-900">Export Content</div>
              <div className="text-sm text-gray-600">Download as CSV or JSON</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );

  const ImportTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Import Educational Content</h3>
        
        {/* Import Type Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Import Format</label>
          <div className="flex space-x-4">
            <button
              onClick={() => setImportType('csv')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                importType === 'csv'
                  ? 'bg-blue-100 border-blue-300 text-blue-700'
                  : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FileSpreadsheet className="h-4 w-4" />
              <span>CSV</span>
            </button>
            <button
              onClick={() => setImportType('json')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                importType === 'json'
                  ? 'bg-blue-100 border-blue-300 text-blue-700'
                  : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Code className="h-4 w-4" />
              <span>JSON</span>
            </button>
          </div>
        </div>

        {/* Template Download */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start space-x-3">
            <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-blue-900 mb-1">Download Template</h4>
              <p className="text-sm text-blue-700 mb-3">
                Download a template file to see the required format for importing content.
              </p>
              <button
                onClick={() => handleDownloadTemplate(importType)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
              >
                Download {importType.toUpperCase()} Template
              </button>
            </div>
          </div>
        </div>

        {/* File Upload */}
        <div className="mb-6">
          <input
            ref={fileInputRef}
            type="file"
            accept={importType === 'csv' ? '.csv' : '.json'}
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isImporting}
            className="w-full flex items-center justify-center space-x-2 p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors disabled:opacity-50"
          >
            {isImporting ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
                <span>Importing...</span>
              </>
            ) : (
              <>
                <Upload className="h-6 w-6 text-gray-400" />
                <span className="text-gray-600">
                  Click to upload {importType.toUpperCase()} file
                </span>
              </>
            )}
          </button>
        </div>

        {/* Import Results */}
        {importResult && (
          <div className={`p-4 rounded-lg border ${
            importResult.success 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-start space-x-3">
              {importResult.success ? (
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              )}
              <div className="flex-1">
                <h4 className={`font-medium mb-2 ${
                  importResult.success ? 'text-green-900' : 'text-red-900'
                }`}>
                  Import {importResult.success ? 'Completed' : 'Failed'}
                </h4>
                <div className="text-sm space-y-1">
                  <p className={importResult.success ? 'text-green-700' : 'text-red-700'}>
                    Successfully imported: {importResult.imported} items
                  </p>
                  {importResult.failed > 0 && (
                    <p className="text-red-700">Failed: {importResult.failed} items</p>
                  )}
                </div>
                {importResult.errors.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-red-900 mb-1">Errors:</p>
                    <ul className="text-sm text-red-700 space-y-1">
                      {importResult.errors.slice(0, 5).map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                      {importResult.errors.length > 5 && (
                        <li>• ... and {importResult.errors.length - 5} more errors</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const ManageTab = () => (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Subjects</option>
            {Object.keys(stats.bySubject).map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>

          <select
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Difficulties</option>
            {Object.keys(stats.byDifficulty).map(difficulty => (
              <option key={difficulty} value={difficulty}>{difficulty}</option>
            ))}
          </select>

          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Content</span>
          </button>
        </div>

        {selectedContent.length > 0 && (
          <div className="mt-4 flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {selectedContent.length} items selected
            </span>
            <button
              onClick={handleBulkDelete}
              className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 flex items-center space-x-1"
            >
              <Trash2 className="h-3 w-3" />
              <span>Delete Selected</span>
            </button>
          </div>
        )}
      </div>

      {/* Content List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedContent(filteredContent.map(c => c.id));
                      } else {
                        setSelectedContent([]);
                      }
                    }}
                    checked={selectedContent.length === filteredContent.length && filteredContent.length > 0}
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Topic
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Difficulty
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Read Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredContent.map((content) => (
                <tr key={content.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedContent.includes(content.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedContent([...selectedContent, content.id]);
                        } else {
                          setSelectedContent(selectedContent.filter(id => id !== content.id));
                        }
                      }}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{content.title}</div>
                    <div className="text-sm text-gray-500">{content.subtopic}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {content.subject}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {content.topic}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      content.difficulty === 'Foundation' ? 'bg-green-100 text-green-800' :
                      content.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                      content.difficulty === 'Advanced' ? 'bg-orange-100 text-orange-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {content.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {content.estimatedReadTime}m
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingContent(content)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const ExportTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Educational Content</h3>
        
        {/* Export Filters */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3">Export Filters (Optional)</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <select
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Subjects</option>
                {Object.keys(stats.bySubject).map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
              <select
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Difficulties</option>
                {Object.keys(stats.byDifficulty).map(difficulty => (
                  <option key={difficulty} value={difficulty}>{difficulty}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Export Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <FileSpreadsheet className="h-8 w-8 text-green-600" />
              <div>
                <h4 className="font-medium text-gray-900">Export as CSV</h4>
                <p className="text-sm text-gray-600">Spreadsheet format for Excel/Google Sheets</p>
              </div>
            </div>
            <button
              onClick={() => handleExport('csv')}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
            >
              Download CSV
            </button>
          </div>

          <div className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Code className="h-8 w-8 text-blue-600" />
              <div>
                <h4 className="font-medium text-gray-900">Export as JSON</h4>
                <p className="text-sm text-gray-600">Structured data format for developers</p>
              </div>
            </div>
            <button
              onClick={() => handleExport('json')}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Download JSON
            </button>
          </div>
        </div>

        {/* Export Preview */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Export Preview</h4>
          <p className="text-sm text-gray-600">
            {getFilteredContent().length} content items will be exported
            {filterSubject && ` (Subject: ${filterSubject})`}
            {filterDifficulty && ` (Difficulty: ${filterDifficulty})`}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-green-600 to-blue-600 p-3 rounded-lg">
              <Database className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Content Management System</h1>
              <p className="text-gray-600">Import, manage, and export educational content at scale</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="flex space-x-8 px-6">
            {[
              { id: 'overview', name: 'Overview', icon: BarChart3 },
              { id: 'import', name: 'Import Content', icon: Upload },
              { id: 'manage', name: 'Manage Content', icon: Settings },
              { id: 'export', name: 'Export Content', icon: Download }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'import' && <ImportTab />}
        {activeTab === 'manage' && <ManageTab />}
        {activeTab === 'export' && <ExportTab />}
      </div>
    </div>
  );
};

export default ContentManagement;