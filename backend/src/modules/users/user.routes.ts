import { Router } from 'express';
import * as userController from './user.controller';
import * as roadmapController from './roadmap.controller';
import * as interviewController from './interview.controller';
import { requireStudent, requireCompany } from '../../core/middlewares/auth';

const router = Router();

// Public routes
router.get('/portfolio/:slug', userController.getPortfolioBySlug);

// Student routes
router.get('/student/dashboard', requireStudent, userController.getStudentDashboard);
router.get('/student/profile', requireStudent, userController.getStudentFullProfile);
router.get('/student/:studentId', requireStudent, userController.getStudentById);
router.patch('/student/bio', requireStudent, userController.updateBio);
router.patch('/student/platform-connections', requireStudent, userController.updatePlatformConnections);

// Skills
router.post('/student/skills', requireStudent, userController.addSkill);
router.delete('/student/skills/:skillId', requireStudent, userController.removeSkill);

// Projects
router.post('/student/projects', requireStudent, userController.addProject);
router.delete('/student/projects/:id', requireStudent, userController.deleteProject);

// Certifications
router.post('/student/certifications', requireStudent, userController.addCertification);
router.delete('/student/certifications/:id', requireStudent, userController.deleteCertification);

// Resumes
router.get('/student/resumes', requireStudent, userController.getResumes);
router.post('/student/resumes', requireStudent, userController.saveResume);
router.patch('/student/resumes/:id', requireStudent, userController.updateResume);
router.delete('/student/resumes/:id', requireStudent, userController.deleteResume);

// Roadmaps
router.get('/student/roadmaps', requireStudent, userController.getRoadmaps);
router.post('/student/roadmaps', requireStudent, roadmapController.createRoadmap);
router.patch('/student/roadmaps/steps/:stepId', requireStudent, roadmapController.updateRoadmapStep);
router.delete('/student/roadmaps/:id', requireStudent, roadmapController.deleteRoadmap);

// Applications (Company context)
router.patch('/applications/:appId/status', requireCompany, userController.updateApplicationStatusByAppId);

// Interviews
router.get('/student/interviews', requireStudent, userController.getMockInterviews);
router.get('/student/interviews/:interviewId', requireStudent, interviewController.getMockInterviewById);
router.post('/student/interviews', requireStudent, interviewController.createInterview);
router.post('/student/interviews/:interviewId/messages', requireStudent, interviewController.addInterviewMessage);
router.post('/student/interviews/:interviewId/complete', requireStudent, interviewController.completeInterview);

// Company routes
router.get('/company/dashboard', requireCompany, userController.getCompanyDashboard);
router.get('/company/profile', requireCompany, userController.getCompanyProfile);
router.get('/company/candidates', requireCompany, userController.getCompanyCandidates);
router.get('/company/search', requireCompany, userController.searchCandidates);

export default router;
