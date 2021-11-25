import { Router } from 'express';
import {
  addArticle,
  getArticle,
  getArticles,
} from '../../../controllers/ArticlesCtrl';

const router = Router();

// Test: 'curl http://localhost:3000/api/GPAO/Articles'
router.get('/', getArticles);

// Test: 'curl http://localhost:3000/api/GPAO/Articles/CD100'
router.get(':reference', getArticle);

// Test: 'curl http://localhost:3000/api/GPAO/Articles/add'
router.post('add', addArticle);

export default router;
