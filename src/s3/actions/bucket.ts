// s3/actions/bucket.ts
import {
  CreateBucketCommand,
  DeleteBucketCommand,
  ListBucketsCommand,
} from "@aws-sdk/client-s3";
import { s3Client } from "../utils";
import type {
  S3ClientConfig,
  CreateBucketCommandInput,
  DeleteBucketCommandInput,
  ListBucketsCommandInput,
} from "@aws-sdk/client-s3";
export const foo = 1;

export const createBucket = async (
  params: CreateBucketCommandInput,
  clientConfig?: S3ClientConfig
) => {
  const client = s3Client(clientConfig);
  const command = new CreateBucketCommand(params);
  const result = await client.send(command);
  return result;
};

export const deleteBucket = async (
  params: DeleteBucketCommandInput,
  clientConfig?: S3ClientConfig
) => {
  const client = s3Client(clientConfig);
  const command = new DeleteBucketCommand(params);
  const result = await client.send(command);
  return result;
};

export const listBuckets = async (
  params: ListBucketsCommandInput,
  clientConfig?: S3ClientConfig
) => {
  const client = s3Client(clientConfig);
  const command = new ListBucketsCommand(params);
  const result = await client.send(command);
  return result;
};
