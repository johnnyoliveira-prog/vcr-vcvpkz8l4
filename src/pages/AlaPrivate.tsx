import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Search, Crown, Plus, Edit2, Trash2, Loader2 } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import {
  getMembers,
  createMember,
  updateMember,
  deleteMember,
  type AlaPrivateMember,
} from '@/services/ala-private'
import { MemberDialog, type MemberFormValues } from '@/components/ala-private/MemberDialog'

export default function AlaPrivate() {
  const [members, setMembers] = useState<AlaPrivateMember[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<AlaPrivateMember | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const loadMembers = async () => {
    try {
      const data = await getMembers()
      setMembers(data)
    } catch (error: any) {
      toast({ title: 'Erro', description: 'Falha ao carregar membros.', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMembers()
  }, [])

  const handleSave = async (data: MemberFormValues) => {
    setIsSaving(true)
    try {
      if (editingMember) {
        await updateMember(editingMember.id, data)
        toast({ title: 'Sucesso', description: 'Membro atualizado com sucesso.' })
      } else {
        await createMember(data)
        toast({ title: 'Sucesso', description: 'Novo membro cadastrado.' })
      }
      setDialogOpen(false)
      loadMembers()
    } catch (error: any) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await deleteMember(deleteId)
      toast({ title: 'Sucesso', description: 'Membro removido.' })
      loadMembers()
    } catch (error: any) {
      toast({ title: 'Erro', description: 'Falha ao remover.', variant: 'destructive' })
    } finally {
      setDeleteId(null)
    }
  }

  const filteredMembers = members.filter(
    (m) =>
      m.nome.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary flex items-center gap-2">
            <Crown className="w-8 h-8 text-secondary" />
            ALA Private
          </h1>
          <p className="text-muted-foreground mt-1">Gestão de membros do clube exclusivo.</p>
        </div>
        <Button
          onClick={() => {
            setEditingMember(null)
            setDialogOpen(true)
          }}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Membro
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou e-mail..."
            className="pl-9 bg-background shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Card className="border-none shadow-sm overflow-hidden animate-fade-in-up">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Data de Adesão</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
                </TableCell>
              </TableRow>
            ) : filteredMembers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Nenhum membro encontrado.
                </TableCell>
              </TableRow>
            ) : (
              filteredMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.nome}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell className="text-muted-foreground">{member.telefone || '-'}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(member.data_adesao).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        member.status === 'Ativo'
                          ? 'bg-green-100 text-green-800 hover:bg-green-100 border-none'
                          : 'bg-muted text-muted-foreground border-none'
                      }
                    >
                      {member.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-primary"
                      onClick={() => {
                        setEditingMember(member)
                        setDialogOpen(true)
                      }}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => setDeleteId(member.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      <MemberDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        member={editingMember}
        onSave={handleSave}
        isLoading={isSaving}
      />

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza absoluta?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O registro deste membro será removido
              permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
