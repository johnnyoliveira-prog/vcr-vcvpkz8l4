import { useState, useEffect, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
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
import { Search, Crown, Plus, AlertCircle } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import {
  getMembers,
  createMember,
  updateMember,
  deleteMember,
  type AlaPrivateMember,
} from '@/services/ala-private'
import { MemberDialog, type MemberFormValues } from '@/components/ala-private/MemberDialog'
import { DashboardCards } from '@/components/ala-private/DashboardCards'
import { MembersTable } from '@/components/ala-private/MembersTable'
import { TitularFilter } from '@/components/ala-private/TitularFilter'

const isPrimary = (tipo: string) =>
  ['ALA PRIVATE', 'membro ALA', 'membro ALA PRIVATE WINE'].includes(tipo)

export default function AlaPrivate() {
  const [members, setMembers] = useState<AlaPrivateMember[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [titularFilterId, setTitularFilterId] = useState<string | null>(null)
  const [showOrphansOnly, setShowOrphansOnly] = useState(false)
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

  const filteredMembers = useMemo(() => {
    let result = members
    if (showOrphansOnly) {
      result = result.filter((m) => !isPrimary(m.tipo) && !m.titular_id)
    } else if (titularFilterId) {
      result = result.filter((m) => m.id === titularFilterId || m.titular_id === titularFilterId)
    }
    if (search) {
      result = result.filter(
        (m) =>
          m.nome.toLowerCase().includes(search.toLowerCase()) ||
          m.email.toLowerCase().includes(search.toLowerCase()),
      )
    }
    return result
  }, [members, search, titularFilterId, showOrphansOnly])

  const getTitularName = (titularId: string | null) => {
    if (!titularId) return '-'
    return members.find((m) => m.id === titularId)?.nome || '-'
  }

  const principais = members.filter((m) => isPrimary(m.tipo))
  const orphans = members.filter((m) => !isPrimary(m.tipo) && !m.titular_id)

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
          <Plus className="w-4 h-4 mr-2" /> Novo Membro
        </Button>
      </div>

      <DashboardCards
        total={members.length}
        alaPrivate={members.filter((m) => m.tipo === 'ALA PRIVATE').length}
        membroAla={members.filter((m) => m.tipo === 'membro ALA').length}
        membroWine={members.filter((m) => m.tipo === 'membro ALA PRIVATE WINE').length}
        dependentes={members.filter((m) => !isPrimary(m.tipo)).length}
      />

      {orphans.length > 0 && !showOrphansOnly && (
        <Alert variant="destructive" className="animate-fade-in-up">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Atenção à Integridade dos Dados</AlertTitle>
          <AlertDescription className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-2 sm:mt-0">
            <span>Existem {orphans.length} dependentes sem um membro principal vinculado.</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setShowOrphansOnly(true)
                setTitularFilterId(null)
              }}
              className="border-destructive text-destructive hover:bg-destructive hover:text-white"
            >
              Ver Pendências
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {showOrphansOnly && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-destructive/10 text-destructive px-4 py-3 rounded-md">
          <span className="font-medium text-sm">
            Visualizando apenas dependentes com pendência de membro principal.
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowOrphansOnly(false)}
            className="hover:bg-destructive/20 text-destructive"
          >
            Limpar Filtro
          </Button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 mb-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou e-mail..."
            className="pl-9 bg-background shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <TitularFilter
          principais={principais}
          value={titularFilterId}
          onChange={(id) => {
            setTitularFilterId(id)
            setShowOrphansOnly(false)
          }}
        />
      </div>

      <MembersTable
        members={filteredMembers}
        loading={loading}
        onEdit={(m) => {
          setEditingMember(m)
          setDialogOpen(true)
        }}
        onDelete={setDeleteId}
        getTitularName={getTitularName}
      />

      <MemberDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        member={editingMember}
        principais={principais.filter((p) => p.id !== editingMember?.id)}
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
