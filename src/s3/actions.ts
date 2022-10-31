// s3/actions.ts
import { createReadStream } from "node:fs";
import { S3Wrapper } from ".";
import { accountAlias } from "../utils";
import type { Action } from "../utils";

const bucket = `my-bucket-${accountAlias}`;
const objectKey = "my-object.txt";
const objectBody = "My Body";
const binaryKey = "s3-logo.png";
const binaryPath = `${__dirname}/files/s3-logo.png`;

async function createBucket() {
  const s3 = new S3Wrapper();
  await s3.createBucket({ Bucket: bucket });
  return JSON.stringify(bucket, null, 2);
}

async function deleteBucket() {
  const s3 = new S3Wrapper();
  await s3.deleteAllObjects(bucket);
  await s3.deleteBucket({ Bucket: bucket });
  return JSON.stringify(bucket, null, 2);
}

async function deleteObject() {
  const s3 = new S3Wrapper();
  await s3.deleteObject({ Bucket: bucket, Key: objectKey });
  return JSON.stringify(objectKey, null, 2);
}

async function getObject() {
  const s3 = new S3Wrapper();
  const { Body } = await s3.getObject({ Bucket: bucket, Key: objectKey });
  const content = Body?.transformToString();
  return JSON.stringify(content, null, 2);
}

async function uploadBinary() {
  const s3 = new S3Wrapper();
  await s3.putObject({
    Bucket: bucket,
    Key: binaryKey,
    Body: createReadStream(binaryPath),
  });
  return JSON.stringify(binaryKey, null, 2);
}

async function uploadPlain() {
  const s3 = new S3Wrapper();
  await s3.putObject({ Bucket: bucket, Key: objectKey, Body: objectBody });
  return JSON.stringify(objectKey, null, 2);
}

const actions: Record<string, Action> = {
  createBucket,
  deleteBucket,
  deleteObject,
  getObject,
  uploadBinary,
  uploadPlain,
};

export default actions;
