import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router'
import {
  Check,
  ChefHat,
  ChevronLeft,
  ChevronRight,
  ListChecks,
  PartyPopper,
  Pause,
  Play,
  RotateCcw,
  Timer,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { RECIPES } from '@/data/recipes'
import { formatIngredient } from '@/lib/recipe-utils'
import { cn } from '@/lib/utils'

// ─── Step timer ────────────────────────────────────────────────

function StepTimer({ minutes, stepKey }: { minutes: number; stepKey: string }) {
  const total = minutes * 60
  const [left, setLeft] = useState(total)
  const [running, setRunning] = useState(false)
  const intervalRef = useRef<number | null>(null)

  // Reset when the step changes
  useEffect(() => {
    setLeft(total)
    setRunning(false)
  }, [stepKey, total])

  useEffect(() => {
    if (!running) return
    intervalRef.current = window.setInterval(() => {
      setLeft((s) => {
        if (s <= 1) {
          setRunning(false)
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current)
    }
  }, [running])

  const pct = total === 0 ? 0 : ((total - left) / total) * 100
  const mm = Math.floor(left / 60)
  const ss = left % 60
  const done = left === 0

  return (
    <div
      className={cn(
        'mt-6 rounded-2xl border p-4 transition-colors',
        done
          ? 'border-emerald-400/50 bg-emerald-500/10'
          : 'border-white/10 bg-white/5'
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              'flex h-11 w-11 items-center justify-center rounded-full',
              done ? 'bg-emerald-500 text-white' : 'bg-amber-400/20 text-amber-300'
            )}
          >
            {done ? <Check className="h-5 w-5" /> : <Timer className="h-5 w-5" />}
          </span>
          <div>
            <div className="text-xs font-medium uppercase tracking-wide text-stone-400">
              Suggested timer
            </div>
            <div
              className={cn(
                'font-mono text-3xl font-bold tabular-nums',
                done ? 'text-emerald-300' : 'text-white'
              )}
            >
              {String(mm).padStart(2, '0')}:{String(ss).padStart(2, '0')}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!done && (
            <Button
              size="lg"
              onClick={() => setRunning((r) => !r)}
              className={cn(
                'gap-1.5 rounded-full',
                running
                  ? 'bg-white/15 text-white hover:bg-white/25'
                  : 'bg-amber-400 text-stone-900 hover:bg-amber-300'
              )}
            >
              {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {running ? 'Pause' : left === total ? 'Start' : 'Resume'}
            </Button>
          )}
          <Button
            size="icon"
            variant="ghost"
            onClick={() => {
              setLeft(total)
              setRunning(false)
            }}
            className="text-stone-400 hover:bg-white/10 hover:text-white"
            aria-label="Reset timer"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-1000',
            done ? 'bg-emerald-400' : 'bg-amber-400'
          )}
          style={{ width: `${done ? 100 : pct}%` }}
        />
      </div>
      {done && <p className="mt-2 text-sm font-medium text-emerald-300">Time's up — check your food!</p>}
    </div>
  )
}

// ─── Cook mode ─────────────────────────────────────────────────

export default function CookMode() {
  const { id } = useParams()
  const recipe = RECIPES.find((r) => r.id === id)
  const [stepIdx, setStepIdx] = useState(0)
  const [finished, setFinished] = useState(false)
  const [showIngredients, setShowIngredients] = useState(false)
  const [checkedIng, setCheckedIng] = useState<Set<number>>(new Set())

  // Try to keep the screen awake while cooking
  useEffect(() => {
    let lock: { release: () => Promise<void> } | null = null
    const nav = navigator as Navigator & {
      wakeLock?: { request: (t: 'screen') => Promise<{ release: () => Promise<void> }> }
    }
    nav.wakeLock
      ?.request('screen')
      ?.then((l) => (lock = l))
      ?.catch(() => {})
    return () => {
      lock?.release().catch(() => {})
    }
  }, [])

  const stepCount = recipe?.steps.length ?? 0
  const next = useCallback(() => {
    if (stepIdx < stepCount - 1) setStepIdx((i) => i + 1)
    else setFinished(true)
  }, [stepIdx, stepCount])
  const prev = useCallback(() => setStepIdx((i) => Math.max(0, i - 1)), [])

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault()
        next()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        prev()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev])

  const progress = useMemo(
    () => (stepCount === 0 ? 0 : ((finished ? stepCount : stepIdx) / stepCount) * 100),
    [stepIdx, stepCount, finished]
  )

  if (!recipe) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-stone-950 text-white">
        <span className="text-6xl">🍽️</span>
        <p className="font-display text-2xl font-bold">Recipe not found</p>
        <Button asChild variant="secondary">
          <Link to="/recipes">Back to recipes</Link>
        </Button>
      </div>
    )
  }

  const step = recipe.steps[stepIdx]

  // ── Finished screen ──
  if (finished) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-stone-950 px-6 text-center text-white">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300">
          <PartyPopper className="h-10 w-10" />
        </span>
        <h1 className="mt-6 font-display text-4xl font-bold sm:text-5xl">Dinner is served!</h1>
        <p className="mt-3 max-w-md text-stone-400">
          You cooked <span className="font-semibold text-white">{recipe.title}</span> from start to
          finish — all {recipe.steps.length} steps. Plate it up and enjoy. {recipe.emoji}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg" className="rounded-full">
            <Link to="/recipes">Cook something else</Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="rounded-full border-white/20 bg-transparent text-white hover:bg-white/10"
            onClick={() => {
              setFinished(false)
              setStepIdx(0)
              setCheckedIng(new Set())
            }}
          >
            <RotateCcw className="mr-1.5 h-4 w-4" /> Cook it again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-stone-950 text-white">
      {/* Top bar */}
      <div className="border-b border-white/10">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <img
              src={`/images/${recipe.id}.jpg`}
              alt=""
              className="h-9 w-9 rounded-lg object-cover"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{recipe.title}</p>
              <p className="text-xs text-stone-400">
                Step {stepIdx + 1} of {stepCount}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowIngredients(true)}
              className="gap-1.5 text-stone-300 hover:bg-white/10 hover:text-white"
            >
              <ListChecks className="h-4 w-4" />
              <span className="hidden sm:inline">Ingredients</span>
            </Button>
            <Link
              to={`/recipe/${recipe.id}`}
              className="rounded-full p-2 text-stone-400 hover:bg-white/10 hover:text-white"
              aria-label="Exit cooking mode"
            >
              <X className="h-5 w-5" />
            </Link>
          </div>
        </div>
        <div className="h-1 bg-white/10">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step dots */}
      <div className="mx-auto flex max-w-4xl flex-wrap gap-1.5 px-4 pt-6 sm:px-6">
        {recipe.steps.map((_, i) => (
          <button
            key={i}
            onClick={() => setStepIdx(i)}
            aria-label={`Go to step ${i + 1}`}
            className={cn(
              'h-2.5 rounded-full transition-all',
              i === stepIdx
                ? 'w-8 bg-primary'
                : i < stepIdx
                  ? 'w-2.5 bg-primary/50'
                  : 'w-2.5 bg-white/15 hover:bg-white/30'
            )}
          />
        ))}
      </div>

      {/* Current step */}
      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-8 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary font-display text-xl font-bold text-primary-foreground">
            {stepIdx + 1}
          </span>
          {step.timer && (
            <span className="flex items-center gap-1.5 rounded-full bg-amber-400/15 px-3 py-1.5 text-sm font-medium text-amber-300">
              <Timer className="h-4 w-4" /> about {step.timer} min
            </span>
          )}
        </div>
        <p className="mt-6 font-display text-2xl font-medium leading-relaxed sm:text-3xl">
          {step.text}
        </p>

        {step.timer && <StepTimer minutes={step.timer} stepKey={`${recipe.id}-${stepIdx}`} />}

        <div className="mt-auto" />
      </div>

      {/* Bottom controls */}
      <div className="sticky bottom-0 border-t border-white/10 bg-stone-950/95 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-4 sm:px-6">
          <Button
            size="lg"
            variant="outline"
            onClick={prev}
            disabled={stepIdx === 0}
            className="gap-1.5 rounded-full border-white/20 bg-transparent text-white hover:bg-white/10 disabled:opacity-30"
          >
            <ChevronLeft className="h-5 w-5" /> Back
          </Button>
          <Button size="lg" onClick={next} className="flex-1 gap-1.5 rounded-full text-base">
            {stepIdx === stepCount - 1 ? (
              <>
                Finish <ChefHat className="h-5 w-5" />
              </>
            ) : (
              <>
                Next step <ChevronRight className="h-5 w-5" />
              </>
            )}
          </Button>
        </div>
        <p className="pb-3 text-center text-[11px] text-stone-500">
          Tip: use ← → arrow keys (or space) to move between steps, hands-free
        </p>
      </div>

      {/* Ingredients drawer */}
      {showIngredients && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-black/60"
          onClick={() => setShowIngredients(false)}
        >
          <div
            className="flex h-full w-full max-w-sm flex-col bg-stone-900 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <h2 className="font-display text-lg font-bold">Ingredients</h2>
              <button
                onClick={() => setShowIngredients(false)}
                className="rounded-full p-1.5 text-stone-400 hover:bg-white/10 hover:text-white"
                aria-label="Close ingredients"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <p className="mb-3 text-xs text-stone-400">
                Check items off as you add them to the pot.
              </p>
              <ul className="space-y-1">
                {recipe.ingredients.map((ing, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 rounded-xl px-2 py-2.5 hover:bg-white/5"
                  >
                    <Checkbox
                      id={`cook-ing-${i}`}
                      checked={checkedIng.has(i)}
                      onCheckedChange={() =>
                        setCheckedIng((c) => {
                          const nextSet = new Set(c)
                          if (nextSet.has(i)) nextSet.delete(i)
                          else nextSet.add(i)
                          return nextSet
                        })
                      }
                      className="border-white/30 data-[state=checked]:bg-primary"
                    />
                    <label
                      htmlFor={`cook-ing-${i}`}
                      className={cn(
                        'flex flex-1 cursor-pointer items-baseline justify-between gap-2 text-sm',
                        checkedIng.has(i) && 'text-stone-500 line-through'
                      )}
                    >
                      <span className="capitalize">{ing.n}</span>
                      <span className="shrink-0 text-right text-xs text-stone-400">
                        {formatIngredient(ing.q, ing.u)}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
