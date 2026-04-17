"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateMatchScore = calculateMatchScore;
const prisma_1 = require("../prisma");
const google_genai_1 = require("@langchain/google-genai");
const langgraph_1 = require("@langchain/langgraph");
const zod_1 = require("zod");
// Schema for matching output
const ComponentScoresSchema = zod_1.z.object({
    expScore: zod_1.z.number(),
    projScore: zod_1.z.number(),
    potentialScore: zod_1.z.number(),
    analysis: zod_1.z.string(),
});
// Define State for LangGraph
const MatchState = langgraph_1.Annotation.Root({
    jobId: (langgraph_1.Annotation),
    student: (langgraph_1.Annotation),
    job: (langgraph_1.Annotation),
    skillScore: (langgraph_1.Annotation),
    externalStats: (langgraph_1.Annotation),
    scores: (langgraph_1.Annotation),
    totalScore: (langgraph_1.Annotation),
});
// Helper for vector similarity using raw SQL since Prisma doesn't have native vector comparison
async function getSkillScore(studentId, jobId) {
    try {
        const student = await prisma_1.prisma.student.findUnique({ where: { id: studentId } });
        const job = await prisma_1.prisma.job.findUnique({ where: { id: jobId } });
        if (!student || !job)
            return 0;
        const studentSkills = await prisma_1.prisma.studentSkill.findMany({ where: { studentId }, include: { skill: true } });
        const jobSkills = await prisma_1.prisma.jobSkill.findMany({ where: { jobId }, include: { skill: true } });
        const studentSkillNames = studentSkills.map(s => s.skill.name.toLowerCase());
        const jobSkillNames = jobSkills.map(s => s.skill.name.toLowerCase());
        if (jobSkillNames.length === 0)
            return 70;
        const overlap = jobSkillNames.filter(s => studentSkillNames.includes(s));
        return Math.round((overlap.length / jobSkillNames.length) * 100);
    }
    catch (e) {
        return 0;
    }
}
// Node 1: Fetch and Prepare Data
async function dataCollector(state) {
    const student = await prisma_1.prisma.student.findUnique({
        where: { id: state.student.id },
        include: {
            experience: true,
            projects: true,
            skills: { include: { skill: true } },
            scores: true,
            normalizedSkills: true,
            externalAccounts: { include: { githubData: true, leetcodeData: true } }
        }
    });
    const job = await prisma_1.prisma.job.findUnique({
        where: { id: state.jobId },
        include: { company: true, skills: { include: { skill: true } } }
    });
    const skillScore = await getSkillScore(state.student.id, state.jobId);
    const externalStats = {
        scores: student?.scores,
        skills: student?.normalizedSkills,
        github: student?.externalAccounts?.find((a) => a.platform === 'github')?.githubData,
        leetcode: student?.externalAccounts?.find((a) => a.platform === 'leetcode')?.leetcodeData
    };
    return { student, job, skillScore, externalStats };
}
// Node 2: AI Analysis
async function aiScorer(state) {
    const model = new google_genai_1.ChatGoogleGenerativeAI({
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
    const scores = await model.invoke(prompt);
    return { scores };
}
// Node 3: Final Computation
async function finalizer(state) {
    const scores = state.scores;
    const totalScore = Math.round((state.skillScore * 0.4) +
        (scores.expScore * 0.2) +
        (scores.projScore * 0.2) +
        (scores.potentialScore * 0.2));
    return { totalScore };
}
// Build Graph
const workflow = new langgraph_1.StateGraph(MatchState)
    .addNode("collector", dataCollector)
    .addNode("scorer", aiScorer)
    .addNode("finalizer", finalizer)
    .addEdge(langgraph_1.START, "collector")
    .addEdge("collector", "scorer")
    .addEdge("scorer", "finalizer")
    .addEdge("finalizer", langgraph_1.END);
const app = workflow.compile();
async function calculateMatchScore(studentId, jobId) {
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
//# sourceMappingURL=matcher.js.map