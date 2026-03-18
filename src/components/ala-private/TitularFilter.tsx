import { useState } from 'react'
import { Check, ChevronsUpDown, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import type { AlaPrivateMember } from '@/services/ala-private'

interface TitularFilterProps {
  titulares: AlaPrivateMember[]
  value: string | null
  onChange: (id: string | null) => void
}

export function TitularFilter({ titulares, value, onChange }: TitularFilterProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[250px] justify-between bg-background shadow-sm"
          >
            {value
              ? titulares.find((titular) => titular.id === value)?.nome
              : 'Filtrar por Titular...'}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[250px] p-0">
          <Command>
            <CommandInput placeholder="Buscar titular..." />
            <CommandList>
              <CommandEmpty>Nenhum titular encontrado.</CommandEmpty>
              <CommandGroup>
                {titulares.map((titular) => (
                  <CommandItem
                    key={titular.id}
                    value={titular.nome}
                    onSelect={() => {
                      onChange(titular.id === value ? null : titular.id)
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        value === titular.id ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                    {titular.nome}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {value && (
        <Button variant="ghost" onClick={() => onChange(null)} className="text-muted-foreground">
          <X className="w-4 h-4 mr-2" />
          Limpar Filtro
        </Button>
      )}
    </div>
  )
}
