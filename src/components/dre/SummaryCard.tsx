import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const formatBRL = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)

function VarianceBadge({
  curr,
  prev,
  inverted,
}: {
  curr: number | null
  prev: number | null
  inverted?: boolean
}) {
  if (curr === null || prev === null)
    return (
      <Badge
        variant="outline"
        className="bg-slate-800 text-slate-400 border-slate-700 font-medium px-2 py-0.5"
      >
        Sem dados
      </Badge>
    )
  const pct = prev === 0 ? 0 : (curr / prev - 1) * 100
  if (pct === 0)
    return (
      <Badge variant="outline" className="bg-slate-800 text-slate-400 border-slate-700">
        0.0%
      </Badge>
    )

  const isGood = inverted ? pct < 0 : pct > 0
  return (
    <Badge
      variant="outline"
      className={cn(
        'border-transparent font-semibold px-2 py-0.5',
        isGood ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400',
      )}
    >
      {pct > 0 ? (
        <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
      ) : (
        <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
      )}
      {Math.abs(pct).toFixed(1)}%
    </Badge>
  )
}

export function SummaryCard({
  title,
  current,
  previous,
  inverted,
}: {
  title: string
  current: number | null
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
              {current !== null ? formatBRL(current) : 'N/A'}
            </div>
            <div className="text-sm text-slate-500 mt-1">
              vs {previous !== null ? formatBRL(previous) : 'N/A'} (ano anterior)
            </div>
          </div>
          <VarianceBadge curr={current} prev={previous} inverted={inverted} />
        </div>
      </CardContent>
      <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/50 to-transparent opacity-50 z-0 pointer-events-none" />
    </Card>
  )
}
