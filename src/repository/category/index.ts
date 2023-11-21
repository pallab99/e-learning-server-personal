import { CategoryModel } from "../../models/category";

class CategoryRepositoryClass {
  async createCategory(title: string) {
    return await CategoryModel.create({ title });
  }
  async getAllCategory() {
    return await CategoryModel.find().select("_id title");
  }

  async findByTitle(title: string) {
    return await CategoryModel.findOne({ title });
  }
}

const CategoryRepository = new CategoryRepositoryClass();
export default CategoryRepository;
