const bucketName = process.env.S3_BUCKET_NAME as string;
export const s3ParamsGenerator = (
  bucketName: string,
  fileName: string,
  buffer: any,
  contentType: string
) => {
  const params = {
    Bucket: `${bucketName}`,
    Key: fileName,
    Body: buffer,
    ContentType: contentType,
  };

  return params;
};
