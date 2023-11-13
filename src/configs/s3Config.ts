import { S3Client } from "@aws-sdk/client-s3";
import dotEnv from "dotenv";
dotEnv.config();
const accessKeyId = process.env.S3_BUCKET_ACCESSKEY as string;
const secretAccessKey = process.env.S3_BUCKET_SECRETKEY as string;
const region = process.env.S3_BUCKET_REGION as string;

export const s3Client = new S3Client({
  region: region as string,
  credentials: {
    accessKeyId: accessKeyId as string,
    secretAccessKey: secretAccessKey as string,
  },
});
