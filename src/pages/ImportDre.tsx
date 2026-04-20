import { useState, useEffect } from 'react'
import { FileSpreadsheet } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { useRealtime } from '@/hooks/use-realtime'
import { getDreUploads, deleteDreUpload, type DreUpload } from '@/services/dre'
import { DreUploadZone } from '@/components/dre/DreUploadZone'
import { DreHistoryTable } from '@/components/dre/DreHistoryTable'

export default function ImportDre() {
  const [history, setHistory] = useState<DreUpload[]>([])

  const fetchHistory = async () => {
    try {
      const data = await getDreUploads()
      setHistory(data)
    } catch (e: any) {
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar o histórico.',
        variant: 'destructive',
      })
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  useRealtime('dre_uploads', () => {
    fetchHistory()
  })

  const handleDelete = async (id: string) => {
    try {
      await deleteDreUpload(id)
      setHistory((prev) => prev.filter((item) => item.id !== id))
      toast({ title: 'Sucesso', description: 'O registro foi removido com sucesso.' })
    } catch (e: any) {
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir a importação.',
        variant: 'destructive',
      })
      throw e
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-serif font-bold text-primary flex items-center gap-2">
          <FileSpreadsheet className="w-8 h-8 text-secondary" />
          Importar DRE
        </h1>
        <p className="text-muted-foreground mt-1">
          Faça o upload do arquivo Excel para processamento automático.
        </p>
      </div>

      <DreUploadZone onUploadSuccess={fetchHistory} />

      <div className="mt-10 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        <h2 className="text-2xl font-serif font-bold text-primary mb-4">
          Histórico de Importações
        </h2>
        <DreHistoryTable history={history} onDelete={handleDelete} />
      </div>
    </div>
  )
}
