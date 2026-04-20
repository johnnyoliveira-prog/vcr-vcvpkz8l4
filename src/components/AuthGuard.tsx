import { useAuth } from '@/hooks/use-auth'
import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2, LogOut, AlertTriangle } from 'lucide-react'
import { extractFieldErrors, getErrorMessage } from '@/lib/pocketbase/errors'

export default function AuthGuard() {
  const { user, profile, loading, signIn, signUp, signOut } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [err, setErr] = useState('')
  const [fieldErrs, setFieldErrs] = useState<Record<string, string>>({})

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (user && !profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
        <Card className="w-full max-w-md text-center border-none shadow-elevation">
          <CardHeader>
            <div className="mx-auto bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-full w-fit mb-4">
              <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-500" />
            </div>
            <CardTitle className="text-xl font-serif text-primary">
              Configurando seu perfil...
            </CardTitle>
            <CardDescription className="mt-2 text-sm">
              Estamos preparando o seu acesso. Se esta tela persistir por mais de alguns segundos,
              tente atualizar a página ou entrar novamente.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full mt-2" onClick={() => signOut()}>
              <LogOut className="w-4 h-4 mr-2" />
              Sair e tentar novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
        <Card className="w-full max-w-md border-none shadow-elevation">
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
                setFieldErrs({})
                try {
                  const { error } = isLogin
                    ? await signIn(email, password)
                    : await signUp(email, password)
                  if (error) {
                    if (error.status === 400) {
                      setErr(
                        'E-mail ou senha incorretos. Verifique suas credenciais e tente novamente.',
                      )
                      setFieldErrs(extractFieldErrors(error))
                    } else {
                      setErr(getErrorMessage(error))
                    }
                  }
                } catch (error: any) {
                  setErr('Erro de conexão ao tentar fazer login. Tente novamente mais tarde.')
                } finally {
                  setIsSubmitting(false)
                }
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
                {fieldErrs.email && <p className="text-xs text-red-500">{fieldErrs.email}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Senha</label>
                <Input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {fieldErrs.password && <p className="text-xs text-red-500">{fieldErrs.password}</p>}
              </div>
              <Button className="w-full" type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {isLogin ? 'Entrar' : 'Criar Conta'}
              </Button>
              <div className="text-center text-sm mt-4">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-primary hover:underline font-medium"
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
