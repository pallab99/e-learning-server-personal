import { Request, Response } from "express";
import { RESPONSE_MESSAGE } from "../../constant/responseMessage";
import { HTTP_STATUS } from "../../constant/statusCode";
import CourseModel from "../../models/course";
import AssignmentService from "../../services/assignment";
import CourseService from "../../services/course";
import CourseSectionService from "../../services/course-section";
import SubmitAssignmentService from "../../services/submit-assignment";
import UserService from "../../services/user";
import { ISubmitAssignment } from "../../types/submitAssignment";
import { databaseLogger } from "../../utils/dbLogger";
import { sendResponse } from "../../utils/response";
import SubmitAssignmentModel from "../../models/submit-assignment";
import mongoose from "mongoose";
class AssignmentControllerClass {
  async createAssignment(req: Request, res: Response) {
    try {
      databaseLogger(req.originalUrl);

      const { title, description, instructions, point } = req.body;
      const { courseId, sectionId } = req.params;
      const file = req.file;

      const course = await CourseService.findById(courseId);
      const courseSection = await CourseSectionService.findById(sectionId);
      if (!course.success) {
        return sendResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          RESPONSE_MESSAGE.COURSE_NOT_FOUND
        );
      }
      if (!courseSection.success) {
        return sendResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          RESPONSE_MESSAGE.COURSE_SECTION_NOT_FOUND
        );
      }
      if (courseSection.data.assignment) {
        return sendResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          RESPONSE_MESSAGE.SINGLE_ASSIGNMENT
        );
      }
      const saveFileOnServer = await AssignmentService.saveFileOnServer(
        file,
        course.data.title,
        courseSection.data.title
      );

      if (!saveFileOnServer.success) {
        return sendResponse(
          res,
          HTTP_STATUS.BAD_REQUEST,
          RESPONSE_MESSAGE.S3_SERVER_ERROR
        );
      }
      const newAssignment = await AssignmentService.createAssignment(
        title,
        description,
        saveFileOnServer.data,
        sectionId,
        courseId,
        point,
        instructions
      );
      if (!newAssignment.success) {
        return sendResponse(
          res,
          HTTP_STATUS.BAD_REQUEST,
          RESPONSE_MESSAGE.ASSIGNMENT_CREATE_FAILED
        );
      }
      const saveAssignmentInSection = await CourseSectionService.saveAssignment(
        newAssignment.data._id,
        courseSection.data
      );
      if (!saveAssignmentInSection.success) {
        return sendResponse(
          res,
          HTTP_STATUS.BAD_REQUEST,
          RESPONSE_MESSAGE.ASSIGNMENT_CREATE_FAILED
        );
      }
      return sendResponse(
        res,
        HTTP_STATUS.OK,
        RESPONSE_MESSAGE.ASSIGNMENT_CREATE_SUCCESS,
        newAssignment.data
      );
    } catch (error: any) {
      console.log(error);
      databaseLogger(error.message);
      return sendResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updateAssignment(req: Request, res: Response) {
    try {
      databaseLogger(req.originalUrl);
      const { courseId, sectionId, assignmentId } = req.params;
      const file = req.file;

      const course = await CourseService.findById(courseId);
      const courseSection = await CourseSectionService.findById(sectionId);
      if (!course.success) {
        return sendResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          RESPONSE_MESSAGE.COURSE_NOT_FOUND
        );
      }
      if (!courseSection.success) {
        return sendResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          RESPONSE_MESSAGE.COURSE_SECTION_NOT_FOUND
        );
      }

      let data = { ...req.body };

      if (file) {
        const saveFileOnServer = await AssignmentService.saveFileOnServer(
          file,
          course.data.title,
          courseSection.data.title
        );
        data = {
          ...data,
          assignmentFileURL: saveFileOnServer.data,
        };
      }

      const updatedAssignment = await AssignmentService.updateAssignmentById(
        assignmentId,
        data
      );

      if (!updatedAssignment.success) {
        return sendResponse(
          res,
          HTTP_STATUS.BAD_REQUEST,
          RESPONSE_MESSAGE.ASSIGNMENT_UPDATE_FAILED
        );
      }
      return sendResponse(
        res,
        HTTP_STATUS.OK,
        RESPONSE_MESSAGE.ASSIGNMENT_UPDATE_SUCCESS,
        updatedAssignment.data
      );
    } catch (error: any) {
      console.log(error);
      databaseLogger(error.message);
      return sendResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR
      );
    }
  }

  async disableAssignment(req: Request, res: Response) {
    try {
      databaseLogger(req.originalUrl);
      const { courseId, sectionId, assignmentId } = req.params;

      const course = await CourseService.findById(courseId);
      const courseSection = await CourseSectionService.findById(sectionId);
      const assignment = await AssignmentService.findById(assignmentId);
      if (!course.success) {
        return sendResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          RESPONSE_MESSAGE.COURSE_NOT_FOUND
        );
      }
      if (!courseSection.success) {
        return sendResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          RESPONSE_MESSAGE.COURSE_SECTION_NOT_FOUND
        );
      }
      if (!assignment.success) {
        return sendResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          RESPONSE_MESSAGE.ASSIGNMENT_NOT_FOUND
        );
      }

      const disableAssignment = await AssignmentService.disableAssignment(
        assignment.data
      );
      if (!disableAssignment.success) {
        return sendResponse(
          res,
          HTTP_STATUS.OK,
          RESPONSE_MESSAGE.ASSIGNMENT_DISABLE_FAILED
        );
      }
      return sendResponse(
        res,
        HTTP_STATUS.OK,
        RESPONSE_MESSAGE.ASSIGNMENT_DISABLE_SUCCESS,
        disableAssignment.data
      );
    } catch (error: any) {
      console.log(error);
      databaseLogger(error.message);
      return sendResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR
      );
    }
  }

  async enableAssignment(req: Request, res: Response) {
    try {
      databaseLogger(req.originalUrl);
      const { courseId, sectionId, assignmentId } = req.params;

      const course = await CourseService.findById(courseId);
      const courseSection = await CourseSectionService.findById(sectionId);
      const assignment = await AssignmentService.findById(assignmentId);
      if (!course.success) {
        return sendResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          RESPONSE_MESSAGE.COURSE_NOT_FOUND
        );
      }
      if (!courseSection.success) {
        return sendResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          RESPONSE_MESSAGE.COURSE_SECTION_NOT_FOUND
        );
      }
      if (!assignment.success) {
        return sendResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          RESPONSE_MESSAGE.ASSIGNMENT_NOT_FOUND
        );
      }

      const disableAssignment = await AssignmentService.enableAssignment(
        assignment.data
      );
      if (!disableAssignment.success) {
        return sendResponse(
          res,
          HTTP_STATUS.OK,
          RESPONSE_MESSAGE.ASSIGNMENT_ENABLE_FAILED
        );
      }
      return sendResponse(
        res,
        HTTP_STATUS.OK,
        RESPONSE_MESSAGE.ASSIGNMENT_ENABLE_SUCCESS,
        disableAssignment.data
      );
    } catch (error: any) {
      console.log(error);
      databaseLogger(error.message);
      return sendResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getAllAssignmentOfACourse(req: Request, res: Response) {
    try {
      databaseLogger(req.originalUrl);
      const { courseId } = req.params;
      const course = await CourseService.findById(courseId);
      if (!course.success) {
        return sendResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          RESPONSE_MESSAGE.COURSE_NOT_FOUND
        );
      }

      const allAssignmentOfACourse =
        await AssignmentService.getAllAssignmentOfACourse(courseId);

      if (!allAssignmentOfACourse.success) {
        return sendResponse(
          res,
          HTTP_STATUS.BAD_REQUEST,
          RESPONSE_MESSAGE.NOT_FOUND
        );
      }
      return sendResponse(
        res,
        HTTP_STATUS.OK,
        RESPONSE_MESSAGE.SUCCESSFULLY_GET_ALL_DATA,
        allAssignmentOfACourse.data
      );
    } catch (error: any) {
      console.log(error);
      databaseLogger(error.message);
      return sendResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getAllAssignmentOfASection(req: Request, res: Response) {
    try {
      databaseLogger(req.originalUrl);
      const { courseId, sectionId } = req.params;
      const course = await CourseService.findById(courseId);
      const section = await CourseSectionService.findById(sectionId);
      if (!course.success) {
        return sendResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          RESPONSE_MESSAGE.COURSE_NOT_FOUND
        );
      }
      if (!section.success) {
        return sendResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          RESPONSE_MESSAGE.COURSE_NOT_FOUND
        );
      }

      const allAssignmentOfASection =
        await AssignmentService.getAllAssignmentOfASection(sectionId);

      if (!allAssignmentOfASection.success) {
        return sendResponse(
          res,
          HTTP_STATUS.BAD_REQUEST,
          RESPONSE_MESSAGE.NOT_FOUND
        );
      }
      return sendResponse(
        res,
        HTTP_STATUS.OK,
        RESPONSE_MESSAGE.SUCCESSFULLY_GET_ALL_DATA,
        allAssignmentOfASection.data
      );
    } catch (error: any) {
      console.log(error);
      databaseLogger(error.message);
      return sendResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR
      );
    }
  }
  async getAllAssignmentById(req: Request, res: Response) {
    try {
      databaseLogger(req.originalUrl);
      const { courseId, sectionId, assignmentId } = req.params;
      const course = await CourseService.findById(courseId);
      const section = await CourseSectionService.findById(sectionId);
      const assignment = await AssignmentService.findById(assignmentId);
      if (!course.success) {
        return sendResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          RESPONSE_MESSAGE.COURSE_NOT_FOUND
        );
      }
      if (!section.success) {
        return sendResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          RESPONSE_MESSAGE.COURSE_NOT_FOUND
        );
      }

      if (!assignment.success) {
        return sendResponse(
          res,
          HTTP_STATUS.BAD_REQUEST,
          RESPONSE_MESSAGE.NOT_FOUND
        );
      }
      return sendResponse(
        res,
        HTTP_STATUS.OK,
        RESPONSE_MESSAGE.SUCCESSFULLY_GET_ALL_DATA,
        assignment.data
      );
    } catch (error: any) {
      console.log(error);
      databaseLogger(error.message);
      return sendResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR
      );
    }
  }

  async submitAssignment(req: Request, res: Response) {
    try {
      databaseLogger(req.originalUrl);
      const { title, description, comments } = req.body;
      const { courseId, sectionId, assignmentId } = req.params;
      const file = req.file;
      const { email } = req.user;
      const student = await UserService.findByEmail(email);
      const course = await CourseService.findById(courseId);
      const section = await CourseSectionService.findById(sectionId);
      const assignment = await AssignmentService.findById(assignmentId);
      if (
        !course.success ||
        !section.success ||
        !assignment.success ||
        !student
      ) {
        return sendResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          RESPONSE_MESSAGE.NO_DATA
        );
      }
      const saveAssignmentOnServer =
        await AssignmentService.saveAssignmentOnServer(
          file,
          course.data.title,
          section.data.title
        );

      if (!saveAssignmentOnServer.success) {
        return sendResponse(
          res,
          HTTP_STATUS.BAD_REQUEST,
          RESPONSE_MESSAGE.S3_SERVER_ERROR
        );
      }
      const assignmentData: ISubmitAssignment = {
        title: title,
        description: description,
        assignmentFileURL: saveAssignmentOnServer.data,
        student: student._id,
        course: courseId,
        courseSection: sectionId,
        assignment: assignmentId,
        comments: comments,
      };
      const saveAssignment =
        await SubmitAssignmentService.submitAssignment(assignmentData);
      if (!saveAssignment.success) {
        return sendResponse(
          res,
          HTTP_STATUS.BAD_REQUEST,
          RESPONSE_MESSAGE.ASSIGNMENT_SUBMIT_FAILED
        );
      }
      return sendResponse(
        res,
        HTTP_STATUS.OK,
        RESPONSE_MESSAGE.ASSIGNMENT_SUBMIT_SUCCESS,
        saveAssignment.data
      );
    } catch (error: any) {
      console.log(error);
      databaseLogger(error.message);
      return sendResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR
      );
    }
  }
  async getAllSubmittedAssignmentByCourseId(req: Request, res: Response) {
    try {
      databaseLogger(req.originalUrl);
      const { courseId } = req.params;
      const course = await CourseService.findById(courseId);
      if (!course.success) {
        return sendResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          RESPONSE_MESSAGE.NO_DATA
        );
      }

      const allAssignment =
        await SubmitAssignmentService.getAllAssignmentByCourseId(courseId);
      return sendResponse(
        res,
        HTTP_STATUS.OK,
        RESPONSE_MESSAGE.SUCCESSFULLY_GET_ALL_DATA,
        allAssignment.data
      );
    } catch (error: any) {
      console.log(error);
      databaseLogger(error.message);
      return sendResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getSubmittedAssignmentById(req: Request, res: Response) {
    try {
      databaseLogger(req.originalUrl);
      const { courseId, assignmentId } = req.params;
      const course = await CourseService.findById(courseId);
      const assignment = await SubmitAssignmentService.findById(assignmentId);
      if (!course.success || !assignment.success) {
        return sendResponse(
          res,
          HTTP_STATUS.OK,
          RESPONSE_MESSAGE.SUCCESSFULLY_GET_ALL_DATA,
          { data: [] }
        );
      }
      return sendResponse(
        res,
        HTTP_STATUS.OK,
        RESPONSE_MESSAGE.SUCCESSFULLY_GET_ALL_DATA,
        assignment
      );
    } catch (error: any) {
      console.log(error);
      databaseLogger(error.message);
      return sendResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getAssignmentSubmittedByUser(req: Request, res: Response) {
    try {
      databaseLogger(req.originalUrl);
      const { courseId, assignmentId } = req.params;
      const { email } = req.user;
      const user =await UserService.findByEmail(email);

      if (!user) {
        return sendResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          RESPONSE_MESSAGE.NO_DATA
        );
      }
      const submittedAssignment = await SubmitAssignmentModel.findOne({
        course: new mongoose.Types.ObjectId(courseId),
        assignment: new mongoose.Types.ObjectId(assignmentId),
        student:new mongoose.Types.ObjectId(user?._id)
      });
      if (!submittedAssignment) {
        return sendResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          RESPONSE_MESSAGE.NO_DATA, 
        );
      }
      return sendResponse(
        res,
        HTTP_STATUS.OK,
        RESPONSE_MESSAGE.SUCCESSFULLY_GET_ALL_DATA,
        submittedAssignment
      );
    } catch (error: any) {
      console.log(error);
      databaseLogger(error.message);
      return sendResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR
      );
    }
  }

  async giveGraderToSubmittedAssignment(req: Request, res: Response) {
    try {
      databaseLogger(req.originalUrl);
      const { assignmentId, submittedAssignmentId } = req.params;

      const { grade, feedback } = req.body;

      const assignment = await AssignmentService.findById(assignmentId);
      const submittedAssignment = await SubmitAssignmentService.findById(
        submittedAssignmentId
      );
      if (!assignment.success || !submittedAssignment.success) {
        return sendResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          RESPONSE_MESSAGE.NO_DATA
        );
      }

      const checkMark = await AssignmentService.checkMark(
        grade,
        assignment.data.point
      );
      if (!checkMark.success) {
        return sendResponse(
          res,
          HTTP_STATUS.BAD_REQUEST,
          RESPONSE_MESSAGE.INVALID_GRADE
        );
      }
      const addAssessment = await SubmitAssignmentService.submitAssessment(
        submittedAssignmentId,
        grade,
        feedback
      );

      if (!addAssessment.success) {
        return sendResponse(
          res,
          HTTP_STATUS.BAD_REQUEST,
          RESPONSE_MESSAGE.ASSIGNMENT_ASSESSMENT_FAIlED
        );
      }

      return sendResponse(
        res,
        HTTP_STATUS.OK,
        RESPONSE_MESSAGE.ASSIGNMENT_ASSESSMENT_SUCCESS,
        addAssessment.data
      );
    } catch (error: any) {
      console.log(error);
      databaseLogger(error.message);
      return sendResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getAllAssignmentByInstructor(req: Request, res: Response) {
    try {
      databaseLogger(req.originalUrl);
      // const { courseId } = req.params;
      const { email } = req.user;
      const instructor = await UserService.findByEmail(email);
      if (!instructor) {
        return sendResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          RESPONSE_MESSAGE.NO_DATA
        );
      }

      const findAllCourseByInstructor = await CourseModel.find({
        instructors: { $in: [instructor._id] },
      });
      console.log(findAllCourseByInstructor);

      // const course = await CourseService.findById(courseId);
      // if (!course.success) {
      //   return sendResponse(
      //     res,
      //     HTTP_STATUS.NOT_FOUND,
      //     RESPONSE_MESSAGE.COURSE_NOT_FOUND
      //   );
      // }

      // const allAssignmentOfACourse =
      //   await AssignmentService.getAllAssignmentOfACourse(courseId);

      // if (!allAssignmentOfACourse.success) {
      //   return sendResponse(
      //     res,
      //     HTTP_STATUS.BAD_REQUEST,
      //     RESPONSE_MESSAGE.NOT_FOUND
      //   );
      // }
      // return sendResponse(
      //   res,
      //   HTTP_STATUS.OK,
      //   RESPONSE_MESSAGE.SUCCESSFULLY_GET_ALL_DATA,
      //   allAssignmentOfACourse.data
      // );
    } catch (error: any) {
      console.log(error);
      databaseLogger(error.message);
      return sendResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR
      );
    }
  }

  // async getSubmittedAssignment(req:Request,res:Response){
  //   try {

  //   } catch (error) {

  //   }
  // }

  // async getAllSubmittedAssignmentById(req: Request, res: Response) {
  //   try {
  //     databaseLogger(req.originalUrl);
  //     const { courseId, assignmentId } = req.params;
  //     const course = await CourseService.findById(courseId);
  //     const assignment = await SubmitAssignmentService.findById(assignmentId);
  //     if (!course.success || !assignment.success) {
  //       return sendResponse(
  //         res,
  //         HTTP_STATUS.NOT_FOUND,
  //         RESPONSE_MESSAGE.NO_DATA
  //       );
  //     }
  //     return sendResponse(
  //       res,
  //       HTTP_STATUS.OK,
  //       RESPONSE_MESSAGE.SUCCESSFULLY_GET_ALL_DATA,
  //       assignment
  //     );
  //   } catch (error: any) {
  //     console.log(error);
  //     databaseLogger(error.message);
  //     return sendResponse(
  //       res,
  //       HTTP_STATUS.INTERNAL_SERVER_ERROR,
  //       RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR
  //     );
  //   }
  // }
}

const AssignmentController = new AssignmentControllerClass();
export default AssignmentController;
