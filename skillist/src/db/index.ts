import { fetchFromBackend } from '@/lib/api'

const mockQuery = (endpoint: string) => ({
  findMany: async (options: any) => {
    const data = await fetchFromBackend(endpoint)
    return Array.isArray(data) ? data : (data.items || [])
  },
  findFirst: async (options: any) => {
    const id = options?.where?.id?.right || options?.where?.right
    const data = await fetchFromBackend(id ? `${endpoint}/${id}` : endpoint)
    return Array.isArray(data) ? data[0] : data
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
        return data.projects || []
      }
    },
    certifications: {
      findMany: async (options: any) => {
        const data = await fetchFromBackend('/users/student/profile')
        return data.certifications || []
      }
    },
    mockInterviews: mockQuery('/users/student/interviews'),
    applications: {
      findMany: async (options: any) => {
        const data = await fetchFromBackend('/users/student/profile')
        return data.applications || []
      }
    },
    jobs: mockQuery('/jobs'),
    userScores: {
      findFirst: async (options: any) => {
        const data = await fetchFromBackend('/users/student/profile')
        return data.scores || null
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
