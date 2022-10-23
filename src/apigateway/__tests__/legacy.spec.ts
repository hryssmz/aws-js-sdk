// apigateway/__tests__/legacy.spec.ts
import {
  createResource,
  createRestApi,
  deleteAllMethods,
  deleteAllResources,
  deleteMethod,
  deleteResource,
  deleteRestApi,
  deleteRestApisByPrefix,
  getMethod,
  getResource,
  getResourceByPath,
  getResources,
  getRestApi,
  getRestApiByName,
  getRestApis,
  putMethod,
} from "../legacy";
import { httpMethod, pathPart, restApiName } from "./dummy";
import { isLocal } from "./utils";

jest.setTimeout((isLocal ? 5 : 120) * 1000);

describe("Rest API APIs", () => {
  beforeEach(async () => {
    await deleteRestApisByPrefix(restApiName);
  });

  afterAll(async () => {
    await deleteRestApisByPrefix(restApiName);
  });

  const getNumberOfRestApis = async () => {
    const { items } = await getRestApis({});
    return items?.length ?? 0;
  };

  test("Create, get, list, and delete Rest API", async () => {
    const numberOfRestApis = await getNumberOfRestApis();
    const { id } = await createRestApi({ name: restApiName });

    expect(await getNumberOfRestApis()).toBe(numberOfRestApis + 1);

    const { name } = await getRestApi({ restApiId: id });

    expect(name).toBe(restApiName);

    await deleteRestApi({ restApiId: id });

    expect(await getNumberOfRestApis()).toBe(numberOfRestApis);
  });

  test("deleteRestApisByPrefix() helper", async () => {
    const numberOfRestApis = await getNumberOfRestApis();
    await createRestApi({ name: restApiName });

    expect(await getNumberOfRestApis()).toBe(numberOfRestApis + 1);

    await deleteRestApisByPrefix(restApiName);

    expect(await getNumberOfRestApis()).toBe(numberOfRestApis);
  });

  test("getRestApiByName() helper", async () => {
    const { id } = await createRestApi({ name: restApiName });
    const restApi = await getRestApiByName(restApiName);

    expect(restApi.id).toBe(id);
    await expect(getRestApiByName("NonExist")).rejects.toStrictEqual(
      expect.objectContaining({ message: "REST API not found: NonExist" })
    );
  });
});

describe("Resource APIs", () => {
  beforeAll(async () => {
    await deleteRestApisByPrefix(restApiName);
    await createRestApi({ name: restApiName });
  });

  beforeEach(async () => {
    const { id } = await getRestApiByName(restApiName);
    await deleteAllResources(id);
  });

  afterAll(async () => {
    await deleteRestApisByPrefix(restApiName);
  });

  const getNumberOfResources = async (restApiId?: string) => {
    const { items } = await getResources({ restApiId });
    return items?.length ?? 0;
  };

  test("Create, get, list, and delete Resource", async () => {
    const { id: restApiId } = await getRestApiByName(restApiName);
    const { id: parentId } = await getResourceByPath("/", restApiId);

    expect(await getNumberOfResources(restApiId)).toBe(1);

    const { id: resourceId } = await createResource({
      restApiId,
      parentId,
      pathPart,
    });

    expect(await getNumberOfResources(restApiId)).toBe(2);

    const { path } = await getResource({ restApiId, resourceId });

    expect(path).toBe(`/${pathPart}`);

    await deleteResource({ restApiId, resourceId });

    expect(await getNumberOfResources(restApiId)).toBe(1);
  });

  test("deleteAllResources() helper", async () => {
    const { id: restApiId } = await getRestApiByName(restApiName);
    const { id: parentId } = await getResourceByPath("/", restApiId);
    await createResource({ restApiId, parentId, pathPart });

    expect(await getNumberOfResources(restApiId)).toBe(2);

    await deleteAllResources(restApiId);

    expect(await getNumberOfResources(restApiId)).toBe(1);
  });

  test("getResourceByPath() helper", async () => {
    const { id: restApiId } = await getRestApiByName(restApiName);
    const { id: parentId } = await getResourceByPath("/", restApiId);
    const { id: resourceId } = await createResource({
      restApiId,
      parentId,
      pathPart,
    });
    const { id: resourceId2 } = await getResourceByPath(
      `/${pathPart}`,
      restApiId
    );

    expect(resourceId2).toBe(resourceId);
    await expect(
      getResourceByPath("/non-exist", restApiId)
    ).rejects.toStrictEqual(
      expect.objectContaining({
        message: "Resource path not found: /non-exist",
      })
    );
  });
});

describe("Method APIs", () => {
  beforeAll(async () => {
    await deleteRestApisByPrefix(restApiName);
    await createRestApi({ name: restApiName });
  });

  beforeEach(async () => {
    const { id: restApiId } = await getRestApiByName(restApiName);
    const { id: resourceId } = await getResourceByPath("/", restApiId);
    await deleteAllMethods(restApiId, resourceId);
  });

  afterAll(async () => {
    await deleteRestApisByPrefix(restApiName);
  });

  const listMethodNames = async (restApiId?: string, resourceId?: string) => {
    const { resourceMethods } = await getResource({
      restApiId,
      resourceId,
    });
    const methodNames = Object.keys(resourceMethods ?? {});
    return methodNames;
  };

  test("Create, get, and delete Method", async () => {
    const { id: restApiId } = await getRestApiByName(restApiName);
    const { id: resourceId } = await getResourceByPath("/", restApiId);

    expect(await listMethodNames(restApiId, resourceId)).toStrictEqual([]);

    await putMethod({
      restApiId,
      resourceId,
      httpMethod,
      authorizationType: "NONE",
    });

    expect(await listMethodNames(restApiId, resourceId)).toStrictEqual([
      httpMethod,
    ]);

    const method = await getMethod({ restApiId, resourceId, httpMethod });

    expect(method.httpMethod).toBe(httpMethod);
    expect(method.authorizationType).toBe("NONE");

    await deleteMethod({ restApiId, resourceId, httpMethod });

    expect(await listMethodNames(restApiId, resourceId)).toStrictEqual([]);
  });

  test("deleteAllMethods() helper", async () => {
    const { id: restApiId } = await getRestApiByName(restApiName);
    const { id: resourceId } = await getResourceByPath("/", restApiId);

    await putMethod({
      restApiId,
      resourceId,
      httpMethod,
      authorizationType: "NONE",
    });

    expect(await listMethodNames(restApiId, resourceId)).toStrictEqual([
      httpMethod,
    ]);

    await deleteAllMethods(restApiId, resourceId);

    expect(await listMethodNames(restApiId, resourceId)).toStrictEqual([]);
  });
});
