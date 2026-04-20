import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import type { DreUpload } from '@/services/dre'

export function DreHistoryTable({
  history,
  onDelete,
}: {
  history: DreUpload[]
  onDelete: (id: string) => void
}) {
  if (history.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground border rounded-lg bg-slate-50 dark:bg-slate-900/50">
        Nenhum histórico de importação encontrado.
      </div>
    )
  }

  return (
    <div className="border rounded-lg bg-card overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Arquivo</TableHead>
            <TableHead>Mês/Ano</TableHead>
            <TableHead className="text-right">Receita Total</TableHead>
            <TableHead className="text-right">Despesa Total</TableHead>
            <TableHead className="text-right">Saldo</TableHead>
            <TableHead className="w-[100px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {history.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.file_name || 'Upload manual'}</TableCell>
              <TableCell>
                {String(item.mes).padStart(2, '0')}/{item.ano}
              </TableCell>
              <TableCell className="text-right text-emerald-500">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                  Number(item.total_receita),
                )}
              </TableCell>
              <TableCell className="text-right text-rose-500">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                  Number(item.total_despesa),
                )}
              </TableCell>
              <TableCell
                className={`text-right font-bold ${Number(item.saldo) >= 0 ? 'text-blue-500' : 'text-rose-500'}`}
              >
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                  Number(item.saldo),
                )}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(item.id)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
