// scripts/deleteUser.ts
import { UserWrapper } from "./wrappers";

async function main() {
  const userName = process.argv[2];
  if (userName === undefined) {
    throw new Error("Must provide user name!");
  }
  const wrapper = new UserWrapper();
  const result = await wrapper.deleteUser(userName);
  return result;
}

main()
  .then(res => {
    console.log(res);
  })
  .catch(error => {
    console.error(error);
  });
