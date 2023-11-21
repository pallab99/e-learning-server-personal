import { PutObjectCommand } from "@aws-sdk/client-s3";
import dotEnv from "dotenv";
import { s3Client } from "../../configs/s3Config";
import { imageFileTypes, videoFileTypes } from "../../constant/filetypes";
import { publicURL } from "../../constant/user";
import { generateFileName } from "../../helper/generateFileName";
import CourseRepository from "../../repository/course";
dotEnv.config();
const bucketName = process.env.S3_BUCKET_NAME as string;
class CourseServiceClass {
  async saveFilesOnServer(files: any[], body: any, newCourse: any) {
    const S3_Bucket_path = `course`;
    const uploadPromises = files.map(async (file: any) => {
      const fileName = generateFileName(
        S3_Bucket_path,
        body.title,
        file.originalname
      );
      console.log(fileName);

      const fileExt = file.originalname.split(".")[1];
      if (videoFileTypes.includes(fileExt)) {
        newCourse.demoVideo = publicURL + fileName;
      } else if (imageFileTypes.includes(fileExt)) {
        newCourse.thumbnail = publicURL + fileName;
      }
      const params = {
        Bucket: bucketName,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
      };
      console.log({ params });

      const command = new PutObjectCommand(params);
      const upload = await s3Client.send(command);
      console.log({ upload });

      // return await s3Client.send(command);
    });
    await Promise.all(uploadPromises);
    return newCourse;
  }

  async save(entity: any) {
    return await CourseRepository.save(entity);
  }

  async findByTitle(title: string) {
    const result = await CourseRepository.findByTitle(title);
    if (Object.keys(result).length) {
      return { success: true, data: result };
    }
    return { success: false, data: [] };
  }

  async getFilesFromServer(params: any) {
    // const fileCommand = new GetObjectCommand(params);
    // const fileURL = await getSignedUrl(s3Client, fileCommand);
    // console.log(fileURL);
    const fileURL = publicURL + params;

    if (fileURL.length) {
      console.log("hello", fileURL);

      return { success: true, data: fileURL };
    }
    return { success: false, data: [] };
  }

  async findById(id: string) {
    const result = await CourseRepository.findById(id);
    if (result) {
      return { success: true, data: result as any };
    }
    return { success: false, data: {} as any };
  }

  async addUserToEnrollmentList(course: any, userId: string) {
    // course.students.push(userId);
    // console.log({ course, userId });
    // const result = await course.save();
    // console.log({ result });
    const result = CourseRepository.addToEnrollment(course, userId);
    if (result) {
      return { success: true, data: result as any };
    }
    return { success: false, data: {} as any };
  }

  async userAvailableInCourse(courseId: string, userId: string) {
    const result = await CourseRepository.userAvailableInCourse(
      courseId,
      userId
    );

    return { success: result ? true : false, data: result as any };
  }

  async addReviewRatingToCourse(reviewId: string, course: any) {
    course.reviews.push(reviewId);
    const result = await course.save();
    return { success: result ? true : false, data: result as any };
  }

  async removeReviewFromCourse(reviewId: string, course: any) {
    let index = course.reviews.findIndex(
      (ele: any) => String(ele) === String(reviewId)
    );
    if (index !== -1) {
      course.reviews.splice(index, 1);
      const result = await course.save();
      return { success: true, data: result as any };
    }
    return { success: false, data: [] as any };
  }

  async getCourseByInstructor(instructorId: string, searchTerm: string) {
    const result = await CourseRepository.getCourseByInstructor(
      instructorId,
      searchTerm
    );

    return {
      success: result && result.length >= 0 ? true : false,
      data: result as any,
    };
  }

  async userEnrolledInCourse(courseId: string, userId: string) {
    const result = await CourseRepository.userEnrolledInCourse(
      courseId,
      userId
    );
    return { success: result ? true : false, data: result as any };
  }
}

const CourseService = new CourseServiceClass();

export default CourseService;
