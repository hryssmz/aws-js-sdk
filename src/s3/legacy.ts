// s3/legacy.ts
import {
  CopyObjectCommand,
  CreateBucketCommand,
  DeleteBucketCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  ListBucketsCommand,
  ListObjectsCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { defaultS3ClientConfig } from "./wrapper";
import {
  CopyObjectCommandInput,
  CreateBucketCommandInput,
  DeleteBucketCommandInput,
  DeleteObjectCommandInput,
  DeleteObjectsCommandInput,
  GetObjectCommandInput,
  ListBucketsCommandInput,
  ListObjectsCommandInput,
  PutObjectCommandInput,
  S3ClientConfig,
} from "@aws-sdk/client-s3";
import type { RequestPresigningArguments } from "@aws-sdk/types";

export const createS3Client = (config?: S3ClientConfig) => {
  return new S3Client({ ...defaultS3ClientConfig, ...config });
};

export const copyObject = async (
  params: CopyObjectCommandInput,
  client = createS3Client()
) => {
  const command = new CopyObjectCommand(params);
  const result = await client.send(command);
  return result;
};

export const createBucket = async (
  params: CreateBucketCommandInput,
  client = createS3Client()
) => {
  const command = new CreateBucketCommand(params);
  const result = await client.send(command);
  return result;
};

export const deleteBucket = async (
  params: DeleteBucketCommandInput,
  client = createS3Client()
) => {
  const command = new DeleteBucketCommand(params);
  const result = await client.send(command);
  return result;
};

export const deleteObject = async (
  params: DeleteObjectCommandInput,
  client = createS3Client()
) => {
  const command = new DeleteObjectCommand(params);
  const result = await client.send(command);
  return result;
};

export const deleteObjects = async (
  params: DeleteObjectsCommandInput,
  client = createS3Client()
) => {
  const command = new DeleteObjectsCommand(params);
  const result = await client.send(command);
  return result;
};

export const getObject = async (
  params: GetObjectCommandInput,
  client = createS3Client()
) => {
  const command = new GetObjectCommand(params);
  const result = await client.send(command);
  return result;
};

export const getObjectUrl = async (
  params: GetObjectCommandInput,
  options?: RequestPresigningArguments,
  client = createS3Client()
) => {
  const command = new GetObjectCommand(params);
  const signedUrl = await getSignedUrl(client, command, options);
  return signedUrl;
};

export const listBuckets = async (
  params: ListBucketsCommandInput,
  client = createS3Client()
) => {
  const command = new ListBucketsCommand(params);
  const result = await client.send(command);
  return result;
};

export const listObjects = async (
  params: ListObjectsCommandInput,
  client = createS3Client()
) => {
  const command = new ListObjectsCommand(params);
  const result = await client.send(command);
  return result;
};

export const putObject = async (
  params: PutObjectCommandInput,
  client = createS3Client()
) => {
  const command = new PutObjectCommand(params);
  const result = await client.send(command);
  return result;
};

export const putObjectUrl = async (
  params: PutObjectCommandInput,
  options?: RequestPresigningArguments,
  client = createS3Client()
) => {
  const command = new PutObjectCommand(params);
  const signedUrl = await getSignedUrl(client, command, options);
  return signedUrl;
};

export const deleteAllObjects = async (
  Bucket?: string,
  client = createS3Client()
) => {
  const { Contents } = await listObjects({ Bucket }, client);
  if (Contents === undefined) {
    return;
  }
  const result = await deleteObjects(
    { Bucket, Delete: { Objects: Contents.map(({ Key }) => ({ Key })) } },
    client
  );
  return result;
};

export const deleteBucketsByPrefix = async (
  prefix: string,
  client = createS3Client()
) => {
  const { Buckets } = await listBuckets({}, client);
  const promises =
    Buckets?.filter(({ Name }) => Name?.startsWith(prefix)).map(
      async ({ Name }) => {
        await deleteAllObjects(Name, client);
        const result = await deleteBucket({ Bucket: Name }, client);
        return result;
      }
      /* c8 ignore next */
    ) ?? [];
  const results = await Promise.all(promises);
  return results;
};
