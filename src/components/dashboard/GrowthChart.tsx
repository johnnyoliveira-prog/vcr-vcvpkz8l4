import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { mockChartData } from '@/lib/mocks'

export function GrowthChart() {
  return (
    <Card
      className="col-span-1 lg:col-span-3 hover:shadow-elevation transition-all border-none shadow-sm animate-fade-in-up"
      style={{ animationDelay: '400ms' }}
    >
      <CardHeader>
        <CardTitle className="font-serif text-xl text-primary">Crescimento ALA Private</CardTitle>
        <CardDescription>Evolução de membros e receita nos últimos 6 meses</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ChartContainer
            config={{
              members: { label: 'Membros', color: 'hsl(var(--secondary))' },
              revenue: { label: 'Receita (R$)', color: 'hsl(var(--primary))' },
            }}
          >
            <AreaChart data={mockChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-revenue)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-revenue)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="fillMembers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-members)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-members)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                dy={10}
              />
              <YAxis
                yAxisId="left"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                dx={-10}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="revenue"
                stroke="var(--color-revenue)"
                fill="url(#fillRevenue)"
                strokeWidth={2}
              />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="members"
                stroke="var(--color-members)"
                fill="url(#fillMembers)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}
