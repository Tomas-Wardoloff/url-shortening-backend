import { Response } from "express";

import TagService from "../services/tagService.js";
import { AuthRequest } from "../middlewares/authenticationMiddleware.js";

class TagController {
  private tagService = new TagService();

  public createTag = async (
    request: AuthRequest,
    response: Response
  ): Promise<any> => {
    const user = request.user;
    const { name } = request.body;

    if (!name)
      return response.status(400).json({ message: "Name is required" });

    if (name.length > 20)
      return response
        .status(400)
        .json({ error: "Tag name must be less than 20 characters" });

    try {
      const data = await this.tagService.createTag(user.id, name);
      return response.status(201).json({ message: "Tag created", data: data });
    } catch (error: any) {
      if (error.message === "Tag already exists")
        return response.status(409).json({ error: error.message });
      return response.status(500).json({ error: error.message });
    }
  };

  public getUserTags = async (
    request: AuthRequest,
    response: Response
  ): Promise<any> => {
    const user = request.user;

    try {
      const data = await this.tagService.getUserTags(user.id);
      return response
        .status(202)
        .json({ message: "All user tags", data: data });
    } catch (error: any) {
      return response.status(500).json({ error: error.message });
    }
  };

  public deleteTag = async (
    request: AuthRequest,
    response: Response
  ): Promise<any> => {
    const user = request.user;
    const tagId = request.params.tagId;

    if (isNaN(parseInt(tagId)))
      return response.status(400).json({ error: "Invalid tag id" });

    try {
      await this.tagService.deleteTag(user.id, parseInt(tagId));
      return response.status(204).json({ message: "Tag deleted" });
    } catch (error: any) {
      if (error.message === "Tag not found")
        return response.status(404).json({ error: error.message });
      return response.status(500).json({ error: error.message });
    }
  };
}

export default TagController;
