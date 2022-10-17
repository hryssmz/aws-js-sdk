// s3/actions/wrapper.ts
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
import { defaultClientConfig, isLocal } from "../utils";
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

export const defaultS3ClientConfig = {
  ...defaultClientConfig,
  /* c8 ignore next */
  forcePathStyle: isLocal ? true : undefined,
};

export class S3Wrapper {
  client: S3Client;

  constructor(config?: S3ClientConfig) {
    this.client = new S3Client({ ...defaultS3ClientConfig, ...config });
  }

  async createBucket(params: CreateBucketCommandInput) {
    const command = new CreateBucketCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async deleteBucket(params: DeleteBucketCommandInput) {
    const command = new DeleteBucketCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async deleteObject(params: DeleteObjectCommandInput) {
    const command = new DeleteObjectCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async deleteObjects(params: DeleteObjectsCommandInput) {
    const command = new DeleteObjectsCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async getObject(params: GetObjectCommandInput) {
    const command = new GetObjectCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async listBuckets(params: ListBucketsCommandInput) {
    const command = new ListBucketsCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async listObjects(params: ListObjectsCommandInput) {
    const command = new ListObjectsCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async putObject(params: PutObjectCommandInput) {
    const command = new PutObjectCommand(params);
    const result = await this.client.send(command);
    return result;
  }
}
