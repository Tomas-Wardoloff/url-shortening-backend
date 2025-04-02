import TagRepository from "../repositories/tagRepository.js";

class TagService {
  private tagRepository = new TagRepository();

  public async createTag(userId: number, name: string) {
    const existingTag = await this.tagRepository.getTagByName(userId, name);

    if (existingTag) throw new Error("Tag already exists");

    const newTag = await this.tagRepository.create(userId, name);
    return {
      tag: {
        name: newTag.name,
      },
    };
  }

  public async getUserTags(userId: number) {
    const tags = await this.tagRepository.getUserTags(userId);
    return {
      tags: tags.map((tag) => ({
        name: tag.name,
      })),
    };
  }

  public async deleteTag(userId: number, tagId: number) {
    const tagToDelete = await this.tagRepository.getOne(tagId);
    if (!tagToDelete) throw new Error("Tag not found");

    if (tagToDelete.creatorId !== userId)
      throw new Error("Action not authorized");

    await this.tagRepository.delete(tagId);
    return;
  }
}

export default TagService;
