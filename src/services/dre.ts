import { supabase } from '@/lib/supabase/client'
import type { Database } from '@/lib/supabase/types'

type DreUpload = Database['public']['Tables']['dre_uploads']['Row']
type DreLinha = Database['public']['Tables']['dre_linhas']['Row']

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

export async function getDreLinhas(ano: number, mes: number): Promise<DreLinha[]> {
  const { data, error } = await supabase
    .from('dre_linhas')
    .select('*')
    .eq('ano', ano)
    .eq('mes', mes)
    .order('codigo', { ascending: true })

  if (error) throw error
  return data || []
}
