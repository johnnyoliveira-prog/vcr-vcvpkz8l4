import { supabase } from '@/lib/supabase/client'
import { type UserProfile } from '@/hooks/use-auth'

export const getProfiles = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as UserProfile[]
}

export const updateUserAccess = async (userId: string, role: string, routes: string[]) => {
  const { error } = await supabase.rpc('update_user_access', {
    target_user_id: userId,
    new_role: role,
    new_routes: routes,
  })
  if (error) throw error
}

export const createUser = async (payload: any) => {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-user`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${session?.access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.error || 'Erro ao criar usuário')
  }

  return res.json()
}
