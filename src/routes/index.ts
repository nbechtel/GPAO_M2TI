import { Router } from 'express';
import { getIndex } from '../controllers/IndexCtrl';

const router = Router();

// Test: 'curl http://localhost:3000/'
router.get('/', getIndex);

export default router;
