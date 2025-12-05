import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const REGION = process.env.RAILWAY_BUCKET_REGION;
const ENDPOINT = process.env.RAILWAY_BUCKET_ENDPOINT;
const BUCKET = process.env.RAILWAY_BUCKET_NAME;
const ACCESS_KEY_ID = process.env.RAILWAY_BUCKET_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.RAILWAY_BUCKET_SECRET_ACCESS_KEY;

if (!REGION || !ENDPOINT || !BUCKET || !ACCESS_KEY_ID || !SECRET_ACCESS_KEY) {
  console.warn("Bucket env vars not configured");
}

export const s3 = new S3Client({
  region: REGION!,
  endpoint: ENDPOINT!,
  credentials: {
    accessKeyId: ACCESS_KEY_ID!,
    secretAccessKey: SECRET_ACCESS_KEY!,
  },
  forcePathStyle: true,
});

export async function uploadCoinImage(opts: {
  buffer: Buffer;
  contentType: string;
  key: string;
}): Promise<string> {
  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: opts.key,
      Body: opts.buffer,
      ContentType: opts.contentType,
    })
  );

  return opts.key;
}
