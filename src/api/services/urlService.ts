import UrlRepository from "../repositories/urlRepository.js";

import { Links } from "@prisma/client";
import { generateShortCode, validateUrl } from "../utils/url.js";

class UrlService {
  private urlRepository = new UrlRepository();

  public async shortenUrl(userId: number, url: string, description?: string) {
    if (!validateUrl(url)) throw new Error("Invalid URL");

    const newUrl = await this.urlRepository.create(url, userId, description); // create new url in the database
    const shortCode = generateShortCode(newUrl.id); // generate short code from the new url id
    const updateUrl = await this.urlRepository.update(shortCode, {
      shortCode: shortCode,
    });
    return {
      url: updateUrl.url,
      shortCode: updateUrl.shortCode,
      description: updateUrl.description,
      createdAt: updateUrl.createdAt,
    };
  }

  public async redirectUrl(shortCode: string) {
    const urlToRedirect = await this.urlRepository.getOne(shortCode);
    if (!urlToRedirect) throw new Error("URL not found");

    return urlToRedirect.url;
  }

  public async updateUrl(
    shortCode: string,
    url?: string,
    description?: string
  ) {
    const urlToUpdate = await this.urlRepository.getOne(shortCode);
    if (!urlToUpdate) throw new Error("URL not found");

    const data: Partial<Omit<Links, "id" | "userId" | "createdAt">> = {};
    if (url) data["url"] = url;
    if (description) data["description"] = description;

    const updatedUrl = await this.urlRepository.update(shortCode, data);
    return {
      url: updatedUrl.url,
      shortCode: updatedUrl.shortCode,
      description: updatedUrl.description,
      createdAt: updatedUrl.createdAt,
    };
  }

  /*public async deleteUrl(shortCode: string) {
    const urlToDelete = await this.urlRepository.getUserUrl(shortCode);
  }

  public async getUserUrls(userId: number) {}

  public async getUrl(shortCode: string) {}*/
}

export default UrlService;
