import dotEnv from "dotenv";
import express, { Application, NextFunction, Request, Response } from "express";
import path from "path";
import { connectDB } from "./configs/databaseConnection";
import { RESPONSE_MESSAGE } from "./constant/responseMessage";
import { HTTP_STATUS } from "./constant/statusCode";
import routes from "./routes";
import { ExpressError } from "./types/expressError";
import { sendResponse } from "./utils/response";
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
dotEnv.config();
const app: Application = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "..", "src", "public")));
const port = process.env.PORT || 8000;

app.use(
  (err: ExpressError, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
      return sendResponse(
        res,
        HTTP_STATUS.UNPROCESSABLE_ENTITY,
        "Invalid JSON provided"
      );
    }
    next();
  }
);

app.use("/api", routes);
app.get("/", (req: Request, res: Response) => {
  return sendResponse(res, HTTP_STATUS.OK, RESPONSE_MESSAGE.BASE_ROUTE);
});

app.use((req: Request, res: Response, next: NextFunction) => {
  return sendResponse(res, HTTP_STATUS.BAD_GATEWAY, RESPONSE_MESSAGE.NOT_FOUND);
});

connectDB(() => {
  app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  });
});
