import { ITokenPayload } from "./tokenType";

export interface IRegistration {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  phoneNumber: number;
  notificationSetting: boolean;
  rank: number;
}

export interface ILogin {
  email: string;
  password: string;
}

export interface ILoginResponse extends ITokenPayload {
  accessToken?: string;
  refreshToken?: string;
}
