const bucketName = process.env.S3_BUCKET_NAME || "mern-pallab-bucket";

export const createObjectParamsForS3 = (key: any) => {
  return {
    Bucket: bucketName,
    Key: key,
  };
};
