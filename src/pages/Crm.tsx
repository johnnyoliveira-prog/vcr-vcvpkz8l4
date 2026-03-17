import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Search, UserPlus, SlidersHorizontal } from 'lucide-react'
import { mockLeads } from '@/lib/mocks'
import { LeadDetailsSheet } from '@/components/crm/LeadDetailsSheet'

const statusColors: Record<string, string> = {
  Novo: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  'Em Contato': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  Negociando: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  Ganho: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  Perdido: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
}

export default function Crm() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLead, setSelectedLead] = useState<any>(null)

  const filteredLeads = mockLeads.filter((l) =>
    l.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary">CRM & Leads</h1>
          <p className="text-muted-foreground mt-1">Gestão de prospecção e funil de vendas.</p>
        </div>
        <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90">
          <UserPlus className="w-4 h-4 mr-2" />
          Adicionar Lead
        </Button>
      </div>

      <Card className="p-4 flex flex-col sm:flex-row gap-4 justify-between items-center shadow-sm border-none animate-fade-in-up">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome..."
            className="pl-9 bg-muted/50 border-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="w-full sm:w-auto">
          <SlidersHorizontal className="w-4 h-4 mr-2" /> Filtros
        </Button>
      </Card>

      <Card
        className="border-none shadow-sm overflow-hidden animate-fade-in-up"
        style={{ animationDelay: '100ms' }}
      >
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="font-semibold text-primary">Nome</TableHead>
              <TableHead className="font-semibold text-primary">Status</TableHead>
              <TableHead className="font-semibold text-primary hidden md:table-cell">
                Interesse
              </TableHead>
              <TableHead className="font-semibold text-primary hidden sm:table-cell">
                Último Contato
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLeads.map((lead) => (
              <TableRow
                key={lead.id}
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setSelectedLead(lead)}
              >
                <TableCell className="font-medium">{lead.name}</TableCell>
                <TableCell>
                  <Badge className={`${statusColors[lead.status]} border-none hover:opacity-80`}>
                    {lead.status}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">{lead.interest}</TableCell>
                <TableCell className="text-muted-foreground hidden sm:table-cell">
                  {lead.date}
                </TableCell>
              </TableRow>
            ))}
            {filteredLeads.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  Nenhum lead encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      <LeadDetailsSheet
        lead={selectedLead}
        open={!!selectedLead}
        onOpenChange={(open) => !open && setSelectedLead(null)}
      />
    </div>
  )
}
