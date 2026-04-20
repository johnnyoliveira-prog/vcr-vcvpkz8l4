import pb from '@/lib/pocketbase/client'
import { type UserProfile } from '@/hooks/use-auth'

export const getProfiles = async () => {
  return pb.collection('profiles').getFullList({ sort: '-created' }) as Promise<UserProfile[]>
}

export const updateUserAccess = async (userId: string, role: string, routes: string[]) => {
  const profiles = await pb.collection('profiles').getFullList({ filter: `user="${userId}"` })
  if (profiles.length > 0) {
    await pb.collection('profiles').update(profiles[0].id, { role, allowed_routes: routes })
  }
}

export const createUser = async (payload: any) => {
  const user = await pb.collection('users').create({
    email: payload.email,
    password: payload.password,
    passwordConfirm: payload.password,
    name: payload.name,
  })

  await pb.collection('profiles').create({
    user: user.id,
    email: payload.email,
    name: payload.name,
    role: payload.role || 'user',
    allowed_routes: payload.allowed_routes || ['/'],
  })

  return user
}
