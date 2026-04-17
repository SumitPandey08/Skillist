"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth/auth.routes"));
const user_routes_1 = __importDefault(require("./users/user.routes"));
const job_routes_1 = __importDefault(require("./jobs/job.routes"));
const matching_routes_1 = __importDefault(require("./matching/matching.routes"));
const skills_routes_1 = __importDefault(require("./skills/skills.routes"));
const resume_routes_1 = __importDefault(require("./resume/resume.routes"));
const integrations_routes_1 = __importDefault(require("./integrations/integrations.routes"));
const agent_routes_1 = __importDefault(require("./agentic-ai/agent.routes"));
const router = (0, express_1.Router)();
router.use('/auth', auth_routes_1.default);
router.use('/users', user_routes_1.default);
router.use('/jobs', job_routes_1.default);
router.use('/matching', matching_routes_1.default);
router.use('/skills', skills_routes_1.default);
router.use('/resume', resume_routes_1.default);
router.use('/integrations', integrations_routes_1.default);
router.use('/agentic', agent_routes_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map