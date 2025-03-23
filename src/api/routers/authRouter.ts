import { Router } from "express";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  signupController,
  loginController,
  logoutController,
  refreshController,
} from "../controllers/authController.js";

const authRouter = Router();

authRouter.post("/signup", signupController);
authRouter.post("/login", loginController);
authRouter.post("/logout", authMiddleware, logoutController);
authRouter.post("/refresh-token", authMiddleware, refreshController);

export default authRouter;
