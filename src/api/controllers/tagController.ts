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
}

export default TagController;
