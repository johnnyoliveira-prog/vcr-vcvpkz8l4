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
import { HierarchicalTable } from '@/components/dre/HierarchicalTable'
import { getDreUploads, getDreLinhas } from '@/services/dre'
import type { Database } from '@/lib/supabase/types'

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

  const detailedExpenses = useMemo(() => {
    if (!currUpload || linhas.length === 0) return null

    let despTotal = Number(currUpload.total_despesa) || 0

    const findDetailedVal = (kws: string[]) => {
      const matches = linhas.filter(
        (l) => kws.some((k) => l.descricao?.toLowerCase().includes(k)) && Number(l.despesa) > 0,
      )
      if (!matches.length) return 0

      const roots = matches.filter((m) => {
        if (!m.codigo) return true
        const hasParentInMatches = matches.some(
          (parent) =>
            parent.codigo &&
            m.codigo !== parent.codigo &&
            m.codigo?.startsWith(parent.codigo + '.'),
        )
        return !hasParentInMatches
      })

      return roots.reduce((acc, curr) => acc + (Number(curr.despesa) || 0), 0)
    }

    const raw = {
      pessoal: findDetailedVal([
        'pessoal',
        'salário',
        'salario',
        'férias',
        'ferias',
        '13º',
        'décimo terceiro',
        'encargo',
        'pró-labore',
        'pro labore',
        'benefício',
        'fgts',
        'inss',
      ]),
      financeira: findDetailedVal(['financeir', 'bancár', 'juros', 'tarifa', 'iof', 'multa']),
      gerais: findDetailedVal([
        'geral',
        'gerais',
        'administrativ',
        'adm',
        'ocupação',
        'honorário',
        'manutenção',
        'água',
        'luz',
        'telefone',
        'aluguel',
        'energia',
        'internet',
      ]),
      impostos: findDetailedVal([
        'imposto',
        'tributo',
        'taxa',
        'das',
        'simples',
        'icms',
        'iss',
        'pis',
        'cofins',
        'irpj',
        'csll',
      ]),
      maoDeObra: findDetailedVal(['mão de obra', 'mao de obra', 'terceirizad']),
      insumos: findDetailedVal([
        'insumo',
        'matéria-prima',
        'materia-prima',
        'embalagem',
        'rótulo',
        'rotulo',
        'rolha',
        'garrafa',
        'levedura',
        'barrica',
        'caixa',
      ]),
      operacao: findDetailedVal([
        'prestação de serviço',
        'prestacao de servico',
        'serviços prestados',
        'servicos prestados',
        'operação',
        'operacao',
        'logística',
        'frete',
      ]),
      ferramentas: findDetailedVal(['ferramenta', 'utensílio', 'utensilio', 'equipamento', 'peça']),
      publicidade: findDetailedVal([
        'publicidade',
        'marketing',
        'propaganda',
        'anúncio',
        'anuncio',
        'evento',
        'comercial',
        'rede social',
        'patrocínio',
      ]),
    }

    const sum = Object.values(raw).reduce((a, b) => a + b, 0)

    if (despTotal > 0) {
      if (sum > despTotal) {
        const scale = despTotal / sum
        for (const key in raw) {
          raw[key as keyof typeof raw] *= scale
        }
      } else if (sum < despTotal) {
        raw.gerais += despTotal - sum
      }
    } else if (sum > 0) {
      despTotal = sum
    }

    return {
      ...raw,
      totalScaled: despTotal,
    }
  }, [currUpload, linhas])

  const categorizedValues = useMemo(() => {
    if (!currUpload) return null

    let recTotal = Number(currUpload.total_receita) || 0
    const despTotal = detailedExpenses
      ? detailedExpenses.totalScaled
      : Number(currUpload.total_despesa) || 0

    if (!detailedExpenses) {
      return {
        recTotal,
        despTotal,
        despFin: despTotal * 0.15,
        despOp: despTotal * 0.45,
        despGer: despTotal * 0.4,
        recFin: recTotal * 0.05,
      }
    }

    const rf =
      linhas.length > 0
        ? (() => {
            const matches = linhas.filter(
              (l) =>
                ['financeir', 'juros', 'rendimento', 'aplicação', 'desconto'].some((k) =>
                  l.descricao?.toLowerCase().includes(k),
                ) && Number(l.receita) > 0,
            )
            return matches.length ? Math.max(...matches.map((m) => Number(m.receita) || 0)) : 0
          })()
        : recTotal * 0.05

    if (recTotal === 0 && rf > 0) {
      recTotal = rf
    }

    return {
      recTotal,
      despTotal,
      despFin: detailedExpenses.financeira,
      despGer: detailedExpenses.gerais,
      despOp:
        detailedExpenses.pessoal +
        detailedExpenses.impostos +
        detailedExpenses.maoDeObra +
        detailedExpenses.insumos +
        detailedExpenses.operacao +
        detailedExpenses.ferramentas +
        detailedExpenses.publicidade,
      recFin: rf,
    }
  }, [currUpload, linhas, detailedExpenses])

  const kpiData = useMemo(() => {
    if (!currUpload || !categorizedValues) return null
    const receita = categorizedValues.recTotal
    const despesa = categorizedValues.despTotal
    const saldo = Number(currUpload.saldo) || receita - despesa
    const cobertura = despesa > 0 ? receita / despesa : 0
    return { receita, despesa, saldo, cobertura }
  }, [currUpload, categorizedValues])

  const expenseCompositionData = useMemo(() => {
    if (!detailedExpenses) return []

    const categories = [
      { name: 'Despesas com Pessoal', value: detailedExpenses.pessoal, fill: '#3b82f6' },
      { name: 'Despesas Financeiras', value: detailedExpenses.financeira, fill: '#f59e0b' },
      { name: 'Despesas/Custos Gerais', value: detailedExpenses.gerais, fill: '#8b5cf6' },
      { name: 'Impostos e Tributos', value: detailedExpenses.impostos, fill: '#ef4444' },
      { name: 'Mão de Obra', value: detailedExpenses.maoDeObra, fill: '#10b981' },
      { name: 'Insumos', value: detailedExpenses.insumos, fill: '#f97316' },
      {
        name: 'Operação - Prestação de Serviços',
        value: detailedExpenses.operacao,
        fill: '#06b6d4',
      },
      { name: 'Ferramentas e Utensílios', value: detailedExpenses.ferramentas, fill: '#64748b' },
      { name: 'Publicidade', value: detailedExpenses.publicidade, fill: '#ec4899' },
    ]

    const totalCat = categories.reduce((acc, curr) => acc + curr.value, 0)

    if (totalCat === 0) return []

    return categories
      .filter((r) => r.value > 0)
      .map((r) => ({
        ...r,
        percent: (r.value / totalCat) * 100,
      }))
      .sort((a, b) => b.value - a.value)
  }, [detailedExpenses])

  const waterfallData = useMemo(() => {
    if (!categorizedValues || !detailedExpenses) return []

    const { recTotal } = categorizedValues

    let currentY = recTotal
    const steps = []

    steps.push({
      name: 'Receita Total',
      fullName: 'Receita Total',
      range: [0, currentY] as [number, number],
      value: currentY,
      isTotal: true,
      fill: '#10b981',
    })

    const cats = [
      { key: 'pessoal', name: 'Pessoal', fullName: 'Despesas com Pessoal', fill: '#3b82f6' },
      { key: 'financeira', name: 'Financeiras', fullName: 'Despesas Financeiras', fill: '#f59e0b' },
      { key: 'gerais', name: 'Gerais', fullName: 'Despesas/Custos Gerais', fill: '#8b5cf6' },
      { key: 'impostos', name: 'Impostos', fullName: 'Impostos e Tributos', fill: '#ef4444' },
      { key: 'maoDeObra', name: 'Mão de Obra', fullName: 'Mão de Obra', fill: '#10b981' },
      { key: 'insumos', name: 'Insumos', fullName: 'Insumos', fill: '#f97316' },
      { key: 'operacao', name: 'Operação', fullName: 'Operação - Prest. Serv.', fill: '#06b6d4' },
      {
        key: 'ferramentas',
        name: 'Ferram.',
        fullName: 'Ferramentas e Utensílios',
        fill: '#64748b',
      },
      { key: 'publicidade', name: 'Publicidade', fullName: 'Publicidade', fill: '#ec4899' },
    ]

    cats.forEach((c) => {
      const val = detailedExpenses[c.key as keyof Omit<typeof detailedExpenses, 'totalScaled'>]
      if (typeof val === 'number' && val > 0) {
        const nextY = currentY - val
        steps.push({
          name: c.name,
          fullName: c.fullName,
          range: [Math.min(nextY, currentY), Math.max(nextY, currentY)] as [number, number],
          value: -val,
          fill: c.fill,
        })
        currentY = nextY
      }
    })

    steps.push({
      name: 'Saldo Final',
      fullName: 'Saldo Final',
      range: [Math.min(0, currentY), Math.max(0, currentY)] as [number, number],
      value: currentY,
      isTotal: true,
      fill: currentY >= 0 ? '#3b82f6' : '#ef4444',
    })

    return steps
  }, [categorizedValues, detailedExpenses])

  const heatmapData = useMemo(() => {
    if (!categorizedValues) return []
    const { despTotal, despFin, despGer, despOp } = categorizedValues

    const despBasis = despTotal > 0 ? despTotal : 1

    if (!detailedExpenses) {
      return [
        { name: 'Despesas com Pessoal', value: 0, percentage: 0 },
        { name: 'Despesas financeiras', value: despFin, percentage: (despFin / despBasis) * 100 },
        { name: 'despesas/custos gerais', value: despGer, percentage: (despGer / despBasis) * 100 },
        { name: 'Impostos e Tributos', value: 0, percentage: 0 },
        { name: 'Mão de Obra', value: 0, percentage: 0 },
        { name: 'Insumos', value: 0, percentage: 0 },
        { name: 'Operação - Prestação de Serviços', value: 0, percentage: 0 },
        { name: 'Ferramentas e Utensílios', value: 0, percentage: 0 },
        { name: 'Publicidade', value: 0, percentage: 0 },
        {
          name: 'Despesas/Custo Operacional',
          value: despOp,
          percentage: (despOp / despBasis) * 100,
        },
      ]
    }

    return [
      {
        name: 'Despesas com Pessoal',
        value: detailedExpenses.pessoal,
        percentage: (detailedExpenses.pessoal / despBasis) * 100,
      },
      {
        name: 'Despesas financeiras',
        value: detailedExpenses.financeira,
        percentage: (detailedExpenses.financeira / despBasis) * 100,
      },
      {
        name: 'despesas/custos gerais',
        value: detailedExpenses.gerais,
        percentage: (detailedExpenses.gerais / despBasis) * 100,
      },
      {
        name: 'Impostos e Tributos',
        value: detailedExpenses.impostos,
        percentage: (detailedExpenses.impostos / despBasis) * 100,
      },
      {
        name: 'Mão de Obra',
        value: detailedExpenses.maoDeObra,
        percentage: (detailedExpenses.maoDeObra / despBasis) * 100,
      },
      {
        name: 'Insumos',
        value: detailedExpenses.insumos,
        percentage: (detailedExpenses.insumos / despBasis) * 100,
      },
      {
        name: 'Operação - Prestação de Serviços',
        value: detailedExpenses.operacao,
        percentage: (detailedExpenses.operacao / despBasis) * 100,
      },
      {
        name: 'Ferramentas e Utensílios',
        value: detailedExpenses.ferramentas,
        percentage: (detailedExpenses.ferramentas / despBasis) * 100,
      },
      {
        name: 'Publicidade',
        value: detailedExpenses.publicidade,
        percentage: (detailedExpenses.publicidade / despBasis) * 100,
      },
      {
        name: 'Despesas/Custo Operacional',
        value: despOp,
        percentage: (despOp / despBasis) * 100,
      },
    ]
  }, [categorizedValues, detailedExpenses])

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

    const last12 = sorted.slice(0, 12).reverse()

    return last12.map((item) => {
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

      {waterfallData.length > 0 && (
        <WaterfallChart title={`Fluxo de Caixa (${currentPeriodLabel})`} data={waterfallData} />
      )}

      {yearlyData.length > 0 && <RevenueExpenseChart data={yearlyData} year={year} />}

      {currUpload && <DistributionHeatmap data={heatmapData} period={currentPeriodLabel} />}

      {comboChartData.length > 0 && <ComboChart data={comboChartData} />}

      <div className="mt-8 relative z-10 border-t border-slate-800/80 pt-8">
        <h2 className="text-2xl font-serif font-bold text-slate-50 flex items-center gap-2">
          <ListTree className="w-6 h-6 text-blue-500" /> Detalhamento DRE ({currentPeriodLabel})
        </h2>
      </div>

      <HierarchicalTable linhas={linhas} loading={loadingLinhas} />
    </div>
  )
}
