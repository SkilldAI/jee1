import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      console.log('=== Getting initial session ===')
      console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL)
      console.log('Supabase Anon Key exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY)
      console.log('Supabase Anon Key length:', import.meta.env.VITE_SUPABASE_ANON_KEY?.length)
      
      // Handle OAuth redirect with URL fragments
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      if (hashParams.get('access_token')) {
        console.log('OAuth redirect detected, processing session...');
        // Clear the hash to clean up the URL
        window.history.replaceState(null, '', window.location.pathname);
      }
      
      console.log('Calling supabase.auth.getSession()...')
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('=== Session Error ===', error)
        console.error('Error message:', error.message)
        console.error('Error details:', error)
        setError(error.message)
      } else {
        console.log('=== Session Result ===')
        console.log('Session found:', !!session)
        if (session) {
          console.log('User ID:', session.user?.id)
          console.log('User email:', session.user?.email)
          console.log('Access token exists:', !!session.access_token)
        }
        setSession(session)
        setUser(session?.user ?? null)
      }
      
      setLoading(false)
      console.log('=== Initial session check complete ===')
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('=== Auth State Change ===')
        console.log('Event:', event)
        console.log('Session exists:', !!session)
        if (session) {
          console.log('User email:', session.user?.email)
        }
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
        setError(null)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signInWithGoogle = async () => {
    try {
      setError(null)
      setLoading(true)
      
      console.log('Starting Google OAuth sign in...')
      console.log('Current URL:', window.location.origin)
      
      // Get the current origin dynamically for WebContainer environments
      const redirectUrl = `${window.location.origin}/`
      console.log('Redirect URL:', redirectUrl)
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      })
      
      if (error) {
        console.error('OAuth error:', error)
        throw error
      }
      
      console.log('OAuth request initiated successfully')
    } catch (error) {
      console.error('Error signing in with Google:', error)
      setError(error instanceof Error ? error.message : 'An error occurred during sign in')
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setError(null)
      const { error } = await supabase.auth.signOut()
      if (error) {
        throw error
      }
    } catch (error) {
      console.error('Error signing out:', error)
      setError(error instanceof Error ? error.message : 'An error occurred during sign out')
    }
  }

  const value = {
    user,
    session,
    loading,
    signInWithGoogle,
    signOut,
    error
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}