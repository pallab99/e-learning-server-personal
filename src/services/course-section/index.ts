import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotEnv from "dotenv";
import { s3Client } from "../../configs/s3Config";
import { publicURL } from "../../constant/user";
import CourseContentRepository from "../../repository/course-content";
import CourseSectionRepository from "../../repository/course-section";
import { ICourseSectionUpdate } from "../../types/courseSection";
dotEnv.config();
const bucketName = process.env.S3_BUCKET_NAME as string;

class CourseSectionClassService {
  async createSection(title: string, courseId: string) {
    const result = await CourseSectionRepository.createSection(title, courseId);
    if (result) {
      return { success: true, data: result };
    }
    return { success: false, data: [] };
  }

  async updateSection(id: string, doc: ICourseSectionUpdate) {
    const result = await CourseSectionRepository.updateSection(id, doc);
    if (result) {
      return { success: true, data: result };
    }
    return { success: false, data: [] };
  }

  async deleteSection(id: string) {
    const result = await CourseSectionRepository.deleteSection(id);
    if (result) {
      return { success: true, data: result };
    }
    return { success: false, data: [] };
  }
  async findById(id: string) {
    console.log({ id });

    const result = await CourseSectionRepository.findById(id);

    if (result) {
      return { success: true, data: result as any };
    }
    return { success: false, data: [] as any };
  }

  async getCourseSectionByCourseId(id: string) {
    const result = await CourseSectionRepository.getCourseSectionByCourseId(id);
    if (result) {
      return { success: true, data: result as any };
    }
    return { success: false, data: [] as any };
  }
  async saveCourseContentId(id: string, doc: any) {
    const result = await CourseSectionRepository.saveCourseContentId(id);

    if (!result) {
      return { success: false, data: {} };
    }

    result.sectionContent.push(doc);
    await result.save();

    return { success: true, data: result };
  }

  async findTotalContent(id: string) {
    // const result = await this.getCourseSectionByCourseId(id);
    // console.log(result);

    // if (!result.success) {
    //   return { success: false, data: {} as any };
    // }
    const findById = await CourseSectionRepository.findById(id);
    if (!findById) {
      return { success: false, data: {} as any };
    }

    findById.totalVideo = findById.sectionContent.length;
    await findById.save();
    // return { success: true, data: result.data.sectionContent.length as any };
  }

  async updateTotalContent(id: string, content: any) {
    const courseSection = await CourseSectionRepository.findById(id);
    if (courseSection) {
      courseSection.totalVideo = content.length;

      let sum = content.reduce(
        (accumulator: any, ele: any) => accumulator + ele.contentLength,
        0
      );
      courseSection.totalHours = 0;

      await courseSection.save();
    }
  }
  async getDataFromServer(params: any) {
    const thumbnailCommand = new GetObjectCommand(params);
    const dpURI = await getSignedUrl(s3Client, thumbnailCommand);
    if (dpURI) {
      return { success: true, data: dpURI };
    }
    return { success: false, data: [] };
  }

  async deleteCourseContentFromSection(sectionId: string, contentId: string) {
    const result = await CourseSectionRepository.findById(sectionId);
    const content = await CourseContentRepository.findById(contentId);

    if (!result || !content) {
      return { success: false, data: [] };
    }
    const index = result.sectionContent.findIndex((ele: any) => {
      console.log(ele);
      return String(ele._id) === String(contentId);
    });
    console.log({ index });

    if (index != -1 && result.totalHours && result.totalVideo) {
      result.sectionContent.splice(index, 1);
      result.totalVideo -= 1;
      // result.totalHours -= content.contentLength;
      await result.save();
      return { success: true, data: result as any };
    }
    return { success: false, data: [] };
  }
  async getCourseContent(result: any) {
    // console.log("result", result);

    const data = await Promise.all(
      // Array.from(result, async (ele: any) => {
      //   const sectionContentData = await Promise.all(
      //     Array.from(
      //       ele.sectionContent,
      //       async (content: any, index: number) => {
      //         // const ContentObjectParams = createObjectParamsForS3(
      //         //   content.contentUrl
      //         // );
      //         // const courseContent =
      //         //   await this.getDataFromServer(ContentObjectParams);
      //         const fileURL = publicURL + content.contentUrl;

      //         return {
      //           content,
      //           courseContentURL: fileURL,
      //         };
      //       }
      //     )
      //   );

      //   return [ele, sectionContentData];
      // })

      result.map(async (ele: any) => {
        console.log(ele);
        if (!ele.sectionContent) {
          return ele;
        } else {
          const contents = await Promise.all(
            ele.sectionContent.map(async (content: any) => {
              let fileURL = publicURL + content.contentUrl;
              return {
                ele,
                // content: content,
                fileURL: fileURL,
              };
            })
          );
          return contents;
        }
      })
    );

    const newData = result.map((obj: any) => {
      const newObj = { ...obj };
      const x = newObj.toObject();
      console.log(x);

      newObj.sectionContent.forEach((content: any) => {
        content.newProperty = "new value";
      });
      return newObj;
    });

    console.log("new data", newData);

    if (data.length) {
      return { success: true, data };
    }
    return { success: false, data: [] };
  }

  async saveAssignment(id: string, sectionData: any) {
    sectionData.assignment = id;
    sectionData.save();

    return { success: Object.keys(sectionData).length, data: sectionData };
  }

  async addQuiz(quizId: any, sectionId: string) {
    const result = await CourseSectionRepository.findById(sectionId);
    if (!result) {
      return { success: false, data: {} as any };
    }
    console.log(quizId, result);

    result.quiz = quizId;
    await result.save();
    return { success: true, data: result as any };
  }

  async courseContentForNonSubscribedStudent(courseId: string) {
    const result =
      await CourseSectionRepository.courseContentForNonSubscribedStudent(
        courseId
      );
    if (result) {
      return { success: true, data: result as any };
    }
    return { success: false, data: [] as any };
  }
}

const CourseSectionService = new CourseSectionClassService();
export default CourseSectionService;
