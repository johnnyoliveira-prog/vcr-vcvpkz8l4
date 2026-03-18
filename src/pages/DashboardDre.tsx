import { useState, useEffect } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { TrendingUp, CalendarDays } from 'lucide-react'
import { SummaryCard } from '@/components/dre/SummaryCard'
import { ComparisonChart } from '@/components/dre/ComparisonChart'
import { getDreUploads } from '@/services/dre'

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

export default function DashboardDre() {
  const [month, setMonth] = useState(String(new Date().getMonth() + 1).padStart(2, '0'))
  const [year, setYear] = useState(String(new Date().getFullYear()))
  const [dbData, setDbData] = useState<
    Record<string, Record<string, { rev: number; exp: number }>>
  >({})

  useEffect(() => {
    getDreUploads().then((uploads) => {
      const agg: Record<string, Record<string, { rev: number; exp: number }>> = {}
      uploads.forEach((u) => {
        const y = String(u.ano)
        const m = String(u.mes).padStart(2, '0')
        if (!agg[y]) agg[y] = {}
        if (!agg[y][m]) agg[y][m] = { rev: 0, exp: 0 }
        agg[y][m].rev += Number(u.total_receita) || 0
        agg[y][m].exp += Number(u.total_despesa) || 0
      })
      setDbData(agg)
    })
  }, [])

  const prevYear = String(parseInt(year) - 1)
  const currData = dbData[year]?.[month] || { rev: 0, exp: 0 }
  const prevData = dbData[prevYear]?.[month] || null

  const chartData = [
    { name: 'Receita', [year]: currData.rev, [prevYear]: prevData ? prevData.rev : 0 },
    { name: 'Despesa', [year]: currData.exp, [prevYear]: prevData ? prevData.exp : 0 },
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
    hasQPrev = false

  const qChartData = qMonths.map((m) => {
    const cData = dbData[year]?.[m] || { rev: 0, exp: 0 }
    const pData = dbData[prevYear]?.[m] || null
    qCurrRev += cData.rev
    qCurrExp += cData.exp
    if (pData) {
      qPrevRev += pData.rev
      qPrevExp += pData.exp
      hasQPrev = true
    }
    return {
      name: MONTHS.find((x) => x.v === m)?.l || m,
      [year]: cData.rev - cData.exp,
      [prevYear]: pData ? pData.rev - pData.exp : 0,
    }
  })

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
          current={currData.rev}
          previous={prevData?.rev || null}
        />
        <SummaryCard
          title="Despesa Total"
          current={currData.exp}
          previous={prevData?.exp || null}
          inverted
        />
        <SummaryCard
          title="Saldo do Período"
          current={currData.rev - currData.exp}
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
          current={qCurrRev}
          previous={hasQPrev ? qPrevRev : null}
        />
        <SummaryCard
          title="Despesa Total do Trimestre"
          current={qCurrExp}
          previous={hasQPrev ? qPrevExp : null}
          inverted
        />
        <SummaryCard
          title="Saldo do Trimestre"
          current={qCurrRev - qCurrExp}
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
    </div>
  )
}
