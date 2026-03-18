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
import { Card } from '@/components/ui/card'
import { Edit2, Trash2, Loader2, Crown, Users, AlertCircle } from 'lucide-react'
import type { AlaPrivateMember } from '@/services/ala-private'

interface MembersTableProps {
  members: AlaPrivateMember[]
  loading: boolean
  onEdit: (member: AlaPrivateMember) => void
  onDelete: (id: string) => void
  getTitularName: (id: string | null) => string
}

export function MembersTable({
  members,
  loading,
  onEdit,
  onDelete,
  getTitularName,
}: MembersTableProps) {
  return (
    <Card className="border-none shadow-sm overflow-hidden animate-fade-in-up">
      <Table>
        <TableHeader className="bg-muted/30">
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Tipo / Vínculo</TableHead>
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
              <TableCell colSpan={7} className="text-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
              </TableCell>
            </TableRow>
          ) : members.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                Nenhum membro encontrado.
              </TableCell>
            </TableRow>
          ) : (
            members.map((member) => (
              <TableRow key={member.id}>
                <TableCell className="font-medium">{member.nome}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="flex items-center gap-1.5 font-medium text-sm">
                      {member.tipo === 'Titular' ? (
                        <Crown className="w-3.5 h-3.5 text-secondary" />
                      ) : (
                        <Users className="w-3.5 h-3.5 text-muted-foreground" />
                      )}
                      {member.tipo}
                    </span>
                    {member.tipo !== 'Titular' && (
                      <span className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                        Vinculado a:{' '}
                        {member.titular_id ? (
                          getTitularName(member.titular_id)
                        ) : (
                          <span className="text-destructive font-semibold flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> Sem titular
                          </span>
                        )}
                      </span>
                    )}
                  </div>
                </TableCell>
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
                    onClick={() => onEdit(member)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => onDelete(member.id)}
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
  )
}
