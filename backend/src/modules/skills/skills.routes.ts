import { Router } from 'express';
import * as skillsController from './skills.controller';
import { requireAuth } from '../../core/middlewares/auth';

const router = Router();

router.get('/', skillsController.listSkills);
router.post('/', requireAuth, skillsController.createSkill);

export default router;
