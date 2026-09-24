import { Link } from 'react-router'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RecipeCard } from '@/components/RecipeCard'
import { RECIPES } from '@/data/recipes'
import { useFavorites } from '@/hooks/useFavorites'

export default function Favorites() {
  const { favorites } = useFavorites()
  const recipes = RECIPES.filter((r) => favorites.includes(r.id))

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="font-display text-4xl font-bold">Your favorites</h1>
      <p className="mt-1 text-muted-foreground">
        {recipes.length} saved recipe{recipes.length === 1 ? '' : 's'}
      </p>

      {recipes.length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-24 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-rose-400">
            <Heart className="h-8 w-8" />
          </span>
          <p className="font-display text-xl font-semibold">No favorites yet</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            Tap the heart on any recipe to keep it here for quick access.
          </p>
          <Button asChild className="mt-2">
            <Link to="/recipes">Browse recipes</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {recipes.map((r) => (
            <RecipeCard key={r.id} recipe={r} />
          ))}
        </div>
      )}
    </div>
  )
}
