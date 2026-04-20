import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import pb from '@/lib/pocketbase/client'

export interface UserProfile {
  id: string
  email: string
  name: string
  role: string
  allowed_routes: string[]
}

interface AuthContextType {
  user: any
  session: any
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
  const [user, setUser] = useState<any>(pb.authStore.record)
  const [session, setSession] = useState<any>(
    pb.authStore.isValid ? { user: pb.authStore.record } : null,
  )
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const fetchProfile = async (record: any) => {
      try {
        const profiles = await pb
          .collection('profiles')
          .getFullList({ filter: `user="${record.id}"` })
        if (profiles.length > 0) {
          if (mounted) setProfile(profiles[0] as unknown as UserProfile)
        } else {
          const temp: UserProfile = {
            id: record.id,
            email: record.email,
            name: record.email.split('@')[0],
            role: record.email === 'johnnyoliveira@gmail.com' ? 'admin' : 'user',
            allowed_routes: record.email === 'johnnyoliveira@gmail.com' ? ['*'] : ['/'],
          }
          if (mounted) setProfile(temp)
          try {
            await pb.collection('profiles').create({
              user: record.id,
              email: temp.email,
              name: temp.name,
              role: temp.role,
              allowed_routes: temp.allowed_routes,
            })
          } catch (e) {
            // ignore
          }
        }
      } catch (err) {
        console.error(err)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    if (pb.authStore.record) {
      fetchProfile(pb.authStore.record)
    } else {
      setLoading(false)
    }

    const unsubscribe = pb.authStore.onChange((token, record) => {
      if (mounted) {
        setUser(record)
        setSession(record ? { user: record } : null)
        if (record) {
          setLoading(true)
          fetchProfile(record)
        } else {
          setProfile(null)
          setLoading(false)
        }
      }
    })

    return () => {
      mounted = false
      unsubscribe()
    }
  }, [])

  const signUp = async (email: string, password: string) => {
    try {
      await pb.collection('users').create({ email, password, passwordConfirm: password })
      await pb.collection('users').authWithPassword(email, password)
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  const signIn = async (identity: string, password: string) => {
    try {
      await pb.collection('users').authWithPassword(identity, password)
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  const signOut = async () => {
    pb.authStore.clear()
    return { error: null }
  }

  return (
    <AuthContext.Provider value={{ user, session, profile, signUp, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
