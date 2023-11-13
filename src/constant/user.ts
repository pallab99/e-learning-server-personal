import dotEnv from "dotenv";
import { UserType } from "../types/userType";
dotEnv.config();
export const userType: UserType = {
  admin: 1,
  instructor: 2,
  student: 3,
};
export const publicURL = process.env.PUBLIC_URL;
