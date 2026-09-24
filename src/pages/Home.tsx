import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { ArrowRight, Clock, Search, Sparkles, Timer, UtensilsCrossed } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { RecipeCard } from '@/components/RecipeCard'
import { RECIPES } from '@/data/recipes'
import { CATEGORY_IMAGE, HERO_IMAGES, recipeImage } from '@/data/images'
import { CATEGORIES } from '@/types/recipe'
import { pantryIndex } from '@/lib/recipe-utils'

const FEATURED = [...RECIPES].sort((a, b) => b.rating - a.rating).slice(0, 6)

export default function Home() {
  const [q, setQ] = useState('')
  const navigate = useNavigate()
  const ingredientCount = pantryIndex().length

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate(q.trim() ? `/recipes?q=${encodeURIComponent(q.trim())}` : '/recipes')
  }

  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -left-40 top-0 h-96 w-96 rounded-full bg-orange-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-amber-100/60 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pb-20 pt-14 sm:px-6 lg:grid-cols-2 lg:pt-20">
          {/* Copy */}
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" /> {RECIPES.length} recipes · step-by-step cooking mode
            </span>
            <h1 className="mt-6 font-display text-5xl font-bold leading-[1.04] tracking-tight sm:text-6xl">
              Real food,
              <br />
              cooked <span className="italic text-primary">with confidence</span>
            </h1>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-muted-foreground">
              Search the whole catalog, or tell us what's in your fridge and we'll find what you can
              cook tonight — then guide you through every step.
            </p>

            <form onSubmit={submit} className="mt-8 flex max-w-md gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Try “lasagna”, “salmon”, “vegan”…"
                  className="h-13 rounded-full border-border bg-card py-6 pl-11 text-base shadow-sm"
                />
              </div>
              <Button type="submit" size="lg" className="h-13 rounded-full px-7 text-base">
                Search
              </Button>
            </form>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Popular:
              </span>
              {['pasta', 'curry', 'salmon', 'tacos', 'chocolate'].map((t) => (
                <Link
                  key={t}
                  to={`/recipes?q=${t}`}
                  className="rounded-full border border-border bg-card px-3 py-1 text-sm text-muted-foreground transition hover:border-primary/40 hover:text-primary"
                >
                  {t}
                </Link>
              ))}
            </div>

            {/* Stats */}
            <div className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-border/70 pt-6">
              {[
                { icon: UtensilsCrossed, value: `${RECIPES.length}`, label: 'Recipes' },
                { icon: Search, value: `${ingredientCount}`, label: 'Ingredients indexed' },
                { icon: Timer, value: `${RECIPES.reduce((a, r) => a + r.steps.length, 0)}`, label: 'Guided steps' },
              ].map(({ icon: Icon, value, label }) => (
                <div key={label}>
                  <div className="flex items-center gap-1.5 font-display text-2xl font-bold">
                    <Icon className="h-4 w-4 text-primary" /> {value}
                  </div>
                  <div className="mt-0.5 text-xs text-muted-foreground">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Photo collage */}
          <div className="relative hidden h-[540px] lg:block">
            <div className="absolute right-0 top-0 w-[62%] rotate-2 overflow-hidden rounded-3xl shadow-[0_24px_60px_-20px_rgba(60,40,20,0.4)]">
              <img src={HERO_IMAGES.main} alt="Freshly baked lasagna" className="aspect-[4/5] w-full object-cover" />
            </div>
            <div className="absolute left-0 top-24 w-[46%] -rotate-3 overflow-hidden rounded-3xl border-4 border-card shadow-[0_24px_60px_-20px_rgba(60,40,20,0.4)]">
              <img src={HERO_IMAGES.top} alt="Seafood paella" className="aspect-square w-full object-cover" />
            </div>
            <div className="absolute bottom-0 left-16 w-[42%] rotate-1 overflow-hidden rounded-3xl border-4 border-card shadow-[0_24px_60px_-20px_rgba(60,40,20,0.4)]">
              <img src={HERO_IMAGES.bottom} alt="Chocolate chip cookies" className="aspect-[4/3] w-full object-cover" />
            </div>
            <div className="absolute -bottom-2 right-8 flex items-center gap-2 rounded-full bg-card px-4 py-2.5 shadow-lg">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">30-minute weeknight winners</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="mb-7 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">The catalog</p>
            <h2 className="mt-1 font-display text-3xl font-bold sm:text-4xl">What are you craving?</h2>
          </div>
          <Button asChild variant="ghost" className="hidden gap-1 sm:inline-flex">
            <Link to="/recipes">
              All recipes <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {CATEGORIES.map((c) => {
            const count = RECIPES.filter((r) => r.category === c).length
            return (
              <Link
                key={c}
                to={`/recipes?category=${encodeURIComponent(c)}`}
                className="group relative aspect-[4/3] overflow-hidden rounded-2xl"
              >
                <img
                  src={CATEGORY_IMAGE[c]}
                  alt={c}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.07]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <div className="font-display text-lg font-semibold text-white">{c}</div>
                  <div className="text-xs font-medium text-white/75">{count} recipes</div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* ── Featured ── */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="mb-7 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Most loved</p>
            <h2 className="mt-1 font-display text-3xl font-bold sm:text-4xl">Tonight's greatest hits</h2>
          </div>
          <Button asChild variant="ghost" className="hidden gap-1 sm:inline-flex">
            <Link to="/recipes?sort=rating">
              See all <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED.map((r) => (
            <RecipeCard key={r.id} recipe={r} />
          ))}
        </div>
      </section>

      {/* ── Pantry CTA ── */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl shadow-[0_24px_60px_-24px_rgba(60,40,20,0.5)]">
          <img
            src={HERO_IMAGES.cta}
            alt="Roast chicken on a platter"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/85 via-stone-950/60 to-stone-950/10" />
          <div className="relative max-w-xl px-6 py-16 text-white sm:px-12">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" /> Ingredient search
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold sm:text-4xl">
              What's in your kitchen?
            </h2>
            <p className="mt-3 leading-relaxed text-stone-200">
              Tell Forkful which ingredients you have, and we'll rank every recipe by how few extra
              items you'd need. Dinner decisions, solved.
            </p>
            <Button asChild size="lg" className="mt-6 gap-2 rounded-full">
              <Link to="/pantry">
                Find recipes by ingredient <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Editor's strip ── */}
      <section className="border-t border-border/70 bg-card/60">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-4 px-4 py-8 sm:px-6">
          {['roast-chicken', 'margherita-pizza', 'beef-tacos', 'tiramisu', 'tom-kha-gai'].map((id) => {
            const r = RECIPES.find((x) => x.id === id)!
            return (
              <Link
                key={id}
                to={`/recipe/${id}`}
                className="group flex items-center gap-3"
              >
                <img
                  src={recipeImage(id)}
                  alt={r.title}
                  loading="lazy"
                  className="h-12 w-12 rounded-full border-2 border-card object-cover shadow-sm transition group-hover:scale-110"
                />
                <span className="text-sm font-medium text-muted-foreground transition group-hover:text-primary">
                  {r.title}
                </span>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}
