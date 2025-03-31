import { Response } from "express";

import UrlService from "../services/urlService.js";
import { AuthRequest } from "../middlewares/authenticationMiddleware.js";

class UrlController {
  private urlService = new UrlService();

  public shortenUrl = async (
    request: AuthRequest,
    response: Response
  ): Promise<any> => {
    const user = request.user;
    const { url, description } = request.body;

    if (!url) {
      return response.status(400).json({ error: "No URL provided" });
    }
    try {
      const data = await this.urlService.shortenUrl(user.id, url, description);
      return response
        .status(201)
        .json({ message: "URL shortened", data: data });
    } catch (error: any) {
      if (error.message === "Invalid URL")
        return response.status(400).json({ error: error.message });
      return response.status(500).json({ error: error.message });
    }
  };

  public redirectUrl = async (
    request: AuthRequest,
    response: Response
  ): Promise<any> => {
    const { shortCode } = request.params;

    try {
      const url = await this.urlService.redirectUrl(shortCode);
      return response.status(301).redirect(url);
    } catch (error: any) {
      if (error.message === "URL not found")
        return response.status(404).json({ error: error.message });
      return response.status(500).json({ error: error.message });
    }
  };

  public updateUrl = async (
    request: AuthRequest,
    response: Response
  ): Promise<any> => {
    // To update the original url and the description
    const user = request.user;
    const { shortCode } = request.params;
    const { url, description } = request.body;

    if (!url && !description)
      return response.status(400).json({ error: "No data provided" });

    try {
      const data = await this.urlService.updateUrl(
        user.id,
        shortCode,
        url,
        description
      );
      return response.status(200).json({ message: "URL updated", data: data });
    } catch (error: any) {
      if (error.mmessage === "URL not found")
        return response.status(404).json({ error: error.message });
      else if (error.message === "Invalid URL")
        return response.status(400).json({ error: error.message });
      else if (error.message === "Action not authorized")
        return response.status(403).json({ error: error.message });
      return response.status(500).json({ error: error.message });
    }
  };

  public deleteUrl = async (
    request: AuthRequest,
    response: Response
  ): Promise<any> => {
    const user = request.user;
    const { shortCode } = request.params;

    try {
      await this.urlService.deleteUrl(user.id, shortCode);
      return response.status(204).json({ message: "URL deleted" });
    } catch (error: any) {
      if (error.message === "URL not found")
        return response.status(404).json({ error: error.message });
      if (error.message === "Action not authorized")
        return response.status(403).json({ error: error.message });
      return response.status(500).json({ error: error.message });
    }
  };

  public getUserUrls = async (
    request: AuthRequest,
    response: Response
  ): Promise<any> => {
    const user = request.user;

    try {
      const data = await this.urlService.getUserUrls(user.id);
      return response
        .status(200)
        .json({ message: "All user urls", data: data });
    } catch (error: any) {
      return response.status(500).json({ error: error.message });
    }
  };
}

export default UrlController;
