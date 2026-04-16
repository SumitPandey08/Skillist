import { RoadmapSection } from "@/components/dashboard/student/roadmap-section";
import { getStudentRoadmap } from "@/app/dashboard/student/_actions";

export default async function CandidateDashboardPage() {
  const roadmap = await getStudentRoadmap();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Welcome back.</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-6 rounded-2xl border border-white/5 shadow-xl hover:shadow-primary/5 transition-shadow">
          <div className="text-sm text-muted-foreground font-medium mb-2">Overall Match Score</div>
          <div className="text-4xl font-extrabold text-foreground">84<span className="text-primary text-xl">%</span></div>
        </div>
        <div className="glass p-6 rounded-2xl border border-white/5 shadow-xl hover:shadow-primary/5 transition-shadow">
          <div className="text-sm text-muted-foreground font-medium mb-2">Pending Applications</div>
          <div className="text-4xl font-extrabold text-foreground">3</div>
        </div>
        <div className="glass p-6 rounded-2xl border border-white/5 shadow-xl hover:shadow-primary/5 transition-shadow">
          <div className="text-sm text-muted-foreground font-medium mb-2">Profile Views</div>
          <div className="text-4xl font-extrabold text-foreground">12</div>
        </div>
      </div>

      <RoadmapSection initialRoadmap={roadmap as any} />
    </div>
  );
}
