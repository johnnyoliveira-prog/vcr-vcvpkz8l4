import { supabase } from '@/lib/supabase/client'

export interface AlaPrivateMember {
  id: string
  user_id: string
  nome: string
  email: string
  telefone: string | null
  status: string
  tipo: 'Titular' | 'Cônjuge' | 'Filho'
  titular_id: string | null
  data_adesao: string
  created_at: string
}

export const getMembers = async () => {
  const { data, error } = await supabase
    .from('ala_private_membros')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as AlaPrivateMember[]
}

export const createMember = async (
  member: Omit<AlaPrivateMember, 'id' | 'user_id' | 'created_at' | 'data_adesao'>,
) => {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

  const { data, error } = await supabase
    .from('ala_private_membros')
    .insert([{ ...member, user_id: user.id }])
    .select()
    .single()

  if (error) throw error
  return data as AlaPrivateMember
}

export const updateMember = async (id: string, member: Partial<AlaPrivateMember>) => {
  const { data, error } = await supabase
    .from('ala_private_membros')
    .update(member)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as AlaPrivateMember
}

export const deleteMember = async (id: string) => {
  const { error } = await supabase.from('ala_private_membros').delete().eq('id', id)
  if (error) throw error
}
