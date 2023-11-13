"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const databaseConnection_1 = require("./configs/databaseConnection");
const responseMessage_1 = require("./constant/responseMessage");
const statusCode_1 = require("./constant/statusCode");
const routes_1 = __importDefault(require("./routes"));
const response_1 = require("./utils/response");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(cors({ origin: true, credentials: true }));
app.use(express_1.default.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("view engine", "ejs");
app.use(express_1.default.static(path_1.default.join(__dirname, "..", "src", "public")));
const port = process.env.PORT || 8000;
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
        return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.UNPROCESSABLE_ENTITY, "Invalid JSON provided");
    }
    next();
});
app.use("/api", routes_1.default);
app.get("/", (req, res) => {
    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.OK, responseMessage_1.RESPONSE_MESSAGE.BASE_ROUTE);
});
app.use((req, res, next) => {
    return (0, response_1.sendResponse)(res, statusCode_1.HTTP_STATUS.BAD_GATEWAY, responseMessage_1.RESPONSE_MESSAGE.NOT_FOUND);
});
(0, databaseConnection_1.connectDB)(() => {
    app.listen(port, () => {
        console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
    });
});
