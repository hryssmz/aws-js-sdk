const https = require("node:https");
const querystring = require("node:querystring");

exports.handler = async event => {
  console.log(JSON.stringify(event, null, 2));
  const { domainName } = event.requestContext;
  const { code } = event.queryStringParameters ?? {};
  const hostname = process.env.TOKEN_ENDPOINT_HOST;
  const clientId = process.env.CLIENT_ID;
  const redirectUri = `https://${domainName}/`;
  if (!code) {
    const location = `https://${hostname}/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`;
    return { statusCode: 303, headers: { Location: location }, body: "null" };
  }

  const reqBody = {
    grant_type: "authorization_code",
    redirect_uri: redirectUri,
    client_id: clientId,
    code,
  };
  const headers = { "Content-Type": "application/x-www-form-urlencoded" };
  const data = await new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: process.env.TOKEN_ENDPOINT_HOST,
        port: 443,
        path: "/oauth2/token",
        method: "POST",
        headers,
      },
      res => {
        const chunks = [];
        res.on("data", chunk => {
          chunks.push(chunk);
        });
        res.on("error", error => {
          reject(error.message);
        });
        res.on("end", () => {
          const data = JSON.parse(Buffer.concat(chunks).toString("utf8"));
          resolve(data);
        });
      },
    );
    req.on("error", e => {
      reject(e.message);
    });
    req.write(querystring.stringify(reqBody));
    req.end();
  });
  const { access_token, id_token } = data;
  if (access_token) {
    data.access_token_payload = JSON.parse(
      Buffer.from(access_token.split(".")[1], "base64").toString(),
    );
  }
  if (id_token) {
    data.id_token_payload = JSON.parse(
      Buffer.from(id_token.split(".")[1], "base64").toString(),
    );
  }
  return {
    statusCode: 200,
    headers: { "Access-Control-Allow-Origin": "*" },
    body: JSON.stringify(data, null, 2),
  };
};
