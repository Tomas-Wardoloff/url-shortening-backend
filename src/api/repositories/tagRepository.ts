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

  public async getOne(tagId: number) {
    return await prisma.tags.findUnique({
      where: {
        id: tagId,
      },
    });
  }

  public async delete(tagId: number) {
    return await prisma.tags.delete({
      where: {
        id: tagId,
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
