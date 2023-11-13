import CategoryRepository from "../../repository/category";

class CategoryServiceClass {
  async createCategory(title: string) {
    const result = await CategoryRepository.createCategory(title);
    return { success: result ? 1 : 0, data: result };
  }

  async findByTitle(title: string) {
    const result = await CategoryRepository.findByTitle(title);
    return { success: result ? true : false, data: result };
  }
  async allCategory() {
    const result = await CategoryRepository.getAllCategory();
    return { success: result && result.length ? 1 : 0, data: result };
  }
}
const CategoryService = new CategoryServiceClass();

export default CategoryService;
