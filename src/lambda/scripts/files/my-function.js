exports.handler = async function () {
  const data = {
    message: "Hello World",
    date: new Date(),
  };
  const headers = {
    "x-custom-header": "my custom header value",
  };
  const response = {
    statusCode: 200,
    headers,
    body: JSON.stringify(data),
  };
  return response;
};
