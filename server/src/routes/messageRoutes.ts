import express from 'express'
import { protectRoute } from '../middleware/auth';
import { getMessages, getUsersForSideBar, markMessageSeen, sendMessage } from '../controller/messageController';

const messageRouter = express.Router();

messageRouter.get('/users', protectRoute, getUsersForSideBar);
messageRouter.get('/:id', protectRoute, getMessages);
messageRouter.put('/mark/:id', protectRoute, markMessageSeen);
messageRouter.post('/send/:id', protectRoute, sendMessage)

export default messageRouter;
