import { Link } from 'react-router-dom'
import { OverviewCards } from '@/components/dashboard/OverviewCards'
import { GrowthChart } from '@/components/dashboard/GrowthChart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Wine, Smartphone } from 'lucide-react'
import { mockActivities } from '@/lib/mocks'

export default function Index() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Bem-vindo ao centro de gestão da Casa Rosada.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            asChild
            className="w-full sm:w-auto text-secondary border-secondary/50 hover:bg-secondary/10"
          >
            <Link to="/member/portal">
              <Smartphone className="w-4 h-4 mr-2" />
              Portal do Membro (App)
            </Link>
          </Button>
          <Button
            variant="outline"
            className="w-full sm:w-auto text-primary border-primary/20 hover:bg-primary/5"
          >
            <Wine className="w-4 h-4 mr-2" />
            Vender Avulso
          </Button>
          <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus className="w-4 h-4 mr-2" />
            Novo Membro
          </Button>
        </div>
      </div>

      <OverviewCards />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <GrowthChart />

        <Card
          className="col-span-1 border-none shadow-sm hover:shadow-elevation transition-all animate-fade-in-up"
          style={{ animationDelay: '500ms' }}
        >
          <CardHeader>
            <CardTitle className="font-serif text-xl text-primary">Atividade Recente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {mockActivities.map((act, i) => (
                <div key={act.id} className="flex items-start gap-3 relative">
                  {i !== mockActivities.length - 1 && (
                    <div className="absolute left-[15px] top-8 bottom-[-16px] w-[1px] bg-border" />
                  )}
                  <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center shrink-0 z-10">
                    <div className="w-2 h-2 rounded-full bg-secondary" />
                  </div>
                  <div>
                    <p className="text-sm">
                      <span className="font-medium text-foreground">{act.user}</span>{' '}
                      <span className="text-muted-foreground">{act.action}</span>
                    </p>
                    <p className="text-xs text-muted-foreground/70 mt-0.5">{act.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="link" className="w-full mt-4 text-secondary hover:text-secondary/80">
              Ver todo o histórico
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
