import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { cn } from '@/lib/utils'

const MOCK_DATA: Record<string, Record<string, { rev: number; exp: number }>> = {
  '2024': {
    '01': { rev: 150000, exp: 90000 },
    '02': { rev: 145000, exp: 88000 },
    '03': { rev: 160000, exp: 95000 },
    '04': { rev: 155000, exp: 92000 },
    '05': { rev: 170000, exp: 100000 },
    '06': { rev: 180000, exp: 105000 },
    '07': { rev: 175000, exp: 102000 },
    '08': { rev: 190000, exp: 110000 },
    '09': { rev: 185000, exp: 108000 },
    '10': { rev: 200000, exp: 115000 },
    '11': { rev: 220000, exp: 125000 },
    '12': { rev: 250000, exp: 140000 },
  },
  '2025': {
    '01': { rev: 180000, exp: 95000 },
    '02': { rev: 175000, exp: 92000 },
    '03': { rev: 195000, exp: 105000 },
    '04': { rev: 185000, exp: 98000 },
    '05': { rev: 200000, exp: 108000 },
    '06': { rev: 215000, exp: 115000 },
    '07': { rev: 210000, exp: 110000 },
    '08': { rev: 230000, exp: 120000 },
    '09': { rev: 225000, exp: 118000 },
    '10': { rev: 240000, exp: 125000 },
    '11': { rev: 260000, exp: 135000 },
    '12': { rev: 290000, exp: 150000 },
  },
}

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

function VarianceBadge({
  curr,
  prev,
  inverted = false,
}: {
  curr: number
  prev: number | null
  inverted?: boolean
}) {
  if (!prev)
    return (
      <Badge
        variant="outline"
        className="bg-slate-800 text-slate-400 border-slate-700 font-medium px-2 py-0.5"
      >
        Sem dados
      </Badge>
    )
  const pct = (curr / prev - 1) * 100
  const isPos = pct > 0
  const isGood = inverted ? !isPos : isPos

  if (pct === 0)
    return (
      <Badge variant="outline" className="bg-slate-800 text-slate-400 border-slate-700">
        0.0%
      </Badge>
    )

  return (
    <Badge
      variant="outline"
      className={cn(
        'border-transparent font-semibold px-2 py-0.5',
        isGood ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400',
      )}
    >
      {isPos ? (
        <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
      ) : (
        <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
      )}
      {Math.abs(pct).toFixed(1)}%
    </Badge>
  )
}

function SummaryCard({
  title,
  current,
  previous,
  inverted = false,
}: {
  title: string
  current: number
  previous: number | null
  inverted?: boolean
}) {
  return (
    <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900 border-slate-800/60 shadow-xl overflow-hidden group hover:border-slate-700 transition-colors">
      <CardHeader className="pb-3 relative z-10">
        <CardTitle className="text-sm font-medium text-slate-400">{title}</CardTitle>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="flex items-end justify-between">
          <div>
            <div className="text-3xl font-serif font-bold text-slate-50 tracking-tight">
              {formatBRL(current)}
            </div>
            <div className="text-sm text-slate-500 mt-1">
              vs {previous ? formatBRL(previous) : 'N/A'} (ano anterior)
            </div>
          </div>
          <VarianceBadge curr={current} prev={previous} inverted={inverted} />
        </div>
      </CardContent>
      <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/50 to-transparent opacity-50 z-0 pointer-events-none" />
    </Card>
  )
}

export default function DashboardDre() {
  const [month, setMonth] = useState('03')
  const [year, setYear] = useState('2025')

  const prevYear = String(parseInt(year) - 1)
  const currData = MOCK_DATA[year]?.[month] || { rev: 0, exp: 0 }
  const prevData = MOCK_DATA[prevYear]?.[month] || null

  const currBalance = currData.rev - currData.exp
  const prevBalance = prevData ? prevData.rev - prevData.exp : null

  const chartData = [
    { name: 'Receita', [year]: currData.rev, [prevYear]: prevData ? prevData.rev : 0 },
    { name: 'Despesa', [year]: currData.exp, [prevYear]: prevData ? prevData.exp : 0 },
  ]

  const chartConfig = {
    [year]: { label: year, color: '#3b82f6' },
    [prevYear]: { label: prevYear, color: '#475569' },
  }

  return (
    <div className="-m-6 lg:-m-8 p-6 lg:p-8 bg-[#0f172a] min-h-[calc(100vh-4rem)] dark text-slate-50 flex flex-col space-y-6 animate-fade-in relative z-0">
      {/* Header Controls */}
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
              <SelectItem value="2024" className="focus:bg-slate-800">
                2024
              </SelectItem>
              <SelectItem value="2025" className="focus:bg-slate-800">
                2025
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Cards */}
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
        <SummaryCard title="Saldo do Período" current={currBalance} previous={prevBalance} />
      </div>

      {/* Chart */}
      <Card className="bg-slate-900/50 border-slate-800/80 shadow-2xl relative z-10 flex-1">
        <CardHeader>
          <CardTitle className="font-serif text-xl text-slate-200">
            Comparativo Financeiro ({MONTHS.find((m) => m.v === month)?.l})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[350px] w-full">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 0, left: 0, bottom: 0 }}
              barGap={8}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 14 }}
                dy={10}
              />
              <YAxis
                tickFormatter={(val) => `R$ ${val / 1000}k`}
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b' }}
                dx={-10}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) => formatBRL(value as number)}
                    labelClassName="text-slate-400 mb-2"
                  />
                }
                cursor={{ fill: '#1e293b', opacity: 0.4 }}
              />
              <ChartLegend content={<ChartLegendContent />} className="mt-4" />
              <Bar dataKey={year} fill="var(--color-2025)" radius={[4, 4, 0, 0]} maxBarSize={60} />
              <Bar
                dataKey={prevYear}
                fill="var(--color-2024)"
                radius={[4, 4, 0, 0]}
                maxBarSize={60}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
