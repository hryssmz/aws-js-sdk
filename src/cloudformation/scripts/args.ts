// cloudformation/scripts/args.ts
import type { Parameter } from "@aws-sdk/client-cloudformation";

export const stackName = "MyStack";
export const templatePath = `${__dirname}/files/template.yaml`;
export const parameters: Parameter[] = [
  // { ParameterKey: "InstanceType", ParameterValue: "t1.micro" },
  // { ParameterKey: "KeyName", ParameterValue: "my-key-pair" },
];
