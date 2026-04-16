import { Code2, FolderOpen } from 'lucide-react'
import Link from 'next/link'

interface Project {
  id: string
  title: string
  description: string | null
}

interface RecentProjectsProps {
  projects: Project[]
}

export function RecentProjects({ projects }: RecentProjectsProps) {
  return (
    <div className="p-6 rounded-3xl bg-gradient-to-br from-card to-card/50 border border-border/30 shadow-sm hover:shadow-md hover:border-indigo-500/20 transition-all duration-300">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-bold text-foreground/90">Recent Projects</h3>
        <Link href="/dashboard/student/portfolio" className="text-xs font-semibold text-indigo-500 hover:underline">View All</Link>
      </div>
      <div className="space-y-2.5">
        {projects.length > 0 ? (
          projects.slice(0, 3).map(project => (
            <div key={project.id} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-muted/40 transition-all duration-200 group">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <Code2 className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold truncate group-hover:text-indigo-500 transition-colors">{project.title}</p>
                <p className="text-xs text-muted-foreground truncate">{project.description || 'No description'}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-muted/30 text-muted-foreground/60">
            <FolderOpen className="w-5 h-5" />
            <p className="text-sm">No projects added yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}

// interface RecentProjectsProps {
//   projects: Project[]
// }

// export function RecentProjects({ projects }: RecentProjectsProps) {
//   return (
//     <Card className="rounded-[2rem] overflow-hidden border-border/50 bg-background/40 backdrop-blur-sm group hover:border-primary/30 transition-all duration-300">
//       <CardHeader className="pb-4">
//         <div className="flex items-center justify-between">
//           <CardTitle className="text-lg font-bold">Recent Projects</CardTitle>
//           <Link href="/dashboard/student/portfolio" className="text-xs font-bold text-primary hover:underline">View All</Link>
//         </div>
//       </CardHeader>
//       <CardContent>
//         <div className="space-y-3">
//           {projects.length > 0 ? (
//             projects.slice(0, 3).map(project => (
//               <div key={project.id} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-muted/50 transition-all duration-300 group/item">
//                 <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover/item:scale-110 transition-transform">
//                   <Code2 className="w-5 h-5 text-primary" />
//                 </div>
//                 <div className="min-w-0">
//                   <p className="text-sm font-bold truncate group-hover/item:text-primary transition-colors">{project.title}</p>
//                   <p className="text-xs text-muted-foreground truncate">{project.description}</p>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <p className="text-sm text-muted-foreground">No projects added yet.</p>
//           )}
//         </div>
//       </CardContent>
//     </Card>
//   )
// }
