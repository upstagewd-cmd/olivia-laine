import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  // The SDK defaults to attaching a checksum param to presigned URLs, which
  // R2 doesn't handle the same way S3 does — this causes a 401 on upload if
  // left on. See: https://github.com/aws/aws-sdk-js-v3/issues/6810
  requestChecksumCalculation: "WHEN_REQUIRED",
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

export async function presignUpload(key, contentType) {
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });
  // Valid for 5 minutes — plenty of time to start an upload after requesting it.
  return getSignedUrl(r2, command, { expiresIn: 300 });
}

export async function deleteObject(key) {
  await r2.send(new DeleteObjectCommand({ Bucket: process.env.R2_BUCKET_NAME, Key: key }));
}
