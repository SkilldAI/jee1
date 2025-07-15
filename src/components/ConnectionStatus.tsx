import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { testGeminiConnection } from '../services/geminiService';

interface ConnectionStatusProps {
  className?: string;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ className = '' }) => {
  const [status, setStatus] = useState<'checking' | 'connected' | 'disconnected' | 'error'>('checking');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const checkConnection = async () => {
    setStatus('checking');
    setErrorMessage('');
    
    try {
      const result = await testGeminiConnection();
      if (result.success) {
        setStatus('connected');
        setErrorMessage('');
      } else {
        setStatus('error');
        setErrorMessage(result.error || 'Unknown connection error');
      }
    } catch (error) {
      setStatus('disconnected');
      setErrorMessage(error instanceof Error ? error.message : 'Connection failed');
    }
    
    setLastChecked(new Date());
  };

  useEffect(() => {
    checkConnection();
    
    // Check connection every 5 minutes
    const interval = setInterval(checkConnection, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = () => {
    switch (status) {
      case 'checking':
        return <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />;
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'disconnected':
        return <WifiOff className="h-4 w-4 text-red-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      default:
        return <Wifi className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'checking':
        return 'Checking AI connection...';
      case 'connected':
        return 'AI Model Connected';
      case 'disconnected':
        return 'AI Disconnected';
      case 'error':
        return 'AI Connection Error';
      default:
        return 'Unknown Status';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'checking':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'connected':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'disconnected':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'error':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className={`${className}`}>
      <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg border ${getStatusColor()}`}>
        {getStatusIcon()}
        <span className="text-sm font-medium">{getStatusText()}</span>
        <button
          onClick={checkConnection}
          className="ml-2 p-1 hover:bg-black/10 rounded transition-colors"
          title="Refresh connection status"
        >
          <RefreshCw className="h-3 w-3" />
        </button>
      </div>
      
      {errorMessage && (
        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">Connection Error</p>
              <p className="text-xs text-red-600 mt-1">{errorMessage}</p>
              {errorMessage.includes('API key') && (
                <div className="mt-2 text-xs text-red-600">
                  <p className="font-medium">To fix this:</p>
                  <ol className="list-decimal list-inside mt-1 space-y-1">
                    <li>Get your API key from <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline">Google AI Studio</a></li>
                    <li>Add it to your .env file as VITE_GEMINI_API_KEY</li>
                    <li>Restart the development server</li>
                  </ol>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {lastChecked && (
        <p className="text-xs text-gray-500 mt-1">
          Last checked: {lastChecked.toLocaleTimeString()}
        </p>
      )}
    </div>
  );
};

export default ConnectionStatus;