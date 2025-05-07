import { Router } from "express";

import wrap from "../utils/wrap.js";
import UrlController from "../controllers/urlController.js";
import { authMiddleware } from "../middlewares/authenticationMiddleware.js";

class UrlRouter {
  private router = Router();
  private urlController = new UrlController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      "/shorten",
      authMiddleware,
      wrap(this.urlController.shortenUrl)
    );
    this.router.get("/:shortCode", wrap(this.urlController.redirectUrl));
    this.router.put(
      "/:shortCode",
      authMiddleware,
      wrap(this.urlController.updateUrl)
    );
    this.router.delete(
      "/:shortCode",
      authMiddleware,
      wrap(this.urlController.deleteUrl)
    );
    this.router.get(
      "/user",
      authMiddleware,
      wrap(this.urlController.getUserUrls)
    );
    this.router.post(
      "/:shortCode/tag/:tagId",
      authMiddleware,
      wrap(this.urlController.asignTagToUrl)
    );
  }

  public getRouter() {
    return this.router;
  }
}

export default UrlRouter;
