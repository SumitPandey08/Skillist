"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController = __importStar(require("./user.controller"));
const roadmapController = __importStar(require("./roadmap.controller"));
const interviewController = __importStar(require("./interview.controller"));
const auth_1 = require("../../core/middlewares/auth");
const router = (0, express_1.Router)();
// Public routes
router.get('/portfolio/:slug', userController.getPortfolioBySlug);
// Student routes
router.get('/student/dashboard', auth_1.requireStudent, userController.getStudentDashboard);
router.get('/student/profile', auth_1.requireStudent, userController.getStudentFullProfile);
router.patch('/student/bio', auth_1.requireStudent, userController.updateBio);
router.patch('/student/platform-connections', auth_1.requireStudent, userController.updatePlatformConnections);
// Skills
router.post('/student/skills', auth_1.requireStudent, userController.addSkill);
router.delete('/student/skills/:skillId', auth_1.requireStudent, userController.removeSkill);
// Projects
router.post('/student/projects', auth_1.requireStudent, userController.addProject);
router.delete('/student/projects/:id', auth_1.requireStudent, userController.deleteProject);
// Certifications
router.post('/student/certifications', auth_1.requireStudent, userController.addCertification);
router.delete('/student/certifications/:id', auth_1.requireStudent, userController.deleteCertification);
// Resumes
router.get('/student/resumes', auth_1.requireStudent, userController.getResumes);
router.post('/student/resumes', auth_1.requireStudent, userController.saveResume);
router.patch('/student/resumes/:id', auth_1.requireStudent, userController.updateResume);
router.delete('/student/resumes/:id', auth_1.requireStudent, userController.deleteResume);
// Roadmaps
router.get('/student/roadmaps', auth_1.requireStudent, userController.getRoadmaps);
router.post('/student/roadmaps', auth_1.requireStudent, roadmapController.createRoadmap);
router.patch('/student/roadmaps/steps/:stepId', auth_1.requireStudent, roadmapController.updateRoadmapStep);
router.delete('/student/roadmaps/:id', auth_1.requireStudent, roadmapController.deleteRoadmap);
// Applications (Company context)
router.patch('/applications/:appId/status', auth_1.requireCompany, userController.updateApplicationStatusByAppId);
// Interviews
router.get('/student/interviews', auth_1.requireStudent, userController.getMockInterviews);
router.get('/student/interviews/:interviewId', auth_1.requireStudent, interviewController.getMockInterviewById);
router.post('/student/interviews', auth_1.requireStudent, interviewController.createInterview);
router.post('/student/interviews/:interviewId/messages', auth_1.requireStudent, interviewController.addInterviewMessage);
router.post('/student/interviews/:interviewId/complete', auth_1.requireStudent, interviewController.completeInterview);
// Company routes
router.get('/company/dashboard', auth_1.requireCompany, userController.getCompanyDashboard);
router.get('/company/profile', auth_1.requireCompany, userController.getCompanyProfile);
router.get('/company/candidates', auth_1.requireCompany, userController.getCompanyCandidates);
router.get('/company/search', auth_1.requireCompany, userController.searchCandidates);
exports.default = router;
//# sourceMappingURL=user.routes.js.map