import { publicURL } from "../../constant/user";
import { generateFileName } from "../../helper/generateFileName";
import { parallelUploader } from "../../helper/parallelUploader";
import { s3ParamsGenerator } from "../../helper/s3ParamsGenerator";
import AssignmentRepository from "../../repository/assignment";
const bucketName = process.env.S3_BUCKET_NAME as string;

class AssignmentServiceClass {
  async saveFileOnServer(file: any, courseTitle: string, sectionName: string) {
    const S3_Bucket_path = `course/${courseTitle}/${sectionName}`;

    const fileName = generateFileName(
      S3_Bucket_path,
      sectionName,
      file.originalname
    );
    // console.log("filename", fileName);

    const params = s3ParamsGenerator(
      bucketName,
      fileName,
      file.buffer,
      file.mimetype
    );
    const uploadParallel = parallelUploader(params);

    uploadParallel.on("httpUploadProgress", (progress: any) => {
      //   console.log("prog", progress);
    });

    const uploadedData = await uploadParallel.done();
    console.log(uploadedData);

    if (uploadedData.$metadata.httpStatusCode === 200) {
      return { success: true, data: (publicURL + fileName) as any };
    }
    return { success: false, data: [] as any };
  }

  async createAssignment(
    title: string,
    description: string,
    assignmentFileURL: string,
    courseSection: string,
    course: string,
    point: number,
    instructions?: string
  ) {
    const result = await AssignmentRepository.createAssignment(
      title,
      description,
      assignmentFileURL,
      courseSection,
      course,
      point,
      instructions
    );

    return { success: Object.keys(result).length, data: result };
  }

  async updateAssignmentById(id: string, doc: any) {
    const result = await AssignmentRepository.updateAssignment(id, doc);

    return { success: result ? Object.keys(result).length : 0, data: result };
  }
  async findById(id: string) {
    const result = await AssignmentRepository.findById(id);

    return {
      success: result ? Object.keys(result).length : 0,
      data: result as any,
    };
  }

  async disableAssignment(assignment: any) {
    assignment.disabled = true;
    const result = await assignment.save();
    return { success: result ? Object.keys(result).length : 0, data: result };
  }
  async enableAssignment(assignment: any) {
    assignment.disabled = false;
    const result = await assignment.save();
    return { success: result ? Object.keys(result).length : 0, data: result };
  }

  async getAllAssignmentOfACourse(id: string) {
    const result = await AssignmentRepository.getAssignmentByCourseId(id);

    return { success: result ? result.length : 0, data: result };
  }
  async getAllAssignmentOfASection(id: string) {
    const result = await AssignmentRepository.getAssignmentBySectionId(id);
    return { success: result ? Object.keys(result).length : 0, data: result };
  }
  async saveAssignmentOnServer(
    file: any,
    courseTitle: string,
    sectionName: string
  ) {
    const S3_Bucket_path = `course/${courseTitle}/submitted-assignment/${sectionName}`;

    const fileName = generateFileName(
      S3_Bucket_path,
      sectionName,
      file.originalname
    );
    // console.log("filename", fileName);

    const params = s3ParamsGenerator(
      bucketName,
      fileName,
      file.buffer,
      file.mimetype
    );
    const uploadParallel = parallelUploader(params);

    uploadParallel.on("httpUploadProgress", (progress: any) => {
      //   console.log("prog", progress);
    });

    const uploadedData = await uploadParallel.done();
    console.log(uploadedData);

    if (uploadedData.$metadata.httpStatusCode === 200) {
      return { success: true, data: (publicURL + fileName) as any };
    }
    return { success: false, data: [] as any };
  }

  async checkMark(mark: number, assignmentMark: number) {
    return { success: mark <= assignmentMark, data: mark };
  }
}

const AssignmentService = new AssignmentServiceClass();

export default AssignmentService;
