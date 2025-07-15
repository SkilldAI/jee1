import React from 'react'
import { GraduationCap, BookOpen, Target, Brain, Shield, Users, Zap, Star, Award, CheckCircle, ArrowRight, Play, TrendingUp, Clock, Globe, Sparkles } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const LoginPage: React.FC = () => {
  const { signInWithGoogle, loading, error } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/30 to-purple-600/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-pink-400/30 to-blue-600/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Floating particles */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-white/20 rounded-full animate-bounce delay-300"></div>
        <div className="absolute top-40 right-32 w-1 h-1 bg-white/30 rounded-full animate-bounce delay-700"></div>
        <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-white/25 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute bottom-20 right-20 w-2 h-2 bg-white/20 rounded-full animate-bounce delay-500"></div>
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row min-h-screen">
        {/* Left Side - Hero Content */}
        <div className="lg:w-3/5 flex flex-col justify-center p-8 lg:p-16">
          <div className="max-w-2xl mx-auto lg:mx-0">
            {/* Logo with enhanced styling */}
            <div className="flex items-center space-x-4 mb-12">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-3xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-3xl shadow-2xl">
                  <GraduationCap className="h-12 w-12 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                  JEE/NEET AI Tutor
                </h1>
                <p className="text-xl text-blue-100 font-medium">Your Personal Learning Revolution</p>
              </div>
            </div>

            {/* Hero headline */}
            <div className="mb-12">
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                Master
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent"> JEE & NEET </span>
                with AI
              </h2>
              <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
                Experience the future of learning with our advanced AI tutor that adapts to your unique learning style and accelerates your success.
              </p>
              
              {/* Enhanced CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <button 
                  onClick={signInWithGoogle}
                  disabled={loading}
                  className="group relative px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold rounded-2xl shadow-2xl hover:shadow-yellow-500/25 transform hover:scale-105 transition-all duration-300 disabled:opacity-50"
                >
                  <div className="flex items-center justify-center space-x-3">
                    {loading ? (
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black"></div>
                    ) : (
                      <>
                        <Sparkles className="h-6 w-6" />
                        <span>Start Learning Now</span>
                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </div>
                </button>
                <button className="group px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-2xl hover:border-white hover:bg-white/10 transition-all duration-300 backdrop-blur-sm">
                  <div className="flex items-center justify-center space-x-2">
                    <Play className="h-5 w-5" />
                    <span>Watch Demo</span>
                  </div>
                </button>
              </div>

              {/* Enhanced trust indicators */}
              <div className="flex flex-wrap items-center gap-8 text-blue-100">
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full border-2 border-white"></div>
                    <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full border-2 border-white"></div>
                    <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-red-500 rounded-full border-2 border-white"></div>
                  </div>
                  <span className="font-medium">10,000+ students</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <span className="font-medium">4.9/5 rating</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-green-400" />
                  <span className="font-medium">95% success rate</span>
                </div>
              </div>
            </div>

            {/* Enhanced features grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  icon: Brain,
                  title: 'AI-Powered Tutoring',
                  description: 'Personalized learning that adapts to your pace',
                  color: 'from-blue-400 to-purple-500'
                },
                {
                  icon: Target,
                  title: 'Exam-Focused Content',
                  description: 'Tailored specifically for JEE & NEET success',
                  color: 'from-green-400 to-blue-500'
                },
                {
                  icon: Globe,
                  title: '500+ Past Papers',
                  description: 'Comprehensive question bank with solutions',
                  color: 'from-purple-400 to-pink-500'
                },
                {
                  icon: Clock,
                  title: '24/7 Availability',
                  description: 'Learn anytime, anywhere with instant support',
                  color: 'from-orange-400 to-red-500'
                }
              ].map((feature, index) => (
                <div key={index} className="group">
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                    <div className={`bg-gradient-to-r ${feature.color} p-3 rounded-xl inline-block mb-4 group-hover:scale-110 transition-transform`}>
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-blue-100 text-sm">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="lg:w-2/5 flex flex-col justify-center p-8 lg:p-12">
          <div className="max-w-md mx-auto w-full">
            {/* Enhanced login card */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
              <div className="text-center mb-8">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-3 rounded-2xl inline-block mb-4">
                  <Sparkles className="h-8 w-8 text-black" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  Welcome Back!
                </h2>
                <p className="text-blue-100">
                  Continue your learning journey
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl backdrop-blur-sm">
                  <p className="text-red-200 text-sm">{error}</p>
                </div>
              )}

              {/* Enhanced Google Sign In Button */}
              <button
                onClick={signInWithGoogle}
                disabled={loading}
                className="w-full group relative bg-white hover:bg-gray-50 text-gray-900 font-semibold rounded-2xl px-6 py-4 transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center justify-center space-x-3">
                  {loading ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                  ) : (
                    <>
                      <svg className="h-6 w-6" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      <span>Continue with Google</span>
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </div>
              </button>

              {/* Additional Info */}
              <div className="mt-6 text-center">
                <p className="text-xs text-blue-200">
                  By signing in, you agree to our{' '}
                  <a href="#" className="text-yellow-400 hover:underline">Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" className="text-yellow-400 hover:underline">Privacy Policy</a>
                </p>
              </div>

              {/* Enhanced demo info */}
              <div className="mt-8 p-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl border border-blue-400/30 backdrop-blur-sm">
                <div className="flex items-center mb-3">
                  <Zap className="h-5 w-5 text-yellow-400 mr-2" />
                  <h4 className="font-bold text-white">What's Inside?</h4>
                </div>
                <ul className="text-sm text-blue-100 space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                    AI-powered tutoring for all JEE/NEET subjects
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                    Smart image upload with text recognition
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                    500+ past papers with detailed solutions
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                    Personalized study planning & mock exams
                  </li>
                </ul>
              </div>

              {/* Social proof */}
              <div className="mt-6 text-center">
                <div className="flex items-center justify-center space-x-4 text-sm text-blue-200">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    <span>10K+ students</span>
                  </div>
                  <div className="w-1 h-1 bg-blue-300 rounded-full"></div>
                  <div className="flex items-center">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span>95% success rate</span>
                  </div>
                  <div className="w-1 h-1 bg-blue-300 rounded-full"></div>
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 mr-1" />
                    <span>Secure & Private</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage