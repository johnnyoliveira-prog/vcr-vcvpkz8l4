import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell, Tooltip } from 'recharts'
import { ChartContainer } from '@/components/ui/chart'
import { cn } from '@/lib/utils'

const formatBRL = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)

interface WaterfallData {
  name: string
  range: [number, number]
  value: number
  isTotal?: boolean
  fill: string
}

export function WaterfallChart({ data, title }: { data: WaterfallData[]; title: string }) {
  return (
    <Card className="bg-slate-900/50 border-slate-800/80 shadow-2xl relative z-10 flex-1 mt-6">
      <CardHeader>
        <CardTitle className="font-serif text-xl text-slate-200">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{}} className="h-[400px] w-full">
          <BarChart data={data} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 13 }}
              dy={10}
            />
            <YAxis
              tickFormatter={(val) => `R$ ${val / 1000}k`}
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b' }}
              dx={-10}
            />
            <Tooltip
              cursor={{ fill: '#1e293b', opacity: 0.4 }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload as WaterfallData
                  return (
                    <div className="bg-slate-800 border border-slate-700 p-3 rounded-lg shadow-xl min-w-[150px]">
                      <p className="text-slate-400 text-sm mb-1">{data.name}</p>
                      <p
                        className={cn(
                          'text-lg font-bold font-mono',
                          data.value >= 0 ? 'text-emerald-400' : 'text-rose-400',
                        )}
                      >
                        {data.value > 0 && !data.isTotal ? '+' : ''}
                        {formatBRL(data.value)}
                      </p>
                    </div>
                  )
                }
                return null
              }}
            />
            <Bar dataKey="range" radius={[4, 4, 4, 4]} maxBarSize={80}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
