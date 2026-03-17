import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CellarTab } from '@/components/member/CellarTab'
import { OrdersTab } from '@/components/member/OrdersTab'
import { ProfileTab } from '@/components/member/ProfileTab'
import { Wine, Package, User } from 'lucide-react'

export default function Portal() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-primary">
          Bem-vindo, Roberto
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base mt-1">
          Acesse sua adega privativa e benefícios do clube.
        </p>
      </div>

      <Tabs defaultValue="cellar" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6 bg-muted/60 p-1 rounded-xl">
          <TabsTrigger
            value="cellar"
            className="flex items-center gap-2 rounded-lg data-[state=active]:shadow-sm"
          >
            <Wine className="w-4 h-4 sm:mr-1" />
            <span className="hidden sm:inline">Minha Adega</span>
            <span className="sm:hidden text-xs">Adega</span>
          </TabsTrigger>
          <TabsTrigger
            value="orders"
            className="flex items-center gap-2 rounded-lg data-[state=active]:shadow-sm"
          >
            <Package className="w-4 h-4 sm:mr-1" />
            <span className="hidden sm:inline">Meus Pedidos</span>
            <span className="sm:hidden text-xs">Pedidos</span>
          </TabsTrigger>
          <TabsTrigger
            value="profile"
            className="flex items-center gap-2 rounded-lg data-[state=active]:shadow-sm"
          >
            <User className="w-4 h-4 sm:mr-1" />
            <span className="hidden sm:inline">Meu Perfil</span>
            <span className="sm:hidden text-xs">Perfil</span>
          </TabsTrigger>
        </TabsList>

        <div className="mt-4">
          <TabsContent value="cellar" className="m-0 focus-visible:outline-none">
            <CellarTab />
          </TabsContent>

          <TabsContent value="orders" className="m-0 focus-visible:outline-none">
            <OrdersTab />
          </TabsContent>

          <TabsContent value="profile" className="m-0 focus-visible:outline-none">
            <ProfileTab />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
