import { auth } from '@clerk/nextjs/server'

export async function fetchFromBackend(path: string, options: RequestInit = {}) {
  const { getToken } = await auth()
  const token = await getToken()

  const isServer = typeof window === 'undefined'
  let backendUrl = ''

  if (isServer) {
    // On server, we must use the internal backend URL
    backendUrl = process.env.BACKEND_URL ? `${process.env.BACKEND_URL}/api/v1` : 'http://localhost:3001/api/v1'
  } else {
    // On client, if both are same-origin, use the rewrite path
    // If NEXT_PUBLIC_BACKEND_URL is set, it might be an external API
    backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || '/api/backend'
  }
  
  const headers = new Headers(options.headers)
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }
  
  // Only set JSON content-type if not already set (e.g. for FormData)
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json')
  }

  // Remove leading slash from path if backendUrl ends with one or vice versa
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path
  const normalizedBase = backendUrl.endsWith('/') ? backendUrl : `${backendUrl}/`
  const url = `${normalizedBase}${normalizedPath}`

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
