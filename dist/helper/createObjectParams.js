"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createObjectParamsForS3 = void 0;
const bucketName = process.env.S3_BUCKET_NAME || "mern-pallab-bucket";
const createObjectParamsForS3 = (key) => {
    return {
        Bucket: bucketName,
        Key: key,
    };
};
exports.createObjectParamsForS3 = createObjectParamsForS3;
