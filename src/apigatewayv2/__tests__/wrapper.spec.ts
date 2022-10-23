// apigatewayv2/__tests__/wrapper.spec.ts
import { ApiGatewayV2Wrapper } from "../wrapper";
import { isLocal } from "./utils";
import { apiName, routeKey } from "./dummy";

jest.setTimeout((isLocal ? 5 : 30) * 1000);

const apigatewayv2 = new ApiGatewayV2Wrapper();

describe("API APIs", () => {
  beforeEach(async () => {
    await apigatewayv2.deleteApisByPrefix(apiName);
  });

  afterAll(async () => {
    await apigatewayv2.deleteApisByPrefix(apiName);
  });

  const getNumberOfApis = async () => {
    const { Items } = await apigatewayv2.getApis({});
    return Items?.length ?? 0;
  };

  test("Create, get, list, and delete API", async () => {
    const numberOfApis = await getNumberOfApis();
    const { ApiId } = await apigatewayv2.createApi({
      Name: apiName,
      ProtocolType: "HTTP",
    });

    expect(await getNumberOfApis()).toBe(numberOfApis + 1);

    const { Name } = await apigatewayv2.getApi({ ApiId });

    expect(Name).toBe(apiName);

    await apigatewayv2.deleteApi({ ApiId });

    expect(await getNumberOfApis()).toBe(numberOfApis);
  });

  test("deleteApisByPrefix() helper", async () => {
    const numberOfApis = await getNumberOfApis();
    await apigatewayv2.createApi({ Name: apiName, ProtocolType: "HTTP" });

    expect(await getNumberOfApis()).toBe(numberOfApis + 1);

    await apigatewayv2.deleteApisByPrefix(apiName);

    expect(await getNumberOfApis()).toBe(numberOfApis);
  });

  test("getApiByName() helper", async () => {
    const { ApiId } = await apigatewayv2.createApi({
      Name: apiName,
      ProtocolType: "HTTP",
    });
    const api = await apigatewayv2.getApiByName(apiName);

    expect(api.ApiId).toBe(ApiId);
    await expect(apigatewayv2.getApiByName("NonExist")).rejects.toStrictEqual(
      expect.objectContaining({ message: "API not found: NonExist" })
    );
  });
});

describe("Route APIs", () => {
  beforeAll(async () => {
    await apigatewayv2.deleteApisByPrefix(apiName);
    await apigatewayv2.createApi({ Name: apiName, ProtocolType: "HTTP" });
  });

  beforeEach(async () => {
    const { ApiId } = await apigatewayv2.getApiByName(apiName);
    await apigatewayv2.deleteAllRoutes(ApiId);
  });

  afterAll(async () => {
    await apigatewayv2.deleteApisByPrefix(apiName);
  });

  const getNumberOfRoutes = async (ApiId?: string) => {
    const { Items } = await apigatewayv2.getRoutes({ ApiId });
    return Items?.length ?? 0;
  };

  test("Create, get, list, and delete Route", async () => {
    const { ApiId } = await apigatewayv2.getApiByName(apiName);

    expect(await getNumberOfRoutes(ApiId)).toBe(0);

    const { RouteId } = await apigatewayv2.createRoute({
      ApiId,
      RouteKey: routeKey,
    });

    expect(await getNumberOfRoutes(ApiId)).toBe(1);

    const { RouteKey } = await apigatewayv2.getRoute({ ApiId, RouteId });

    expect(RouteKey).toBe(routeKey);

    await apigatewayv2.deleteRoute({ ApiId, RouteId });

    expect(await getNumberOfRoutes(ApiId)).toBe(0);
  });

  test("deleteAllRoutes() helper", async () => {
    const { ApiId } = await apigatewayv2.getApiByName(apiName);

    expect(await getNumberOfRoutes(ApiId)).toBe(0);

    await apigatewayv2.createRoute({ ApiId, RouteKey: routeKey });

    expect(await getNumberOfRoutes(ApiId)).toBe(1);

    await apigatewayv2.deleteAllRoutes(ApiId);

    expect(await getNumberOfRoutes(ApiId)).toBe(0);
  });

  test("getRouteByKey() helper", async () => {
    const { ApiId } = await apigatewayv2.getApiByName(apiName);
    const { RouteId } = await apigatewayv2.createRoute({
      ApiId,
      RouteKey: routeKey,
    });
    const route = await apigatewayv2.getRouteByKey(routeKey, ApiId);

    expect(route.RouteId).toBe(RouteId);
    await expect(
      apigatewayv2.getRouteByKey("GET /non-exist", ApiId)
    ).rejects.toStrictEqual(
      expect.objectContaining({ message: "Route not found: GET /non-exist" })
    );
  });
});
