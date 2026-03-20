import { useState, useEffect, useMemo } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  TrendingUp,
  ListTree,
  Loader2,
  DollarSign,
  Activity,
  PieChart,
  CalendarDays,
} from 'lucide-react'
import { WaterfallChart } from '@/components/dre/WaterfallChart'
import { KpiCard } from '@/components/dre/KpiCard'
import { RevenueExpenseChart } from '@/components/dre/RevenueExpenseChart'
import { DistributionHeatmap } from '@/components/dre/DistributionHeatmap'
import { ComboChart } from '@/components/dre/ComboChart'
import { ExpenseCompositionChart } from '@/components/dre/ExpenseCompositionChart'
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

  const expenseCompositionData = useMemo(() => {
    if (!currUpload) return []
    const despTotal = Number(currUpload.total_despesa) || 0
    if (despTotal === 0) return []

    let despFinVal = 0
    let despOpVal = 0

    if (linhas.length > 0) {
      const findMaxDespesa = (keyword: string) => {
        const matches = linhas.filter(
          (l) =>
            l.descricao?.toLowerCase().includes(keyword.toLowerCase()) && Number(l.despesa) > 0,
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
    } else {
      despFinVal = despTotal * 0.15
      despOpVal = despTotal * 0.45
    }

    const despGerVal = Math.max(0, despTotal - despFinVal - despOpVal)

    return [
      {
        name: 'Financeiras',
        value: despFinVal,
        percent: (despFinVal / despTotal) * 100,
        fill: '#f59e0b', // amber-500
      },
      {
        name: 'Gerais',
        value: despGerVal,
        percent: (despGerVal / despTotal) * 100,
        fill: '#8b5cf6', // violet-500
      },
      {
        name: 'Operacionais',
        value: despOpVal,
        percent: (despOpVal / despTotal) * 100,
        fill: '#ec4899', // pink-500
      },
    ]
  }, [currUpload, linhas])

  const yearlyData = useMemo(() => {
    if (!year) return []
    const yearUploads = uploads.filter((u) => String(u.ano) === year)

    const grouped = yearUploads.reduce(
      (acc, curr) => {
        const m = Number(curr.mes)
        if (!acc[m]) {
          acc[m] = { receita: 0, despesa: 0 }
        }
        acc[m].receita += Number(curr.total_receita) || 0
        acc[m].despesa += Number(curr.total_despesa) || 0
        return acc
      },
      {} as Record<number, { receita: number; despesa: number }>,
    )

    const sortedMonths = Object.keys(grouped)
      .map(Number)
      .sort((a, b) => a - b)

    return sortedMonths.map((m) => ({
      month: MONTHS.find((x) => Number(x.v) === m)?.l || String(m),
      receita: grouped[m].receita,
      despesa: grouped[m].despesa,
    }))
  }, [uploads, year])

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
        fill: '#10b981',
      },
      {
        name: 'Desp. Financeiras',
        range: [Math.min(y1, y0), Math.max(y1, y0)] as [number, number],
        value: -despFinVal,
        fill: '#e11d48',
      },
      {
        name: 'Desp. Gerais',
        range: [Math.min(y2, y1), Math.max(y2, y1)] as [number, number],
        value: -despGerVal,
        fill: '#f43f5e',
      },
      {
        name: 'Desp. Operacionais',
        range: [Math.min(y3, y2), Math.max(y3, y2)] as [number, number],
        value: -despOpVal,
        fill: '#fb7185',
      },
      {
        name: 'Saldo Final',
        range: [Math.min(0, y3), Math.max(0, y3)] as [number, number],
        value: y3,
        isTotal: true,
        fill: y3 >= 0 ? '#3b82f6' : '#ef4444',
      },
    ]
  }, [currUpload, linhas])

  const heatmapData = useMemo(() => {
    if (!currUpload) return []

    const recTotal = Number(currUpload.total_receita) || 0
    const despTotal = Number(currUpload.total_despesa) || 0

    let recFinVal = 0
    let despFinVal = 0
    let despOpVal = 0

    if (linhas.length > 0) {
      const findMax = (keyword: string, type: 'receita' | 'despesa') => {
        const matches = linhas.filter(
          (l) => l.descricao?.toLowerCase().includes(keyword.toLowerCase()) && Number(l[type]) > 0,
        )
        if (matches.length === 0) return 0
        return Math.max(...matches.map((m) => Number(m[type]) || 0))
      }

      recFinVal = findMax('financeir', 'receita')
      despFinVal = findMax('financeir', 'despesa')
      despOpVal = findMax('operaciona', 'despesa')

      if (despFinVal + despOpVal > despTotal) {
        const scale = despTotal / (despFinVal + despOpVal)
        despFinVal *= scale
        despOpVal *= scale
      }
    } else {
      despFinVal = despTotal * 0.15
      despOpVal = despTotal * 0.45
      recFinVal = recTotal * 0.05
    }

    const despGerVal = Math.max(0, despTotal - despFinVal - despOpVal)

    return [
      {
        name: 'Receitas Financeiras',
        value: recFinVal,
        percentage: recTotal > 0 ? (recFinVal / recTotal) * 100 : 0,
      },
      {
        name: 'Despesas Financeiras',
        value: despFinVal,
        percentage: despTotal > 0 ? (despFinVal / despTotal) * 100 : 0,
      },
      {
        name: 'Despesas Gerais',
        value: despGerVal,
        percentage: despTotal > 0 ? (despGerVal / despTotal) * 100 : 0,
      },
      {
        name: 'Despesas Operacionais',
        value: despOpVal,
        percentage: despTotal > 0 ? (despOpVal / despTotal) * 100 : 0,
      },
    ]
  }, [currUpload, linhas])

  const comboChartData = useMemo(() => {
    if (uploads.length === 0) return []

    const grouped = uploads.reduce(
      (acc, curr) => {
        const key = `${curr.ano}-${String(curr.mes).padStart(2, '0')}`
        if (!acc[key]) {
          acc[key] = { key, ano: Number(curr.ano), mes: Number(curr.mes), receita: 0, saldo: 0 }
        }
        acc[key].receita += Number(curr.total_receita) || 0
        acc[key].saldo +=
          Number(curr.saldo) ||
          (Number(curr.total_receita) || 0) - (Number(curr.total_despesa) || 0)
        return acc
      },
      {} as Record<
        string,
        { key: string; ano: number; mes: number; receita: number; saldo: number }
      >,
    )

    const sorted = Object.values(grouped).sort((a, b) => {
      if (a.ano !== b.ano) return b.ano - a.ano
      return b.mes - a.mes
    })

    const last6 = sorted.slice(0, 6).reverse()

    return last6.map((item) => {
      const monthLabel =
        MONTHS.find((m) => Number(m.v) === String(item.mes).padStart(2, '0'))?.l.substring(0, 3) ||
        String(item.mes)
      return {
        label: `${monthLabel}/${item.ano}`,
        receita: item.receita,
        saldo: item.saldo,
      }
    })
  }, [uploads])

  if (loading) {
    return (
      <div className="-m-6 lg:-m-8 p-6 lg:p-8 bg-[#0f172a] min-h-[calc(100vh-4rem)] dark flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    )
  }

  const currentPeriodLabel = `${month ? MONTHS.find((m) => m.v === month)?.l : 'N/A'} ${year || 'N/A'}`

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

      <div className="mt-8 relative z-10 bg-slate-900/40 p-6 rounded-xl border border-slate-800/80 shadow-lg">
        <h2 className="text-xl font-serif font-bold text-slate-50 mb-6 flex items-center gap-2">
          <CalendarDays className="w-6 h-6 text-blue-500" /> Análise do Mês Selecionado (
          {currentPeriodLabel})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <KpiCard
            title="Receita Total do Mês"
            value={kpiData ? formatBRL(kpiData.receita) : 'N/A'}
            description="Entradas brutas apuradas no período"
            icon={DollarSign}
            valueColor="text-emerald-400"
          />
          <KpiCard
            title="Despesa Total do Mês"
            value={kpiData ? formatBRL(kpiData.despesa) : 'N/A'}
            description="Custos e gastos consolidados"
            icon={Activity}
            valueColor="text-rose-400"
          />
          <KpiCard
            title="Saldo do Mês"
            value={kpiData ? formatBRL(kpiData.saldo) : 'N/A'}
            description="Resultado líquido final apurado"
            icon={PieChart}
            valueColor={kpiData && kpiData.saldo >= 0 ? 'text-blue-400' : 'text-rose-500'}
          />
        </div>

        {expenseCompositionData.length > 0 && (
          <ExpenseCompositionChart data={expenseCompositionData} />
        )}
      </div>

      <WaterfallChart title={`Fluxo de Caixa (${currentPeriodLabel})`} data={waterfallData} />

      {yearlyData.length > 0 && <RevenueExpenseChart data={yearlyData} year={year} />}

      {currUpload && <DistributionHeatmap data={heatmapData} period={currentPeriodLabel} />}

      {comboChartData.length > 0 && <ComboChart data={comboChartData} />}

      <div className="mt-8 relative z-10 border-t border-slate-800/80 pt-8">
        <h2 className="text-2xl font-serif font-bold text-slate-50 flex items-center gap-2">
          <ListTree className="w-6 h-6 text-blue-500" /> Detalhamento DRE ({currentPeriodLabel})
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
