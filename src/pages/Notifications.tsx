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
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Send, Zap, MessageSquare } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { mockNotifications } from '@/lib/mocks'

export default function Notifications() {
  const handleSend = () => {
    toast({ title: 'Notificação Enviada', description: 'A mensagem está na fila de disparo.' })
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary">Notificações</h1>
          <p className="text-muted-foreground mt-1">
            Disparo de campanhas e automações de mensagens.
          </p>
        </div>
      </div>

      <Tabs defaultValue="new" className="w-full">
        <TabsList className="grid w-full sm:w-[400px] grid-cols-3">
          <TabsTrigger value="new">Nova</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
          <TabsTrigger value="automations">Automações</TabsTrigger>
        </TabsList>

        <TabsContent value="new" className="mt-6">
          <Card className="border-none shadow-sm max-w-2xl">
            <CardHeader>
              <CardTitle className="text-xl font-serif text-primary flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-secondary" /> Criar Mensagem
              </CardTitle>
              <CardDescription>
                Envie avisos de novas safras ou convites para eventos.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Título da Campanha</Label>
                <Input placeholder="Ex: Degustação Safra 2024" />
              </div>
              <div className="space-y-2">
                <Label>Público-Alvo</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o segmento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Membros</SelectItem>
                    <SelectItem value="reserva">Somente Reserva</SelectItem>
                    <SelectItem value="ouro">Ouro e Acima</SelectItem>
                    <SelectItem value="leads">Leads (CRM)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Mensagem (Email / WhatsApp)</Label>
                <Textarea placeholder="Escreva sua mensagem aqui..." className="min-h-[120px]" />
              </div>
              <Button className="w-full bg-primary hover:bg-primary/90 mt-4" onClick={handleSend}>
                <Send className="w-4 h-4 mr-2" /> Disparar Agora
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card className="border-none shadow-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead>Campanha</TableHead>
                  <TableHead>Público</TableHead>
                  <TableHead>Data de Envio</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Abertura</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockNotifications.map((notif) => (
                  <TableRow key={notif.id}>
                    <TableCell className="font-medium">{notif.title}</TableCell>
                    <TableCell>{notif.audience}</TableCell>
                    <TableCell className="text-muted-foreground">{notif.sentAt}</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800 border-none hover:bg-green-100">
                        {notif.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium text-primary">
                      {notif.opens}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="automations" className="mt-6">
          <Card className="border-none shadow-sm max-w-2xl">
            <CardHeader>
              <CardTitle className="text-xl font-serif text-primary flex items-center gap-2">
                <Zap className="w-5 h-5 text-secondary" /> Regras Automatizadas
              </CardTitle>
              <CardDescription>
                Gatilhos para disparos baseados em ações do sistema.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between space-x-2">
                <Label className="flex flex-col space-y-1 cursor-pointer">
                  <span className="font-medium text-base text-foreground">
                    Aviso de Cobrança (Vencimento)
                  </span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Envia 3 dias antes da fatura do plano.
                  </span>
                </Label>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <Label className="flex flex-col space-y-1 cursor-pointer">
                  <span className="font-medium text-base text-foreground">
                    Lançamento de Safra (Reserva)
                  </span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Alerta prioritário para tier Reserva.
                  </span>
                </Label>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <Label className="flex flex-col space-y-1 cursor-pointer">
                  <span className="font-medium text-base text-foreground">
                    Aniversário de Membro
                  </span>
                  <span className="font-normal text-sm text-muted-foreground">
                    E-mail automático com desconto de 15%.
                  </span>
                </Label>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
