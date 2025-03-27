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
}

export default UrlService;
