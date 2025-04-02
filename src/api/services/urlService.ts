import UrlRepository from "../repositories/urlRepository.js";

import { generateShortCode, validateUrl } from "../utils/url.js";

class UrlService {
  private urlRepository = new UrlRepository();

  public async shortenUrl(
    userId: number,
    url: string,
    description?: string,
    customAlias?: string
  ) {
    if (!validateUrl(url)) throw new Error("Invalid URL");

    if (customAlias) {
      const existingUrl = await this.urlRepository.getOne(customAlias);
      if (existingUrl) throw new Error("Short code already exists"); // check if the short code already exists
    }
    const newUrl = await this.urlRepository.create(url, userId, description); // create new url in the database
    const shortCode = customAlias || generateShortCode(newUrl.id); // generate a short code if not provided

    const updateUrl = await this.urlRepository.update(newUrl.id, {
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

    await this.urlRepository.update(urlToRedirect.id, {
      clicks: urlToRedirect.clicks + 1,
    });

    return urlToRedirect.url;
  }

  public async updateUrl(
    userId: number,
    shortCode: string,
    url?: string,
    description?: string
  ) {
    const urlToUpdate = await this.urlRepository.getOne(shortCode);
    if (!urlToUpdate) throw new Error("URL not found");

    if (urlToUpdate.userId !== userId) throw new Error("Action not authorized"); // check if the user is the owner of the url to update

    if (url && !validateUrl(url)) throw new Error("Invalid URL");

    const updatedUrl = await this.urlRepository.update(urlToUpdate.id, {
      url: url,
      description: description,
    });
    return {
      url: updatedUrl.url,
      shortCode: updatedUrl.shortCode,
      description: updatedUrl.description,
      createdAt: updatedUrl.createdAt,
    };
  }

  public async deleteUrl(userId: number, shortCode: string) {
    const urlToDelete = await this.urlRepository.getOne(shortCode);
    if (!urlToDelete) throw new Error("URL not found");

    if (urlToDelete.userId !== userId) throw new Error("Action not authorized"); // check if the user is the owner of the url to delete

    await this.urlRepository.delete(shortCode);
    return;
  }

  public async getUserUrls(userId: number) {
    const urls = await this.urlRepository.getUserUrl(userId);
    return {
      urls: urls.map((url) => ({
        url: url.url,
        shortCode: url.shortCode,
        description: url.description,
        createdAt: url.createdAt,
        clicks: url.clicks,
      })),
    };
  }
}

export default UrlService;
