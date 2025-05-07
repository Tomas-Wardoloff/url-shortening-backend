import { Response } from "express";

import { TokenPayload } from "../utils/jwt.js";
import UrlService from "../services/urlService.js";
import { BadRequestError } from "../utils/error.js";
import { AuthRequest } from "../middlewares/authenticationMiddleware.js";

class UrlController {
  private urlService = new UrlService();

  public shortenUrl = async (
    request: AuthRequest,
    response: Response
  ): Promise<void> => {
    const userId = (request.payload as TokenPayload).id;
    const { url, description, customAlias } = request.body;

    if (!url) {
      throw new BadRequestError("No URL provided");
    }

    if (customAlias) {
      if (customAlias.length > 16)
        throw new BadRequestError(
          "Custom alias must be less than 16 characters"
        );

      if (customAlias.length < 4)
        throw new BadRequestError("Custom alias must be at least 4 characters");

      if (customAlias.includes(" "))
        throw new BadRequestError("Custom alias must not contain spaces");
    }

    const data = await this.urlService.shortenUrl(
      userId,
      url,
      description,
      customAlias
    );
    response.status(201).json({ message: "URL shortened", data: data });
  };

  public redirectUrl = async (
    request: AuthRequest,
    response: Response
  ): Promise<void> => {
    const { shortCode } = request.params;

    const url = await this.urlService.redirectUrl(shortCode);
    response.status(301).redirect(url);
  };

  public updateUrl = async (
    request: AuthRequest,
    response: Response
  ): Promise<any> => {
    // To update the original url and the description
    const userId = (request.payload as TokenPayload).id;
    const { shortCode } = request.params;
    const { url, description } = request.body;

    if (!url && !description)
      throw new BadRequestError("No URL or description provided");

    const data = await this.urlService.updateUrl(
      userId,
      shortCode,
      url,
      description
    );
    response.status(200).json({ message: "URL updated", data: data });
  };

  public deleteUrl = async (
    request: AuthRequest,
    response: Response
  ): Promise<void> => {
    const userId = (request.payload as TokenPayload).id;
    const { shortCode } = request.params;

    await this.urlService.deleteUrl(userId, shortCode);
    response.status(204).json({ message: "URL deleted" });
  };

  public getUserUrls = async (
    request: AuthRequest,
    response: Response
  ): Promise<void> => {
    const userId = (request.payload as TokenPayload).id;

    const data = await this.urlService.getUserUrls(userId);
    response.status(200).json({ message: "All user urls", data: data });
  };

  public asignTagToUrl = async (
    request: AuthRequest,
    response: Response
  ): Promise<void> => {
    const userId = (request.payload as TokenPayload).id;
    const { shortCode, tagId } = request.params;

    if (isNaN(parseInt(tagId))) {
      throw new BadRequestError("Invalid tag id");
    }

    await this.urlService.asignTagToUrl(userId, shortCode, parseInt(tagId));
    response.status(200).json({ message: "Tag assigned to URL" });
  };
}

export default UrlController;
