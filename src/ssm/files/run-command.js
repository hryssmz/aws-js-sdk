const {
  GetCommandInvocationCommand,
  SendCommandCommand,
  SSMClient,
} = require("@aws-sdk/client-ssm");

const sendCommand = async (instanceId, roleName) => {
  const client = new SSMClient();
  const command = new SendCommandCommand({
    DocumentName: "AWS-RunShellScript",
    InstanceIds: [instanceId],
    Parameters: {
      commands: [
        [
          'TOKEN=`curl -s -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600"`',
          `curl -s -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/iam/security-credentials/${roleName}`,
        ].join(" && "),
      ],
    },
  });
  const { Command } = await client.send(command);
  return Command;
};

const getCommandInvocation = async (commandId, instanceId) => {
  const statuses = ["Delayed", "Success", "Cancelled", "Failed", "TimedOut"];
  const client = new SSMClient();
  const command = new GetCommandInvocationCommand({
    CommandId: commandId,
    InstanceId: instanceId,
  });
  for (let i = 0; i < 20; i++) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const { Status, StandardOutputContent } = await client.send(command);
    if (statuses.indexOf(Status) > -1) {
      return StandardOutputContent;
    }
  }
};

const handler = async () => {
  const instanceId = "i-035c05a2fdb7a42ef";
  const roleName = "fastapi-server-EC2InstanceRole-ap-northeast-1";
  const command = await sendCommand(instanceId, roleName);
  const output = await getCommandInvocation(command.CommandId, instanceId);
  return output;
};

handler().then(console.log);
