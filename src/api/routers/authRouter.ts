import { Router } from "express";

import wrap from "../utils/wrap.js";
import AuthCotroller from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authenticationMiddleware.js";

class AuthRouter {
  private router = Router();
  private authController = new AuthCotroller();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post("/signup", wrap(this.authController.signup));
    this.router.post("/login", wrap(this.authController.login));
    this.router.post(
      "/logout",
      authMiddleware,
      wrap(this.authController.logout)
    );
    this.router.post(
      "/refresh-token",
      authMiddleware,
      wrap(this.authController.refresh)
    );
    this.router.get("/verify-email", wrap(this.authController.verifyEmail));
    this.router.post(
      "/send-verification-email",
      wrap(this.authController.sendVerificationEmail)
    );
  }

  public getRouter() {
    return this.router;
  }
}

export default AuthRouter;
