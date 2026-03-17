import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Crown, CreditCard, UserCircle } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

export function ProfileTab() {
  const handleSave = () =>
    toast({ title: 'Perfil Atualizado', description: 'Suas informações foram salvas.' })

  return (
    <div className="space-y-6">
      <Card className="border border-secondary/20 shadow-sm bg-gradient-to-br from-secondary/5 to-transparent relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary font-serif text-xl">
            <Crown className="w-5 h-5 text-secondary" /> Plano Atual: Reserva
          </CardTitle>
          <CardDescription>Membro fundador desde Maio de 2021</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground/80 mb-5 leading-relaxed">
            Você tem acesso a alocações bimestrais de safras exclusivas, frete grátis nacional e
            convites VIP para a Casa Rosada.
          </p>
          <div className="flex items-center gap-3 p-3 bg-background/50 backdrop-blur-sm rounded-lg border border-secondary/20 shadow-sm">
            <div className="p-2 bg-background rounded-md shadow-sm">
              <CreditCard className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Mastercard final 4242</p>
              <p className="text-xs text-muted-foreground">Expira em 12/2025</p>
            </div>
            <Button variant="outline" size="sm" className="text-xs">
              Atualizar
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <UserCircle className="w-5 h-5 text-muted-foreground" /> Dados Pessoais
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nome Completo</Label>
              <Input defaultValue="Roberto Almeida" className="bg-muted/30" />
            </div>
            <div className="space-y-2">
              <Label>E-mail (Login)</Label>
              <Input defaultValue="roberto@example.com" type="email" className="bg-muted/30" />
            </div>
            <div className="space-y-2">
              <Label>Telefone</Label>
              <Input defaultValue="(11) 99999-9999" className="bg-muted/30" />
            </div>
            <div className="space-y-2">
              <Label>Endereço de Entrega Principal</Label>
              <Input defaultValue="Av. Paulista, 1000 - São Paulo, SP" className="bg-muted/30" />
            </div>
          </div>
          <Button
            className="w-full sm:w-auto mt-4 bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={handleSave}
          >
            Salvar Alterações
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
