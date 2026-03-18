import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { UploadCloud, FileSpreadsheet, Loader2, Trash2 } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase/client'
import { getDreUploads, deleteDreUpload } from '@/services/dre'
import type { Database } from '@/lib/supabase/types'

type DreUpload = Database['public']['Tables']['dre_uploads']['Row']

const formatBRL = (value: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

export default function ImportDre() {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [history, setHistory] = useState<DreUpload[]>([])
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  const processFile = async (file: File) => {
    if (!file.name.endsWith('.xlsx')) {
      toast({
        title: 'Formato inválido',
        description: 'Selecione um arquivo Excel (.xlsx).',
        variant: 'destructive',
      })
      return
    }

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

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

      toast({
        title: 'Sucesso',
        description: `DRE processada: ${responseData.processed_lines} linhas salvas.`,
      })
      fetchHistory()
    } catch (error: any) {
      toast({ title: 'Erro na importação', description: error.message, variant: 'destructive' })
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return
    try {
      await deleteDreUpload(itemToDelete)
      setHistory(history.filter((item) => item.id !== itemToDelete))
      toast({ title: 'Importação excluída', description: 'O registro foi removido com sucesso.' })
    } catch (e: any) {
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir a importação.',
        variant: 'destructive',
      })
    } finally {
      setItemToDelete(null)
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
            onChange={handleFileChange}
          />
          <div
            className={cn(
              'border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200',
              isDragging
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/20 hover:border-secondary/50 hover:bg-secondary/5',
              isUploading && 'opacity-50 pointer-events-none',
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
              if (file) processFile(file)
            }}
            onClick={() => !isUploading && fileInputRef.current?.click()}
          >
            {isUploading ? (
              <>
                <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                <h3 className="text-lg font-semibold mb-1">Processando arquivo...</h3>
                <p className="text-sm text-muted-foreground">Isso pode levar alguns segundos.</p>
              </>
            ) : (
              <>
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
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="mt-10 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        <h2 className="text-2xl font-serif font-bold text-primary mb-4">
          Histórico de Importações
        </h2>
        <Card className="border-none shadow-sm">
          <CardContent className="p-0">
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="font-semibold">Período</TableHead>
                    <TableHead className="font-semibold">Nome do Arquivo</TableHead>
                    <TableHead className="font-semibold text-right">Receita Total</TableHead>
                    <TableHead className="font-semibold text-right">Despesa Total</TableHead>
                    <TableHead className="font-semibold text-right">Saldo</TableHead>
                    <TableHead className="font-semibold text-center w-[100px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                        Nenhum histórico encontrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    history.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium text-foreground">
                          {record.periodo}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {record.nome_arquivo}
                        </TableCell>
                        <TableCell className="text-right text-green-600 font-medium">
                          {formatBRL(record.total_receita || 0)}
                        </TableCell>
                        <TableCell className="text-right text-destructive font-medium">
                          {formatBRL(record.total_despesa || 0)}
                        </TableCell>
                        <TableCell
                          className={cn(
                            'text-right font-bold',
                            (record.saldo || 0) >= 0 ? 'text-primary' : 'text-destructive',
                          )}
                        >
                          {formatBRL(record.saldo || 0)}
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:bg-destructive/10 hover:text-destructive h-8 w-8"
                            onClick={() => setItemToDelete(record.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-serif text-primary">
              Confirmar Exclusão
            </DialogTitle>
            <DialogDescription className="text-base mt-2">
              Tem certeza que deseja excluir esta importação?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 sm:justify-end gap-3">
            <Button variant="outline" onClick={() => setItemToDelete(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Confirmar Exclusão
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
