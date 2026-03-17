import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AlertCircle, Search, Wine, Settings2 } from 'lucide-react'
import { mockInventory } from '@/lib/mocks'

export default function Inventory() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary">Estoque de Vinhos</h1>
          <p className="text-muted-foreground mt-1">Catálogo e disponibilidade para alocações.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto">
          Adicionar Rótulo
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar rótulo ou safra..." className="pl-9 bg-background" />
        </div>
        <Button variant="outline" className="w-full sm:w-auto">
          <Settings2 className="w-4 h-4 mr-2" /> Gerenciar Tipos
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {mockInventory.map((wine, i) => (
          <Card
            key={wine.id}
            className="overflow-hidden hover:shadow-elevation transition-all animate-fade-in-up border-none shadow-sm flex flex-col"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="relative aspect-[3/4] bg-muted/20 p-4 flex items-center justify-center group">
              <img
                src={wine.img}
                alt={wine.name}
                className="h-full object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-500"
              />
              {wine.exclusive && (
                <div className="absolute top-2 left-2">
                  <Badge className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-serif border-none shadow-md">
                    Exclusivo ALA
                  </Badge>
                </div>
              )}
              {wine.stock < 20 && (
                <div className="absolute top-2 right-2">
                  <Badge variant="destructive" className="flex items-center gap-1 shadow-md">
                    <AlertCircle className="w-3 h-3" /> Baixo
                  </Badge>
                </div>
              )}
            </div>
            <CardContent className="p-4 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {wine.type}
                </span>
                <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                  {wine.vintage}
                </span>
              </div>
              <h3 className="font-serif font-bold text-lg leading-tight mb-4 flex-1 text-foreground">
                {wine.name}
              </h3>

              <div className="flex items-center justify-between pt-4 border-t border-border/50">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Wine className="w-4 h-4" />
                  Estoque
                </span>
                <span
                  className={`font-mono font-bold ${wine.stock < 20 ? 'text-destructive' : 'text-foreground'}`}
                >
                  {wine.stock} un
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
