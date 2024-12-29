import express from 'express'
import { protectRoute } from '../middlewares/auth.middleware.js';
import { getMessagesController, getUserforSidebarController, sendMessageController } from '../controllers/message.controller.js';

const router = express.Router();

router.get('/users' , protectRoute , getUserforSidebarController)
router.get('/:id' ,protectRoute, getMessagesController)
router.post('/send/:id', protectRoute , sendMessageController)

export default router;