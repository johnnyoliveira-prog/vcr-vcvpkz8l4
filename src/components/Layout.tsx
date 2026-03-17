import { Link, Outlet, useLocation } from 'react-router-dom'
import { Wine, Users, Target, Package, LayoutDashboard, Search, Bell, Menu } from 'lucide-react'
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
  useSidebar,
} from '@/components/ui/sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

const items = [
  { title: 'Dashboard', url: '/', icon: LayoutDashboard },
  { title: 'CRM (Leads)', url: '/crm', icon: Target },
  { title: 'ALA Private', url: '/ala-private', icon: Users },
  { title: 'Estoque de Vinhos', url: '/inventory', icon: Package },
]

function AppSidebar() {
  const location = useLocation()

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
              {items.map((item) => (
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
  const pathMap: Record<string, string> = {
    '/': 'Dashboard',
    '/crm': 'CRM (Leads)',
    '/ala-private': 'ALA Private',
    '/inventory': 'Estoque de Vinhos',
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
        <Avatar className="h-9 w-9 border-2 border-secondary cursor-pointer hover:opacity-80 transition-opacity">
          <AvatarImage
            src="https://img.usecurling.com/ppl/thumbnail?gender=female&seed=2"
            alt="@admin"
          />
          <AvatarFallback>AD</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}

export default function Layout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <main className="flex-1 flex flex-col min-w-0">
          <Header />
          <div className="flex-1 p-6 lg:p-8 animate-fade-in overflow-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
