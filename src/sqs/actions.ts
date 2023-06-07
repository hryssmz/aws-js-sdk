// sqs/actions.ts
import { SQSWrapper } from ".";
import type { Action } from "../utils";

const message = "Hello World!";
const queueName = "first-queue-Queue";

async function purgeQueue() {
  const sqs = new SQSWrapper();
  const { QueueUrl } = await sqs.getQueueUrl({ QueueName: queueName });
  await sqs.purgeQueue({ QueueUrl });
  return JSON.stringify(QueueUrl, null, 2);
}

async function receiveMessage() {
  const sqs = new SQSWrapper();
  const { QueueUrl } = await sqs.getQueueUrl({ QueueName: queueName });
  const { Messages } = await sqs.receiveMessage({ QueueUrl });
  const promises =
    Messages?.map(async ({ ReceiptHandle }) => {
      await sqs.deleteMessage({ QueueUrl, ReceiptHandle });
    }) ?? [];
  await Promise.all(promises);
  return JSON.stringify(Messages, null, 2);
}

async function sendMessage() {
  const sqs = new SQSWrapper();
  const { QueueUrl } = await sqs.getQueueUrl({ QueueName: queueName });
  const { MessageId, SequenceNumber } = await sqs.sendMessage({
    MessageBody: message,
    QueueUrl,
  });
  const result = { MessageId, SequenceNumber };
  return JSON.stringify(result, null, 2);
}

const actions: Record<string, Action> = {
  purgeQueue,
  receiveMessage,
  sendMessage,
};

export default actions;
