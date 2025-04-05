import { Router } from "express";

import { authMiddleware } from "../middlewares/authenticationMiddleware.js";
import UrlController from "../controllers/urlController.js";

class UrlRouter {
  private router = Router();
  private urlController = new UrlController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post("/shorten", authMiddleware, this.urlController.shortenUrl);
    this.router.get("/:shortCode", this.urlController.redirectUrl);
    this.router.put(
      "/:shortCode",
      authMiddleware,
      this.urlController.updateUrl
    );
    this.router.delete(
      "/:shortCode",
      authMiddleware,
      this.urlController.deleteUrl
    );
    this.router.get("/user", authMiddleware, this.urlController.getUserUrls);
    this.router.post(
      "/:shortCode/tag/:tagId",
      authMiddleware,
      this.urlController.asignTagToUrl
    );
  }

  public getRouter() {
    return this.router;
  }
}

export default UrlRouter;
