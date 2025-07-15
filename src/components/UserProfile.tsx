import React, { useState } from 'react'
import { User, LogOut, Settings, Award, BookOpen, Clock } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const UserProfile: React.FC = () => {
  const { user, signOut } = useAuth()
  const [showDropdown, setShowDropdown] = useState(false)

  if (!user) return null

  const handleSignOut = async () => {
    await signOut()
    setShowDropdown(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        {user.user_metadata?.avatar_url ? (
          <img
            src={user.user_metadata.avatar_url}
            alt={user.user_metadata?.full_name || 'User'}
            className="h-8 w-8 rounded-full"
          />
        ) : (
          <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-white" />
          </div>
        )}
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-gray-900">
            {user.user_metadata?.full_name || 'Student'}
          </p>
          <p className="text-xs text-gray-500">
            {user.email}
          </p>
        </div>
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              {user.user_metadata?.avatar_url ? (
                <img
                  src={user.user_metadata.avatar_url}
                  alt={user.user_metadata?.full_name || 'User'}
                  className="h-12 w-12 rounded-full"
                />
              ) : (
                <div className="h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
              )}
              <div>
                <p className="font-medium text-gray-900">
                  {user.user_metadata?.full_name || 'Student'}
                </p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
          </div>

          <div className="p-2">
            <div className="grid grid-cols-3 gap-2 p-3 bg-gray-50 rounded-lg mb-2">
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <BookOpen className="h-4 w-4 text-blue-600" />
                </div>
                <p className="text-xs font-medium text-gray-900">12</p>
                <p className="text-xs text-gray-500">Sessions</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Clock className="h-4 w-4 text-green-600" />
                </div>
                <p className="text-xs font-medium text-gray-900">4.5h</p>
                <p className="text-xs text-gray-500">Study Time</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Award className="h-4 w-4 text-orange-600" />
                </div>
                <p className="text-xs font-medium text-gray-900">85%</p>
                <p className="text-xs text-gray-500">Accuracy</p>
              </div>
            </div>

            <button className="w-full flex items-center space-x-2 px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <Settings className="h-4 w-4" />
              <span className="text-sm">Settings</span>
            </button>

            <button
              onClick={handleSignOut}
              className="w-full flex items-center space-x-2 px-3 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span className="text-sm">Sign Out</span>
            </button>
          </div>
        </div>
      )}

      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  )
}

export default UserProfile