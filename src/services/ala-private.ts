import pb from '@/lib/pocketbase/client'

export interface AlaPrivateMember {
  id: string
  user_id: string
  nome: string
  email: string
  telefone: string | null
  status: string
  tipo: 'ALA PRIVATE' | 'membro ALA' | 'membro ALA PRIVATE WINE' | 'Cônjuge' | 'Filho'
  titular_id: string | null
  data_adesao: string
  created_at: string
  created: string
}

export const getMembers = async () => {
  const data = await pb.collection('ala_private_membros').getFullList({ sort: '-created' })
  return data.map((d: any) => ({ ...d, created_at: d.created })) as AlaPrivateMember[]
}

export const createMember = async (
  member: Omit<AlaPrivateMember, 'id' | 'user_id' | 'created_at' | 'created' | 'data_adesao'>,
) => {
  const user = pb.authStore.record
  if (!user) throw new Error('User not authenticated')

  const dataToInsert = {
    ...member,
    user_id: user.id,
    data_adesao: new Date().toISOString(),
  }

  const result: any = await pb.collection('ala_private_membros').create(dataToInsert)
  return { ...result, created_at: result.created } as AlaPrivateMember
}

export const updateMember = async (id: string, member: Partial<AlaPrivateMember>) => {
  const result: any = await pb.collection('ala_private_membros').update(id, member)
  return { ...result, created_at: result.created } as AlaPrivateMember
}

export const deleteMember = async (id: string) => {
  await pb.collection('ala_private_membros').delete(id)
}
