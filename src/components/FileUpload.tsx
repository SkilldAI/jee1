import React, { useRef, useState } from 'react';
import { Upload, File, X, Image, FileText, AlertCircle, CheckCircle, Eye, Zap, Camera, Scan } from 'lucide-react';
import { validateImageForOCR } from '../services/fileProcessingService';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onRemoveFile: () => void;
  selectedFile: File | null;
  isUploading: boolean;
  className?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  onRemoveFile,
  selectedFile,
  isUploading,
  className = ''
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageQuality, setImageQuality] = useState<{
    isValid: boolean;
    suggestions: string[];
    estimatedQuality: number;
  } | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelection = async (file: File) => {
    setError(null);
    setImageQuality(null);
    
    // Validate file type
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'text/plain'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload an image (JPG, PNG, GIF, WebP), PDF, or text file.');
      return;
    }
    
    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setError('File size must be less than 10MB.');
      return;
    }
    
    // For images, validate quality for OCR
    if (file.type.startsWith('image/')) {
      try {
        const quality = await validateImageForOCR(file);
        setImageQuality(quality);
        
        if (!quality.isValid) {
          setError(`Image quality may affect text recognition (${quality.estimatedQuality}% quality score). ${quality.suggestions[0]}`);
          // Still allow upload but show warning
        }
      } catch (qualityError) {
        console.warn('Could not validate image quality:', qualityError);
      }
    }
    
    onFileSelect(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image className="h-5 w-5 text-blue-500" />;
    } else if (file.type === 'application/pdf') {
      return <FileText className="h-5 w-5 text-red-500" />;
    } else {
      return <File className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getQualityColor = (quality: number) => {
    if (quality >= 80) return 'text-green-600';
    if (quality >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {!selectedFile ? (
        <div
          className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 ${
            dragActive
              ? 'border-blue-400 bg-blue-50 scale-105'
              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          } ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            accept="image/*,.pdf,.txt"
            onChange={handleFileInputChange}
            disabled={isUploading}
          />
          
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className={`p-4 rounded-full ${dragActive ? 'bg-blue-100' : 'bg-gray-100'} transition-colors`}>
                {dragActive ? (
                  <Upload className="h-10 w-10 text-blue-500" />
                ) : (
                  <Camera className="h-10 w-10 text-gray-400" />
                )}
              </div>
            </div>
            <div>
              <p className="text-xl font-semibold text-gray-900 mb-2">
                {dragActive ? 'Drop your file here' : 'Upload homework or scanned documents'}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Drag and drop or click to browse
              </p>
              
              {/* Enhanced features showcase */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                <div className="flex items-center justify-center space-x-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <Eye className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">AI Text Recognition</span>
                </div>
                <div className="flex items-center justify-center space-x-2 p-3 bg-green-50 rounded-lg border border-green-200">
                  <Zap className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-green-700">Math Detection</span>
                </div>
                <div className="flex items-center justify-center space-x-2 p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <Scan className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-medium text-purple-700">Smart Analysis</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-xs text-gray-500">
                  **Supported formats:** Images (JPG, PNG, GIF, WebP), PDF, Text files (max 10MB)
                </p>
                <p className="text-xs text-blue-600 font-medium">
                  ✨ **Powered by Google Cloud Vision API** for accurate text extraction
                </p>
              </div>

              {/* Tips for better results */}
              <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <h4 className="text-sm font-medium text-yellow-800 mb-2">📸 Tips for best results:</h4>
                <ul className="text-xs text-yellow-700 space-y-1 text-left">
                  <li>• Ensure good lighting and clear text</li>
                  <li>• Avoid shadows and reflections</li>
                  <li>• Keep the camera steady and focused</li>
                  <li>• Include the entire problem in the frame</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl p-4 border-2 border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getFileIcon(selectedFile)}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  📎 {selectedFile.name}
                </p>
                <div className="flex items-center space-x-3 text-xs text-gray-500 mt-1">
                  <span>{formatFileSize(selectedFile.size)}</span>
                  {imageQuality && selectedFile.type.startsWith('image/') && (
                    <>
                      <span>•</span>
                      <span className={`font-medium ${getQualityColor(imageQuality.estimatedQuality)}`}>
                        {imageQuality.estimatedQuality}% quality
                      </span>
                    </>
                  )}
                  <span>•</span>
                  <span className="text-green-600 font-medium">Ready for AI analysis</span>
                </div>
              </div>
            </div>
            <button
              onClick={onRemoveFile}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              disabled={isUploading}
              title="Remove file"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          </div>
          
          {/* Enhanced image quality feedback */}
          {imageQuality && selectedFile.type.startsWith('image/') && (
            <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center space-x-2 mb-2">
                {imageQuality.isValid ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                )}
                <span className="text-sm font-medium">
                  {imageQuality.isValid ? '✅ Excellent for text recognition' : '⚠️ May need optimization'}
                </span>
              </div>
              {imageQuality.suggestions.length > 0 && (
                <div className="text-xs text-gray-600">
                  <p className="font-medium mb-2">💡 **Tips for better results:**</p>
                  <ul className="space-y-1">
                    {imageQuality.suggestions.slice(0, 3).map((suggestion, index) => (
                      <li key={index} className="flex items-start space-x-1">
                        <span>•</span>
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      
      {error && (
        <div className="flex items-start space-x-3 text-red-600 text-sm bg-red-50 p-4 rounded-lg border border-red-200">
          <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">❌ Upload Error</p>
            <p className="mt-1">{error}</p>
            <p className="mt-2 text-xs text-red-500">
              **Tip:** Try uploading a clearer image or describe your question in text.
            </p>
          </div>
        </div>
      )}
      
      {isUploading && (
        <div className="flex items-center space-x-3 text-blue-600 text-sm bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          <span className="font-medium">🔍 Processing file with AI text recognition...</span>
        </div>
      )}
    </div>
  );
};

export default FileUpload;