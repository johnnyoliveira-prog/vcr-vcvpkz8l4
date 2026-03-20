import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Layers } from 'lucide-react'

const formatBRL = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)

export interface HeatmapItem {
  name: string
  value: number
  percentage: number
}

interface DistributionHeatmapProps {
  data: HeatmapItem[]
  period: string
}

export function DistributionHeatmap({ data, period }: DistributionHeatmapProps) {
  // Cores: Verde (0-20%), Amarelo (20-50%), Vermelho (50%+)
  const getColor = (pct: number) => {
    if (pct >= 50) return 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:border-rose-500/60'
    if (pct >= 20)
      return 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:border-amber-500/60'
    return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:border-emerald-500/60'
  }

  return (
    <Card className="bg-slate-900/50 border-slate-800/80 shadow-2xl relative z-10 flex-1 mt-6 overflow-hidden">
      <CardHeader className="border-b border-slate-800/50 bg-slate-900/30 pb-4">
        <CardTitle className="font-serif text-xl text-slate-200 flex items-center gap-2">
          <Layers className="w-5 h-5 text-blue-500" />
          Heatmap de Distribuição ({period})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.map((item, idx) => (
            <div
              key={idx}
              className={cn(
                'p-6 rounded-xl border flex flex-col justify-between transition-all duration-300 group',
                getColor(item.percentage),
              )}
            >
              <h3 className="text-sm font-medium uppercase tracking-wider opacity-90 mb-4 group-hover:opacity-100 transition-opacity">
                {item.name}
              </h3>
              <div>
                <div className="text-4xl font-bold font-mono tracking-tight mb-2 flex items-baseline gap-1">
                  {item.percentage.toFixed(1)}
                  <span className="text-xl opacity-70">%</span>
                </div>
                <div className="text-sm font-mono opacity-80 bg-black/20 inline-block px-2 py-1 rounded-md">
                  {formatBRL(item.value)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
