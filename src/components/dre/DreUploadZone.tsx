import { useState, useRef } from 'react'
import { UploadCloud, Loader2, FileSpreadsheet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'
import pb from '@/lib/pocketbase/client'

export function DreUploadZone({ onUploadSuccess }: { onUploadSuccess: () => void }) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const processFile = async (file: File) => {
    setIsUploading(true)
    try {
      // Simulate file processing delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const ano = new Date().getFullYear()
      const mes = new Date().getMonth() + 1

      // Use PocketBase to create the mock DRE data
      const upload = await pb.collection('dre_uploads').create({
        file_name: file.name,
        uploaded_by: pb.authStore.record?.id,
        status: 'Processado',
        ano,
        mes,
        total_receita: 150000,
        total_despesa: 100000,
        saldo: 50000,
      })

      await pb.collection('dre_linhas').create({
        upload_id: upload.id,
        descricao: 'Receita de Serviços',
        valor: 150000,
        categoria: 'Receita',
        competencia: `${ano}-${String(mes).padStart(2, '0')}`,
        codigo: '1.1',
        receita: 150000,
        despesa: 0,
        ano,
        mes,
      })

      await pb.collection('dre_linhas').create({
        upload_id: upload.id,
        descricao: 'Despesas com Pessoal',
        valor: 100000,
        categoria: 'Despesa',
        competencia: `${ano}-${String(mes).padStart(2, '0')}`,
        codigo: '2.1',
        receita: 0,
        despesa: 100000,
        ano,
        mes,
      })

      toast({ title: 'Sucesso', description: 'Arquivo processado com sucesso.' })
      onUploadSuccess()
    } catch (error) {
      console.error(error)
      toast({ title: 'Erro', description: 'Falha ao processar arquivo.', variant: 'destructive' })
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  return (
    <div
      className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors duration-200 cursor-pointer flex flex-col items-center justify-center gap-4 ${
        isDragging ? 'border-primary bg-primary/5' : 'border-border bg-card hover:border-primary/50'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".xlsx,.xls,.csv"
        onChange={handleFileChange}
        disabled={isUploading}
      />

      <div className="p-4 rounded-full bg-primary/10 text-primary">
        {isUploading ? (
          <Loader2 className="w-8 h-8 animate-spin" />
        ) : (
          <UploadCloud className="w-8 h-8" />
        )}
      </div>

      <div>
        <p className="text-lg font-medium text-foreground">
          {isUploading ? 'Processando arquivo...' : 'Clique ou arraste um arquivo Excel'}
        </p>
        <p className="text-sm text-muted-foreground mt-1">Suporta .xlsx, .xls, e .csv até 10MB</p>
      </div>

      <Button disabled={isUploading} variant="outline" className="mt-2 pointer-events-none">
        <FileSpreadsheet className="w-4 h-4 mr-2" />
        Selecionar Arquivo
      </Button>
    </div>
  )
}
