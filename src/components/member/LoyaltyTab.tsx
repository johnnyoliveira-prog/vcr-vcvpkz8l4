import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Gift, Star } from 'lucide-react'
import { mockRewards } from '@/lib/mocks'

export function LoyaltyTab() {
  const currentPoints = 1250
  const nextRewardPoints = 1500
  const progressPercent = (currentPoints / nextRewardPoints) * 100

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="bg-gradient-to-br from-secondary/20 via-primary/5 to-transparent border-secondary/20 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <CardContent className="p-6 sm:p-8">
          <div className="flex justify-between items-start mb-8 relative z-10">
            <div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-1">
                Seu Saldo
              </p>
              <h2 className="text-4xl sm:text-5xl font-serif font-bold text-primary">
                {currentPoints.toLocaleString('pt-BR')}{' '}
                <span className="text-xl font-sans font-normal text-muted-foreground">pts</span>
              </h2>
            </div>
            <div className="bg-background/80 backdrop-blur-md p-3 rounded-2xl shadow-sm border border-secondary/20">
              <Star className="w-8 h-8 text-secondary fill-secondary/20" />
            </div>
          </div>

          <div className="space-y-3 relative z-10">
            <div className="flex justify-between text-sm">
              <span className="font-semibold text-primary">Nível Atual: Ouro</span>
              <span className="text-muted-foreground font-medium">
                Faltam {nextRewardPoints - currentPoints} pts para próxima recompensa
              </span>
            </div>
            <Progress
              value={progressPercent}
              className="h-3 bg-background border border-primary/10"
            />
          </div>
        </CardContent>
      </Card>

      <div>
        <h3 className="font-serif text-xl font-bold text-primary mb-4 flex items-center gap-2">
          <Gift className="w-5 h-5 text-secondary" /> Recompensas Disponíveis
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {mockRewards.map((reward) => {
            const canRedeem = currentPoints >= reward.points
            return (
              <Card
                key={reward.id}
                className={`transition-all border-none ${canRedeem ? 'shadow-md hover:shadow-lg' : 'shadow-sm opacity-80'}`}
              >
                <CardContent className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 h-full">
                  <div>
                    <h4 className="font-medium text-foreground text-base leading-tight mb-1">
                      {reward.title}
                    </h4>
                    <p className="text-sm font-bold text-secondary">{reward.points} pts</p>
                  </div>
                  <Button
                    variant={canRedeem ? 'default' : 'outline'}
                    disabled={!canRedeem}
                    className={
                      canRedeem
                        ? 'bg-secondary text-secondary-foreground hover:bg-secondary/90 w-full sm:w-auto'
                        : 'w-full sm:w-auto'
                    }
                  >
                    Resgatar
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
