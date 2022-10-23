// apigateway/__tests__/wrapper.spec.ts
import { APIGatewayWrapper } from "../wrapper";
import { httpMethod, pathPart, restApiName } from "./dummy";
import { isLocal } from "./utils";

jest.setTimeout((isLocal ? 5 : 120) * 1000);

const apigateway = new APIGatewayWrapper();

describe("Rest API APIs", () => {
  beforeEach(async () => {
    await apigateway.deleteRestApisByPrefix(restApiName);
  });

  afterAll(async () => {
    await apigateway.deleteRestApisByPrefix(restApiName);
  });

  const getNumberOfRestApis = async () => {
    const { items } = await apigateway.getRestApis({});
    return items?.length ?? 0;
  };

  test("Create, get, list, and delete Rest API", async () => {
    const numberOfRestApis = await getNumberOfRestApis();
    const { id } = await apigateway.createRestApi({ name: restApiName });

    expect(await getNumberOfRestApis()).toBe(numberOfRestApis + 1);

    const { name } = await apigateway.getRestApi({ restApiId: id });

    expect(name).toBe(restApiName);

    await apigateway.deleteRestApi({ restApiId: id });

    expect(await getNumberOfRestApis()).toBe(numberOfRestApis);
  });

  test("deleteRestApisByPrefix() helper", async () => {
    const numberOfRestApis = await getNumberOfRestApis();
    await apigateway.createRestApi({ name: restApiName });

    expect(await getNumberOfRestApis()).toBe(numberOfRestApis + 1);

    await apigateway.deleteRestApisByPrefix(restApiName);

    expect(await getNumberOfRestApis()).toBe(numberOfRestApis);
  });

  test("getRestApiByName() helper", async () => {
    const { id } = await apigateway.createRestApi({ name: restApiName });
    const restApi = await apigateway.getRestApiByName(restApiName);

    expect(restApi.id).toBe(id);
    await expect(apigateway.getRestApiByName("NonExist")).rejects.toStrictEqual(
      expect.objectContaining({ message: "REST API not found: NonExist" })
    );
  });
});

describe("Resource APIs", () => {
  beforeAll(async () => {
    await apigateway.deleteRestApisByPrefix(restApiName);
    await apigateway.createRestApi({ name: restApiName });
  });

  beforeEach(async () => {
    const { id } = await apigateway.getRestApiByName(restApiName);
    await apigateway.deleteAllResources(id);
  });

  afterAll(async () => {
    await apigateway.deleteRestApisByPrefix(restApiName);
  });

  const getNumberOfResources = async (restApiId?: string) => {
    const { items } = await apigateway.getResources({ restApiId });
    return items?.length ?? 0;
  };

  test("Create, get, list, and delete Resource", async () => {
    const { id: restApiId } = await apigateway.getRestApiByName(restApiName);
    const { id: parentId } = await apigateway.getResourceByPath("/", restApiId);

    expect(await getNumberOfResources(restApiId)).toBe(1);

    const { id: resourceId } = await apigateway.createResource({
      restApiId,
      parentId,
      pathPart,
    });

    expect(await getNumberOfResources(restApiId)).toBe(2);

    const { path } = await apigateway.getResource({ restApiId, resourceId });

    expect(path).toBe(`/${pathPart}`);

    await apigateway.deleteResource({ restApiId, resourceId });

    expect(await getNumberOfResources(restApiId)).toBe(1);
  });

  test("deleteAllResources() helper", async () => {
    const { id: restApiId } = await apigateway.getRestApiByName(restApiName);
    const { id: parentId } = await apigateway.getResourceByPath("/", restApiId);
    await apigateway.createResource({
      restApiId,
      parentId,
      pathPart,
    });

    expect(await getNumberOfResources(restApiId)).toBe(2);

    await apigateway.deleteAllResources(restApiId);

    expect(await getNumberOfResources(restApiId)).toBe(1);
  });

  test("getResourceByPath() helper", async () => {
    const { id: restApiId } = await apigateway.getRestApiByName(restApiName);
    const { id: parentId } = await apigateway.getResourceByPath("/", restApiId);
    const { id: resourceId } = await apigateway.createResource({
      restApiId,
      parentId,
      pathPart,
    });
    const { id: resourceId2 } = await apigateway.getResourceByPath(
      `/${pathPart}`,
      restApiId
    );

    expect(resourceId2).toBe(resourceId);
    await expect(
      apigateway.getResourceByPath("/non-exist", restApiId)
    ).rejects.toStrictEqual(
      expect.objectContaining({
        message: "Resource path not found: /non-exist",
      })
    );
  });
});

describe("Method APIs", () => {
  beforeAll(async () => {
    await apigateway.deleteRestApisByPrefix(restApiName);
    await apigateway.createRestApi({ name: restApiName });
  });

  beforeEach(async () => {
    const { id: restApiId } = await apigateway.getRestApiByName(restApiName);
    const { id: resourceId } = await apigateway.getResourceByPath(
      "/",
      restApiId
    );
    await apigateway.deleteAllMethods(restApiId, resourceId);
  });

  afterAll(async () => {
    await apigateway.deleteRestApisByPrefix(restApiName);
  });

  const listMethodNames = async (restApiId?: string, resourceId?: string) => {
    const { resourceMethods } = await apigateway.getResource({
      restApiId,
      resourceId,
    });
    const methodNames = Object.keys(resourceMethods ?? {});
    return methodNames;
  };

  test("Create, get, and delete Method", async () => {
    const { id: restApiId } = await apigateway.getRestApiByName(restApiName);
    const { id: resourceId } = await apigateway.getResourceByPath(
      "/",
      restApiId
    );

    expect(await listMethodNames(restApiId, resourceId)).toStrictEqual([]);

    await apigateway.putMethod({
      restApiId,
      resourceId,
      httpMethod,
      authorizationType: "NONE",
    });

    expect(await listMethodNames(restApiId, resourceId)).toStrictEqual([
      httpMethod,
    ]);

    const method = await apigateway.getMethod({
      restApiId,
      resourceId,
      httpMethod,
    });

    expect(method.httpMethod).toBe(httpMethod);
    expect(method.authorizationType).toBe("NONE");

    await apigateway.deleteMethod({ restApiId, resourceId, httpMethod });

    expect(await listMethodNames(restApiId, resourceId)).toStrictEqual([]);
  });

  test("deleteAllMethods() helper", async () => {
    const { id: restApiId } = await apigateway.getRestApiByName(restApiName);
    const { id: resourceId } = await apigateway.getResourceByPath(
      "/",
      restApiId
    );

    await apigateway.putMethod({
      restApiId,
      resourceId,
      httpMethod,
      authorizationType: "NONE",
    });

    expect(await listMethodNames(restApiId, resourceId)).toStrictEqual([
      httpMethod,
    ]);

    await apigateway.deleteAllMethods(restApiId, resourceId);

    expect(await listMethodNames(restApiId, resourceId)).toStrictEqual([]);
  });
});
