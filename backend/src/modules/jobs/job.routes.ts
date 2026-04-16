import { Router } from 'express';
import * as jobController from './job.controller';
import { requireAuth, requireStudent, requireCompany } from '../../core/middlewares/auth';

const router = Router();

router.get('/', jobController.getJobs);
router.get('/company', requireCompany, jobController.getCompanyJobs);
router.get('/:id', jobController.getJobById);
router.get('/company/:id', requireCompany, jobController.getCompanyJobDetails);
router.get('/applications/:appId', requireCompany, jobController.getApplicationById);
router.post('/', requireCompany, jobController.createJob);
router.put('/:id', requireCompany, jobController.updateJob);
router.patch('/:id/status', requireCompany, jobController.updateJobStatus);
router.delete('/:id', requireCompany, jobController.deleteJob);
router.post('/:id/apply', requireStudent, jobController.applyToJob);
router.patch('/:jobId/applications/:appId', requireCompany, jobController.updateApplicationStatus);

export default router;
