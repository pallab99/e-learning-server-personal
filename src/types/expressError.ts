export interface ExpressError extends SyntaxError {
  status: number;
}

export interface CustomError extends Error {
  message: string;
}
