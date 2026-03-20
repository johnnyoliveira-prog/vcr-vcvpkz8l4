import { useState, useMemo } from 'react'
import { ChevronRight, ChevronDown, Search, ChevronsUpDown, ChevronsDownUp } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import type { Database } from '@/lib/supabase/types'

type DreLinha = Database['public']['Tables']['dre_linhas']['Row']

const formatBRL = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)

interface HierarchicalTableProps {
  linhas: DreLinha[]
  loading: boolean
}

export function HierarchicalTable({ linhas, loading }: HierarchicalTableProps) {
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  const { processedLines, hasChildrenMap } = useMemo(() => {
    const hasChildren = new Set<string>()
    linhas.forEach((l1) => {
      if (!l1.codigo) return
      const isParent = linhas.some(
        (l2) => l2.codigo?.startsWith(l1.codigo + '.') && l2.codigo !== l1.codigo,
      )
      if (isParent) hasChildren.add(l1.codigo)
    })
    return { processedLines: linhas, hasChildrenMap: hasChildren }
  }, [linhas])

  const filteredData = useMemo(() => {
    if (!search) return processedLines

    const lowerSearch = search.toLowerCase()
    const matches = new Set<string>()

    processedLines.forEach((l) => {
      if (
        l.descricao?.toLowerCase().includes(lowerSearch) ||
        l.codigo?.toLowerCase().includes(lowerSearch)
      ) {
        if (l.codigo) matches.add(l.codigo)
      }
    })

    let addedParents = true
    while (addedParents) {
      addedParents = false
      processedLines.forEach((l) => {
        if (l.codigo && !matches.has(l.codigo)) {
          const hasChildMatch = processedLines.some(
            (child) => child.codigo?.startsWith(l.codigo + '.') && matches.has(child.codigo),
          )
          if (hasChildMatch) {
            matches.add(l.codigo)
            addedParents = true
          }
        }
      })
    }
    return processedLines.filter((l) => l.codigo && matches.has(l.codigo))
  }, [processedLines, search])

  const visibleLines = useMemo(() => {
    if (search) return filteredData

    return filteredData.filter((l) => {
      if (!l.codigo) return true
      const parts = l.codigo.split('.')
      let currentPath = ''
      for (let i = 0; i < parts.length - 1; i++) {
        currentPath += (i === 0 ? '' : '.') + parts[i]
        if (hasChildrenMap.has(currentPath) && !expanded.has(currentPath)) {
          return false
        }
      }
      return true
    })
  }, [filteredData, expanded, search, hasChildrenMap])

  const toggleExpand = (codigo: string) => {
    const next = new Set(expanded)
    if (next.has(codigo)) next.delete(codigo)
    else next.add(codigo)
    setExpanded(next)
  }

  const expandAll = () => setExpanded(new Set(Array.from(hasChildrenMap)))
  const collapseAll = () => setExpanded(new Set())

  return (
    <div className="mt-6 relative z-10 bg-slate-900/50 border border-slate-800/80 rounded-lg overflow-hidden flex flex-col">
      <div className="p-4 border-b border-slate-800/50 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-900/30">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input
            placeholder="Buscar por código ou descrição..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-slate-900 border-slate-700 text-slate-200 h-9"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={expandAll}
            className="w-full sm:w-auto border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-slate-100"
          >
            <ChevronsUpDown className="w-4 h-4 mr-2" /> Expandir Tudo
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={collapseAll}
            className="w-full sm:w-auto border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-slate-100"
          >
            <ChevronsDownUp className="w-4 h-4 mr-2" /> Recolher Tudo
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-slate-800/50">
            <TableRow className="border-slate-800 hover:bg-transparent">
              <TableHead className="text-slate-300 w-[240px]">Código</TableHead>
              <TableHead className="text-slate-300">Descrição</TableHead>
              <TableHead className="text-slate-300 text-right">Receita (R$)</TableHead>
              <TableHead className="text-slate-300 text-right">Despesa (R$)</TableHead>
              <TableHead className="text-slate-300 text-right">Saldo (R$)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="border-slate-800/50 hover:bg-transparent">
                  <TableCell>
                    <Skeleton className="h-4 w-16 bg-slate-800" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-48 bg-slate-800" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24 bg-slate-800 ml-auto" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24 bg-slate-800 ml-auto" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24 bg-slate-800 ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : visibleLines.length === 0 ? (
              <TableRow className="hover:bg-transparent border-slate-800/50">
                <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                  Nenhum dado encontrado.
                </TableCell>
              </TableRow>
            ) : (
              visibleLines.map((linha) => {
                const isParent = linha.codigo && hasChildrenMap.has(linha.codigo)
                const isExpanded = linha.codigo && expanded.has(linha.codigo)
                const nivel = linha.nivel || 1

                return (
                  <TableRow
                    key={linha.id}
                    className="border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                  >
                    <TableCell className="font-mono text-slate-400 py-2">
                      <div
                        className="flex items-center gap-1"
                        style={{ paddingLeft: `${(nivel - 1) * 1.5}rem` }}
                      >
                        {isParent ? (
                          <button
                            onClick={() => linha.codigo && toggleExpand(linha.codigo)}
                            className="p-1 hover:bg-slate-700 rounded-md transition-colors"
                          >
                            {isExpanded || search ? (
                              <ChevronDown className="w-4 h-4 text-blue-400" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-blue-400" />
                            )}
                          </button>
                        ) : (
                          <span className="w-6" />
                        )}
                        <span className={cn(isParent && 'font-medium text-slate-300')}>
                          {linha.codigo}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell
                      className={cn('text-slate-200', nivel === 1 && 'font-bold text-slate-100')}
                    >
                      {linha.descricao}
                    </TableCell>
                    <TableCell className="text-right text-emerald-400/90">
                      {linha.receita ? formatBRL(linha.receita) : '-'}
                    </TableCell>
                    <TableCell className="text-right text-rose-400/90">
                      {linha.despesa ? formatBRL(linha.despesa) : '-'}
                    </TableCell>
                    <TableCell
                      className={cn(
                        'text-right font-medium',
                        (linha.saldo || 0) >= 0 ? 'text-emerald-400' : 'text-rose-400',
                      )}
                    >
                      {linha.saldo ? formatBRL(linha.saldo) : '-'}
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
