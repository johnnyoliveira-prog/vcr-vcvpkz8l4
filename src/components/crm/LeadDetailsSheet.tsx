import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Mail, Phone, Calendar, Star, FileText } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface LeadDetailsSheetProps {
  lead: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LeadDetailsSheet({ lead, open, onOpenChange }: LeadDetailsSheetProps) {
  if (!lead) return null

  const handlePromote = () => {
    toast({
      title: 'Sucesso',
      description: `${lead.name} promovido para ALA Private!`,
      variant: 'default',
      className: 'bg-primary text-primary-foreground border-none',
    })
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md w-full p-0 flex flex-col bg-background">
        <div className="p-6 bg-primary text-primary-foreground">
          <SheetHeader className="text-left">
            <div className="flex justify-between items-start">
              <SheetTitle className="text-2xl font-serif text-primary-foreground">
                {lead.name}
              </SheetTitle>
              <Badge variant="outline" className="bg-white/20 text-white border-none">
                {lead.status}
              </Badge>
            </div>
            <SheetDescription className="text-primary-foreground/70 flex items-center gap-2 mt-2">
              <Star className="w-4 h-4 fill-secondary text-secondary" />
              Interesse: {lead.interest}
            </SheetDescription>
          </SheetHeader>
        </div>

        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Contato
            </h3>
            <div className="flex items-center gap-3 text-sm">
              <Mail className="w-4 h-4 text-muted-foreground" />
              {lead.email}
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Phone className="w-4 h-4 text-muted-foreground" />
              {lead.phone}
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              Último contato: {lead.date}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Notas
            </h3>
            <div className="bg-muted/50 p-4 rounded-lg flex gap-3 text-sm">
              <FileText className="w-4 h-4 shrink-0 text-secondary mt-0.5" />
              <p className="text-foreground leading-relaxed">{lead.notes}</p>
            </div>
          </div>
        </div>

        <div className="p-6 border-t bg-muted/20 flex gap-3">
          <Button
            className="flex-1 bg-secondary hover:bg-secondary/90 text-secondary-foreground"
            onClick={handlePromote}
          >
            Promover a Membro
          </Button>
          <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
