import { Router } from "express";

import wrap from "../utils/wrap.js";
import TagController from "../controllers/tagController.js";
import { authMiddleware } from "../middlewares/authenticationMiddleware.js";

class TagRouter {
  private router = Router();
  private tagController = new TagController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post("/", authMiddleware, wrap(this.tagController.createTag));
    this.router.get(
      "/my-tags",
      authMiddleware,
      wrap(this.tagController.getUserTags)
    );
    this.router.delete(
      "/:tagId",
      authMiddleware,
      wrap(this.tagController.deleteTag)
    );
  }

  public getRouter() {
    return this.router;
  }
}

export default TagRouter;
