import { UserProgressRepository } from "../../repository/user-progress";

class UserProgressServiceClass {
  private userProgressRepository: UserProgressRepository;

  constructor() {
    this.userProgressRepository = new UserProgressRepository();
  }

  async create(studentId: string, courseId: string, contentId: string) {
    const result = await this.userProgressRepository.create(
      studentId,
      courseId,
      contentId
    );

    return { success: result ? true : false, data: result };
  }

  async update(studentId: string, courseId: string, contentId: string) {
    const result = await this.userProgressRepository.update(
      studentId,
      courseId,
      contentId
    );
    return { success: result ? true : false, data: result };
  }
}

const UserProgressService = new UserProgressServiceClass();

export default UserProgressService;
