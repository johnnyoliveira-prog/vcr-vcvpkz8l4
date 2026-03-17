import { useState, useRef } from 'react'
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
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { UploadCloud, FileSpreadsheet, Check, X, Loader2, Calendar, Trash2 } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

interface DreRow {
  code: string
  description: string
  level: number
  revenue: number
  expense: number
  balance: number
}

interface ImportHistoryRecord {
  id: string
  period: string
  filename: string
  importDate: string
  totalRevenue: number
  totalExpense: number
  balance: number
}

const MOCK_RAW_DATA = [
  { code: '1', description: 'Receitas Operacionais', rev: 250000, exp: 0 },
  { code: '1.01', description: 'Venda de Vinhos', rev: 180000, exp: 0 },
  { code: '1.01.001', description: 'Vinhos Tintos Reserva', rev: 120000, exp: 0 },
  { code: '1.02', description: 'Eventos e Degustações', rev: 70000, exp: 0 },
  { code: '2', description: 'Despesas Operacionais', rev: 0, exp: 85000 },
  { code: '2.01', description: 'Despesas com Pessoal', rev: 0, exp: 45000 },
  { code: '2.01.001', description: 'Salários e Encargos', rev: 0, exp: 45000 },
  { code: '23', description: 'Outras Receitas/Despesas', rev: 15000, exp: 5000 },
  { code: '23.001', description: 'Rendimentos Financeiros', rev: 15000, exp: 0 },
]

const MOCK_HISTORY: ImportHistoryRecord[] = [
  {
    id: '1',
    period: '02/2025',
    filename: 'dre_2025-02.xlsx',
    importDate: '15/03/2025 14:30',
    totalRevenue: 250000,
    totalExpense: 85000,
    balance: 165000,
  },
  {
    id: '2',
    period: '01/2025',
    filename: 'dre_2025-01.xlsx',
    importDate: '10/02/2025 09:15',
    totalRevenue: 280000,
    totalExpense: 90000,
    balance: 190000,
  },
  {
    id: '3',
    period: '12/2024',
    filename: 'dre_2024-12.xlsx',
    importDate: '15/01/2025 11:45',
    totalRevenue: 420000,
    totalExpense: 150000,
    balance: 270000,
  },
]

const calculateLevel = (code: string): number => {
  const parts = code.split('.')
  if (parts.length === 1) return 1
  if (parts.length === 2) return parts[1].length === 3 ? 2 : 3
  return 4
}

