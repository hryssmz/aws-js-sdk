// apigatewayv2/__tests__/legacy.spec.ts
import {
  createApi,
  createRoute,
  deleteAllRoutes,
  deleteApi,
  deleteApisByPrefix,
  deleteRoute,
  getApi,
  getApiByName,
  getApis,
  getRoute,
  getRouteByKey,
  getRoutes,
} from "../legacy";
import { isLocal } from "./utils";
import { apiName, routeKey } from "./dummy";

jest.setTimeout((isLocal ? 5 : 30) * 1000);

describe("API APIs", () => {
  beforeEach(async () => {
    await deleteApisByPrefix(apiName);
  });

  afterAll(async () => {
    await deleteApisByPrefix(apiName);
  });

  const getNumberOfApis = async () => {
    const { Items } = await getApis({});
    return Items?.length ?? 0;
  };

  test("Create, get, list, and delete API", async () => {
    const numberOfApis = await getNumberOfApis();
    const { ApiId } = await createApi({ Name: apiName, ProtocolType: "HTTP" });

    expect(await getNumberOfApis()).toBe(numberOfApis + 1);

    const { Name } = await getApi({ ApiId });

    expect(Name).toBe(apiName);

    await deleteApi({ ApiId });

    expect(await getNumberOfApis()).toBe(numberOfApis);
  });

  test("deleteApisByPrefix() helper", async () => {
    const numberOfApis = await getNumberOfApis();
    await createApi({ Name: apiName, ProtocolType: "HTTP" });

    expect(await getNumberOfApis()).toBe(numberOfApis + 1);

    await deleteApisByPrefix(apiName);

    expect(await getNumberOfApis()).toBe(numberOfApis);
  });

  test("getApiByName() helper", async () => {
    const { ApiId } = await createApi({ Name: apiName, ProtocolType: "HTTP" });
    const api = await getApiByName(apiName);

    expect(api.ApiId).toBe(ApiId);
    await expect(getApiByName("NonExist")).rejects.toStrictEqual(
      expect.objectContaining({ message: "API not found: NonExist" })
    );
  });
});

describe("Route APIs", () => {
  beforeAll(async () => {
    await deleteApisByPrefix(apiName);
    await createApi({ Name: apiName, ProtocolType: "HTTP" });
  });

  beforeEach(async () => {
    const { ApiId } = await getApiByName(apiName);
    await deleteAllRoutes(ApiId);
  });

  afterAll(async () => {
    await deleteApisByPrefix(apiName);
  });

  const getNumberOfRoutes = async (ApiId?: string) => {
    const { Items } = await getRoutes({ ApiId });
    return Items?.length ?? 0;
  };

  test("Create, get, list, and delete Route", async () => {
    const { ApiId } = await getApiByName(apiName);

    expect(await getNumberOfRoutes(ApiId)).toBe(0);

    const { RouteId } = await createRoute({
      ApiId,
      RouteKey: routeKey,
    });

    expect(await getNumberOfRoutes(ApiId)).toBe(1);

    const { RouteKey } = await getRoute({ ApiId, RouteId });

    expect(RouteKey).toBe(routeKey);

    await deleteRoute({ ApiId, RouteId });

    expect(await getNumberOfRoutes(ApiId)).toBe(0);
  });

  test("deleteAllRoutes() helper", async () => {
    const { ApiId } = await getApiByName(apiName);

    expect(await getNumberOfRoutes(ApiId)).toBe(0);

    await createRoute({ ApiId, RouteKey: routeKey });

    expect(await getNumberOfRoutes(ApiId)).toBe(1);

    await deleteAllRoutes(ApiId);

    expect(await getNumberOfRoutes(ApiId)).toBe(0);
  });

  test("getRouteByKey() helper", async () => {
    const { ApiId } = await getApiByName(apiName);
    const { RouteId } = await createRoute({
      ApiId,
      RouteKey: routeKey,
    });
    const route = await getRouteByKey(routeKey, ApiId);

    expect(route.RouteId).toBe(RouteId);
    await expect(getRouteByKey("GET /non-exist", ApiId)).rejects.toStrictEqual(
      expect.objectContaining({ message: "Route not found: GET /non-exist" })
    );
  });
});
