/**
 * Cliente HTTP mínimo para la futura API de Laravel.
 * Aún no se utiliza en la Etapa 1; queda listo para la integración.
 */
const BASE_URL = import.meta.env.VITE_API_URL || '/api'

async function request(path, { method = 'GET', params, body, headers } = {}) {
  const url = new URL(`${BASE_URL}${path}`, window.location.origin)
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') url.searchParams.set(key, value)
    })
  }

  const response = await fetch(url, {
    method,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json', ...headers },
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    const error = new Error(`Error ${response.status} al consultar ${path}`)
    error.status = response.status
    throw error
  }
  return response.status === 204 ? null : response.json()
}

export const http = {
  get: (path, options) => request(path, { ...options, method: 'GET' }),
  post: (path, body, options) => request(path, { ...options, method: 'POST', body }),
  put: (path, body, options) => request(path, { ...options, method: 'PUT', body }),
  delete: (path, options) => request(path, { ...options, method: 'DELETE' }),
}
