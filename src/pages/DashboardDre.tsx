import { useState, useEffect } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { TrendingUp, CalendarDays, ListTree, Loader2 } from 'lucide-react'
import { SummaryCard } from '@/components/dre/SummaryCard'
import { ComparisonChart } from '@/components/dre/ComparisonChart'
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

const getQuarterInfo = (month: string) => {
  const q = Math.ceil(parseInt(month, 10) / 3)
  return {
    label: `T${q}`,
    months: [
      String((q - 1) * 3 + 1).padStart(2, '0'),
      String((q - 1) * 3 + 2).padStart(2, '0'),
      String(q * 3).padStart(2, '0'),
    ],
  }
}

const formatBRL = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)

export default function DashboardDre() {
  const [month, setMonth] = useState(String(new Date().getMonth() + 1).padStart(2, '0'))
  const [year, setYear] = useState(String(new Date().getFullYear()))
  const [uploads, setUploads] = useState<DreUpload[]>([])
  const [linhas, setLinhas] = useState<DreLinha[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingLinhas, setLoadingLinhas] = useState(false)

  useEffect(() => {
    getDreUploads().then((data) => {
      setUploads(data)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    setLoadingLinhas(true)
    getDreLinhas(Number(year), Number(month)).then((data) => {
      setLinhas(data)
      setLoadingLinhas(false)
    })
  }, [year, month])

  const agg: Record<string, Record<string, { rev: number; exp: number }>> = {}
  uploads.forEach((u) => {
    const y = String(u.ano)
    const m = String(u.mes).padStart(2, '0')
    if (!agg[y]) agg[y] = {}
    if (!agg[y][m]) agg[y][m] = { rev: 0, exp: 0 }
    agg[y][m].rev += Number(u.total_receita) || 0
    agg[y][m].exp += Number(u.total_despesa) || 0
  })

  const prevYear = String(parseInt(year) - 1)
  const currData = agg[year]?.[month] || null
  const prevData = agg[prevYear]?.[month] || null

  const chartData = [
    { name: 'Receita', [year]: currData?.rev || 0, [prevYear]: prevData?.rev || 0 },
    { name: 'Despesa', [year]: currData?.exp || 0, [prevYear]: prevData?.exp || 0 },
  ]
  const chartConfig = {
    [year]: { label: year, color: '#3b82f6' },
    [prevYear]: { label: prevYear, color: '#475569' },
  }

  const { label: qLabel, months: qMonths } = getQuarterInfo(month)
  let qCurrRev = 0,
    qCurrExp = 0,
    qPrevRev = 0,
    qPrevExp = 0,
    hasQCurr = false,
    hasQPrev = false

  const qChartData = qMonths.map((m) => {
    const cData = agg[year]?.[m]
    const pData = agg[prevYear]?.[m]
    if (cData) {
      qCurrRev += cData.rev
      qCurrExp += cData.exp
      hasQCurr = true
    }
    if (pData) {
      qPrevRev += pData.rev
      qPrevExp += pData.exp
      hasQPrev = true
    }
    return {
      name: MONTHS.find((x) => x.v === m)?.l || m,
      [year]: cData ? cData.rev - cData.exp : 0,
      [prevYear]: pData ? pData.rev - pData.exp : 0,
    }
  })

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
          <p className="text-slate-400 mt-1">Análise de Performance Financeira (YoY)</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <Select value={month} onValueChange={setMonth}>
            <SelectTrigger className="w-full sm:w-[140px] bg-slate-900 border-slate-700 text-slate-200">
              <SelectValue placeholder="Mês" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
              {MONTHS.map((m) => (
                <SelectItem key={m.v} value={m.v} className="focus:bg-slate-800">
                  {m.l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={year} onValueChange={setYear}>
            <SelectTrigger className="w-full sm:w-[120px] bg-slate-900 border-slate-700 text-slate-200">
              <SelectValue placeholder="Ano" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
              <SelectItem
                value={String(new Date().getFullYear() - 1)}
                className="focus:bg-slate-800"
              >
                {new Date().getFullYear() - 1}
              </SelectItem>
              <SelectItem value={String(new Date().getFullYear())} className="focus:bg-slate-800">
                {new Date().getFullYear()}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        <SummaryCard
          title="Receita Total"
          current={currData ? currData.rev : null}
          previous={prevData ? prevData.rev : null}
        />
        <SummaryCard
          title="Despesa Total"
          current={currData ? currData.exp : null}
          previous={prevData ? prevData.exp : null}
          inverted
        />
        <SummaryCard
          title="Saldo do Período"
          current={currData ? currData.rev - currData.exp : null}
          previous={prevData ? prevData.rev - prevData.exp : null}
        />
      </div>

      <ComparisonChart
        title={`Comparativo Financeiro (${MONTHS.find((m) => m.v === month)?.l})`}
        data={chartData}
        config={chartConfig}
        year={year}
        prevYear={prevYear}
      />

      <div className="mt-8 relative z-10 border-t border-slate-800/80 pt-8">
        <h2 className="text-2xl font-serif font-bold text-slate-50 flex items-center gap-2">
          <CalendarDays className="w-6 h-6 text-blue-500" /> Comparativo Trimestral ({qLabel})
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 mt-6">
        <SummaryCard
          title="Receita Total do Trimestre"
          current={hasQCurr ? qCurrRev : null}
          previous={hasQPrev ? qPrevRev : null}
        />
        <SummaryCard
          title="Despesa Total do Trimestre"
          current={hasQCurr ? qCurrExp : null}
          previous={hasQPrev ? qPrevExp : null}
          inverted
        />
        <SummaryCard
          title="Saldo do Trimestre"
          current={hasQCurr ? qCurrRev - qCurrExp : null}
          previous={hasQPrev ? qPrevRev - qPrevExp : null}
        />
      </div>

      <ComparisonChart
        title={`Evolução do Saldo no Trimestre (${qLabel})`}
        data={qChartData}
        config={chartConfig}
        year={year}
        prevYear={prevYear}
      />

      <div className="mt-8 relative z-10 border-t border-slate-800/80 pt-8">
        <h2 className="text-2xl font-serif font-bold text-slate-50 flex items-center gap-2">
          <ListTree className="w-6 h-6 text-blue-500" /> Detalhamento DRE (
          {MONTHS.find((m) => m.v === month)?.l}/{year})
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
