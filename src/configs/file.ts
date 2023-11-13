const multer = require("multer");
// const path = require("path");
// import { Request } from "express";
// import { fileTypes } from "../constant/filetypes";
// const upload = multer({
//   limits: {
//     fileSize: 524288000,
//   },
//   storage: multer.memoryStorage({
//     // destination: (req: Request, file: any, cb: any) => {
//     //   if (file) {
//     //     cb(null, path.join(__dirname, "..", "..", "src", "public", "images"));
//     //   } else {
//     //     cb("No file was found", null);
//     //   }
//     // },
//     filename: (req: Request, file: any, cb: any) => {
//       if (file) {
//         cb(null, Date.now() + "_" + file.originalname);
//       } else {
//         cb("No file was found", null);
//       }
//     },
//   }),
//   fileFilter: (req: Request, file: any, cb: any) => {
//     if (file) {
//       const extension = path.extname(file.originalname);
//       req.file_extension = extension;
//       if (fileTypes.includes(extension)) {
//         cb(null, true);
//       } else {
//         cb(null, false);
//       }
//     } else {
//       cb("No file found", false);
//     }
//   },
// });

// export { upload };
const storage = multer.memoryStorage();
export const upload = multer({ storage: storage });
