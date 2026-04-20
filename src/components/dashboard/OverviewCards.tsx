import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react'
import { getDreUploads } from '@/services/dre'
import { useRealtime } from '@/hooks/use-realtime'

export function OverviewCards() {
  const [metrics, setMetrics] = useState({ receita: 0, despesa: 0, saldo: 0 })
  const [loading, setLoading] = useState(true)

  const loadMetrics = async () => {
    try {
      const uploads = await getDreUploads()
      const totals = uploads.reduce(
        (acc, curr) => {
          acc.receita += curr.total_receita || 0
          acc.despesa += curr.total_despesa || 0
          acc.saldo += curr.saldo || 0
          return acc
        },
        { receita: 0, despesa: 0, saldo: 0 },
      )
      setMetrics(totals)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMetrics()
  }, [])

  useRealtime('dre_uploads', () => {
    loadMetrics()
  })

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground invisible">
                Loading
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-7 bg-muted rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Receita</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
              metrics.receita,
            )}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Despesa</CardTitle>
          <TrendingDown className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
              metrics.despesa,
            )}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium text-muted-foreground">Saldo</CardTitle>
          <DollarSign className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
              metrics.saldo,
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
