// kinesis/actions.ts
import { KinesisWrapper } from ".";
import type { Action } from "../utils";

const streamName = "first-stream-Stream";
const records = Array(5)
  .fill(0)
  .map((_, i) => i + Math.floor(Number(new Date()) / 1000))
  .map(i => ({ partitionKey: `${i % 2}`, data: `${i}` }));
const shardId = "shardId-000000000000";
const shardIterator =
  "AAAAAAAAAAGO/gEssBaRGayc9sMXt1yFtH4rDoUdzjkjsz6sM684W5MbWCO6GvWYl1JFVbCKIM+5bOwrzZ9ZdSiklzU9AAzhb175HYRo5Z8wL4w3qZr/xXOUL1MJmtu7qJZmK22ZHH9vZfnglmdYStN7XDf+EwWD2w1eyEqqM6JAIHjLwzp6zW4s6KD3Hitzyc3O0F/D+cc/caWkcGDsdpC+P1Z1+I98FqTeAHv3AO7fhw8v9teba1cNxS3Qgm7okBD5VZG5O4s=";

async function getRecords() {
  const kinesis = new KinesisWrapper();
  const { NextShardIterator, Records = [] } = await kinesis.getRecords({
    ShardIterator: shardIterator,
    Limit: 3,
  });
  const result = {
    NextShardIterator,
    Records: Records.map(({ Data, PartitionKey }) => ({
      Data: Buffer.from(Data ?? []).toString(),
      PartitionKey,
    })),
  };
  return JSON.stringify(result, null, 2);
}

async function getShardIterator() {
  const kinesis = new KinesisWrapper();
  const { ShardIterator = "" } = await kinesis.getShardIterator({
    ShardId: shardId,
    StreamName: streamName,
    ShardIteratorType: "TRIM_HORIZON",
  });
  return ShardIterator;
}

async function putRecords() {
  const kinesis = new KinesisWrapper();
  const { Records = [] } = await kinesis.putRecords({
    Records: records.map(({ partitionKey, data }) => ({
      PartitionKey: partitionKey,
      Data: Buffer.from(data, "utf8"),
    })),
  });
  const result = Records.map(({ ShardId, SequenceNumber }) => ({
    ShardId,
    SequenceNumber,
  }));
  return JSON.stringify(result, null, 2);
}

const actions: Record<string, Action> = {
  getRecords,
  getShardIterator,
  putRecords,
};

export default actions;
