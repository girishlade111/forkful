import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router'
import { ChevronLeft, ChevronRight, Search, SlidersHorizontal, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { RecipeCard } from '@/components/RecipeCard'
import { CATEGORIES } from '@/types/recipe'
import { ALL_CUISINES, formatTime, searchRecipes, totalTime } from '@/lib/recipe-utils'
import { cn } from '@/lib/utils'

const PAGE_SIZE = 12
const MAX_TIME = 240

type SortKey = 'rating' | 'time' | 'name'

export default function Catalog() {
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState(params.get('q') ?? '')
  const [category, setCategory] = useState(params.get('category') ?? 'all')
  const [cuisine, setCuisine] = useState('all')
  const [difficulty, setDifficulty] = useState('all')
  const [sort, setSort] = useState<SortKey>((params.get('sort') as SortKey) || 'rating')
  const [maxTime, setMaxTime] = useState(MAX_TIME)
  const [page, setPage] = useState(1)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const results = useMemo(() => {
    let list = searchRecipes(query)
    if (category !== 'all') list = list.filter((r) => r.category === category)
    if (cuisine !== 'all') list = list.filter((r) => r.cuisine === cuisine)
    if (difficulty !== 'all') list = list.filter((r) => r.difficulty === difficulty)
    if (maxTime < MAX_TIME) list = list.filter((r) => totalTime(r) <= maxTime)
    const sorted = [...list]
    if (sort === 'rating') sorted.sort((a, b) => b.rating - a.rating)
    if (sort === 'time') sorted.sort((a, b) => totalTime(a) - totalTime(b))
    if (sort === 'name') sorted.sort((a, b) => a.title.localeCompare(b.title))
    return sorted
  }, [query, category, cuisine, difficulty, maxTime, sort])

  const pages = Math.max(1, Math.ceil(results.length / PAGE_SIZE))
  const cur = Math.min(page, pages)
  const visible = results.slice((cur - 1) * PAGE_SIZE, cur * PAGE_SIZE)

  const resetPage = () => setPage(1)
  const activeFilters =
    (category !== 'all' ? 1 : 0) +
    (cuisine !== 'all' ? 1 : 0) +
    (difficulty !== 'all' ? 1 : 0) +
    (maxTime < MAX_TIME ? 1 : 0)

  const clearFilters = () => {
    setCategory('all')
    setCuisine('all')
    setDifficulty('all')
    setMaxTime(MAX_TIME)
    setPage(1)
  }

  const FilterPanel = (
    <div className="space-y-5">
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Category
        </label>
        <Select
          value={category}
          onValueChange={(v) => {
            setCategory(v)
            resetPage()
            if (v === 'all') params.delete('category')
            else params.set('category', v)
            setParams(params, { replace: true })
          }}
        >
          <SelectTrigger className="bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Cuisine
        </label>
        <Select
          value={cuisine}
          onValueChange={(v) => {
            setCuisine(v)
            resetPage()
          }}
        >
          <SelectTrigger className="bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All cuisines</SelectItem>
            {ALL_CUISINES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Difficulty
        </label>
        <div className="flex gap-2">
          {['all', 'Easy', 'Medium', 'Hard'].map((d) => (
            <button
              key={d}
              onClick={() => {
                setDifficulty(d)
                resetPage()
              }}
              className={cn(
                'flex-1 rounded-lg border px-2 py-1.5 text-xs font-medium transition',
                difficulty === d
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-white text-muted-foreground hover:border-primary/40'
              )}
            >
              {d === 'all' ? 'Any' : d}
            </button>
          ))}
        </div>
      </div>
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Max total time
          </label>
          <span className="text-xs font-medium text-primary">
            {maxTime >= MAX_TIME ? 'Any' : `≤ ${formatTime(maxTime)}`}
          </span>
        </div>
        <Slider
          value={[maxTime]}
          min={15}
          max={MAX_TIME}
          step={15}
          onValueChange={([v]) => {
            setMaxTime(v)
            resetPage()
          }}
        />
      </div>
      {activeFilters > 0 && (
        <Button variant="outline" size="sm" className="w-full gap-1.5" onClick={clearFilters}>
          <X className="h-3.5 w-3.5" /> Clear filters ({activeFilters})
        </Button>
      )}
    </div>
  )

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-col gap-1">
        <h1 className="font-display text-4xl font-bold">All recipes</h1>
        <p className="text-muted-foreground">
          {results.length} recipe{results.length === 1 ? '' : 's'}
          {query && (
            <>
              {' '}
              for “<span className="font-medium text-foreground">{query}</span>”
            </>
          )}
        </p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Sidebar (desktop) */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-24 rounded-2xl border border-border/70 bg-white/60 p-5">
            {FilterPanel}
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          {/* Toolbar */}
          <div className="mb-5 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  resetPage()
                }}
                placeholder="Search by name, ingredient, cuisine, tag…"
                className="h-11 bg-white pl-10"
              />
              {query && (
                <button
                  onClick={() => {
                    setQuery('')
                    resetPage()
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="gap-1.5 bg-white lg:hidden"
                onClick={() => setFiltersOpen((o) => !o)}
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                {activeFilters > 0 && (
                  <Badge className="ml-1 h-5 min-w-5 px-1 text-[10px]">{activeFilters}</Badge>
                )}
              </Button>
              <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
                <SelectTrigger className="w-40 bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Top rated</SelectItem>
                  <SelectItem value="time">Quickest first</SelectItem>
                  <SelectItem value="name">Name A–Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {filtersOpen && (
            <div className="mb-5 rounded-2xl border border-border/70 bg-white/60 p-5 lg:hidden">
              {FilterPanel}
            </div>
          )}

          {/* Grid */}
          {visible.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-20 text-center">
              <span className="text-5xl">🫙</span>
              <p className="font-display text-xl font-semibold">Nothing matches those filters</p>
              <p className="text-sm text-muted-foreground">
                Try a different search term or loosen the filters.
              </p>
              {(activeFilters > 0 || query) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    clearFilters()
                    setQuery('')
                  }}
                >
                  Reset everything
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {visible.map((r) => (
                <RecipeCard key={r.id} recipe={r} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {pages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="icon"
                disabled={cur <= 1}
                onClick={() => {
                  setPage(cur - 1)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    setPage(p)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  className={cn(
                    'h-9 w-9 rounded-lg text-sm font-medium transition',
                    p === cur
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-secondary'
                  )}
                >
                  {p}
                </button>
              ))}
              <Button
                variant="outline"
                size="icon"
                disabled={cur >= pages}
                onClick={() => {
                  setPage(cur + 1)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
