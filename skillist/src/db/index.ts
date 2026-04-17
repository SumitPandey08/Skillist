import { fetchFromBackend } from '@/lib/api'

const mockQuery = (endpoint: string) => ({
  findMany: async (options: any) => {
    const data = await fetchFromBackend(endpoint)
    // Handle cases where data is wrapped in an object
    let result = data
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      if (Array.isArray(data.items)) result = data.items
      else if (Array.isArray(data.interviews)) result = data.interviews
      else if (Array.isArray(data.jobs)) result = data.jobs
      else if (Array.isArray(data.applications)) result = data.applications
    }
    return Array.isArray(result) ? result : []
  },
  findFirst: async (options: any) => {
    const id = options?.where?.id?.right || options?.where?.right
    
    // Some endpoints use the auth token and don't support /:id
    const noIdEndpoints = ['/users/student/profile', '/users/company/profile']
    const useId = id && !noIdEndpoints.includes(endpoint)
    
    const data = await fetchFromBackend(useId ? `${endpoint}/${id}` : endpoint)
    
    // Unwrap common response wrappers
    let result = data
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      if (data.student) result = data.student
      else if (data.user) result = data.user
      else if (data.company) result = data.company
      else if (data.job) result = data.job
      else if (data.application) result = data.application
    }
    
    return Array.isArray(result) ? result[0] : result
  }
})

const createChainable = (promise: Promise<any>) => {
  const chain: any = promise
  chain.where = () => createChainable(promise)
  chain.orderBy = () => createChainable(promise)
  chain.innerJoin = () => createChainable(promise)
  chain.leftJoin = () => createChainable(promise)
  chain.limit = () => createChainable(promise)
  chain.offset = () => createChainable(promise)
  chain.onConflictDoUpdate = () => createChainable(promise)
  return chain
}

export const db = {
  query: {
    users: mockQuery('/users/student/profile'),
    students: mockQuery('/users/student/profile'),
    projects: {
      findMany: async (options: any) => {
        const data = await fetchFromBackend('/users/student/profile')
        return (data.student?.projects || data.projects || [])
      }
    },
    certifications: {
      findMany: async (options: any) => {
        const data = await fetchFromBackend('/users/student/profile')
        return (data.student?.certifications || data.certifications || [])
      }
    },
    mockInterviews: mockQuery('/users/student/interviews'),
    applications: {
      findMany: async (options: any) => {
        const data = await fetchFromBackend('/users/student/profile')
        return (data.student?.applications || data.applications || [])
      }
    },
    jobs: mockQuery('/jobs'),
    userScores: {
      findFirst: async (options: any) => {
        const data = await fetchFromBackend('/users/student/profile')
        return (data.student?.scores || data.scores || null)
      }
    }
  },
  select: (args?: any) => ({
    from: (table: any) => createChainable(Promise.resolve([])),
    then: (cb: any) => Promise.resolve([]).then(cb)
  }),
  insert: (table: any) => ({
    values: (values: any) => createChainable(Promise.resolve({ id: 'mock-id' }))
  }),
  update: (table: any) => ({
    set: (values: any) => createChainable(Promise.resolve({ success: true }))
  }),
  delete: (table: any) => ({
    where: (condition: any) => createChainable(Promise.resolve({ success: true }))
  })
}

export * from './schema'

export const eq = (a: any, b: any) => ({ type: 'eq', left: a, right: b })
export const and = (...args: any[]) => ({ type: 'and', conditions: args })
export const desc = (a: any) => ({ type: 'desc', col: a })
export const asc = (a: any) => ({ type: 'asc', col: a })
