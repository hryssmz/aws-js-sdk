// iam/__tests__/scenarios/manageAccount.spec.ts
import { IAMWrapper } from "../..";
import { userName } from "../dummy";
import { accountAlias, isLocal } from "../utils";

jest.setTimeout((isLocal ? 5 : 30) * 1000);

const iam = new IAMWrapper();

beforeAll(async () => {
  await iam.deleteUsersByPrefix(userName);
  await iam.createUser({ UserName: userName });
});

afterAll(async () => {
  await iam.createAccountAlias({ AccountAlias: accountAlias });
  await iam.deleteUsersByPrefix(userName);
});

test("Manage your IAM account", async () => {
  const alias2 = `${accountAlias}2`;

  // Create a new account alias.
  await iam.createAccountAlias({ AccountAlias: alias2 });

  // List account aliases.
  const listCurrentAccountAliases = async () => {
    const { AccountAliases } = await iam.listAccountAliases({});
    return AccountAliases;
  };

  expect(await listCurrentAccountAliases()).toStrictEqual([alias2]);

  // Delete account alias.
  await iam.deleteAccountAlias({ AccountAlias: alias2 });

  expect(await listCurrentAccountAliases()).toStrictEqual([]);

  // Generate a credential report.
  await iam.generateCredentialReport({});

  // Get the credential report.
  const { Content } = await iam.getCredentialReport({});
  const [header, ...body] = Buffer.from(Content ?? [])
    .toString()
    .trimEnd()
    .split("\n")
    .map(row => row.split(","));

  expect(header[0]).toBe("user");
  expect(body.findIndex(row => row[0] === userName)).toBeGreaterThan(-1);

  // Get an account summary.
  const { SummaryMap } = await iam.getAccountSummary({});

  expect(SummaryMap?.Groups).toBeGreaterThanOrEqual(0);
  expect(SummaryMap?.Users).toBeGreaterThanOrEqual(1);

  // Get authorization details.
  const { UserDetailList, Policies } = await iam.getAccountAuthorizationDetails(
    {}
  );

  expect(
    UserDetailList?.findIndex(({ UserName }) => UserName === userName)
  ).toBeGreaterThan(-1);
  expect(
    Policies?.findIndex(
      ({ PolicyName }) => PolicyName === "AdministratorAccess"
    )
  ).toBeGreaterThan(-1);
});
