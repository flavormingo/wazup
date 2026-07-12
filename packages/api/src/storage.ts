import * as Minio from 'minio';
import { config } from './config.js';

export function createMinioClient(): Minio.Client {
  return new Minio.Client({
    endPoint: config.minioEndpoint,
    port: config.minioPort,
    useSSL: config.minioUseSsl,
    accessKey: config.minioAccessKey,
    secretKey: config.minioSecretKey,
  });
}

let _publicMinioClient: Minio.Client | null = null;

function getPublicMinioClient(): Minio.Client {
  if (!_publicMinioClient) {
    if (config.minioPublicEndpoint) {
      _publicMinioClient = new Minio.Client({
        endPoint: config.minioPublicEndpoint,
        port: config.minioPublicPort,
        useSSL: config.minioPublicUseSsl,
        accessKey: config.minioAccessKey,
        secretKey: config.minioSecretKey,
      });
    } else {
      _publicMinioClient = createMinioClient();
    }
  }
  return _publicMinioClient;
}

export async function ensureBucket(minio: Minio.Client, bucket: string): Promise<void> {
  const exists = await minio.bucketExists(bucket);
  if (!exists) {
    await minio.makeBucket(bucket);
    const policy = {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Principal: { AWS: ['*'] },
          Action: ['s3:GetObject'],
          Resource: [`arn:aws:s3:::${bucket}/*`],
        },
      ],
    };
    await minio.setBucketPolicy(bucket, JSON.stringify(policy));
  }
}

export function getPresignedPutUrl(
  bucket: string,
  key: string,
  expiry = 3600,
): Promise<string> {
  return getPublicMinioClient().presignedPutObject(bucket, key, expiry);
}

export function getPublicUrl(key: string): string {
  if (config.minioPublicEndpoint) {
    const protocol = config.minioPublicUseSsl ? 'https' : 'http';
    const port = config.minioPublicPort;
    const portStr = (config.minioPublicUseSsl && port === 443) || (!config.minioPublicUseSsl && port === 80) ? '' : `:${port}`;
    return `${protocol}://${config.minioPublicEndpoint}${portStr}/${config.minioBucket}/${key}`;
  }
  const protocol = config.minioUseSsl ? 'https' : 'http';
  return `${protocol}://${config.minioEndpoint}:${config.minioPort}/${config.minioBucket}/${key}`;
}
