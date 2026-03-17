import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { mockMemberCellar } from '@/lib/mocks'
import { Wine } from 'lucide-react'

export function CellarTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-primary/5 p-4 rounded-xl border border-primary/10">
        <div className="flex items-center gap-3">
          <div className="bg-primary text-primary-foreground p-2 rounded-lg">
            <Wine className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-primary">Valor Estimado</p>
            <p className="text-xl font-serif font-bold text-primary">R$ 15.400</p>
          </div>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-sm text-muted-foreground">Total de Garrafas</p>
          <p className="font-bold text-lg text-foreground">12 un</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {mockMemberCellar.map((wine) => (
          <Card
            key={wine.id}
            className="overflow-hidden border-none shadow-sm hover:shadow-md transition-all group"
          >
            <div className="aspect-[4/3] bg-muted/20 p-4 flex items-center justify-center relative">
              <img
                src={wine.img}
                alt={wine.name}
                className="h-full object-contain drop-shadow-lg group-hover:scale-105 transition-transform duration-500"
              />
              <Badge className="absolute top-3 right-3 bg-secondary text-secondary-foreground border-none font-serif shadow-sm">
                {wine.vintage}
              </Badge>
            </div>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                {wine.type}
              </p>
              <h3 className="font-serif font-bold text-foreground leading-tight mb-4 min-h-[2.5rem]">
                {wine.name}
              </h3>
              <div className="flex justify-between items-center pt-3 border-t border-border/50">
                <span className="text-sm text-muted-foreground">Em Estoque</span>
                <span className="font-mono font-bold text-primary bg-primary/5 px-2 py-1 rounded">
                  {wine.quantity} un
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
