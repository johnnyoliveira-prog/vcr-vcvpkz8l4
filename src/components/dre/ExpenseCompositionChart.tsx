import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Cell, LabelList } from 'recharts'
import { ChartContainer } from '@/components/ui/chart'

interface ExpenseCompositionData {
  name: string
  value: number
  percent: number
  fill: string
}

export function ExpenseCompositionChart({ data }: { data: ExpenseCompositionData[] }) {
  return (
    <Card className="bg-slate-900/50 border-slate-800/80 shadow-2xl relative z-10 w-full mt-6">
      <CardHeader className="pb-2 border-b border-slate-800/50 bg-slate-900/30">
        <CardTitle className="font-serif text-lg text-slate-200">Composição de Despesas</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <ChartContainer config={{}} className="h-[350px] w-full">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 60, left: 10, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={true}
              vertical={false}
              stroke="#334155"
            />
            <XAxis type="number" hide domain={[0, 100]} />
            <YAxis
              dataKey="name"
              type="category"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              width={160}
            />
            <Tooltip
              cursor={{ fill: '#1e293b', opacity: 0.4 }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload as ExpenseCompositionData
                  return (
                    <div className="bg-slate-800 border border-slate-700 p-3 rounded-lg shadow-xl">
                      <p className="text-slate-400 text-sm mb-1">{item.name}</p>
                      <p className="text-lg font-bold font-mono text-slate-100">
                        {item.percent.toFixed(1)}%
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        R${' '}
                        {item.value.toLocaleString('pt-BR', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                  )
                }
                return null
              }}
            />
            <Bar dataKey="percent" radius={[0, 4, 4, 0]} maxBarSize={24}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
              <LabelList
                dataKey="percent"
                position="right"
                formatter={(val: number) => `${val.toFixed(1)}%`}
                fill="#f8fafc"
                fontSize={12}
                fontWeight={500}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
