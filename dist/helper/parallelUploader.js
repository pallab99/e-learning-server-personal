"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parallelUploader = void 0;
const s3Config_1 = require("../configs/s3Config");
const { Upload } = require("@aws-sdk/lib-storage");
const parallelUploader = (params) => {
    const uploadParallel = new Upload({
        client: s3Config_1.s3Client,
        queueSize: 4,
        partSize: 5542880,
        leavePartsOnError: false,
        params,
    });
    return uploadParallel;
};
exports.parallelUploader = parallelUploader;
