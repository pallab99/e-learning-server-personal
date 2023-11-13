import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotEnv from "dotenv";
import { s3Client } from "../../configs/s3Config";
import { publicURL } from "../../constant/user";
import { createObjectParamsForS3 } from "../../helper/createObjectParams";
import UserRepository from "../../repository/user";
dotEnv.config();
const bucketName = process.env.S3_BUCKET_NAME;

class USerServiceClass {
  async findByEmail(email: string) {
    return await UserRepository.findByEmail(email);
  }

  async createUserInUser(
    name: string,
    email: string,
    phoneNumber: number,
    notificationSetting: boolean
  ) {
    return await UserRepository.createUser(
      name,
      email,
      phoneNumber,
      notificationSetting
    );
  }

  async getAllUser() {
    return await UserRepository.getAllUser();
  }

  async getBalance(email: string) {
    const result = await UserRepository.getBalance(email);
    if (result != undefined && result >= 0) {
      return { success: true, data: result };
    }
    return { success: false, data: null };
  }

  async addBalance(entity: any) {
    return await UserRepository.save(entity);
  }

  async saveDpOnServer(file: any, fileName: string, email: string) {
    const params = {
      Bucket: `${bucketName}`,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    };
    const command = new PutObjectCommand(params);
    const result = await s3Client.send(command);
    if (result.$metadata.httpStatusCode === 200) {
      return { success: true, data: (publicURL as string) + result };
    }
    return { success: false, data: [] };

    // console.log(result.$metadata.httpStatusCode === 200);
  }

  async updateProfilePicture(entity: any) {
    return await UserRepository.save(entity);
  }
  async findById(userId: string) {
    const res = await UserRepository.findById(userId);
    if (res) {
      return { success: true, data: res };
    }
    return { success: false, data: null };
  }

  async getAllInstructor() {
    const result = await UserRepository.getAllInstructor();
    console.log({ result });

    if (result.length <= 0) {
      return { success: false, data: null };
    }

    const instructors = result.filter((ele: any) => {
      return ele.rank === 2;
    });

    return { success: true, data: instructors };
  }

  async updateUser(email: string, entity: any) {
    const result = await UserRepository.updateUser(email, entity);
    if (result) {
      return { success: true, data: result };
    }
    return { success: false, data: null };
  }

  async getDPFromServer(params: any) {
    const thumbnailCommand = new GetObjectCommand(params);
    const dpURI = await getSignedUrl(s3Client, thumbnailCommand);
    if (dpURI) {
      return { success: true, data: dpURI };
    }
    return { success: false, data: [] };
  }

  async getDpOfAllUser(result: any) {
    const data = await Promise.all(
      result.map(async (user: any) => {
        const DpObjectParams = createObjectParamsForS3(user.dp);
        const profilePicture = await this.getDPFromServer(DpObjectParams);
        return {
          user,
          profilePictureURL: profilePicture.data,
        };
      })
    );

    if (data.length) {
      return { success: true, data };
    }
    return { success: false, data: [] };
  }

  async getAllStudents() {
    const result = await UserRepository.getAllUser();
    if (result.length <= 0) {
      return { success: false, data: null };
    }
    const students = result.filter((ele: any) => {
      return ele.rank === 3;
    });

    return { success: true, data: students };
  }
}

const UserService = new USerServiceClass();

export default UserService;
