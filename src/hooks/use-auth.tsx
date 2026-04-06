import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'

export interface UserProfile {
  id: string
  email: string
  name: string
  role: string
  allowed_routes: string[]
}

interface AuthContextType {
  user: User | null
  session: Session | null
  profile: UserProfile | null
  signUp: (email: string, password: string) => Promise<{ error: any }>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<{ error: any }>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const fetchProfile = async (userId: string, email?: string) => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .limit(1)

        if (error) {
          console.error('Error fetching profile:', error)
        }

        if (data && data.length > 0) {
          if (mounted) {
            setProfile(data[0] as UserProfile)
            setLoading(false)
          }
        } else if (email) {
          // If profile is missing (due to trigger delay or missing old user), set a temporary local profile
          const temporaryProfile: UserProfile = {
            id: userId,
            email: email,
            name: email.split('@')[0],
            role: email === 'johnnyoliveira@gmail.com' ? 'admin' : 'user',
            allowed_routes: email === 'johnnyoliveira@gmail.com' ? ['*'] : ['/'],
          }

          if (mounted) {
            setProfile(temporaryProfile)
            setLoading(false)
          }

          // Attempt to insert it as a fallback
          supabase.from('profiles').insert(temporaryProfile).then()
        } else {
          if (mounted) {
            setLoading(false)
          }
        }
      } catch (err) {
        console.error('Unexpected error fetching profile:', err)
        if (mounted) setLoading(false)
      }
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id, session.user.email)
      } else {
        setProfile(null)
        setLoading(false)
      }
    })

    supabase.auth
      .getSession()
      .then(({ data: { session }, error }) => {
        if (error) {
          console.error('Error fetching session:', error)
        }
        if (mounted) {
          setSession(session)
          setUser(session?.user ?? null)
          if (session?.user) {
            fetchProfile(session.user.id, session.user.email)
          } else {
            setProfile(null)
            setLoading(false)
          }
        }
      })
      .catch((error) => {
        console.error('Unhandled session fetch error:', error)
        if (mounted) {
          setSession(null)
          setUser(null)
          setProfile(null)
          setLoading(false)
        }
      })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/` },
    })
    return { error }
  }
  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error }
  }
  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  return (
    <AuthContext.Provider value={{ user, session, profile, signUp, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
