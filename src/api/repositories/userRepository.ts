import prisma from "../config/prisma.js";

import { User } from ".prisma/client";

class UserRepository {
  public async getAll() {
    return await prisma.user.findMany();
  }

  public async getUserByEmail(email: string) {
    return await prisma.user.findUnique({ where: { email: email } });
  }

  public async getUserById(userId: number) {
    return await prisma.user.findUnique({ where: { id: userId } });
  }

  public async create(
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

  public async update(userId: number, userData: Partial<User>) {
    return await prisma.user.update({
      where: { id: userId },
      data: userData,
    });
  }
}

export default UserRepository;
