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
import { UploadCloud, FileSpreadsheet, Check, X, Loader2, Calendar } from 'lucide-react'
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

const calculateLevel = (code: string): number => {
  const parts = code.split('.')
  if (parts.length === 1) return 1
  if (parts.length === 2) {
    if (parts[1].length === 3) return 2 // e.g., 23.001
    return 3 // e.g., 1.02
  }
  return 4 // e.g., 1.02.001
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
    const match = file.name.match(/(\d{4}-\d{2})/)
    setPeriod(match ? match[1] : 'Período não identificado')
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
    </div>
  )
}
