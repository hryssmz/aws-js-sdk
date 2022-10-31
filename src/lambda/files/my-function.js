"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const handler = async (event, context) => {
  console.log(new Date());
  const body = {
    path: event.path,
    logStreamName: context.logStreamName,
    message: "Hello World",
  };
  const headers = {
    "X-Custom-Header": "My custom value",
  };
  const response = {
    statusCode: 200,
    headers,
    body: JSON.stringify(body),
  };
  return response;
};
exports.handler = handler;
