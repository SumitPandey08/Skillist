import { auth } from '@clerk/nextjs/server'

export async function fetchFromBackend(path: string, options: RequestInit = {}) {
  const { getToken } = await auth()
  const token = await getToken()

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001/api/v1'
  
  const headers = new Headers(options.headers)
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }
  
  // Only set JSON content-type if not already set (e.g. for FormData)
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json')
  }

  const url = `${backendUrl}${path.startsWith('/') ? path : `/${path}`}`

  const response = await fetch(url, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.error || `Backend request failed: ${response.statusText}`)
  }

  return response.json()
}
