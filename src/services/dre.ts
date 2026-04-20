import pb from '@/lib/pocketbase/client'

export interface DreUpload {
  id: string
  ano: number
  mes: number
  total_receita: number
  total_despesa: number
  saldo: number
  file_name?: string
  status?: string
  created_at?: string
  created: string
}

export interface DreLinha {
  id: string
  upload_id: string
  codigo?: string
  descricao?: string
  receita?: number
  despesa?: number
  ano?: number
  mes?: number
  categoria?: string
  competencia?: string
  valor?: number
  created_at?: string
  created: string
}

export async function getDreUploads(): Promise<DreUpload[]> {
  const data = await pb.collection('dre_uploads').getFullList({ sort: '-created' })
  return data.map((d: any) => ({ ...d, created_at: d.created })) as DreUpload[]
}

export async function deleteDreUpload(id: string): Promise<void> {
  await pb.collection('dre_uploads').delete(id)
}

export async function getDreLinhas(ano: number, mes: number): Promise<DreLinha[]> {
  const data = await pb.collection('dre_linhas').getFullList({
    filter: `ano=${ano} && mes=${mes}`,
    sort: 'codigo',
  })
  return data.map((d: any) => ({ ...d, created_at: d.created })) as DreLinha[]
}
