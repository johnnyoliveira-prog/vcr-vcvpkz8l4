import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Bot, Plus, Trash2, Send, Smartphone } from 'lucide-react'
import { mockBotRules } from '@/lib/mocks'

export default function WhatsAppBot() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-serif font-bold text-primary flex items-center gap-2">
          <Bot className="w-8 h-8 text-secondary" />
          WhatsApp Bot
        </h1>
        <p className="text-muted-foreground mt-1">Configuração de respostas automatizadas.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="col-span-1 lg:col-span-2 space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-serif text-primary">
                Mensagem de Saudação
              </CardTitle>
              <CardDescription>Enviada automaticamente no primeiro contato.</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                defaultValue="Olá! Bem-vindo à Casa Rosada. Sou o assistente virtual. Como posso ajudar hoje?"
                className="min-h-[100px]"
              />
              <Button className="mt-4 bg-primary hover:bg-primary/90 text-primary-foreground">
                Salvar Saudação
              </Button>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-xl font-serif text-primary">
                  Gatilhos e Respostas
                </CardTitle>
                <CardDescription>Defina palavras-chave que disparam respostas.</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" /> Novo Gatilho
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="w-[150px]">Palavra-Chave</TableHead>
                    <TableHead>Resposta do Bot</TableHead>
                    <TableHead className="w-[60px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockBotRules.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell className="font-semibold text-secondary">{rule.keyword}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {rule.response}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-destructive h-8 w-8"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-1 flex flex-col items-center">
          <div className="mb-4 flex items-center gap-2 text-muted-foreground font-medium">
            <Smartphone className="w-5 h-5" /> Simulador do Bot
          </div>
          <div className="w-[300px] h-[600px] border-[8px] border-foreground rounded-[2.5rem] bg-background relative overflow-hidden flex flex-col shadow-2xl">
            <div className="bg-[#075e54] text-white p-4 flex items-center gap-3 shrink-0 shadow-md z-10">
              <div className="p-1.5 bg-white/20 rounded-full">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <p className="font-semibold text-sm leading-tight">Casa Rosada</p>
                <p className="text-[10px] text-white/80">Online</p>
              </div>
            </div>

            <div
              className="flex-1 bg-cover bg-center flex flex-col"
              style={{
                backgroundImage:
                  'url(https://img.usecurling.com/p/300/600?q=texture&color=gray&dpr=1)',
                opacity: 0.9,
              }}
            >
              <ScrollArea className="flex-1 p-4 bg-white/60 dark:bg-black/60 backdrop-blur-sm">
                <div className="space-y-3">
                  <div className="flex flex-col items-start">
                    <div className="bg-white dark:bg-zinc-800 text-foreground text-sm p-2.5 rounded-lg rounded-tl-none shadow-sm max-w-[85%]">
                      Olá! Bem-vindo à Casa Rosada. Sou o assistente virtual. Como posso ajudar
                      hoje?
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="bg-[#dcf8c6] dark:bg-[#056162] text-foreground text-sm p-2.5 rounded-lg rounded-tr-none shadow-sm max-w-[85%]">
                      Quais os Planos disponíveis?
                    </div>
                  </div>
                  <div className="flex flex-col items-start">
                    <div className="bg-white dark:bg-zinc-800 text-foreground text-sm p-2.5 rounded-lg rounded-tl-none shadow-sm max-w-[85%]">
                      Temos 3 planos: Reserva, Ouro e Prata. Qual deseja conhecer?
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>

            <div className="p-2 bg-[#f0f0f0] dark:bg-zinc-900 flex gap-2 items-center shrink-0">
              <div className="flex-1 bg-white dark:bg-zinc-800 rounded-full h-10 px-4 text-sm flex items-center text-muted-foreground border border-border/50">
                Digite "Cota" ou "Horário"...
              </div>
              <Button
                size="icon"
                className="rounded-full bg-[#00a884] hover:bg-[#008f6f] h-10 w-10 text-white shrink-0"
              >
                <Send className="w-4 h-4 ml-0.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
