import { UserModel } from "../../models/user";

class UserRepositoryClass {
  async findByEmail(email: string) {
    return await UserModel.findOne({ email });
  }

  async createUser(
    name: string,
    email: string,
    phoneNumber: number,
    notificationSetting: boolean
  ) {
    return await UserModel.create({
      name,
      email,
      phoneNumber,
      notificationSetting,
    });
  }

  async getAllUser() {
    return await UserModel.find({});
  }

  async getBalance(email: string) {
    const user = await this.findByEmail(email);
    return user?.balance;
  }
  async save(entity: any) {
    return entity.save();
  }
  async findById(userId: string) {
    return await UserModel.findById(userId);
  }

  async getAllInstructor() {
    return await UserModel.find({});
  }

  async updateUser(email: string, entity: any) {
    return await UserModel.findOneAndUpdate({ email: email }, entity, {
      new: true,
    });
  }

  async getAllInstructors() {
    return await UserModel.find({ rank: 2 });
  }
  async getAllStudents() {
    return await UserModel.find({});
  }
}

const UserRepository = new UserRepositoryClass();

export default UserRepository;
