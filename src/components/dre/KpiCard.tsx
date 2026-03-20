import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface KpiCardProps {
  title: string
  value: string | React.ReactNode
  description: string
  icon: React.ElementType
  valueColor?: string
}

export function KpiCard({
  title,
  value,
  description,
  icon: Icon,
  valueColor = 'text-slate-50',
}: KpiCardProps) {
  return (
    <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700/60 shadow-xl relative overflow-hidden group hover:border-slate-600 transition-all h-full">
      <CardContent className="p-6 relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">{title}</h3>
          <div className="p-2 bg-slate-800/80 rounded-lg shadow-inner">
            <Icon className="w-5 h-5 text-blue-400" />
          </div>
        </div>
        <div className={cn('text-3xl font-bold font-mono tracking-tight mb-2', valueColor)}>
          {value}
        </div>
        <p className="text-xs text-slate-500 mt-auto">{description}</p>
      </CardContent>
      <div className="absolute inset-0 bg-gradient-to-t from-blue-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </Card>
  )
}
