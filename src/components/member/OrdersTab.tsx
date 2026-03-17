import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { mockMemberOrders } from '@/lib/mocks'
import { Package, Truck, CheckCircle2 } from 'lucide-react'

const statusIcons = {
  Preparando: Package,
  'Em Trânsito': Truck,
  Entregue: CheckCircle2,
}

const statusColors = {
  Preparando: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  'Em Trânsito': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  Entregue: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
}

export function OrdersTab() {
  return (
    <div className="space-y-4">
      {mockMemberOrders.map((order) => {
        const Icon = statusIcons[order.status as keyof typeof statusIcons] || Package
        const colorClass = statusColors[order.status as keyof typeof statusColors]

        return (
          <Card key={order.id} className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${colorClass}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground text-sm sm:text-base">{order.id}</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                    {order.date} • {order.items}
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:items-end gap-2 w-full sm:w-auto mt-2 sm:mt-0 pt-3 border-t sm:border-0 sm:pt-0 border-border/50">
                <span className="font-serif font-bold text-primary">{order.total}</span>
                <Badge variant="outline" className={`border-none w-fit ${colorClass}`}>
                  {order.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
