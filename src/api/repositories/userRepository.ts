import prisma from "../config/prisma.js";

import { User } from ".prisma/client";

class UserRepository {
  async getAll() {
    return await prisma.user.findMany();
  }

  async getOne(email: string) {
    return await prisma.user.findUnique({ where: { email: email } });
  }

  async create(
    firstName: string,
    lastName: string,
    email: string,
    hashedPassword: string
  ) {
    return await prisma.user.create({
      data: {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: hashedPassword,
      },
    });
  }

  async update(userId: number, userData: Partial<User>) {
    return await prisma.user.update({
      where: { id: userId },
      data: userData,
    });
  }
}

export default UserRepository;
