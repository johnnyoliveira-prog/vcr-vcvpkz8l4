import { Link, Outlet, useLocation } from 'react-router-dom'
import {
  Wine,
  Users,
  Target,
  Package,
  LayoutDashboard,
  Search,
  Bell,
  CreditCard,
  BellRing,
  BarChart3,
  Gift,
  MessageCircle,
  Bot,
  FileSpreadsheet,
  PieChart,
  Shield,
  ShieldAlert,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { useAuth } from '@/hooks/use-auth'

const items = [
  { title: 'Dashboard', url: '/', icon: LayoutDashboard },
  { title: 'CRM (Leads)', url: '/crm', icon: Target },
  { title: 'ALA Private', url: '/ala-private', icon: Users },
  { title: 'Faturamento', url: '/billing', icon: CreditCard },
  { title: 'Importar DRE', url: '/import-dre', icon: FileSpreadsheet },
  { title: 'Dashboard DRE', url: '/dashboard-dre', icon: PieChart },
  { title: 'Estoque de Vinhos', url: '/inventory', icon: Package },
  { title: 'Notificações', url: '/notifications', icon: BellRing },
  { title: 'Analytics', url: '/analytics', icon: BarChart3 },
  { title: 'Fidelidade', url: '/loyalty', icon: Gift },
  { title: 'Suporte', url: '/support', icon: MessageCircle },
  { title: 'WhatsApp Bot', url: '/bot', icon: Bot },
  { title: 'Usuários e Acessos', url: '/users', icon: Shield, adminOnly: true },
]

function AppSidebar() {
  const location = useLocation()
  const { profile } = useAuth()

  const isAllowed = (url: string, adminOnly?: boolean) => {
    if (adminOnly && profile?.role !== 'admin') return false
    if (profile?.role === 'admin' || profile?.allowed_routes.includes('*')) return true
    return profile?.allowed_routes.includes(url)
  }

  const visibleItems = items.filter((item) => isAllowed(item.url, item.adminOnly))

  return (
    <Sidebar variant="sidebar">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="bg-primary/20 p-2 rounded-lg">
            <Wine className="w-6 h-6 text-secondary" />
          </div>
          <div>
            <h2 className="font-serif font-bold text-xl text-sidebar-foreground leading-none">
              Casa Rosada
            </h2>
            <span className="text-xs text-secondary tracking-widest uppercase">ALA Private</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/50 uppercase tracking-wider text-xs mb-2">
            Menu Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.url}
                    className="py-5"
                  >
                    <Link to={item.url}>
                      <item.icon className="w-5 h-5 mr-2" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

function Header() {
  const location = useLocation()
  const { profile, signOut } = useAuth()

  const pathMap: Record<string, string> = {
    '/': 'Dashboard',
    '/crm': 'CRM (Leads)',
    '/ala-private': 'ALA Private',
    '/inventory': 'Estoque de Vinhos',
    '/billing': 'Faturamento',
    '/import-dre': 'Importar DRE',
    '/dashboard-dre': 'Dashboard DRE',
    '/notifications': 'Notificações',
    '/analytics': 'Analytics Avançado',
    '/loyalty': 'Programa de Fidelidade',
    '/support': 'Inbox de Suporte',
    '/bot': 'WhatsApp Bot',
    '/users': 'Usuários e Acessos',
  }
  const currentPathName = pathMap[location.pathname] || 'Dashboard'

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-4 border-b bg-background/80 backdrop-blur-md px-6">
      <SidebarTrigger className="md:hidden" />
      <Breadcrumb className="hidden md:flex">
        <BreadcrumbList>
          <BreadcrumbItem>
            <span className="text-muted-foreground">Casa Rosada</span>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="font-medium text-primary">{currentPathName}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-1 items-center justify-end gap-4">
        <div className="relative w-full max-w-sm hidden md:flex">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar membros ou leads..."
            className="w-full bg-background pl-9 rounded-full border-muted-foreground/20 focus-visible:ring-secondary"
          />
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-full hover:bg-primary/5 hover:text-primary"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive" />
        </Button>
        <Avatar
          className="h-9 w-9 border-2 border-secondary cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => signOut()}
          title="Sair"
        >
          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
            {profile?.name?.substring(0, 2).toUpperCase() || 'AD'}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}

export default function Layout() {
  const { profile } = useAuth()
  const location = useLocation()

  const canAccess =
    profile?.role === 'admin' ||
    profile?.allowed_routes.includes('*') ||
    profile?.allowed_routes.includes(location.pathname)
  const isAdminRoute = location.pathname === '/users'
  const finalAccess = isAdminRoute ? profile?.role === 'admin' : canAccess

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <main className="flex-1 flex flex-col min-w-0">
          <Header />
          <div className="flex-1 p-6 lg:p-8 animate-fade-in overflow-auto">
            {!finalAccess ? (
              <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] text-center">
                <ShieldAlert className="w-16 h-16 text-destructive mb-4" />
                <h1 className="text-2xl font-bold font-serif text-primary">Acesso Restrito</h1>
                <p className="text-muted-foreground mt-2 max-w-md">
                  Seu perfil atual ({profile?.role}) não possui permissão para visualizar esta
                  página. Entre em contato com um administrador caso precise de acesso.
                </p>
                <Button asChild className="mt-6">
                  <Link to="/">Voltar ao Início</Link>
                </Button>
              </div>
            ) : (
              <Outlet />
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