const formatBRL = (value: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

export default function ImportDre() {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [parsedData, setParsedData] = useState<DreRow[] | null>(null)
  const [period, setPeriod] = useState<string>('')
  const [filename, setFilename] = useState<string>('')

  const [history, setHistory] = useState<ImportHistoryRecord[]>(MOCK_HISTORY)
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const processFile = (file: File) => {
    if (!file.name.endsWith('.xlsx')) {
      toast({
        title: 'Formato inválido',
        description: 'Por favor, selecione um arquivo Excel (.xlsx).',
        variant: 'destructive',
      })
      return
    }

    setFilename(file.name)
    const match = file.name.match(/(\d{4})-(\d{2})/)
    setPeriod(match ? `${match[2]}/${match[1]}` : 'Período não identificado')
    setIsUploading(true)

    // Simulate parsing delay
    setTimeout(() => {
      const data = MOCK_RAW_DATA.map((item) => ({
        code: item.code,
        description: item.description,
        level: calculateLevel(item.code),
        revenue: item.rev,
        expense: item.exp,
        balance: item.rev - item.exp,
      }))
      setParsedData(data)
      setIsUploading(false)
      toast({
        title: 'Arquivo processado',
        description: 'Verifique os dados antes de confirmar a importação.',
      })
    }, 1500)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) processFile(file)
  }

  const handleConfirm = () => {
    if (parsedData) {
      const totalRevenue = parsedData
        .filter((r) => r.level === 1)
        .reduce((acc, row) => acc + row.revenue, 0)
      const totalExpense = parsedData
        .filter((r) => r.level === 1)
        .reduce((acc, row) => acc + row.expense, 0)

      const newRecord: ImportHistoryRecord = {
        id: Math.random().toString(),
        period: period || 'Desconhecido',
        filename,
        importDate: new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }),
        totalRevenue,
        totalExpense,
        balance: totalRevenue - totalExpense,
      }
      setHistory([newRecord, ...history])
    }

    toast({
      title: 'Importação concluída',
      description: 'Os dados da DRE foram salvos com sucesso no sistema.',
    })
    setParsedData(null)
    setPeriod('')
    setFilename('')
  }

  const handleCancel = () => {
    setParsedData(null)
    setPeriod('')
    setFilename('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleDeleteConfirm = () => {
    if (itemToDelete) {
      setHistory(history.filter((item) => item.id !== itemToDelete))
      toast({
        title: 'Importação excluída',
        description: 'O registro foi removido do histórico com sucesso.',
      })
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
          Faça o upload do arquivo Excel para processar e visualizar a estrutura financeira.
        </p>
      </div>

      {!parsedData ? (
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-serif text-primary">Upload de Arquivo</CardTitle>
            <CardDescription>Formatos suportados: .xlsx (Excel)</CardDescription>
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
              onDrop={handleDrop}
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
      ) : (
        <Card className="border-none shadow-sm animate-fade-in-up">
          <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4">
            <div>
              <CardTitle className="text-xl font-serif text-primary">Pré-visualização</CardTitle>
              <CardDescription className="flex items-center gap-2 mt-1">
                <FileSpreadsheet className="w-4 h-4" /> {filename}
              </CardDescription>
            </div>
            <Badge
              variant="outline"
              className="bg-primary/5 text-primary border-primary/20 text-sm py-1 px-3"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Período: <span className="font-bold ml-1">{period}</span>
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="font-semibold w-[120px]">Código</TableHead>
                    <TableHead className="font-semibold">Descrição</TableHead>
                    <TableHead className="font-semibold text-center w-[120px]">
                      Nível Hierárquico
                    </TableHead>
                    <TableHead className="font-semibold text-right">Receita (R$)</TableHead>
                    <TableHead className="font-semibold text-right">Despesa (R$)</TableHead>
                    <TableHead className="font-semibold text-right">Saldo (R$)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {parsedData.map((row) => (
                    <TableRow key={row.code}>
                      <TableCell className="font-mono text-sm">{row.code}</TableCell>
                      <TableCell
                        className={cn(
                          'font-medium text-foreground',
                          row.level === 1 && 'font-bold text-primary',
                        )}
                        style={{ paddingLeft: `${(row.level - 1) * 1.5 + 1}rem` }}
                      >
                        {row.description}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant="secondary"
                          className="bg-secondary/20 text-secondary-foreground"
                        >
                          Lvl {row.level}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-green-600 font-medium">
                        {row.revenue > 0 ? formatBRL(row.revenue) : '-'}
                      </TableCell>
                      <TableCell className="text-right text-destructive font-medium">
                        {row.expense > 0 ? formatBRL(row.expense) : '-'}
                      </TableCell>
                      <TableCell
                        className={cn(
                          'text-right font-bold',
                          row.balance >= 0 ? 'text-primary' : 'text-destructive',
                        )}
                      >
                        {formatBRL(row.balance)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-6">
              <Button variant="outline" onClick={handleCancel} className="w-full sm:w-auto">
                <X className="w-4 h-4 mr-2" /> Cancelar
              </Button>
              <Button
                onClick={handleConfirm}
                className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Check className="w-4 h-4 mr-2" /> Confirmar Importação
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Histórico de Importações Section */}
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
                          {record.period}
                        </TableCell>
                        <TableCell className="text-muted-foreground">{record.filename}</TableCell>
                        <TableCell className="text-muted-foreground">{record.importDate}</TableCell>
                        <TableCell className="text-right text-green-600 font-medium">
                          {formatBRL(record.totalRevenue)}
                        </TableCell>
                        <TableCell className="text-right text-destructive font-medium">
                          {formatBRL(record.totalExpense)}
                        </TableCell>
                        <TableCell
                          className={cn(
                            'text-right font-bold',
                            record.balance >= 0 ? 'text-primary' : 'text-destructive',
                          )}
                        >
                          {formatBRL(record.balance)}
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:bg-destructive/10 hover:text-destructive h-8 w-8 transition-colors"
                            onClick={() => setItemToDelete(record.id)}
                            title="Excluir"
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
