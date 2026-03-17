import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { ArrowUpRight, ArrowDownRight, Users, DollarSign, Activity } from 'lucide-react'
import { mockChurnData } from '@/lib/mocks'

export default function Analytics() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary">Analytics Avançado</h1>
          <p className="text-muted-foreground mt-1">
            Métricas de retenção e performance financeira.
          </p>
        </div>
        <Select defaultValue="6m">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="30d">Últimos 30 dias</SelectItem>
            <SelectItem value="6m">Últimos 6 meses</SelectItem>
            <SelectItem value="1y">Anual</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Lifetime Value (LTV)
            </CardTitle>
            <DollarSign className="w-4 h-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-serif font-bold text-primary">R$ 14.850</div>
            <p className="text-xs font-medium text-green-600 flex items-center mt-1">
              <ArrowUpRight className="w-3 h-3 mr-1" /> +8.2% vs período anterior
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Taxa de Churn Atual
            </CardTitle>
            <Activity className="w-4 h-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-serif font-bold text-primary">0.8%</div>
            <p className="text-xs font-medium text-green-600 flex items-center mt-1">
              <ArrowDownRight className="w-3 h-3 mr-1" /> -0.4% vs período anterior
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Custo de Aquisição (CAC)
            </CardTitle>
            <Users className="w-4 h-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-serif font-bold text-primary">R$ 850</div>
            <p className="text-xs font-medium text-muted-foreground mt-1">
              LTV/CAC Ratio: <span className="text-green-600 font-bold">17.4x</span>
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="font-serif text-xl text-primary">Evolução do Churn Rate</CardTitle>
          <CardDescription>
            Porcentagem de cancelamentos de membros nos últimos 6 meses.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] w-full mt-4">
            <ChartContainer
              config={{
                rate: { label: 'Churn %', color: 'hsl(var(--destructive))' },
              }}
            >
              <LineChart data={mockChurnData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  dx={-10}
                  domain={[0, 'auto']}
                />
                <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
                <Line
                  type="monotone"
                  dataKey="rate"
                  stroke="var(--color-rate)"
                  strokeWidth={3}
                  dot={{ r: 4, fill: 'var(--color-rate)' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
