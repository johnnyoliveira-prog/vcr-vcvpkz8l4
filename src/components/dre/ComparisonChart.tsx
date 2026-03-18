import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

const formatBRL = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)

export function ComparisonChart({
  title,
  data,
  config,
  year,
  prevYear,
}: {
  title: string
  data: any[]
  config: any
  year: string
  prevYear: string
}) {
  return (
    <Card className="bg-slate-900/50 border-slate-800/80 shadow-2xl relative z-10 flex-1 mt-6">
      <CardHeader>
        <CardTitle className="font-serif text-xl text-slate-200">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-[350px] w-full">
          <BarChart data={data} margin={{ top: 20, right: 0, left: 0, bottom: 0 }} barGap={8}>
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
            <Bar
              dataKey={year}
              fill={`var(--color-${year})`}
              radius={[4, 4, 0, 0]}
              maxBarSize={60}
            />
            <Bar
              dataKey={prevYear}
              fill={`var(--color-${prevYear})`}
              radius={[4, 4, 0, 0]}
              maxBarSize={60}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
