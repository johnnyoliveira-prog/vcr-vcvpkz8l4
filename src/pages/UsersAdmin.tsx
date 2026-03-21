import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Shield, ShieldCheck, Edit2, Plus, Loader2 } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { getProfiles, updateUserAccess, createUser } from '@/services/users'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { type UserProfile } from '@/hooks/use-auth'

const AVAILABLE_ROUTES = [
  { path: '/', label: 'Dashboard Principal' },
  { path: '/crm', label: 'CRM (Leads)' },
  { path: '/ala-private', label: 'ALA Private' },
  { path: '/billing', label: 'Faturamento' },
  { path: '/import-dre', label: 'Importar DRE' },
  { path: '/dashboard-dre', label: 'Dashboard DRE' },
  { path: '/inventory', label: 'Estoque de Vinhos' },
  { path: '/notifications', label: 'Notificações' },
  { path: '/analytics', label: 'Analytics Avançado' },
  { path: '/loyalty', label: 'Programa de Fidelidade' },
  { path: '/support', label: 'Inbox de Suporte' },
  { path: '/bot', label: 'WhatsApp Bot' },
]

export default function UsersAdmin() {
  const [profiles, setProfiles] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)

  // Modals state
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Edit State
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null)
  const [editRole, setEditRole] = useState('user')
  const [editRoutes, setEditRoutes] = useState<string[]>([])

  // Create State
  const [newEmail, setNewEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newName, setNewName] = useState('')
  const [newRole, setNewRole] = useState('user')
  const [newRoutes, setNewRoutes] = useState<string[]>(['/'])

  const loadProfiles = async () => {
    try {
      const data = await getProfiles()
      setProfiles(data)
    } catch (err: any) {
      toast({ title: 'Erro', description: 'Falha ao carregar usuários.', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProfiles()
  }, [])

  const handleEditOpen = (user: UserProfile) => {
    setEditingUser(user)
    setEditRole(user.role)
    setEditRoutes(user.allowed_routes || [])
    setIsEditOpen(true)
  }

  const handleSaveEdit = async () => {
    if (!editingUser) return
    setSubmitting(true)
    try {
      const finalRoutes = editRole === 'admin' ? ['*'] : editRoutes
      await updateUserAccess(editingUser.id, editRole, finalRoutes)
      toast({ title: 'Sucesso', description: 'Permissões atualizadas com sucesso.' })
      setIsEditOpen(false)
      loadProfiles()
    } catch (err: any) {
      toast({ title: 'Erro', description: err.message, variant: 'destructive' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleCreateUser = async () => {
    if (!newEmail || !newPassword || !newName) {
      toast({
        title: 'Atenção',
        description: 'Preencha todos os campos obrigatórios.',
        variant: 'destructive',
      })
      return
    }
    setSubmitting(true)
    try {
      const finalRoutes = newRole === 'admin' ? ['*'] : newRoutes
      await createUser({
        email: newEmail,
        password: newPassword,
        name: newName,
        role: newRole,
        allowed_routes: finalRoutes,
      })
      toast({ title: 'Sucesso', description: 'Usuário criado com sucesso.' })
      setIsCreateOpen(false)
      loadProfiles()
      // reset form
      setNewEmail('')
      setNewPassword('')
      setNewName('')
      setNewRole('user')
      setNewRoutes(['/'])
    } catch (err: any) {
      toast({ title: 'Erro', description: err.message, variant: 'destructive' })
    } finally {
      setSubmitting(false)
    }
  }

  const toggleRoute = (path: string, current: string[], setter: (val: string[]) => void) => {
    setter(current.includes(path) ? current.filter((p) => p !== path) : [...current, path])
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary flex items-center gap-2">
            <Shield className="w-8 h-8 text-secondary" />
            Usuários e Acessos
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie permissões e controle de acesso da equipe.
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90" onClick={() => setIsCreateOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> Novo Usuário
        </Button>
      </div>

      <Card className="border-none shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Nível de Acesso</TableHead>
                <TableHead>Páginas Permitidas</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
                  </TableCell>
                </TableRow>
              ) : (
                profiles.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.name || '-'}</TableCell>
                    <TableCell className="text-muted-foreground">{p.email}</TableCell>
                    <TableCell>
                      {p.role === 'admin' ? (
                        <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border-none flex items-center w-fit gap-1">
                          <ShieldCheck className="w-3 h-3" /> Admin
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground">
                          Usuário Restrito
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {p.role === 'admin' || p.allowed_routes?.includes('*')
                        ? 'Acesso Total'
                        : p.allowed_routes?.length > 0
                          ? `${p.allowed_routes.length} página(s)`
                          : 'Nenhum acesso'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleEditOpen(p)}>
                        <Edit2 className="w-4 h-4 text-muted-foreground hover:text-primary" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Edit Modal */}
      <Dialog open={isEditOpen} onOpenChange={(open) => !submitting && setIsEditOpen(open)}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Editar Permissões</DialogTitle>
            <DialogDescription>
              Ajuste o nível de acesso e rotas permitidas para {editingUser?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Perfil de Acesso</Label>
              <Select value={editRole} onValueChange={setEditRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Usuário Restrito</SelectItem>
                  <SelectItem value="admin">Administrador (Acesso Total)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {editRole !== 'admin' && (
              <div className="space-y-3">
                <Label>Páginas Permitidas</Label>
                <div className="max-h-[250px] overflow-y-auto border rounded-md p-4 space-y-3 bg-muted/20">
                  {AVAILABLE_ROUTES.map((route) => (
                    <div key={route.path} className="flex items-center space-x-2">
                      <Checkbox
                        id={`edit-${route.path}`}
                        checked={editRoutes.includes(route.path)}
                        onCheckedChange={() => toggleRoute(route.path, editRoutes, setEditRoutes)}
                      />
                      <label
                        htmlFor={`edit-${route.path}`}
                        className="text-sm font-medium leading-none cursor-pointer"
                      >
                        {route.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)} disabled={submitting}>
              Cancelar
            </Button>
            <Button onClick={handleSaveEdit} disabled={submitting}>
              {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Modal */}
      <Dialog open={isCreateOpen} onOpenChange={(open) => !submitting && setIsCreateOpen(open)}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Novo Usuário</DialogTitle>
            <DialogDescription>Crie uma nova credencial de acesso para a equipe.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Nome Completo</Label>
              <Input
                placeholder="Ex: Maria Consultora"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Email Institucional</Label>
              <Input
                type="email"
                placeholder="maria@casarosada.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Senha Temporária</Label>
              <Input
                type="text"
                placeholder="senha123"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2 pt-2">
              <Label>Perfil de Acesso</Label>
              <Select value={newRole} onValueChange={setNewRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Usuário Restrito</SelectItem>
                  <SelectItem value="admin">Administrador (Acesso Total)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {newRole !== 'admin' && (
              <div className="space-y-3">
                <Label>Páginas Permitidas</Label>
                <div className="max-h-[150px] overflow-y-auto border rounded-md p-4 space-y-3 bg-muted/20">
                  {AVAILABLE_ROUTES.map((route) => (
                    <div key={route.path} className="flex items-center space-x-2">
                      <Checkbox
                        id={`create-${route.path}`}
                        checked={newRoutes.includes(route.path)}
                        onCheckedChange={() => toggleRoute(route.path, newRoutes, setNewRoutes)}
                      />
                      <label
                        htmlFor={`create-${route.path}`}
                        className="text-sm font-medium leading-none cursor-pointer"
                      >
                        {route.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)} disabled={submitting}>
              Cancelar
            </Button>
            <Button onClick={handleCreateUser} disabled={submitting}>
              {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Criar Acesso
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
