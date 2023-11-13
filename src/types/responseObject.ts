export interface IResponseObj {
  status: number;
  success: boolean;
  message: string;
  data: object | null;
  error: object | undefined | null;
}
