import { prisma } from "../prisma";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { Annotation, StateGraph, END, START } from "@langchain/langgraph";
import { z } from "zod";

// Schema for matching output
const ComponentScoresSchema = z.object({
  expScore: z.number(),
  projScore: z.number(),
  potentialScore: z.number(),
  analysis: z.string(),
});

interface ComponentScores {
  expScore: number;
  projScore: number;
  potentialScore: number;
  analysis: string;
}

// Define State for LangGraph
const MatchState = Annotation.Root({
  jobId: Annotation<string>,
  student: Annotation<any>,
  job: Annotation<any>,
  skillScore: Annotation<number>,
  externalStats: Annotation<any>,
  scores: Annotation<ComponentScores>,
  totalScore: Annotation<number>,
});

// Helper for vector similarity using raw SQL since Prisma doesn't have native vector comparison
async function getSkillScore(studentId: string, jobId: string): Promise<number> {
  try {
    const student = await prisma.student.findUnique({ where: { id: studentId } });
    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!student || !job) return 0;
    
    const studentSkills = await prisma.studentSkill.findMany({ where: { studentId }, include: { skill: true } });
    const jobSkills = await prisma.jobSkill.findMany({ where: { jobId }, include: { skill: true } });
    
    const studentSkillNames = studentSkills.map(s => s.skill.name.toLowerCase());
    const jobSkillNames = jobSkills.map(s => s.skill.name.toLowerCase());
    
    if (jobSkillNames.length === 0) return 70;
    
    const overlap = jobSkillNames.filter(s => studentSkillNames.includes(s));
    return Math.round((overlap.length / jobSkillNames.length) * 100);
  } catch (e) {
    return 0;
  }
}

// Node 1: Fetch and Prepare Data
async function dataCollector(state: typeof MatchState.State) {
  const student = await prisma.student.findUnique({
    where: { id: state.student.id },
    include: { 
      experience: true, 
      projects: true, 
      skills: { include: { skill: true } },
      scores: true,
      normalizedSkills: true,
      externalAccounts: { include: { githubData: true, leetcodeData: true } }
    }
  }) as any;

  const job = await prisma.job.findUnique({
    where: { id: state.jobId },
    include: { company: true, skills: { include: { skill: true } } }
  }) as any;

  const skillScore = await getSkillScore(state.student.id, state.jobId);

  const externalStats = {
    scores: student?.scores,
    skills: student?.normalizedSkills,
    github: student?.externalAccounts?.find((a: any) => a.platform === 'github')?.githubData,
    leetcode: student?.externalAccounts?.find((a: any) => a.platform === 'leetcode')?.leetcodeData
  };

  return { student, job, skillScore, externalStats };
}

// Node 2: AI Analysis
async function aiScorer(state: typeof MatchState.State) {
  const model = new ChatGoogleGenerativeAI({ 
    model: "gemini-1.5-flash",
    temperature: 0,
    apiKey: process.env.GEMINI_API_KEY
  }).withStructuredOutput(ComponentScoresSchema);

  const prompt = `
    Analyze the match between student and job.
    Student: ${JSON.stringify(state.student)}
    Job: ${JSON.stringify(state.job)}
    Skill Overlap Score: ${state.skillScore}
    External Stats (GitHub/LeetCode): ${JSON.stringify(state.externalStats)}

    Return scores (0-100) and analysis in JSON format.
  `;

  const scores = await model.invoke(prompt) as ComponentScores;
  return { scores };
}

// Node 3: Final Computation
async function finalizer(state: typeof MatchState.State) {
  const scores = state.scores;
  const totalScore = Math.round(
    (state.skillScore * 0.4) +
    (scores.expScore * 0.2) +
    (scores.projScore * 0.2) +
    (scores.potentialScore * 0.2)
  );

  return { totalScore };
}

// Build Graph
const workflow = new StateGraph(MatchState)
  .addNode("collector", dataCollector)
  .addNode("scorer", aiScorer)
  .addNode("finalizer", finalizer)
  .addEdge(START, "collector")
  .addEdge("collector", "scorer")
  .addEdge("scorer", "finalizer")
  .addEdge("finalizer", END);

const app = workflow.compile();

export async function calculateMatchScore(studentId: string, jobId: string) {
  const initialState = {
    jobId,
    student: { id: studentId },
    totalScore: 0,
    skillScore: 0,
    externalStats: {},
    scores: { expScore: 0, projScore: 0, potentialScore: 0, analysis: "" }
  };

  const finalState = await app.invoke(initialState);
  
  return {
    totalScore: finalState.totalScore,
    skillScore: finalState.skillScore,
    expScore: finalState.scores.expScore,
    projScore: finalState.scores.projScore,
    potentialScore: finalState.scores.potentialScore,
    analysis: finalState.scores.analysis,
  };
}
