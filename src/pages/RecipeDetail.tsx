import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import {
  ChefHat,
  ChevronRight,
  Clock,
  Flame,
  Heart,
  Minus,
  Plus,
  Star,
  Timer,
  Users,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { RECIPES } from '@/data/recipes'
import { recipeImage } from '@/data/images'
import { formatIngredient, formatTime } from '@/lib/recipe-utils'
import { useFavorites } from '@/hooks/useFavorites'
import { cn } from '@/lib/utils'

export default function RecipeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const recipe = RECIPES.find((r) => r.id === id)
  const { toggle, isFavorite } = useFavorites()
  const [servings, setServings] = useState(recipe?.servings ?? 2)
  const [checked, setChecked] = useState<Set<number>>(new Set())

  if (!recipe) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 px-4 py-24 text-center">
        <span className="text-6xl">🍽️</span>
        <h1 className="font-display text-3xl font-bold">Recipe not found</h1>
        <Button asChild>
          <Link to="/recipes">Back to all recipes</Link>
        </Button>
      </div>
    )
  }

  const ratio = servings / recipe.servings
  const timerSteps = recipe.steps.filter((s) => s.timer).length
  const fav = isFavorite(recipe.id)

  const toggleCheck = (i: number) =>
    setChecked((c) => {
      const next = new Set(c)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })

  return (
    <div>
      {/* Photo hero */}
      <div className="relative h-[420px] overflow-hidden sm:h-[480px]">
        <img
          src={recipeImage(recipe.id)}
          alt={recipe.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-5xl px-4 pb-10 sm:px-6">
            <nav className="mb-3 flex items-center gap-1 text-xs font-medium text-white/70">
              <Link to="/" className="hover:text-white">Home</Link>
              <ChevronRight className="h-3 w-3" />
              <Link to="/recipes" className="hover:text-white">Recipes</Link>
              <ChevronRight className="h-3 w-3" />
              <Link
                to={`/recipes?category=${encodeURIComponent(recipe.category)}`}
                className="hover:text-white"
              >
                {recipe.category}
              </Link>
            </nav>
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="border-white/20 bg-white/15 text-white backdrop-blur hover:bg-white/15">
                {recipe.cuisine}
              </Badge>
              <Badge className="border-white/20 bg-white/15 text-white backdrop-blur hover:bg-white/15">
                {recipe.difficulty}
              </Badge>
              <span className="flex items-center gap-1 rounded-full bg-black/40 px-2.5 py-1 text-xs font-semibold text-amber-300 backdrop-blur">
                <Star className="h-3 w-3 fill-current" /> {recipe.rating.toFixed(1)}
              </span>
            </div>
            <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold leading-tight text-white sm:text-5xl">
              {recipe.title}
            </h1>
            <p className="mt-2 max-w-xl text-white/85">{recipe.description}</p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {/* Meta + actions card overlapping hero */}
        <div className="relative -mt-6 rounded-2xl border border-border/70 bg-card p-4 shadow-[0_12px_32px_-12px_rgba(60,40,20,0.25)]">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
            {[
              { icon: Clock, label: 'Prep', value: formatTime(recipe.prepTime) },
              { icon: Flame, label: 'Cook', value: formatTime(recipe.cookTime) },
              { icon: Users, label: 'Serves', value: `${recipe.servings}` },
              { icon: Timer, label: 'Timed steps', value: `${timerSteps}` },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-2.5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-4.5 w-4.5" />
                </span>
                <div>
                  <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                    {label}
                  </div>
                  <div className="text-sm font-semibold">{value}</div>
                </div>
              </div>
            ))}
            <div className="ml-auto flex gap-2.5">
              <Button
                variant="outline"
                className={cn('gap-2 rounded-full bg-card', fav && 'border-rose-300 text-rose-600')}
                onClick={() => toggle(recipe.id)}
              >
                <Heart className={cn('h-4.5 w-4.5', fav && 'fill-current')} />
                {fav ? 'Saved' : 'Save'}
              </Button>
              <Button
                className="gap-2 rounded-full px-6"
                onClick={() => navigate(`/recipe/${recipe.id}/cook`)}
              >
                <ChefHat className="h-4.5 w-4.5" /> Start cooking
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-10 pb-16 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          {/* Ingredients */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-2xl font-bold">Ingredients</h2>
              <div className="flex items-center gap-1 rounded-full border border-border bg-card p-1">
                <button
                  className="rounded-full p-1.5 text-muted-foreground hover:bg-secondary disabled:opacity-40"
                  onClick={() => setServings((s) => Math.max(1, s - 1))}
                  disabled={servings <= 1}
                  aria-label="Fewer servings"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="min-w-16 text-center text-sm font-semibold">
                  {servings} {servings === 1 ? 'serving' : 'servings'}
                </span>
                <button
                  className="rounded-full p-1.5 text-muted-foreground hover:bg-secondary disabled:opacity-40"
                  onClick={() => setServings((s) => Math.min(24, s + 1))}
                  disabled={servings >= 24}
                  aria-label="More servings"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
            {ratio !== 1 && (
              <p className="mb-3 text-xs font-medium text-primary">
                Quantities scaled ×{ratio.toFixed(2)} from the original {recipe.servings} servings.
              </p>
            )}
            <ul className="divide-y divide-border/70 rounded-2xl border border-border/70 bg-card">
              {recipe.ingredients.map((ing, i) => (
                <li key={i} className="flex items-center gap-3 px-4 py-3">
                  <Checkbox
                    checked={checked.has(i)}
                    onCheckedChange={() => toggleCheck(i)}
                    id={`ing-${i}`}
                  />
                  <label
                    htmlFor={`ing-${i}`}
                    className={cn(
                      'flex flex-1 cursor-pointer items-baseline justify-between gap-3 text-sm',
                      checked.has(i) && 'text-muted-foreground line-through'
                    )}
                  >
                    <span className="capitalize">{ing.n}</span>
                    <span className="shrink-0 text-right font-medium text-muted-foreground">
                      {formatIngredient(ing.q, ing.u, ratio)}
                      {ing.note ? ` · ${ing.note}` : ''}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {recipe.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium text-secondary-foreground"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Steps */}
          <div>
            <h2 className="mb-4 font-display text-2xl font-bold">Method</h2>
            <ol className="space-y-3">
              {recipe.steps.map((step, i) => (
                <li
                  key={i}
                  className="flex gap-4 rounded-2xl border border-border/70 bg-card p-4"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 font-display text-sm font-bold text-primary">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm leading-relaxed">{step.text}</p>
                    {step.timer && (
                      <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                        <Timer className="h-3 w-3" /> ~{formatTime(step.timer)}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ol>
            <Button
              size="lg"
              className="mt-6 w-full gap-2 rounded-full"
              onClick={() => navigate(`/recipe/${recipe.id}/cook`)}
            >
              <ChefHat className="h-5 w-5" /> Cook it step by step
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
