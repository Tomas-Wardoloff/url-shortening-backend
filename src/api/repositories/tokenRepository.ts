import bcrypt from "bcrypt";

import prisma from "../config/prisma.js";

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
}

export default TokenRepository;
