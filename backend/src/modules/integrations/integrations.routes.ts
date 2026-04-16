import { Router } from 'express';
import * as integrationsController from './integrations.controller';
import { requireAuth, requireStudent } from '../../core/middlewares/auth';

const router = Router();

router.post('/sync', requireStudent, integrationsController.syncAll);
router.get('/dashboard', requireStudent, integrationsController.getIntelligence);
router.get('/:studentId', requireAuth, integrationsController.getIntelligence);

export default router;
