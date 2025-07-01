import React, { useRef, useState } from 'react';
import { Upload, File, X, Image, FileText, AlertCircle, CheckCircle, Eye, Zap } from 'lucide-react';
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
    <div className={`space-y-3 ${className}`}>
      {!selectedFile ? (
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
            dragActive
              ? 'border-blue-400 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
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
              <div className={`p-3 rounded-full ${dragActive ? 'bg-blue-100' : 'bg-gray-100'}`}>
                <Upload className={`h-8 w-8 ${dragActive ? 'text-blue-500' : 'text-gray-400'}`} />
              </div>
            </div>
            <div>
              <p className="text-lg font-medium text-gray-900 mb-2">
                {dragActive ? 'Drop your file here' : 'Upload homework or scanned documents'}
              </p>
              <p className="text-sm text-gray-600 mb-3">
                Drag and drop or click to browse
              </p>
              
              {/* Enhanced features showcase */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                <div className="flex items-center justify-center space-x-2 p-2 bg-blue-50 rounded-lg">
                  <Eye className="h-4 w-4 text-blue-600" />
                  <span className="text-xs font-medium text-blue-700">AI Text Recognition</span>
                </div>
                <div className="flex items-center justify-center space-x-2 p-2 bg-green-50 rounded-lg">
                  <Zap className="h-4 w-4 text-green-600" />
                  <span className="text-xs font-medium text-green-700">Math Detection</span>
                </div>
                <div className="flex items-center justify-center space-x-2 p-2 bg-purple-50 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-purple-600" />
                  <span className="text-xs font-medium text-purple-700">Smart Analysis</span>
                </div>
              </div>
              
              <p className="text-xs text-gray-400">
                Supports: Images (JPG, PNG, GIF, WebP), PDF, Text files (max 10MB)
              </p>
              <p className="text-xs text-blue-500 mt-1">
                ✨ Powered by Google Cloud Vision API for accurate text extraction
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getFileIcon(selectedFile)}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {selectedFile.name}
                </p>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <span>{formatFileSize(selectedFile.size)}</span>
                  {imageQuality && selectedFile.type.startsWith('image/') && (
                    <>
                      <span>•</span>
                      <span className={getQualityColor(imageQuality.estimatedQuality)}>
                        {imageQuality.estimatedQuality}% quality
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={onRemoveFile}
              className="p-1 hover:bg-gray-200 rounded-full transition-colors"
              disabled={isUploading}
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          </div>
          
          {/* Image quality feedback */}
          {imageQuality && selectedFile.type.startsWith('image/') && (
            <div className="mt-3 p-3 bg-white rounded border">
              <div className="flex items-center space-x-2 mb-2">
                {imageQuality.isValid ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                )}
                <span className="text-sm font-medium">
                  {imageQuality.isValid ? 'Good for text recognition' : 'May need optimization'}
                </span>
              </div>
              {imageQuality.suggestions.length > 0 && (
                <div className="text-xs text-gray-600">
                  <p className="font-medium mb-1">Tips for better results:</p>
                  <ul className="space-y-1">
                    {imageQuality.suggestions.slice(0, 3).map((suggestion, index) => (
                      <li key={index}>• {suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      
      {error && (
        <div className="flex items-start space-x-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">Upload Error</p>
            <p>{error}</p>
          </div>
        </div>
      )}
      
      {isUploading && (
        <div className="flex items-center space-x-2 text-blue-600 text-sm bg-blue-50 p-3 rounded-lg">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span>Processing file with AI text recognition...</span>
        </div>
      )}
    </div>
  );
};

export default FileUpload;