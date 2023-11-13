import dotEnv from "dotenv";
import getVideoDurationInSeconds from "get-video-duration";
import { Readable } from "stream";
import { publicURL } from "../../constant/user";
import { generateFileName } from "../../helper/generateFileName";
import { parallelUploader } from "../../helper/parallelUploader";
import { s3ParamsGenerator } from "../../helper/s3ParamsGenerator";
import CourseContentRepository from "../../repository/course-content";
dotEnv.config();
const bucketName = process.env.S3_BUCKET_NAME as string;
const { Upload } = require("@aws-sdk/lib-storage");

class CourseContentServiceClass {
  async saveFileOnServer(file: any, courseTitle: string, sectionName: string) {
    const S3_Bucket_path = `course/${courseTitle}`;
    const fileName = generateFileName(
      S3_Bucket_path,
      sectionName,
      file.originalname
    );

    const params = s3ParamsGenerator(
      bucketName,
      fileName,
      file.buffer,
      file.mimetype
    );
    const uploadParallel = parallelUploader(params);

    uploadParallel.on("httpUploadProgress", (progress: any) => {
      console.log("prog", progress);
    });

    const uploadedData = await uploadParallel.done();
    if (uploadedData.$metadata.httpStatusCode === 200) {
      return { success: true, data: (publicURL + fileName) as any };
    }
    return { success: false, data: [] as any };
  }

  async getVideoDuration(file: any) {
    console.log("file", file);

    if (
      file.mimetype === "video/mp4" ||
      file.mimetype === "video/mkv" ||
      file.mimetype === "video/wmv"
    ) {
      const videoStream = new Readable();
      videoStream.push(file.buffer);
      videoStream.push(null);
      const duration = await getVideoDurationInSeconds(videoStream);
      return duration;
    }
    return 0;
  }

  async getAllCourseContentBySectionId(id: string) {
    const result =
      await CourseContentRepository.getCourseContentBySectionId(id);

    if (!result.length) {
      return { success: false, data: {} as any };
    }
    return { success: true, data: result as any };
  }

  async findById(id: string) {
    const result = await CourseContentRepository.findById(id);

    if (!result) {
      return { success: false, data: {} as any };
    }
    return { success: true, data: result as any };
  }
  async findByIdAndDelete(id: string) {
    const result = await CourseContentRepository.findByIdAndDelete(id);
    console.log("course content service class", result);

    if (!result) {
      return { success: false, data: {} as any };
    }
    return { success: true, data: result as any };
  }
}

const CourseContentService = new CourseContentServiceClass();
export default CourseContentService;
