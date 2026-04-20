import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Wine } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { signIn, user, loading } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (user) {
    return <Navigate to="/" replace />
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const timeoutPromise = new Promise<{ error: any }>((resolve) =>
        setTimeout(() => resolve({ error: new Error('Timeout') }), 10000),
      )

      const authPromise = signIn(email, password)

      const { error } = await Promise.race([authPromise, timeoutPromise])

      if (error) {
        toast({
          variant: 'destructive',
          title: 'Erro ao entrar',
          description:
            'Erro ao entrar. Por favor, verifique suas credenciais ou tente novamente em instantes.',
        })
        setIsLoading(false)
        return
      }

      toast({
        title: 'Sucesso',
        description: 'Login realizado com sucesso. Redirecionando...',
      })

      setTimeout(() => {
        navigate('/')
      }, 300)
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Erro ao entrar',
        description:
          'Erro ao entrar. Por favor, verifique suas credenciais ou tente novamente em instantes.',
      })
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4 relative">
      {isLoading && (
        <div className="absolute inset-0 z-50 bg-background/50 flex items-center justify-center backdrop-blur-sm animate-fade-in">
          <div className="flex flex-col items-center gap-3 p-6 bg-background rounded-lg shadow-xl border">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm font-medium">Autenticando...</p>
          </div>
        </div>
      )}
      <Card className="w-full max-w-md shadow-lg border-none animate-fade-in-up relative z-10">
        <CardHeader className="space-y-3 text-center pb-6">
          <div className="mx-auto bg-primary/10 w-16 h-16 flex items-center justify-center rounded-full mb-2">
            <Wine className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-serif text-primary">Casa Rosada</CardTitle>
          <CardDescription>Faça login para acessar o sistema de gestão</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="exemplo@casarosada.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                autoComplete="current-password"
              />
            </div>
            <Button className="w-full mt-6" type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Entrar'}
            </Button>{' '}
          </form>
        </CardContent>
        <CardFooter className="flex justify-center text-sm text-muted-foreground pt-4 border-t">
          <p>Dúvidas? Contate o suporte técnico.</p>
        </CardFooter>
      </Card>
    </div>
  )
}
