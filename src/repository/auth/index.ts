import { AuthModel } from "../../models/auth";

class AuthRepositoryClass {
  async findByEmail(email: string) {
    return await AuthModel.findOne({ email });
  }

  async createUser(email: string, password: string, rank: number, user: any) {
    return await AuthModel.create({
      email,
      password,
      rank,
      user,
    });
  }

  async findById(userId: string) {
    return await AuthModel.findById(userId);
  }
  async save(entity: any) {
    return entity.save();
  }

  async isEmailVerified(userId: string) {
    const user = await AuthModel.findById({ _id: userId });
    return user?.isVerified;
  }

  async userDisabled(email: string) {
    const user = await this.findByEmail(email);
    return user?.disabled;
  }

  async getAllInstructor() {
    return await AuthModel.find({ rank: 2 })
      .populate("user")
      .select(
        "-password -resetPassword -resetPasswordToken -resetPasswordExpired"
      );
  }
  async getAllStudents() {
    return await AuthModel.find({ rank: 3 })
      .populate("user")
      .select(
        "-password -resetPassword -resetPasswordToken -resetPasswordExpired"
      );
  }
}

const AuthRepository = new AuthRepositoryClass();

export default AuthRepository;
