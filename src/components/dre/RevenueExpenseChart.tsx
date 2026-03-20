import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts'
import { ChartContainer } from '@/components/ui/chart'

const formatBRL = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)

interface YearlyData {
  month: string
  receita: number
  despesa: number
}

interface RevenueExpenseChartProps {
  data: YearlyData[]
  year: string
}

export function RevenueExpenseChart({ data, year }: RevenueExpenseChartProps) {
  return (
    <Card className="bg-slate-900/50 border-slate-800/80 shadow-2xl relative z-10 flex-1 mt-6">
      <CardHeader>
        <CardTitle className="font-serif text-xl text-slate-200">
          Comparativo Receita x Despesa ({year})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            receita: { label: 'Receita', color: '#3b82f6' }, // blue-500
            despesa: { label: 'Despesa', color: '#ef4444' }, // red-500
          }}
          className="h-[400px] w-full"
        >
          <BarChart data={data} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
            <XAxis
              dataKey="month"
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
              maxBarSize={40}
            />
            <Bar
              dataKey="despesa"
              name="Despesa"
              fill="var(--color-despesa)"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
