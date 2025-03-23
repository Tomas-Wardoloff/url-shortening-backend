import bcrypt from "bcrypt";

import prisma from "../config/prisma.js";
import { RefreshToken } from "@prisma/client";

class TokenRepository {
  async create(userId: number, token: string) {
    const hashedToken = await bcrypt.hash(token, 10);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    return await prisma.refreshToken.create({
      data: {
        userId: userId,
        hashedToken: hashedToken,
        expiresAt: expiresAt,
      },
    });
  }

  async getActiveToken(userId: number) {
    return await prisma.refreshToken.findFirst({
      where: {
        userId: userId,
        revoked: false,
        expiresAt: {
          gt: new Date(),
        },
      },
    });
  }

  async update(tokenId: number, tokenData: Partial<RefreshToken>) {
    return await prisma.refreshToken.update({
      where: {
        id: tokenId,
      },
      data: tokenData,
    });
  }
}

export default TokenRepository;
