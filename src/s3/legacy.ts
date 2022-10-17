// s3/actions/legacy.ts
import {
  S3Client,
  CreateBucketCommand,
  DeleteBucketCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  ListBucketsCommand,
  ListObjectsCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { defaultS3ClientConfig } from "./wrapper";
import {
  S3ClientConfig,
  CreateBucketCommandInput,
  DeleteBucketCommandInput,
  DeleteObjectCommandInput,
  DeleteObjectsCommandInput,
  GetObjectCommandInput,
  ListBucketsCommandInput,
  ListObjectsCommandInput,
  PutObjectCommandInput,
} from "@aws-sdk/client-s3";

export const s3Client = (config?: S3ClientConfig) => {
  return new S3Client({ ...defaultS3ClientConfig, ...config });
};

export const createBucket = async (
  params: CreateBucketCommandInput,
  client = s3Client()
) => {
  const command = new CreateBucketCommand(params);
  const result = await client.send(command);
  return result;
};

export const deleteBucket = async (
  params: DeleteBucketCommandInput,
  client = s3Client()
) => {
  const command = new DeleteBucketCommand(params);
  const result = await client.send(command);
  return result;
};

export const deleteObject = async (
  params: DeleteObjectCommandInput,
  client = s3Client()
) => {
  const command = new DeleteObjectCommand(params);
  const result = await client.send(command);
  return result;
};

export const deleteObjects = async (
  params: DeleteObjectsCommandInput,
  client = s3Client()
) => {
  const command = new DeleteObjectsCommand(params);
  const result = await client.send(command);
  return result;
};

export const getObject = async (
  params: GetObjectCommandInput,
  client = s3Client()
) => {
  const command = new GetObjectCommand(params);
  const result = await client.send(command);
  return result;
};

export const listBuckets = async (
  params: ListBucketsCommandInput,
  client = s3Client()
) => {
  const command = new ListBucketsCommand(params);
  const result = await client.send(command);
  return result;
};

export const listObjects = async (
  params: ListObjectsCommandInput,
  client = s3Client()
) => {
  const command = new ListObjectsCommand(params);
  const result = await client.send(command);
  return result;
};

export const putObject = async (
  params: PutObjectCommandInput,
  client = s3Client()
) => {
  const command = new PutObjectCommand(params);
  const result = await client.send(command);
  return result;
};
