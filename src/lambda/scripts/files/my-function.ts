import type {
  APIGatewayEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";

export const handler = async (
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  console.log(new Date());
  const body = {
    path: event.path,
    logStreamName: context.logStreamName,
    message: "Hello World",
  };
  const headers = {
    "X-Custom-Header": "My custom value",
  };
  const response: APIGatewayProxyResult = {
    statusCode: 200,
    headers,
    body: JSON.stringify(body),
  };
  return response;
};
