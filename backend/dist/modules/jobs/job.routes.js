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
const jobController = __importStar(require("./job.controller"));
const auth_1 = require("../../core/middlewares/auth");
const router = (0, express_1.Router)();
router.get('/', jobController.getJobs);
router.get('/company', auth_1.requireCompany, jobController.getCompanyJobs);
router.get('/:id', jobController.getJobById);
router.get('/company/:id', auth_1.requireCompany, jobController.getCompanyJobDetails);
router.get('/applications/:appId', auth_1.requireCompany, jobController.getApplicationById);
router.post('/', auth_1.requireCompany, jobController.createJob);
router.put('/:id', auth_1.requireCompany, jobController.updateJob);
router.patch('/:id/status', auth_1.requireCompany, jobController.updateJobStatus);
router.delete('/:id', auth_1.requireCompany, jobController.deleteJob);
router.post('/:id/apply', auth_1.requireStudent, jobController.applyToJob);
router.patch('/:jobId/applications/:appId', auth_1.requireCompany, jobController.updateApplicationStatus);
exports.default = router;
//# sourceMappingURL=job.routes.js.map