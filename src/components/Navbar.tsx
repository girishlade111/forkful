import { useState } from 'react'
import { Link, NavLink } from 'react-router'
import { ChefHat, Heart, Home, LayoutGrid, Menu, Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useFavorites } from '@/hooks/useFavorites'

const links = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/recipes', label: 'Browse Recipes', icon: LayoutGrid },
  { to: '/pantry', label: "What's in your kitchen?", icon: Search },
  { to: '/favorites', label: 'Favorites', icon: Heart },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const { favorites } = useFavorites()

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
            <ChefHat className="h-5 w-5" />
          </span>
          <span className="font-display text-2xl font-bold italic tracking-tight">Forkful</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                )
              }
            >
              <Icon className="h-4 w-4" />
              {label}
              {to === '/favorites' && favorites.length > 0 && (
                <span className="ml-0.5 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-bold leading-none text-primary-foreground">
                  {favorites.length}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <button
          className="rounded-lg p-2 text-muted-foreground hover:bg-secondary md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-border/70 bg-background px-4 py-3 md:hidden">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium',
                  isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
                )
              }
            >
              <Icon className="h-4 w-4" />
              {label}
              {to === '/favorites' && favorites.length > 0 && (
                <span className="rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-bold leading-none text-primary-foreground">
                  {favorites.length}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  )
}
