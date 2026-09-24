import { useMemo, useRef, useState } from 'react'
import { Link } from 'react-router'
import { Check, Plus, Search, ShoppingBasket, Sparkles, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Switch } from '@/components/ui/switch'
import { RecipeCard } from '@/components/RecipeCard'
import { matchByPantry, pantryIndex } from '@/lib/recipe-utils'
import { cn } from '@/lib/utils'

const POPULAR_COUNT = 28

export default function Pantry() {
  const index = useMemo(pantryIndex, [])
  const [have, setHave] = useState<string[]>([])
  const [draft, setDraft] = useState('')
  const [onlyReady, setOnlyReady] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const popular = index.slice(0, POPULAR_COUNT).filter((e) => !have.includes(e.name))

  const suggestions = useMemo(() => {
    const q = draft.trim().toLowerCase()
    if (!q) return []
    return index
      .filter((e) => e.name.includes(q) && !have.includes(e.name))
      .slice(0, 8)
  }, [draft, index, have])

  const results = useMemo(() => {
    if (have.length === 0) return []
    const all = matchByPantry(have)
    return onlyReady ? all.filter((m) => m.missing.length === 0) : all
  }, [have, onlyReady])

  const readyCount = useMemo(
    () => (have.length ? matchByPantry(have).filter((m) => m.missing.length === 0).length : 0),
    [have]
  )

  const add = (name: string) => {
    if (!have.includes(name)) setHave((h) => [...h, name])
    setDraft('')
    setShowSuggestions(false)
    inputRef.current?.focus()
  }

  const remove = (name: string) => setHave((h) => h.filter((x) => x !== name))

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary">
          <ShoppingBasket className="h-3.5 w-3.5" /> Ingredient search
        </span>
        <h1 className="mt-4 font-display text-4xl font-bold">What's in your kitchen?</h1>
        <p className="mt-2 text-muted-foreground">
          Add the ingredients you have — we'll rank all recipes by how ready you are to cook them.
        </p>
      </div>

      {/* Input */}
      <div className="relative mx-auto mt-8 max-w-xl">
        <Search className="absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef}
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value)
            setShowSuggestions(true)
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && suggestions.length > 0) add(suggestions[0].name)
          }}
          placeholder="Type an ingredient, e.g. “chicken”, “garlic”, “rice”…"
          className="h-13 rounded-full bg-white py-6 pl-11 pr-4 text-base shadow-sm"
        />
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute inset-x-0 top-full z-20 mt-2 overflow-hidden rounded-2xl border border-border bg-white shadow-lg">
            {suggestions.map((s) => (
              <button
                key={s.name}
                onMouseDown={() => add(s.name)}
                className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm hover:bg-secondary"
              >
                <span className="font-medium capitalize">{s.name}</span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  {s.count} recipes <Plus className="h-3.5 w-3.5" />
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selected */}
      {have.length > 0 && (
        <div className="mx-auto mt-5 flex max-w-2xl flex-wrap items-center justify-center gap-2">
          {have.map((name) => (
            <span
              key={name}
              className="flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-sm font-medium capitalize text-primary-foreground"
            >
              {name}
              <button onClick={() => remove(name)} aria-label={`Remove ${name}`}>
                <X className="h-3.5 w-3.5 opacity-80 hover:opacity-100" />
              </button>
            </span>
          ))}
          <button
            onClick={() => setHave([])}
            className="text-xs font-medium text-muted-foreground underline-offset-2 hover:underline"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Popular */}
      {popular.length > 0 && (
        <div className="mx-auto mt-6 max-w-3xl">
          <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Most-used ingredients
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {popular.map((e) => (
              <button
                key={e.name}
                onClick={() => add(e.name)}
                className="rounded-full border border-border bg-white px-3 py-1.5 text-sm capitalize text-muted-foreground transition hover:border-primary/50 hover:text-primary"
              >
                + {e.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {have.length > 0 && (
        <div className="mt-12">
          <div className="mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-display text-2xl font-bold">
                {results.length} matching recipe{results.length === 1 ? '' : 's'}
              </h2>
              <p className="text-sm text-muted-foreground">
                <Sparkles className="mr-1 inline h-3.5 w-3.5 text-primary" />
                {readyCount} you can make right now with nothing else
              </p>
            </div>
            <label className="flex items-center gap-2.5 text-sm font-medium">
              <Switch checked={onlyReady} onCheckedChange={setOnlyReady} />
              Ready-to-cook only
            </label>
          </div>

          {results.length === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border py-16 text-center">
              <span className="text-4xl">🛒</span>
              <p className="font-display text-lg font-semibold">
                {onlyReady ? 'Nothing fully covered yet' : 'No matches yet'}
              </p>
              <p className="text-sm text-muted-foreground">
                {onlyReady
                  ? 'Turn off “Ready-to-cook only” to see near-misses, or add more ingredients.'
                  : 'Try adding more common ingredients like garlic, olive oil or rice.'}
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((m) => (
                <RecipeCard
                  key={m.recipe.id}
                  recipe={m.recipe}
                  footer={
                    <div className="mt-2 border-t border-border/70 pt-3">
                      <div className="mb-1.5 flex items-center justify-between text-xs">
                        <span
                          className={cn(
                            'font-semibold',
                            m.missing.length === 0 ? 'text-emerald-600' : 'text-primary'
                          )}
                        >
                          {m.missing.length === 0
                            ? '✓ You have everything'
                            : `${Math.round(m.score * 100)}% covered`}
                        </span>
                        <span className="text-muted-foreground">
                          {m.matched.length}/{m.matched.length + m.missing.length} ingredients
                        </span>
                      </div>
                      <Progress
                        value={m.score * 100}
                        className={cn('h-1.5', m.missing.length === 0 && '[&>div]:bg-emerald-500')}
                      />
                      {m.missing.length > 0 && (
                        <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
                          Missing:{' '}
                          {m.missing.slice(0, 4).map((x, i) => (
                            <span key={x}>
                              {i > 0 && ', '}
                              <span className="font-medium text-foreground/80">{x}</span>
                            </span>
                          ))}
                          {m.missing.length > 4 && ` +${m.missing.length - 4} more`}
                        </p>
                      )}
                      {m.missing.length > 0 && m.missing.length <= 2 && (
                        <Badge variant="secondary" className="mt-2 text-[11px]">
                          <Check className="mr-1 h-3 w-3" /> Almost there
                        </Badge>
                      )}
                    </div>
                  }
                />
              ))}
            </div>
          )}

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Want the full list instead? <Link to="/recipes" className="font-medium text-primary underline-offset-2 hover:underline">Browse all recipes →</Link>
          </p>
        </div>
      )}
    </div>
  )
}
