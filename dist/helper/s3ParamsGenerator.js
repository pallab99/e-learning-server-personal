"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.s3ParamsGenerator = void 0;
const bucketName = process.env.S3_BUCKET_NAME;
const s3ParamsGenerator = (bucketName, fileName, buffer, contentType) => {
    const params = {
        Bucket: `${bucketName}`,
        Key: fileName,
        Body: buffer,
        ContentType: contentType,
    };
    return params;
};
exports.s3ParamsGenerator = s3ParamsGenerator;
