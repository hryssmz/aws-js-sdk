// s3/actions.ts
import { createReadStream } from "node:fs";
import { S3Wrapper } from ".";
import { jsonSerialize } from "../utils";
import type { Action } from "../utils";

const bucket = `hryssmz`;
const objectKey = "test-object.txt";
const objectBody = "My Body";
const binaryKey = "s3-logo.png";
const binaryPath = `${__dirname}/../../src/s3/files/s3-logo.png`;

async function createBucket() {
  const s3 = new S3Wrapper();
  await s3.createBucket({ Bucket: bucket });
  return jsonSerialize(bucket);
}

async function deleteBucket() {
  const s3 = new S3Wrapper();
  await s3.deleteAllObjects(bucket);
  await s3.deleteBucket({ Bucket: bucket });
  return jsonSerialize(bucket);
}

async function deleteObject() {
  const s3 = new S3Wrapper();
  await s3.deleteObject({ Bucket: bucket, Key: objectKey });
  return jsonSerialize(objectKey);
}

async function deleteObjectVersions() {
  const s3 = new S3Wrapper();
  const { Versions } = await s3.listObjectVersions({
    Bucket: bucket,
    Prefix: objectKey,
  });
  const { Deleted } = await s3.deleteObjects({
    Bucket: bucket,
    Delete: {
      Objects: Versions?.map(({ Key, VersionId }) => ({ Key, VersionId })),
    },
    BypassGovernanceRetention: true,
  });
  return jsonSerialize(Deleted);
}

async function emptyBucket() {
  const s3 = new S3Wrapper();
  await s3.deleteAllObjects(bucket);
  return jsonSerialize(bucket);
}

async function getObject() {
  const s3 = new S3Wrapper();
  const { Body } = await s3.getObject({ Bucket: bucket, Key: objectKey });
  const content = Body?.transformToString();
  return jsonSerialize(content);
}

async function getObjectRetention() {
  const s3 = new S3Wrapper();
  const { Retention } = await s3.getObjectRetention({
    Bucket: bucket,
    Key: objectKey,
  });
  return jsonSerialize(Retention);
}

async function listBuckets() {
  const s3 = new S3Wrapper();
  const { Buckets } = await s3.listBuckets({});
  const buckets = Buckets?.map(bucket => bucket.Name);
  return jsonSerialize(buckets);
}

async function listObjectVersions() {
  const s3 = new S3Wrapper();
  const { Versions } = await s3.listObjectVersions({
    Bucket: bucket,
    Prefix: objectKey,
  });
  const result = Versions?.map(({ Key, VersionId }) => ({ Key, VersionId }));
  return jsonSerialize(result);
}

async function uploadBinary() {
  const s3 = new S3Wrapper();
  await s3.putObject({
    Bucket: bucket,
    Key: binaryKey,
    Body: createReadStream(binaryPath),
  });
  return jsonSerialize(binaryKey);
}

async function uploadPlain() {
  const s3 = new S3Wrapper();
  await s3.putObject({
    Bucket: bucket,
    Key: objectKey,
    Body: objectBody,
    // StorageClass: "DEEP_ARCHIVE",
  });
  return jsonSerialize(objectKey);
}

const actions: Record<string, Action> = {
  createBucket,
  deleteBucket,
  deleteObject,
  deleteObjectVersions,
  emptyBucket,
  getObject,
  getObjectRetention,
  listBuckets,
  listObjectVersions,
  uploadBinary,
  uploadPlain,
};

export default actions;
