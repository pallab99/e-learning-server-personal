import AuthRepository from "../../repository/auth";
import { comparePasswords, hashPasswordUsingBcrypt } from "../../utils/bcrypt";

class AuthServiceClass {
  async findByEmail(email: string) {
    return await AuthRepository.findByEmail(email);
  }

  async samePassword(password: string, confirmPassword: string) {
    return password === confirmPassword;
  }

  async createUserInAuth(
    email: string,
    password: string,
    rank: number,
    user: any
  ) {
    return await AuthRepository.createUser(email, password, rank, user._id);
  }
  async findById(userId: string) {
    return await AuthRepository.findById(userId);
  }
  async hashPassword(password: string) {
    return await hashPasswordUsingBcrypt(password);
  }

  async comparePassword(password: string, hashedPasswordFromDB: string) {
    return await comparePasswords(password, hashedPasswordFromDB);
  }
  async save(entity: any) {
    return await AuthRepository.save(entity);
  }

  async isEmailVerified(userId: string) {
    return await AuthRepository.isEmailVerified(userId);
  }
  async userDisabled(email: string) {
    return await AuthRepository.userDisabled(email);
  }

  async getAllInstructor() {
    const result = await AuthRepository.getAllInstructor();
    if (result.length <= 0) {
      return { success: false, data: null };
    }

    // const instructors = result.map((ele: any) => {
    //   return {
    //     ele,
    //     profilePIC: publicURL + ele.user.dp,
    //   };
    // });

    return { success: true, data: result };
  }

  async getAllStudents() {
    const result = await AuthRepository.getAllStudents();
    if (result.length <= 0) {
      return { success: false, data: null };
    }

    return { success: true, data: result };
  }
}

const AuthService = new AuthServiceClass();

export default AuthService;
