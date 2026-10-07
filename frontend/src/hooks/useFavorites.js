import { useCallback, useSyncExternalStore } from 'react'

/**
 * Favoritos guardados en localStorage (sin necesidad de cuenta).
 * Usa un pequeño "store" compartido para que todos los corazones de la
 * página se actualicen al mismo tiempo, incluso entre pestañas.
 */
const STORAGE_KEY = 'umbral:favorites'
const listeners = new Set()

function read() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

let cache = typeof window === 'undefined' ? [] : read()

function write(ids) {
  cache = ids
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
  } catch {
    // Modo privado o almacenamiento lleno: se conserva en memoria.
  }
  listeners.forEach((listener) => listener())
}

function subscribe(listener) {
  listeners.add(listener)
  const onStorage = (event) => {
    if (event.key === STORAGE_KEY) {
      cache = read()
      listener()
    }
  }
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', onStorage)
  }
}

const getSnapshot = () => cache
const getServerSnapshot = () => []

export function useFavorites() {
  const favorites = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const isFavorite = useCallback((id) => favorites.includes(id), [favorites])

  const toggleFavorite = useCallback((id) => {
    write(cache.includes(id) ? cache.filter((fav) => fav !== id) : [...cache, id])
  }, [])

  return { favorites, count: favorites.length, isFavorite, toggleFavorite }
}
