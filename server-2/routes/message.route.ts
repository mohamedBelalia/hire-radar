import { Router } from 'express';
import { isAuthenticated } from '../isAuth.middleware';
import { deleteMessage, getMessages, sendMessage } from '../controllers/message.controller';

const router = Router();
router.get('/get/:conversationId',isAuthenticated,getMessages);
router.post('/sendMessage',isAuthenticated,sendMessage)
router.delete('/deleteMessage/:messageId',isAuthenticated,deleteMessage)

export default router;