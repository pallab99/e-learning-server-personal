import { s3Client } from "../configs/s3Config";
const { Upload } = require("@aws-sdk/lib-storage");

export const parallelUploader = (params: any) => {
  const uploadParallel = new Upload({
    client: s3Client,
    queueSize: 4,
    partSize: 5542880,
    leavePartsOnError: false,
    params,
  });

  return uploadParallel;
};
