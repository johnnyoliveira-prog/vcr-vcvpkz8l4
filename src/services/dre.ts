import { supabase } from '@/lib/supabase/client'
import type { Database } from '@/lib/supabase/types'

type DreUpload = Database['public']['Tables']['dre_uploads']['Row']

export async function getDreUploads(): Promise<DreUpload[]> {
  const { data, error } = await supabase
    .from('dre_uploads')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function deleteDreUpload(id: string): Promise<void> {
  const { error } = await supabase.from('dre_uploads').delete().eq('id', id)

  if (error) throw error
}
