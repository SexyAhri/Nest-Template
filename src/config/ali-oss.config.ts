import { config as dotenvConfig } from 'dotenv';
dotenvConfig();
interface AliOssConfig {
  region: string;
  accessKeyId: string;
  accessKeySecret: string;
  bucket: string;
}
export const AliOss: AliOssConfig = {
  region: process.env.OSS_REGION || 'your-oss-region',
  accessKeyId: process.env.OSS_ACCESS_KEY_ID || 'your-access-key-id',
  accessKeySecret:
    process.env.OSS_ACCESS_KEY_SECRET || 'your-access-key-secret',
  bucket: process.env.OSS_BUCKET || 'your-bucket-name',
};
