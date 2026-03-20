import { useState, useEffect, useMemo } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { TrendingUp, ListTree, Loader2, DollarSign, Activity, PieChart, Target } from 'lucide-react'
import { WaterfallChart } from '@/components/dre/WaterfallChart'
import { KpiCard } from '@/components/dre/KpiCard'
import { getDreUploads, getDreLinhas } from '@/services/dre'
import type { Database } from '@/lib/supabase/types'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

type DreUpload = Database['public']['Tables']['dre_uploads']['Row']
type DreLinha = Database['public']['Tables']['dre_linhas']['Row']

const MONTHS = [
  { v: '01', l: 'Janeiro' },
  { v: '02', l: 'Fevereiro' },
  { v: '03', l: 'Março' },
  { v: '04', l: 'Abril' },
  { v: '05', l: 'Maio' },
  { v: '06', l: 'Junho' },
  { v: '07', l: 'Julho' },
  { v: '08', l: 'Agosto' },
  { v: '09', l: 'Setembro' },
  { v: '10', l: 'Outubro' },
  { v: '11', l: 'Novembro' },
  { v: '12', l: 'Dezembro' },
]

const formatBRL = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)

export default function DashboardDre() {
  const [month, setMonth] = useState<string>('')
  const [year, setYear] = useState<string>('')
  const [uploads, setUploads] = useState<DreUpload[]>([])
  const [linhas, setLinhas] = useState<DreLinha[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingLinhas, setLoadingLinhas] = useState(false)

  useEffect(() => {
    getDreUploads().then((data) => {
      setUploads(data)
      setLoading(false)

      if (data.length > 0) {
        const years = Array.from(new Set(data.map((u) => String(u.ano)))).sort(
          (a, b) => Number(b) - Number(a),
        )
        const latestYear = years[0]
        const monthsInLatestYear = Array.from(
          new Set(
            data
              .filter((u) => String(u.ano) === latestYear)
              .map((u) => String(u.mes).padStart(2, '0')),
          ),
        ).sort((a, b) => Number(b) - Number(a))

        setYear(latestYear)
        setMonth(monthsInLatestYear[0])
      }
    })
  }, [])

  useEffect(() => {
    if (!year || !month) {
      setLinhas([])
      return
    }
    setLoadingLinhas(true)
    getDreLinhas(Number(year), Number(month)).then((data) => {
      setLinhas(data)
      setLoadingLinhas(false)
    })
  }, [year, month])

  const availableYears = Array.from(new Set(uploads.map((u) => String(u.ano)))).sort(
    (a, b) => Number(b) - Number(a),
  )

  const availableMonths = year
    ? Array.from(
        new Set(
          uploads.filter((u) => String(u.ano) === year).map((u) => String(u.mes).padStart(2, '0')),
        ),
      ).sort((a, b) => Number(a) - Number(b))
    : []

  const handleYearChange = (newYear: string) => {
    setYear(newYear)
    const newMonths = Array.from(
      new Set(
        uploads.filter((u) => String(u.ano) === newYear).map((u) => String(u.mes).padStart(2, '0')),
      ),
    ).sort((a, b) => Number(a) - Number(b))

    if (newMonths.length > 0 && !newMonths.includes(month)) {
      setMonth(newMonths[newMonths.length - 1])
    } else if (newMonths.length === 0) {
      setMonth('')
    }
  }

  const currUpload = useMemo(() => {
    if (!year || !month) return null
    return uploads.find((u) => String(u.ano) === year && String(u.mes).padStart(2, '0') === month)
  }, [uploads, year, month])

  const kpiData = useMemo(() => {
    if (!currUpload) return null
    const receita = Number(currUpload.total_receita) || 0
    const despesa = Number(currUpload.total_despesa) || 0
    const saldo = Number(currUpload.saldo) || receita - despesa
    const cobertura = despesa > 0 ? receita / despesa : 0
    return { receita, despesa, saldo, cobertura }
  }, [currUpload])

  const waterfallData = useMemo(() => {
    if (!currUpload) return []

    const recTotal = Number(currUpload.total_receita) || 0
    const despTotal = Number(currUpload.total_despesa) || 0
    const saldoFinal = Number(currUpload.saldo) || recTotal - despTotal

    let despFinVal = 0
    let despOpVal = 0

    if (linhas.length > 0) {
      const findMaxDespesa = (keyword: string) => {
        const matches = linhas.filter(
          (l) => l.descricao?.toLowerCase().includes(keyword.toLowerCase()) && l.despesa,
        )
        if (matches.length === 0) return 0
        return Math.max(...matches.map((m) => Number(m.despesa) || 0))
      }
      despFinVal = findMaxDespesa('financeir')
      despOpVal = findMaxDespesa('operaciona')

      if (despFinVal + despOpVal > despTotal) {
        const scale = despTotal / (despFinVal + despOpVal)
        despFinVal *= scale
        despOpVal *= scale
      }
    } else if (despTotal > 0) {
      despFinVal = despTotal * 0.15
      despOpVal = despTotal * 0.45
    }

    const despGerVal = despTotal - despFinVal - despOpVal

    const y0 = recTotal
    const y1 = y0 - despFinVal
    const y2 = y1 - despGerVal
    const y3 = saldoFinal

    return [
      {
        name: 'Receita Total',
        range: [0, y0] as [number, number],
        value: recTotal,
        isTotal: true,
        fill: '#10b981', // emerald-500
      },
      {
        name: 'Desp. Financeiras',
        range: [Math.min(y1, y0), Math.max(y1, y0)] as [number, number],
        value: -despFinVal,
        fill: '#e11d48', // rose-600
      },
      {
        name: 'Desp. Gerais',
        range: [Math.min(y2, y1), Math.max(y2, y1)] as [number, number],
        value: -despGerVal,
        fill: '#f43f5e', // rose-500
      },
      {
        name: 'Desp. Operacionais',
        range: [Math.min(y3, y2), Math.max(y3, y2)] as [number, number],
        value: -despOpVal,
        fill: '#fb7185', // rose-400
      },
      {
        name: 'Saldo Final',
        range: [Math.min(0, y3), Math.max(0, y3)] as [number, number],
        value: y3,
        isTotal: true,
        fill: y3 >= 0 ? '#3b82f6' : '#ef4444', // blue-500 or red-500
      },
    ]
  }, [currUpload, linhas])

  if (loading) {
    return (
      <div className="-m-6 lg:-m-8 p-6 lg:p-8 bg-[#0f172a] min-h-[calc(100vh-4rem)] dark flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="-m-6 lg:-m-8 p-6 lg:p-8 bg-[#0f172a] min-h-[calc(100vh-4rem)] dark text-slate-50 flex flex-col space-y-6 animate-fade-in relative z-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
        <div>
          <h1 className="text-3xl font-serif font-bold text-slate-50 flex items-center gap-2">
            <TrendingUp className="w-8 h-8 text-blue-500" /> Dashboard DRE
          </h1>
          <p className="text-slate-400 mt-1">Análise de Performance Financeira</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <Select value={month} onValueChange={setMonth} disabled={availableMonths.length === 0}>
            <SelectTrigger className="w-full sm:w-[140px] bg-slate-900 border-slate-700 text-slate-200">
              <SelectValue placeholder="Mês" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
              {availableMonths.map((m) => (
                <SelectItem key={m} value={m} className="focus:bg-slate-800">
                  {MONTHS.find((x) => x.v === m)?.l || m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={year}
            onValueChange={handleYearChange}
            disabled={availableYears.length === 0}
          >
            <SelectTrigger className="w-full sm:w-[120px] bg-slate-900 border-slate-700 text-slate-200">
              <SelectValue placeholder="Ano" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
              {availableYears.map((y) => (
                <SelectItem key={y} value={y} className="focus:bg-slate-800">
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <WaterfallChart
        title={`Fluxo de Caixa (${month ? MONTHS.find((m) => m.v === month)?.l : 'N/A'} ${year || 'N/A'})`}
        data={waterfallData}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6 relative z-10">
        <KpiCard
          title="Receita Total"
          value={kpiData ? formatBRL(kpiData.receita) : 'N/A'}
          description="Montante bruto apurado no período"
          icon={DollarSign}
          valueColor="text-emerald-400"
        />
        <KpiCard
          title="Despesa Total"
          value={kpiData ? formatBRL(kpiData.despesa) : 'N/A'}
          description="Soma de todas as saídas no período"
          icon={Activity}
          valueColor="text-rose-400"
        />
        <KpiCard
          title="Saldo do Período"
          value={kpiData ? formatBRL(kpiData.saldo) : 'N/A'}
          description="Resultado líquido final (Receita - Despesas)"
          icon={PieChart}
          valueColor={kpiData && kpiData.saldo >= 0 ? 'text-blue-400' : 'text-rose-500'}
        />
        <KpiCard
          title="Índice de Cobertura"
          value={kpiData ? `${kpiData.cobertura.toFixed(2)}x` : 'N/A'}
          description="Eficiência operacional (Receita / Despesa)"
          icon={Target}
          valueColor="text-purple-400"
        />
      </div>

      <div className="mt-8 relative z-10 border-t border-slate-800/80 pt-8">
        <h2 className="text-2xl font-serif font-bold text-slate-50 flex items-center gap-2">
          <ListTree className="w-6 h-6 text-blue-500" /> Detalhamento DRE (
          {month ? MONTHS.find((m) => m.v === month)?.l : 'N/A'}/{year || 'N/A'})
        </h2>
      </div>

      <div className="mt-6 relative z-10 bg-slate-900/50 border border-slate-800/80 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-800/50">
              <TableRow className="border-slate-800 hover:bg-transparent">
                <TableHead className="text-slate-300 w-[120px]">Código</TableHead>
                <TableHead className="text-slate-300">Descrição</TableHead>
                <TableHead className="text-slate-300 text-right">Receita (R$)</TableHead>
                <TableHead className="text-slate-300 text-right">Despesa (R$)</TableHead>
                <TableHead className="text-slate-300 text-right">Saldo (R$)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingLinhas ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="border-slate-800/50 hover:bg-transparent">
                    <TableCell>
                      <Skeleton className="h-4 w-16 bg-slate-800" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-48 bg-slate-800" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24 bg-slate-800 ml-auto" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24 bg-slate-800 ml-auto" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24 bg-slate-800 ml-auto" />
                    </TableCell>
                  </TableRow>
                ))
              ) : linhas.length === 0 ? (
                <TableRow className="hover:bg-transparent border-slate-800/50">
                  <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                    Nenhum dado detalhado encontrado para este período.
                  </TableCell>
                </TableRow>
              ) : (
                linhas.map((linha) => (
                  <TableRow key={linha.id} className="border-slate-800/50 hover:bg-slate-800/30">
                    <TableCell className="font-mono text-slate-400">{linha.codigo}</TableCell>
                    <TableCell
                      className={cn(
                        'text-slate-200',
                        linha.nivel === 1 && 'font-bold text-slate-100',
                        linha.nivel === 2 && 'pl-4',
                        linha.nivel === 3 && 'pl-8',
                        linha.nivel === 4 && 'pl-12 text-slate-400',
                      )}
                    >
                      {linha.descricao}
                    </TableCell>
                    <TableCell className="text-right text-emerald-400/90">
                      {linha.receita ? formatBRL(linha.receita) : '-'}
                    </TableCell>
                    <TableCell className="text-right text-rose-400/90">
                      {linha.despesa ? formatBRL(linha.despesa) : '-'}
                    </TableCell>
                    <TableCell
                      className={cn(
                        'text-right font-medium',
                        (linha.saldo || 0) >= 0 ? 'text-emerald-400' : 'text-rose-400',
                      )}
                    >
                      {linha.saldo ? formatBRL(linha.saldo) : '-'}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
