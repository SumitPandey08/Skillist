import { Code2, FolderOpen } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

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
    <div className="p-8 rounded-[2rem] bg-gradient-to-br from-background to-muted/20 border border-border/40 shadow-xl relative overflow-hidden group">
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <h3 className="text-xl font-black uppercase tracking-tight">Active Projects</h3>
          <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em]">Showcasing your technical build-outs</p>
        </div>
        <Link href="/dashboard/student/portfolio">
          <Button variant="ghost" className="text-xs font-black uppercase tracking-widest text-indigo-500 hover:bg-indigo-500/5 rounded-xl">View All</Button>
        </Link>
      </div>
      <div className="space-y-4">
        {projects.length > 0 ? (
          projects.slice(0, 3).map(project => (
            <div key={project.id} className="flex items-center gap-5 p-4 rounded-[1.5rem] bg-background/50 border border-border/40 hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-500 group/item relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 opacity-0 group-hover/item:opacity-100 transition-opacity" />
              
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0 group-hover/item:scale-110 group-hover/item:rotate-[-5deg] transition-all duration-500 shadow-inner">
                <Code2 className="w-6 h-6 text-indigo-500" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-base font-black truncate group-hover/item:text-indigo-500 transition-colors tracking-tight">{project.title}</p>
                <p className="text-xs font-bold text-muted-foreground/60 truncate uppercase tracking-tight mt-0.5">{project.description || 'No description provided'}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="py-10 flex flex-col items-center justify-center text-center space-y-4 opacity-40">
            <FolderOpen className="w-12 h-12 text-muted-foreground" />
            <p className="text-xs font-black uppercase tracking-[0.2em]">No projects in orbit yet</p>
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
