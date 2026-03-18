import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2 } from 'lucide-react'
import { type AlaPrivateMember } from '@/services/ala-private'

const formSchema = z
  .object({
    nome: z.string().min(1, 'Nome é obrigatório'),
    email: z.string().email('E-mail inválido'),
    telefone: z.string().optional(),
    status: z.enum(['Ativo', 'Inativo']),
    tipo: z.enum(['Titular', 'Cônjuge', 'Filho']),
    titular_id: z.string().nullable().optional(),
  })
  .refine(
    (data) => {
      if (data.tipo !== 'Titular' && !data.titular_id) {
        return false
      }
      return true
    },
    {
      message: 'Titular vinculado é obrigatório para dependentes',
      path: ['titular_id'],
    },
  )

export type MemberFormValues = z.infer<typeof formSchema>

interface MemberDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  member?: AlaPrivateMember | null
  titulares: AlaPrivateMember[]
  onSave: (data: MemberFormValues) => Promise<void>
  isLoading?: boolean
}

export function MemberDialog({
  open,
  onOpenChange,
  member,
  titulares,
  onSave,
  isLoading,
}: MemberDialogProps) {
  const form = useForm<MemberFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: '',
      email: '',
      telefone: '',
      status: 'Ativo',
      tipo: 'Titular',
      titular_id: null,
    },
  })

  useEffect(() => {
    if (member && open) {
      form.reset({
        nome: member.nome,
        email: member.email,
        telefone: member.telefone || '',
        status: member.status as 'Ativo' | 'Inativo',
        tipo: member.tipo,
        titular_id: member.titular_id,
      })
    } else if (open) {
      form.reset({
        nome: '',
        email: '',
        telefone: '',
        status: 'Ativo',
        tipo: 'Titular',
        titular_id: null,
      })
    }
  }, [member, form, open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{member ? 'Editar Membro' : 'Novo Membro'}</DialogTitle>
          <DialogDescription>
            {member
              ? 'Atualize as informações do membro.'
              : 'Preencha os dados para adicionar um novo membro ao ALA Private.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSave)} className="space-y-4">
            <FormField
              control={form.control}
              name="tipo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Membro</FormLabel>
                  <Select
                    onValueChange={(val) => {
                      field.onChange(val)
                      if (val === 'Titular') {
                        form.setValue('titular_id', null, { shouldValidate: true })
                      }
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Titular">Titular</SelectItem>
                      <SelectItem value="Cônjuge">Cônjuge</SelectItem>
                      <SelectItem value="Filho">Filho</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch('tipo') !== 'Titular' && (
              <FormField
                control={form.control}
                name="titular_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Titular Vinculado</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || undefined}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o titular" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {titulares.length === 0 ? (
                          <SelectItem value="none" disabled>
                            Nenhum titular disponível
                          </SelectItem>
                        ) : (
                          titulares.map((t) => (
                            <SelectItem key={t.id} value={t.id}>
                              {t.nome}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Roberto Almeida" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="roberto@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="telefone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone (Opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="(11) 99999-9999" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Ativo">Ativo</SelectItem>
                      <SelectItem value="Inativo">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Salvar Membro
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
