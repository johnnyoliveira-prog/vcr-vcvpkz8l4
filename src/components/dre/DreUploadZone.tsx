import { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { UploadCloud, Loader2, File as FileIcon } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase/client'

interface DreUploadZoneProps {
  onUploadSuccess: () => void
}

export function DreUploadZone({ onUploadSuccess }: DreUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelection = (file: File) => {
    if (!file.name.endsWith('.xlsx')) {
      toast({
        title: 'Formato inválido',
        description: 'Selecione um arquivo Excel (.xlsx).',
        variant: 'destructive',
      })
      return
    }
    const match = file.name.match(/(\d{4})-(\d{2})/)
    if (!match) {
      toast({
        title: 'Nome inválido',
        description: 'O nome do arquivo deve conter o período (AAAA-MM).',
        variant: 'destructive',
      })
      return
    }
    setSelectedFile(file)
  }

  const confirmUpload = async () => {
    if (!selectedFile) return
    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', selectedFile)

      const {
        data: { session },
      } = await supabase.auth.getSession()

      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/processar-dre`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${session?.access_token}` },
        body: formData,
      })

      const responseData = await res.json()
      if (!res.ok) throw new Error(responseData.error || 'Erro no servidor')

      const match = selectedFile.name.match(/(\d{4})-(\d{2})/)
      const periodoStr = match ? `${match[1]}-${match[2]}` : 'Desconhecido'

      toast({
        title: 'Sucesso',
        description: `DRE importado com sucesso! ${responseData.processed_lines} linhas processadas para o período ${periodoStr}`,
      })
      setSelectedFile(null)
      onUploadSuccess()
    } catch (error: any) {
      toast({ title: 'Erro na importação', description: error.message, variant: 'destructive' })
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <Card className="border-none shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-serif text-primary">Upload de Arquivo</CardTitle>
        <CardDescription>
          Formatos suportados: .xlsx (Excel). Nome deve conter o período (AAAA-MM).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <input
          type="file"
          accept=".xlsx"
          className="hidden"
          ref={fileInputRef}
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleFileSelection(file)
          }}
        />

        {selectedFile ? (
          <div className="border rounded-xl p-6 flex flex-col items-center justify-center text-center bg-card shadow-sm animate-fade-in">
            <FileIcon className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-lg font-semibold mb-1 text-foreground">{selectedFile.name}</h3>
            <p className="text-sm text-muted-foreground mb-6">
              {(selectedFile.size / 1024).toFixed(2)} KB
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setSelectedFile(null)}
                disabled={isUploading}
              >
                Cancelar
              </Button>
              <Button onClick={confirmUpload} disabled={isUploading}>
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processando...
                  </>
                ) : (
                  'Confirmar Importação'
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div
            className={cn(
              'border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200',
              isDragging
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/20 hover:border-secondary/50 hover:bg-secondary/5',
            )}
            onDragOver={(e) => {
              e.preventDefault()
              setIsDragging(true)
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault()
              setIsDragging(false)
              const file = e.dataTransfer.files?.[0]
              if (file) handleFileSelection(file)
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            <UploadCloud className="w-12 h-12 text-secondary mb-4" />
            <h3 className="text-lg font-semibold mb-1 text-foreground">
              Arraste e solte sua DRE aqui
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              ou clique para selecionar um arquivo .xlsx
            </p>
            <Button variant="secondary" className="pointer-events-none">
              Selecionar Arquivo
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
