import { Router } from 'express';
import { isAuthenticated } from '../isAuth.middleware';
import { getConversations, startNew } from '../controllers/conversation.controller';

const router = Router();
router.get('/get',isAuthenticated, getConversations);
router.post('/startNew', isAuthenticated, startNew);
export default router;
