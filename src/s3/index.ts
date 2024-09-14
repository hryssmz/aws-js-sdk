// s3/index.ts
import {
  CopyObjectCommand,
  CreateBucketCommand,
  DeleteBucketCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  GetObjectRetentionCommand,
  ListBucketsCommand,
  ListObjectsCommand,
  ListObjectVersionsCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
// import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { defaultClientConfig } from "../utils";
import {
  CopyObjectCommandInput,
  CreateBucketCommandInput,
  DeleteBucketCommandInput,
  DeleteObjectCommandInput,
  DeleteObjectsCommandInput,
  GetObjectCommandInput,
  GetObjectRetentionCommandInput,
  ListBucketsCommandInput,
  ListObjectsCommandInput,
  ListObjectVersionsCommandInput,
  PutObjectCommandInput,
  S3ClientConfig,
} from "@aws-sdk/client-s3";
// import type { RequestPresigningArguments } from "@aws-sdk/types";

export const defaultS3ClientConfig = { ...defaultClientConfig };

export class S3Wrapper {
  client: S3Client;

  constructor(config?: S3ClientConfig) {
    this.client = new S3Client({ ...defaultS3ClientConfig, ...config });
  }

  async copyObject(params: CopyObjectCommandInput) {
    const command = new CopyObjectCommand(params);
    const result = await this.client.send(command);
    return result;
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

  async getObjectRetention(params: GetObjectRetentionCommandInput) {
    const command = new GetObjectRetentionCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  // async getObjectUrl(
  //   params: GetObjectCommandInput,
  //   options?: RequestPresigningArguments
  // ) {
  //   const command = new GetObjectCommand(params);
  //   const signedUrl = await getSignedUrl(this.client, command, options);
  //   return signedUrl;
  // }

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

  async listObjectVersions(params: ListObjectVersionsCommandInput) {
    const command = new ListObjectVersionsCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  async putObject(params: PutObjectCommandInput) {
    const command = new PutObjectCommand(params);
    const result = await this.client.send(command);
    return result;
  }

  // async putObjectUrl(
  //   params: PutObjectCommandInput,
  //   options?: RequestPresigningArguments
  // ) {
  //   const command = new PutObjectCommand(params);
  //   const signedUrl = await getSignedUrl(this.client, command, options);
  //   return signedUrl;
  // }

  async deleteAllObjects(Bucket?: string) {
    const { Contents } = await this.listObjects({ Bucket });
    if (Contents === undefined) {
      return;
    }
    const result = await this.deleteObjects({
      Bucket,
      Delete: { Objects: Contents.map(({ Key }) => ({ Key })) },
    });
    return result;
  }
}
