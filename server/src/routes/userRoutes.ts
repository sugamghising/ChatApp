import express from 'express'
import { checkAuth, login, signup, updateProfile } from '../controller/userController';
import { protectRoute } from '../middleware/auth';

const userRouter = express.Router();

userRouter.post('/login', login);
userRouter.post('/signup', signup);
userRouter.put('/update-profile', protectRoute, updateProfile);
userRouter.get('/check', protectRoute, checkAuth);

export default userRouter;