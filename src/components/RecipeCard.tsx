import { useState } from 'react'
import { Link } from 'react-router'
import { Clock, Heart, Star, Users } from 'lucide-react'
import { type Recipe } from '@/types/recipe'
import { recipeImage } from '@/data/images'
import { formatTime, totalTime } from '@/lib/recipe-utils'
import { useFavorites } from '@/hooks/useFavorites'
import { cn } from '@/lib/utils'

const DIFF_STYLE: Record<string, string> = {
  Easy: 'text-emerald-700',
  Medium: 'text-amber-700',
  Hard: 'text-rose-700',
}

export function RecipeCard({ recipe, footer }: { recipe: Recipe; footer?: React.ReactNode }) {
  const { toggle, isFavorite } = useFavorites()
  const [imgError, setImgError] = useState(false)
  const fav = isFavorite(recipe.id)

  return (
    <Link to={`/recipe/${recipe.id}`} className="group block h-full">
      <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[0_1px_2px_rgba(60,40,20,0.06)] transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_16px_40px_-12px_rgba(60,40,20,0.25)]">
        <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
          {imgError ? (
            <div className="flex h-full items-center justify-center text-6xl">{recipe.emoji}</div>
          ) : (
            <img
              src={recipeImage(recipe.id)}
              alt={recipe.title}
              loading="lazy"
              onError={() => setImgError(true)}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
            />
          )}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/25 to-transparent" />
          <button
            aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              toggle(recipe.id)
            }}
            className={cn(
              'absolute right-3 top-3 rounded-full p-2 shadow-sm backdrop-blur transition hover:scale-110',
              fav ? 'bg-white text-rose-600' : 'bg-white/85 text-stone-500'
            )}
          >
            <Heart className={cn('h-4 w-4', fav && 'fill-current')} />
          </button>
          <span className="absolute bottom-3 left-3 rounded-full bg-black/45 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
            {recipe.cuisine}
          </span>
        </div>

        <div className="flex flex-1 flex-col gap-2 p-4">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider">
            <span className="text-primary">{recipe.category}</span>
            <span className="text-border">·</span>
            <span className={DIFF_STYLE[recipe.difficulty]}>{recipe.difficulty}</span>
          </div>
          <h3 className="font-display text-xl font-semibold leading-snug transition-colors group-hover:text-primary">
            {recipe.title}
          </h3>
          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {recipe.description}
          </p>
          <div className="mt-auto flex items-center gap-4 pt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" /> {formatTime(totalTime(recipe))}
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" /> {recipe.servings}
            </span>
            <span className="ml-auto flex items-center gap-1 font-semibold text-amber-600">
              <Star className="h-3.5 w-3.5 fill-current" /> {recipe.rating.toFixed(1)}
            </span>
          </div>
          {footer}
        </div>
      </article>
    </Link>
  )
}
