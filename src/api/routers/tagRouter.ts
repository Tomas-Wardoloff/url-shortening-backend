import { Router } from "express";

import TagController from "../controllers/tagController.js";
import { authMiddleware } from "../middlewares/authenticationMiddleware.js";

class TagRouter {
  private router = Router();
  private tagController = new TagController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post("/", authMiddleware, this.tagController.createTag);
    this.router.get("/my-tags", authMiddleware, this.tagController.getUserTags);
    this.router.delete("/:tagId", authMiddleware, this.tagController.deleteTag);
  }

  public getRouter() {
    return this.router;
  }
}

export default TagRouter;
