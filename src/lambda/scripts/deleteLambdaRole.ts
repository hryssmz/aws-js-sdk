// lambda/scripts/deleteLambdaRole.ts
import { IAMWrapper } from "../../iam";
import { lambdaPolicyArn, lambdaRoleName } from "./args";

async function main() {
  const iam = new IAMWrapper();
  await iam.detachRolePolicy({
    PolicyArn: lambdaPolicyArn,
    RoleName: lambdaRoleName,
  });
  await iam.deleteRole({ RoleName: lambdaRoleName });
  return lambdaRoleName;
}

main()
  .then(res => {
    console.log(res);
  })
  .catch(error => {
    console.error(error);
  });
