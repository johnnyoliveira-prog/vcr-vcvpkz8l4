import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trash2, Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import type { Database } from '@/lib/supabase/types'

type DreUpload = Database['public']['Tables']['dre_uploads']['Row']

const formatBRL = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('pt-BR')

interface DreHistoryTableProps {
  history: DreUpload[]
  onDelete: (id: string) => Promise<void>
}

export function DreHistoryTable({ history, onDelete }: DreHistoryTableProps) {
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return
    setIsDeleting(true)
    try {
      await onDelete(itemToDelete)
    } catch (err) {
      // errors handled by parent
    } finally {
      setIsDeleting(false)
      setItemToDelete(null)
    }
  }

  return (
    <>
      <Card className="border-none shadow-sm">
        <CardContent className="p-0">
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="font-semibold">Período</TableHead>
                  <TableHead className="font-semibold">Nome do Arquivo</TableHead>
                  <TableHead className="font-semibold">Data de Importação</TableHead>
                  <TableHead className="font-semibold text-right">Receita Total (R$)</TableHead>
                  <TableHead className="font-semibold text-right">Despesa Total (R$)</TableHead>
                  <TableHead className="font-semibold text-right">Saldo (R$)</TableHead>
                  <TableHead className="font-semibold text-center w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                      Nenhum histórico encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  history.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium text-foreground">
                        {record.mes && record.ano
                          ? `${String(record.mes).padStart(2, '0')}/${record.ano}`
                          : record.periodo}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{record.nome_arquivo}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(record.created_at)}
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
                          disabled={isDeleting && itemToDelete === record.id}
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

      <Dialog
        open={!!itemToDelete}
        onOpenChange={(open) => !open && !isDeleting && setItemToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-serif text-primary">
              Confirmar Exclusão
            </DialogTitle>
            <DialogDescription className="text-base mt-2 text-muted-foreground">
              Esta ação é permanente e removerá todos os dados associados a este período específico.
              Tem certeza que deseja excluir esta importação?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 sm:justify-end gap-3">
            <Button variant="outline" onClick={() => setItemToDelete(null)} disabled={isDeleting}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete} disabled={isDeleting}>
              {isDeleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Confirmar Exclusão
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
