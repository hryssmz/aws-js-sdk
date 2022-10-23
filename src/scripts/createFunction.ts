// scripts/createFunction.ts
import { FunctionWrapper } from "./wrappers";
import { funcName, jsCodeStr, lambdaRoleName } from "./args";

async function main() {
  const wrapper = new FunctionWrapper();
  // await wrapper.createLambdaRole(roleName);
  const result = await wrapper.createFunction(
    funcName,
    lambdaRoleName,
    jsCodeStr
  );
  return result;
}

main()
  .then(res => {
    console.log(res);
  })
  .catch(error => {
    console.error(error);
  });
