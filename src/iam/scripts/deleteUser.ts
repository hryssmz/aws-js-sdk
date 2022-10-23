// iam/scripts/deleteUser.ts
import { IAMWrapper } from "..";

async function main() {
  const userName = process.argv[2];
  if (userName === undefined) {
    throw new Error("Must provide user name!");
  }
  const iam = new IAMWrapper();
  await detachAllUserPolicies(userName, iam);
  await iam.deleteAllUserPolicies(userName);
  await iam.deleteUser({ UserName: userName });
  return userName;
}

async function detachAllUserPolicies(
  UserName?: string,
  iam = new IAMWrapper()
) {
  const handlePolicyError = async (
    error: Error,
    PolicyArn?: string,
    PolicyName?: string
  ) => {
    if (
      PolicyArn !== undefined &&
      PolicyName !== undefined &&
      error.name === "NoSuchEntityException" &&
      error.message.includes(PolicyArn)
    ) {
      const arnList = PolicyArn.split(":");
      const resource = arnList[arnList.length - 1];
      const Path = resource
        .replace(/^policy/, "")
        .replace(new RegExp(PolicyName + "$"), "");
      await iam.createPolicy({
        PolicyName,
        Path,
        PolicyDocument: JSON.stringify({
          Version: "2012-10-17",
          Statement: [
            { Effect: "Allow", Action: "s3:GetObject", Resource: "*" },
          ],
        }),
      });
      const result = await iam.detachUserPolicy({ UserName, PolicyArn });
      await iam.deletePolicy({ PolicyArn });
      return result;
    } else {
      throw error;
    }
  };
  const { AttachedPolicies } = await iam.listAttachedUserPolicies({
    UserName,
  });
  const promises =
    AttachedPolicies?.map(async ({ PolicyArn, PolicyName }) => {
      const result = await iam
        .detachUserPolicy({
          UserName,
          PolicyArn,
        })
        .catch(async error => {
          const result = await handlePolicyError(error, PolicyArn, PolicyName);
          return result;
        });
      return result;
      /* c8 ignore next */
    }) ?? [];
  const results = await Promise.all(promises);
  return results;
}

main()
  .then(res => {
    console.log(res);
  })
  .catch(error => {
    console.error(error);
  });
