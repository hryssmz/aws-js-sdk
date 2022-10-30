// lambda/scripts/createLambdaRole.ts
import { IAMWrapper } from "../../iam";
import { lambdaPolicyArn, lambdaRoleName } from "./args";

async function main() {
  const iam = new IAMWrapper();
  const { Role } = await iam.createRole({
    RoleName: lambdaRoleName,
    AssumeRolePolicyDocument: JSON.stringify({
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Allow",
          Principal: { Service: "lambda.amazonaws.com" },
          Action: "sts:AssumeRole",
        },
      ],
    }),
  });
  await iam.attachRolePolicy({
    PolicyArn: lambdaPolicyArn,
    RoleName: lambdaRoleName,
  });
  return Role?.Arn;
}

main()
  .then(res => {
    console.log(res);
  })
  .catch(error => {
    console.error(error);
  });
