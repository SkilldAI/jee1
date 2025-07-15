import React from 'react'
import { GraduationCap, BookOpen, Target, Brain, Shield, Users, Zap } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const LoginPage: React.FC = () => {
  const { signInWithGoogle, loading, error } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left Side - Branding & Features */}
        <div className="lg:w-1/2 flex flex-col justify-center p-8 lg:p-12">
          <div className="max-w-md mx-auto lg:mx-0">
            {/* Logo */}
            <div className="flex items-center space-x-3 mb-8">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-2xl">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">JEE/NEET AI Tutor</h1>
                <p className="text-gray-600">Your Personal Learning Assistant</p>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900">
                Why Choose Our AI Tutor?
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Brain className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">AI-Powered Learning</h3>
                    <p className="text-sm text-gray-600">Get personalized explanations and step-by-step solutions</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Target className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">JEE/NEET Focused</h3>
                    <p className="text-sm text-gray-600">Tailored specifically for competitive exam preparation</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <BookOpen className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Comprehensive Database</h3>
                    <p className="text-sm text-gray-600">Access to 500+ past JEE/NEET questions and solutions</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <Zap className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">24/7 Available</h3>
                    <p className="text-sm text-gray-600">Get help anytime, anywhere with instant AI responses</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center space-x-2 mb-2">
                <Shield className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-gray-900">Secure & Private</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-gray-600">Trusted by thousands of students</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="lg:w-1/2 flex flex-col justify-center p-8 lg:p-12 bg-white lg:bg-gradient-to-br lg:from-gray-50 lg:to-white">
          <div className="max-w-md mx-auto w-full">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome Back!
              </h2>
              <p className="text-gray-600">
                Sign in to continue your learning journey
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* Debug Info */}
            <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs">
              <p><strong>Debug Info:</strong></p>
              <p>Current URL: {window.location.href}</p>
              <p>Origin: {window.location.origin}</p>
            </div>

            {/* Google Sign In Button */}
            <button
              onClick={signInWithGoogle}
              disabled={loading}
              className="w-full flex items-center justify-center space-x-3 bg-white border border-gray-300 rounded-lg px-6 py-3 text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600"></div>
              ) : (
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              )}
              <span>Continue with Google</span>
            </button>

            {/* Additional Info */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                By signing in, you agree to our{' '}
                <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
              </p>
            </div>

            {/* Demo Info */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">🚀 What's Inside?</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• AI-powered tutoring for Physics, Chemistry, Biology & Math</li>
                <li>• Image upload with text recognition</li>
                <li>• 500+ past JEE/NEET questions with solutions</li>
                <li>• Personalized study planning and mock exams</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage