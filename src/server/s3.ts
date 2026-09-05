import { env } from "@/env.js";
import type { S3ClientConfig } from "@aws-sdk/client-s3";

export const s3:S3ClientConfig = {
    // endpoint: env.S3_ENDPOINT,
    
    // region:'sgp1',
    // accessKeyId: env.S3_ACCESS_ID,
    // secretAccessKey: env.S3_SECRET_KEY,
    // signatureVersion:'v4',
    region: "ap-southeast-1", // Must be "us-east-1" when creating new Spaces. Otherwise, use the region in your endpoint (e.g. nyc3).
    credentials: {
      accessKeyId: env.S3_ACCESS_ID, // Access key pair. You can create access key pairs using the control panel or API.
      secretAccessKey: env.S3_SECRET_KEY // Secret access key defined through an environment variable.
    }
};