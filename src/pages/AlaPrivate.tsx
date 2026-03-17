import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Search, Crown, CheckCircle2, ChevronRight } from 'lucide-react'
import { mockMembers } from '@/lib/mocks'

const tierStyles: Record<string, string> = {
  Reserva: 'bg-primary text-primary-foreground border-none',
  Ouro: 'bg-secondary text-secondary-foreground border-none',
  Prata: 'bg-slate-300 text-slate-800 border-none',
  Bronze: 'bg-amber-700/20 text-amber-900 border-none',
}

const paymentStyles: Record<string, string> = {
  Ativo: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  Pendente: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  Atrasado: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
}

export default function AlaPrivate() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary flex items-center gap-2">
            <Crown className="w-8 h-8 text-secondary" />
            ALA Private
          </h1>
          <p className="text-muted-foreground mt-1">Gestão de membros do clube exclusivo.</p>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar membro..." className="pl-9 bg-background shadow-sm" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {mockMembers.map((member, i) => (
          <Card
            key={member.id}
            className="group hover:shadow-elevation transition-all animate-fade-in-up border-none shadow-sm relative overflow-hidden"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            {member.tier === 'Reserva' && (
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10" />
            )}
            {member.tier === 'Ouro' && (
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-3xl -mr-10 -mt-10" />
            )}

            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
                    <AvatarImage
                      src={`https://img.usecurling.com/ppl/thumbnail?seed=${member.id}`}
                    />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg leading-tight text-foreground">
                      {member.name}
                    </h3>
                    <div className="flex gap-2 items-center mt-1">
                      <Badge className={`${tierStyles[member.tier]} text-[10px] px-1.5 py-0`}>
                        {member.tier}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`${paymentStyles[member.paymentStatus]} border-none text-[10px] px-1.5 py-0`}
                      >
                        {member.paymentStatus}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 my-6 p-4 bg-muted/30 rounded-lg">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    Valor Adega
                  </p>
                  <p className="font-serif font-bold text-primary">{member.cellarValue}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    Próx. Lote
                  </p>
                  <p className="font-medium text-foreground text-sm flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-green-500" />
                    {member.nextAllocation}
                  </p>
                </div>
              </div>

              <Button
                variant="ghost"
                className="w-full justify-between text-muted-foreground hover:text-primary hover:bg-primary/5 group/btn"
              >
                Ver Detalhes do Membro
                <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
