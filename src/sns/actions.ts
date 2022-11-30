// sns/actions.ts
import { SNSWrapper } from ".";
import type { Action } from "../utils";

const topicArn =
  "arn:aws:sns:ap-northeast-1:512667299293:getting-started-sns-MyTopic-FbSo0hw4qq0p";
const subject = "Hello from Amazon SNS!";
const message = "Publishing a message to an SNS topic.";

async function publishMessage() {
  const sns = new SNSWrapper();
  const { MessageId, SequenceNumber } = await sns.publish({
    Message: message,
    Subject: subject,
    TopicArn: topicArn,
  });
  const result = { MessageId, SequenceNumber };
  return JSON.stringify(result, null, 2);
}

const actions: Record<string, Action> = {
  publishMessage,
};

export default actions;
