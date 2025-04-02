import prisma from "../config/prisma.js";

class TagRepository {
  public async create(creatorId: number, name: string) {
    return await prisma.tags.create({
      data: {
        name: name,
        creatorId: creatorId,
      },
    });
  }

  public async getTagByName(creatorId: number, name: string) {
    return await prisma.tags.findFirst({
      where: {
        creatorId: creatorId,
        name: name,
      },
    });
  }

  public async getUserTags(userId: number) {
    return await prisma.tags.findMany({
      where: {
        creatorId: userId,
      },
    });
  }
}

export default TagRepository;
