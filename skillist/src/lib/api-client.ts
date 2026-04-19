export async function fetchFromBackend(path: string, options: RequestInit = {}) {
  const isServer = typeof window === 'undefined'
  let backendUrl = ''

  if (isServer) {
    // On server, use the internal backend URL (but this client version shouldn't be used on server)
    backendUrl = process.env.BACKEND_URL ? `${process.env.BACKEND_URL}/api/v1` : 'http://localhost:3001/api/v1'
  } else {
    // On client, use the rewrite path or public backend URL
    backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || '/api/backend'
  }
  
  const headers = new Headers(options.headers)
  
  // Only set JSON content-type if not already set (e.g. for FormData)
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json')
  }

  if (!options.credentials && !isServer) {
    options = { ...options, credentials: 'include' }
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
