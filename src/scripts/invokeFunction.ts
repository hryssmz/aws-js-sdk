// scripts/invokeFunction.ts
import { FunctionWrapper } from "./wrappers";
import { funcName, payload } from "./args";

async function main() {
  const wrapper = new FunctionWrapper();
  const result = await wrapper.invokeFunction(
    funcName,
    JSON.stringify(payload)
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
