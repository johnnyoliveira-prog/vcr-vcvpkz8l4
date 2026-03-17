import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from '@/components/ui/sheet'
import { CreditCard, DollarSign, CheckCircle2, AlertCircle } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { mockBillingHistory, mockPlans } from '@/lib/mocks'

const statusStyles: Record<string, string> = {
  Pago: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  Pendente: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  Atrasado: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
}

export default function Billing() {
  const handleProcessPayment = () => {
    toast({
      title: 'Simulação Pagar.me',
      description: 'Processando lote de pagamentos pendentes...',
    })
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary">Faturamento</h1>
          <p className="text-muted-foreground mt-1">
            Gestão de assinaturas e integrações de pagamento.
          </p>
        </div>
        <Button
          className="w-full sm:w-auto bg-primary hover:bg-primary/90"
          onClick={handleProcessPayment}
        >
          <DollarSign className="w-4 h-4 mr-2" />
          Processar Lote
        </Button>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full sm:w-[400px] grid-cols-3">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="plans">Planos</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-none shadow-sm bg-primary/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Receita Mensal Prevista
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-serif text-primary">R$ 145.200</div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-green-50 dark:bg-green-900/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-green-700 dark:text-green-400">
                  Recebido (Mês)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-serif text-green-800 dark:text-green-300">
                  R$ 120.500
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-red-50 dark:bg-red-900/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-red-700 dark:text-red-400">
                  Em Atraso
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-serif text-red-800 dark:text-red-300">
                  R$ 8.400
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl font-serif text-primary">Ações Rápidas</CardTitle>
                <CardDescription>
                  Gerencie métodos de pagamento ou atualize gateways.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline">
                    <CreditCard className="w-4 h-4 mr-2" /> Adicionar Cartão Membro
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Novo Cartão de Crédito</SheetTitle>
                    <SheetDescription>
                      Simulação de inserção segura de dados via Pagar.me.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="space-y-4 py-6">
                    <div className="space-y-2">
                      <Label>Titular do Cartão</Label>
                      <Input placeholder="Nome no cartão" />
                    </div>
                    <div className="space-y-2">
                      <Label>Número do Cartão</Label>
                      <Input placeholder="0000 0000 0000 0000" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Validade</Label>
                        <Input placeholder="MM/AA" />
                      </div>
                      <div className="space-y-2">
                        <Label>CVC</Label>
                        <Input placeholder="123" />
                      </div>
                    </div>
                    <Button
                      className="w-full mt-4"
                      onClick={() =>
                        toast({ title: 'Sucesso', description: 'Cartão vinculado com sucesso.' })
                      }
                    >
                      Salvar Cartão
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plans" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockPlans.map((plan) => (
              <Card
                key={plan.id}
                className="border-none shadow-sm hover:shadow-elevation transition-all"
              >
                <CardHeader>
                  <CardTitle className="text-2xl font-serif text-primary">{plan.name}</CardTitle>
                  <div className="text-xl font-bold mt-2">{plan.price}</div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                        {feat}
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" className="w-full">
                    Editar Plano
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card className="border-none shadow-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead>Fatura</TableHead>
                  <TableHead>Membro</TableHead>
                  <TableHead>Plano</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockBillingHistory.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.id}</TableCell>
                    <TableCell>{invoice.member}</TableCell>
                    <TableCell>{invoice.plan}</TableCell>
                    <TableCell>{invoice.amount}</TableCell>
                    <TableCell className="text-muted-foreground">{invoice.date}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`${statusStyles[invoice.status]} border-none`}
                      >
                        {invoice.status === 'Atrasado' && <AlertCircle className="w-3 h-3 mr-1" />}
                        {invoice.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
