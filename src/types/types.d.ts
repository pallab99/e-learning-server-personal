declare namespace Express {
  export interface Request {
    user?: any;
    file_extension?: string;
    file: any;
    files: any;
  }
}
