import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Search, Send, CheckCircle2 } from 'lucide-react'
import { mockSupportChats, mockChatMessages } from '@/lib/mocks'
import { cn } from '@/lib/utils'

export default function SupportInbox() {
  const [selectedChat, setSelectedChat] = useState(mockSupportChats[0])
  const [message, setMessage] = useState('')

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4 animate-fade-in">
      <div>
        <h1 className="text-3xl font-serif font-bold text-primary">Inbox de Suporte</h1>
        <p className="text-muted-foreground mt-1">
          Atendimento Concierge em tempo real para os membros.
        </p>
      </div>

      <Card className="flex-1 border-none shadow-sm flex overflow-hidden">
        <div className="w-full max-w-[320px] border-r flex flex-col bg-muted/10 hidden md:flex">
          <div className="p-4 border-b bg-background">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar conversa..."
                className="pl-9 bg-muted/50 border-none h-9"
              />
            </div>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {mockSupportChats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => setSelectedChat(chat)}
                  className={cn(
                    'w-full text-left p-3 rounded-lg flex items-start gap-3 transition-colors',
                    selectedChat.id === chat.id
                      ? 'bg-primary/5 border border-primary/10'
                      : 'hover:bg-muted/50 border border-transparent',
                  )}
                >
                  <div className="relative">
                    <Avatar className="w-10 h-10 border border-background shadow-sm">
                      <AvatarImage
                        src={`https://img.usecurling.com/ppl/thumbnail?seed=${chat.id}`}
                      />
                      <AvatarFallback>{chat.user.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span
                      className={cn(
                        'absolute bottom-0 right-0 w-3 h-3 border-2 border-background rounded-full',
                        chat.status === 'online' ? 'bg-green-500' : 'bg-muted',
                      )}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <p className="font-medium text-sm text-foreground truncate">{chat.user}</p>
                      <span className="text-[10px] text-muted-foreground shrink-0">
                        {chat.time}
                      </span>
                    </div>
                    <p
                      className={cn(
                        'text-xs truncate',
                        chat.unread ? 'font-semibold text-foreground' : 'text-muted-foreground',
                      )}
                    >
                      {chat.lastMessage}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>

        <div className="flex-1 flex flex-col bg-background">
          {selectedChat ? (
            <>
              <div className="h-16 px-6 border-b flex items-center justify-between shrink-0 bg-background/95 backdrop-blur z-10">
                <div className="flex items-center gap-3">
                  <Avatar className="w-9 h-9">
                    <AvatarImage
                      src={`https://img.usecurling.com/ppl/thumbnail?seed=${selectedChat.id}`}
                    />
                    <AvatarFallback>{selectedChat.user.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-foreground leading-none">
                      {selectedChat.user}
                    </h3>
                    <span className="text-xs text-muted-foreground">
                      {selectedChat.status === 'online' ? 'Online agora' : 'Offline'}
                    </span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="hidden sm:flex">
                  <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
                  Marcar Resolvido
                </Button>
              </div>
              <ScrollArea className="flex-1 p-6">
                <div className="space-y-4">
                  {mockChatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        'flex flex-col max-w-[75%]',
                        msg.sender === 'support' ? 'ml-auto items-end' : 'mr-auto items-start',
                      )}
                    >
                      <div
                        className={cn(
                          'p-3 rounded-2xl text-sm shadow-sm',
                          msg.sender === 'support'
                            ? 'bg-primary text-primary-foreground rounded-tr-sm'
                            : 'bg-muted/60 text-foreground rounded-tl-sm',
                        )}
                      >
                        {msg.text}
                      </div>
                      <span className="text-[10px] text-muted-foreground mt-1 px-1">
                        {msg.time}
                      </span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="p-4 border-t bg-muted/10">
                <form
                  className="flex gap-2"
                  onSubmit={(e) => {
                    e.preventDefault()
                    setMessage('')
                  }}
                >
                  <Input
                    placeholder="Escreva sua resposta..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-1 bg-background"
                  />
                  <Button type="submit" disabled={!message.trim()} className="shrink-0">
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
              <Search className="w-12 h-12 mb-4 opacity-20" />
              <p>Selecione uma conversa para iniciar o atendimento.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
