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

  const categorizedValues = useMemo(() => {
    if (!currUpload) return null

    let recTotal = Number(currUpload.total_receita) || 0
    let despTotal = Number(currUpload.total_despesa) || 0

    if (linhas.length === 0) {
      return {
        recTotal,
        despTotal,
        despFin: despTotal * 0.15,
        despOp: despTotal * 0.45,
        despGer: despTotal * 0.4,
        recFin: recTotal * 0.05,
      }
    }

    const findVal = (type: 'despesa' | 'receita', kws: string[]) => {
      const matches = linhas.filter(
        (l) => kws.some((k) => l.descricao?.toLowerCase().includes(k)) && Number(l[type]) > 0,
      )
      return matches.length ? Math.max(...matches.map((m) => Number(m[type]) || 0)) : 0
    }

    let df = findVal('despesa', [
      'financeir',
      'bancár',
      'juros',
      'tarifa',
      'iof',
      'multa',
      'encargo',
    ])
    let dop = findVal('despesa', [
      'operaciona',
      'venda',
      'comercia',
      'custo',
      'cmv',
      'cpv',
      'csv',
      'logística',
      'frete',
      'imposto',
      'produção',
    ])
    let dg = findVal('despesa', [
      'geral',
      'gerais',
      'administrativ',
      'adm',
      'pessoal',
      'ocupação',
      'honorário',
      'manutenção',
      'despesas diversas',
    ])

    const sum = df + dop + dg

    if (despTotal > 0) {
      if (sum > despTotal) {
        const scale = despTotal / sum
        df *= scale
        dop *= scale
        dg *= scale
      } else if (sum < despTotal) {
        const diff = despTotal - sum
        dg += diff // Adiciona a diferença em Gerais (catch-all)
      }
    } else if (sum > 0) {
      despTotal = sum
    }

    const rf = findVal('receita', ['financeir', 'juros', 'rendimento', 'aplicação', 'desconto'])

    if (recTotal === 0 && rf > 0) {
      recTotal = rf
    }

    return {
      recTotal,
      despTotal,
      despFin: df,
      despOp: dop,
      despGer: dg,
      recFin: rf,
    }
  }, [currUpload, linhas])

  const kpiData = useMemo(() => {
    if (!currUpload || !categorizedValues) return null
    const receita = categorizedValues.recTotal
    const despesa = categorizedValues.despTotal
    const saldo = Number(currUpload.saldo) || receita - despesa
    const cobertura = despesa > 0 ? receita / despesa : 0
    return { receita, despesa, saldo, cobertura }
  }, [currUpload, categorizedValues])

  const expenseCompositionData = useMemo(() => {
    if (!currUpload || linhas.length === 0) return []

    const findDetailedVal = (kws: string[]) => {
      const matches = linhas.filter(
        (l) => kws.some((k) => l.descricao?.toLowerCase().includes(k)) && Number(l.despesa) > 0,
      )
      if (!matches.length) return 0

      // Encontrar apenas os registros que não possuem "filhos" entre os matches,
      // para evitar somar o valor sintético do grupo junto com o detalhado.
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

    const categories = [
      {
        name: 'Despesas com Pessoal',
        kws: [
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
        ],
        fill: '#3b82f6', // blue-500
      },
      {
        name: 'Despesas Financeiras',
        kws: ['financeir', 'bancár', 'juros', 'tarifa', 'iof', 'multa'],
        fill: '#f59e0b', // amber-500
      },
      {
        name: 'Despesas/Custos Gerais',
        kws: [
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
        ],
        fill: '#8b5cf6', // violet-500
      },
      {
        name: 'Impostos e Tributos',
        kws: [
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
        ],
        fill: '#ef4444', // red-500
      },
      {
        name: 'Mão de Obra',
        kws: ['mão de obra', 'mao de obra', 'terceirizad'],
        fill: '#10b981', // emerald-500
      },
      {
        name: 'Insumos',
        kws: [
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
        ],
        fill: '#f97316', // orange-500
      },
      {
        name: 'Operação - Prestação de Serviços',
        kws: [
          'prestação de serviço',
          'prestacao de servico',
          'serviços prestados',
          'servicos prestados',
          'operação',
          'operacao',
          'logística',
          'frete',
        ],
        fill: '#06b6d4', // cyan-500
      },
      {
        name: 'Ferramentas e Utensílios',
        kws: ['ferramenta', 'utensílio', 'utensilio', 'equipamento', 'peça'],
        fill: '#64748b', // slate-500
      },
      {
        name: 'Publicidade',
        kws: [
          'publicidade',
          'marketing',
          'propaganda',
          'anúncio',
          'anuncio',
          'evento',
          'comercial',
          'rede social',
          'patrocínio',
        ],
        fill: '#ec4899', // pink-500
      },
    ]

    const results = categories.map((c) => ({
      name: c.name,
      value: findDetailedVal(c.kws),
      fill: c.fill,
    }))

    const totalCat = results.reduce((acc, curr) => acc + curr.value, 0)

    if (totalCat === 0) return []

    return results
      .filter((r) => r.value > 0)
      .map((r) => ({
        ...r,
        percent: (r.value / totalCat) * 100,
      }))
      .sort((a, b) => b.value - a.value)
  }, [currUpload, linhas])

  const waterfallData = useMemo(() => {
    if (!categorizedValues) return []

    const { recTotal, despFin, despGer, despOp } = categorizedValues

    const y0 = recTotal
    const y1 = y0 - despFin
    const y2 = y1 - despGer
    const y3 = y2 - despOp

    return [
      {
        name: 'Receita Total',
        range: [0, y0] as [number, number],
        value: y0,
        isTotal: true,
        fill: '#10b981',
      },
      {
        name: 'Desp. Financeiras',
        range: [Math.min(y1, y0), Math.max(y1, y0)] as [number, number],
        value: -despFin,
        fill: '#e11d48',
      },
      {
        name: 'Desp. Gerais',
        range: [Math.min(y2, y1), Math.max(y2, y1)] as [number, number],
        value: -despGer,
        fill: '#f43f5e',
      },
      {
        name: 'Desp. Operacionais',
        range: [Math.min(y3, y2), Math.max(y3, y2)] as [number, number],
        value: -despOp,
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
  }, [categorizedValues])

  const heatmapData = useMemo(() => {
    if (!categorizedValues) return []
    const { recTotal, despTotal, recFin, despFin, despGer, despOp } = categorizedValues

    return [
      {
        name: 'Receitas Financeiras',
        value: recFin,
        percentage: recTotal > 0 ? (recFin / recTotal) * 100 : 0,
      },
      {
        name: 'Despesas Financeiras',
        value: despFin,
        percentage: despTotal > 0 ? (despFin / despTotal) * 100 : 0,
      },
      {
        name: 'Despesas Gerais',
        value: despGer,
        percentage: despTotal > 0 ? (despGer / despTotal) * 100 : 0,
      },
      {
        name: 'Despesas Operacionais',
        value: despOp,
        percentage: despTotal > 0 ? (despOp / despTotal) * 100 : 0,
      },
    ]
  }, [categorizedValues])

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
