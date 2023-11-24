import UserProgressModel from "../../models/user-progress";

class UserProgressRepository {
  async create(studentId: string, courseId: string, contentId: string) {
    return await UserProgressModel.create({
      student: studentId,
      course: courseId,
      completedLessons: [contentId],
    });
  }

  async update(studentId: string, courseId: string, contentId: string) {
    const contentAvailable = await UserProgressModel.findOne({
      student: studentId,
      course: courseId,
      completedLessons: { $in: [contentId] },
    });
    if (contentAvailable) {
      return await UserProgressModel.updateOne(
        {
          student: studentId,
          course: courseId,
        },
        { $pull: { completedLessons: contentId } }
      );
    } else {
      return await UserProgressModel.updateOne(
        {
          student: studentId,
          course: courseId,
        },
        { $push: { completedLessons: contentId } }
      );
    }
  }
}

export { UserProgressRepository };

