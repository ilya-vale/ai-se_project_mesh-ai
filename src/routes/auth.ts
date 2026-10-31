import { Router } from "express";
import { getCurrentUser, createNewUser, userLogIn } from "../controllers/auth.js";
import { auth } from '../middleware/auth.js';

const authRouter = Router();


authRouter.get("/me", auth, getCurrentUser);
authRouter.post("/register", createNewUser);
authRouter.post("/login", userLogIn);

export { authRouter };