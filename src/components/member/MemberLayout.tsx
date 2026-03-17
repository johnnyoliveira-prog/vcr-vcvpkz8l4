import { Link, Outlet } from 'react-router-dom'
import { Wine, LogOut } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

export default function MemberLayout() {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b bg-background/90 backdrop-blur-md px-4 sm:px-6 md:px-8">
        <Link to="/member/portal" className="flex items-center gap-2 group">
          <div className="bg-primary/10 p-1.5 rounded-md group-hover:bg-primary/20 transition-colors">
            <Wine className="w-5 h-5 text-secondary" />
          </div>
          <h1 className="font-serif font-bold text-lg text-primary tracking-wide">ALA Private</h1>
        </Link>

        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 border-2 border-secondary/50">
            <AvatarImage src="https://img.usecurling.com/ppl/thumbnail?seed=1" />
            <AvatarFallback>RA</AvatarFallback>
          </Avatar>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-primary asChild"
          >
            <Link to="/">
              <LogOut className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </header>

      <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full max-w-4xl mx-auto overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  )
}
