import { useEffect, useState } from 'react'

/**
 * Ejecuta una función asíncrona y expone { data, loading, error }.
 * Se vuelve a ejecutar cuando cambian las dependencias; mientras carga
 * conserva los datos anteriores (útil al cambiar filtros) y descarta
 * respuestas que lleguen tarde.
 *
 * @template T
 * @param {() => Promise<T>} loader
 * @param {unknown[]} deps  Valores serializables (filtros, slug…)
 * @returns {{ data: T | null, loading: boolean, error: Error | null }}
 */
export function useAsync(loader, deps = []) {
  const key = JSON.stringify(deps)
  const [result, setResult] = useState({ key: null, data: null, error: null })

  useEffect(() => {
    let active = true
    loader()
      .then((data) => active && setResult({ key, data, error: null }))
      .catch((error) => active && setResult((prev) => ({ key, data: prev.data, error })))
    return () => {
      active = false
    }
    // `loader` cambia en cada render; `key` resume las dependencias reales.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  return { data: result.data, loading: result.key !== key, error: result.error }
}
