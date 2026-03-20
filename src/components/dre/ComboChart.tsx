import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { ChartContainer } from '@/components/ui/chart'
import { TrendingUp } from 'lucide-react'

const formatBRL = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)

export interface ComboChartData {
  label: string
  receita: number
  saldo: number
}

interface ComboChartProps {
  data: ComboChartData[]
}

export function ComboChart({ data }: ComboChartProps) {
  return (
    <Card className="bg-slate-900/50 border-slate-800/80 shadow-2xl relative z-10 flex-1 mt-6">
      <CardHeader className="border-b border-slate-800/50 bg-slate-900/30 pb-4">
        <CardTitle className="font-serif text-xl text-slate-200 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-500" />
          Evolução Operacional (Últimos 6 Meses)
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <ChartContainer
          config={{
            receita: { label: 'Receita', color: '#3b82f6' }, // blue-500
            saldo: { label: 'Saldo', color: '#10b981' }, // emerald-500
          }}
          className="h-[400px] w-full"
        >
          <ComposedChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
            <XAxis
              dataKey="label"
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
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-slate-800 border border-slate-700 p-3 rounded-lg shadow-xl min-w-[180px]">
                      <p className="text-slate-400 text-sm mb-2 font-medium">{label}</p>
                      <div className="flex flex-col gap-2">
                        {payload.map((entry, index) => (
                          <div key={index} className="flex justify-between items-center gap-4">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-2.5 h-2.5 rounded-full"
                                style={{ backgroundColor: entry.color }}
                              />
                              <span className="text-slate-300 text-sm">{entry.name}</span>
                            </div>
                            <span className="font-bold font-mono text-slate-100">
                              {formatBRL(Number(entry.value))}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                }
                return null
              }}
            />
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="circle"
              formatter={(value) => <span className="text-slate-300 ml-1">{value}</span>}
            />
            <Bar
              dataKey="receita"
              name="Receita"
              fill="var(--color-receita)"
              radius={[4, 4, 0, 0]}
              maxBarSize={50}
            />
            <Line
              type="monotone"
              dataKey="saldo"
              name="Saldo"
              stroke="var(--color-saldo)"
              strokeWidth={3}
              dot={{ r: 4, strokeWidth: 2, fill: '#0f172a' }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
