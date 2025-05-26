import { Router } from "express";
import { signUpController, loginController, logoutController } from "../controllers/auth.controller";

export const authRouter = Router();

authRouter.post('/sign-up', signUpController);
authRouter.post('/log-in', loginController);
authRouter.get('/log-out', logoutController);