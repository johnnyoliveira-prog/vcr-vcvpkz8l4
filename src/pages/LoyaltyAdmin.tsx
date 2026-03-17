import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Plus, Trash2, Save, Gift } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { mockRewards } from '@/lib/mocks'

export default function LoyaltyAdmin() {
  const handleSaveRules = () => {
    toast({ title: 'Regras Salvas', description: 'As regras de acúmulo foram atualizadas.' })
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary">Programa de Fidelidade</h1>
          <p className="text-muted-foreground mt-1">Configure regras de pontos e recompensas.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 border-none shadow-sm h-fit">
          <CardHeader>
            <CardTitle className="text-xl font-serif text-primary">Regras de Acúmulo</CardTitle>
            <CardDescription>Defina como os membros ganham pontos.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Pontos por R$ gasto (Mensalidade)</Label>
              <div className="flex items-center gap-2">
                <Input type="number" defaultValue="1" className="w-20" />
                <span className="text-sm text-muted-foreground">pontos a cada R$ 1,00</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Bônus por Mês Ativo</Label>
              <div className="flex items-center gap-2">
                <Input type="number" defaultValue="100" className="w-20" />
                <span className="text-sm text-muted-foreground">pontos/mês</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Bônus de Indicação (Amigo)</Label>
              <div className="flex items-center gap-2">
                <Input type="number" defaultValue="500" className="w-24" />
                <span className="text-sm text-muted-foreground">pontos</span>
              </div>
            </div>
            <Button
              className="w-full bg-primary hover:bg-primary/90 mt-4"
              onClick={handleSaveRules}
            >
              <Save className="w-4 h-4 mr-2" />
              Salvar Regras
            </Button>
          </CardContent>
        </Card>

        <Card className="col-span-1 lg:col-span-2 border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-serif text-primary">
                Catálogo de Recompensas
              </CardTitle>
              <CardDescription>Gerencie os benefícios disponíveis para resgate.</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Nova Recompensa
            </Button>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead>Recompensa</TableHead>
                    <TableHead className="text-right">Custo (Pontos)</TableHead>
                    <TableHead className="w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockRewards.map((reward) => (
                    <TableRow key={reward.id}>
                      <TableCell className="font-medium flex items-center gap-2">
                        <Gift className="w-4 h-4 text-secondary shrink-0" />
                        {reward.title}
                      </TableCell>
                      <TableCell className="text-right font-mono font-bold text-primary">
                        {reward.points}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
