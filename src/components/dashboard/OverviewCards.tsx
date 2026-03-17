import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, Users, Target, Truck } from 'lucide-react'

export function OverviewCards() {
  const data = [
    { title: 'Receita Total', value: 'R$ 1.2M', sub: '+12% este mês', icon: DollarSign },
    { title: 'Membros Ativos', value: '450', sub: '+8 novos membros', icon: Users },
    { title: 'Novos Leads (Mês)', value: '64', sub: '24% conversão', icon: Target },
    { title: 'Envios Pendentes', value: '12', sub: 'Lote de Novembro', icon: Truck },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {data.map((item, i) => (
        <Card
          key={i}
          className="hover:shadow-elevation transition-all animate-fade-in-up"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {item.title}
            </CardTitle>
            <item.icon className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-serif text-primary">{item.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{item.sub}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
