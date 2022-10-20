// scripts/updateFunction.ts
import { FunctionWrapper } from "./wrappers";
import { funcName, jsCodeStr } from "./args";

async function main() {
  const wrapper = new FunctionWrapper();
  const result = await wrapper.updateFunctionCode(funcName, jsCodeStr);
  return result;
}

main()
  .then(res => {
    console.log(res);
  })
  .catch(error => {
    console.error(error);
  });
