import { useCallback, useEffect, useState } from 'react'

const KEY = 'forkful:favorites'

function load(): string[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]')
  } catch {
    return []
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(load)

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(favorites))
  }, [favorites])

  const toggle = useCallback((id: string) => {
    setFavorites((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]))
  }, [])

  return { favorites, toggle, isFavorite: (id: string) => favorites.includes(id) }
}
