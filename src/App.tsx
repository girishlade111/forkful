import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router'
import { Navbar } from '@/components/Navbar'
import Home from '@/pages/Home'
import Catalog from '@/pages/Catalog'
import Pantry from '@/pages/Pantry'
import RecipeDetail from '@/pages/RecipeDetail'
import CookMode from '@/pages/CookMode'
import Favorites from '@/pages/Favorites'

export default function App() {
  const { pathname } = useLocation()
  const isCookMode = /\/recipe\/[^/]+\/cook/.test(pathname)

  // Always start each page at the top when navigating
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="min-h-screen">
      {!isCookMode && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipes" element={<Catalog />} />
        <Route path="/pantry" element={<Pantry />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/recipe/:id" element={<RecipeDetail />} />
        <Route path="/recipe/:id/cook" element={<CookMode />} />
        <Route path="*" element={<Home />} />
      </Routes>
      {!isCookMode && (
        <footer className="border-t border-border/70 py-8">
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-1 px-4 text-center sm:px-6">
            <p className="font-display text-lg font-bold">🍴 Forkful</p>
            <p className="text-sm text-muted-foreground">
              A huge recipe catalog with ingredient search and hands-free cooking mode.
            </p>
          </div>
        </footer>
      )}
    </div>
  )
}
