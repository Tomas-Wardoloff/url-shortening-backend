import { Response } from "express";

import { TokenPayload } from "../utils/jwt.js";
import TagService from "../services/tagService.js";
import { BadRequestError } from "../utils/error.js";
import { AuthRequest } from "../middlewares/authenticationMiddleware.js";

class TagController {
  private tagService = new TagService();

  public createTag = async (
    request: AuthRequest,
    response: Response
  ): Promise<void> => {
    const userId = (request.payload as TokenPayload).id;
    const { name } = request.body;

    if (!name) {
      throw new BadRequestError("Tag name is required");
    }

    if (name.length > 20) {
      throw new BadRequestError("Tag name must be less than 20 characters");
    }

    const data = await this.tagService.createTag(userId, name);
    response.status(201).json({ message: "Tag created", data: data });
  };

  public getUserTags = async (
    request: AuthRequest,
    response: Response
  ): Promise<void> => {
    const userId = (request.payload as TokenPayload).id;

    const data = await this.tagService.getUserTags(userId);
    response.status(202).json({ message: "All user tags", data: data });
  };

  public deleteTag = async (
    request: AuthRequest,
    response: Response
  ): Promise<void> => {
    const userId = (request.payload as TokenPayload).id;
    const tagId = request.params.tagId;

    if (isNaN(parseInt(tagId))) {
      throw new BadRequestError("Invalid tag ID");
    }

    await this.tagService.deleteTag(userId, parseInt(tagId));
    response.status(204).json({ message: "Tag deleted" });
  };
}

export default TagController;
