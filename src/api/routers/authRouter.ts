import { Router } from "express";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import AuthCotroller from "../controllers/authController.js";

class AuthRouter {
  private router = Router();
  private authController = new AuthCotroller();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post("/signup", this.authController.signupController);
    this.router.post("/login", this.authController.loginController);
    this.router.post(
      "/logout",
      authMiddleware,
      this.authController.logoutController
    );
    this.router.post(
      "/refresh-token",
      authMiddleware,
      this.authController.refreshController
    );
  }

  public getRouter() {
    return this.router;
  }
}

export default AuthRouter;
