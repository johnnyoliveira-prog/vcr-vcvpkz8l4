import { useAuth } from '@/hooks/use-auth'
import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

export default function AuthGuard() {
  const { user, loading, signIn, signUp } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [err, setErr] = useState('')

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-serif text-primary">VCR Gestão</CardTitle>
            <CardDescription>Acesse sua conta para continuar</CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={async (e) => {
                e.preventDefault()
                setIsSubmitting(true)
                setErr('')
                const { error } = isLogin
                  ? await signIn(email, password)
                  : await signUp(email, password)
                if (error) setErr(error.message)
                setIsSubmitting(false)
              }}
              className="space-y-4"
            >
              {err && (
                <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm border border-red-200">
                  {err}
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Senha</label>
                <Input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button className="w-full" type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {isLogin ? 'Entrar' : 'Criar Conta'}
              </Button>
              <div className="text-center text-sm mt-4">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-primary hover:underline"
                >
                  {isLogin ? 'Não tem uma conta? Crie aqui' : 'Já tem uma conta? Entre'}
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <Outlet />
}
