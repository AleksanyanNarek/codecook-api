import { Router } from "express";
import { getCurrentUserController } from "../controllers/user.controller";
import { authMiddleware } from "../middleware/auth";

export const userRouter = Router();

userRouter.get('/current', authMiddleware, getCurrentUserController);