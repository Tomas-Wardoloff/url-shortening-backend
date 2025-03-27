import prisma from "../config/prisma.js";

import { Links } from ".prisma/client";

class UrlRepository {
  async create(originalUrl: string, userId: number, description?: string) {
    return await prisma.links.create({
      data: {
        url: originalUrl,
        description: description,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async update(
    shortCode: string,
    urlData: Partial<Omit<Links, "id" | "userId" | "createdAt">>
  ) {
    return await prisma.links.update({
      where: {
        shortCode: shortCode,
      },
      data: urlData,
    });
  }

  async getUserUrl(shortCode: string, userId: number) {}
}

export default UrlRepository;
