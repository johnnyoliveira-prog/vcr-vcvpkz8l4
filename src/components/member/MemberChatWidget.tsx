import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MessageCircle, X, Send } from 'lucide-react'
import { cn } from '@/lib/utils'

export function MemberChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([
    { id: '1', sender: 'support', text: 'Olá Roberto! Como posso ajudar você hoje?' },
  ])
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen])

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    setMessages((prev) => [...prev, { id: Date.now().toString(), sender: 'user', text: message }])
    setMessage('')

    // Simulate auto-reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: 'support',
          text: 'Nossa equipe já vai te atender. Aguarde um momento!',
        },
      ])
    }, 1500)
  }

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <Card className="w-[calc(100vw-2rem)] sm:w-80 h-[450px] mb-4 flex flex-col shadow-2xl border-none overflow-hidden animate-in slide-in-from-bottom-5">
          <CardHeader className="p-4 bg-primary text-primary-foreground flex flex-row items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <div className="relative">
                <MessageCircle className="w-5 h-5 text-secondary" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full border border-primary" />
              </div>
              <div>
                <CardTitle className="text-sm font-medium">Concierge Casa Rosada</CardTitle>
                <p className="text-[10px] text-primary-foreground/70 leading-none mt-0.5">
                  Online agora
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-primary-foreground hover:bg-primary-foreground/20 rounded-full"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>

          <ScrollArea className="flex-1 p-4 bg-muted/20">
            <div className="space-y-4 pb-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    'flex flex-col max-w-[85%]',
                    msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start',
                  )}
                >
                  <div
                    className={cn(
                      'p-3 text-sm shadow-sm',
                      msg.sender === 'user'
                        ? 'bg-primary text-primary-foreground rounded-2xl rounded-tr-sm'
                        : 'bg-background border text-foreground rounded-2xl rounded-tl-sm',
                    )}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>

          <div className="p-3 border-t bg-background shrink-0">
            <form onSubmit={handleSend} className="flex gap-2 relative">
              <Input
                placeholder="Escreva sua mensagem..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="pr-10 bg-muted/50 border-none rounded-full"
              />
              <Button
                type="submit"
                size="icon"
                disabled={!message.trim()}
                className="absolute right-1 top-1 h-8 w-8 rounded-full bg-secondary hover:bg-secondary/90 text-secondary-foreground shrink-0"
              >
                <Send className="w-4 h-4 ml-0.5" />
              </Button>
            </form>
          </div>
        </Card>
      )}

      <Button
        size="icon"
        className={cn(
          'w-14 h-14 rounded-full shadow-lg transition-transform duration-300 hover:scale-105',
          isOpen
            ? 'bg-muted text-muted-foreground hover:bg-muted/90'
            : 'bg-primary text-primary-foreground',
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </Button>
    </div>
  )
}
