const crypto = require("node:crypto");
const https = require("node:https");

const putObject = async (bucket, key, body) => {
  const service = "s3";
  const baseUrl = `https://${bucket}.${service}.amazonaws.com/${key}`;
  const httpMethod = "PUT";
  const headers = {};
  return createSignedHeaders(baseUrl, httpMethod, headers, body, service);
};

const createLogGroup = async logGroupName => {
  const region = process.env.AWS_DEFAULT_REGION;
  const service = "logs";
  const baseUrl = `https://${service}.${region}.amazonaws.com`;
  const httpMethod = "POST";
  const headers = {
    "X-Amz-Target": "Logs_20140328.CreateLogGroup",
    "Content-Type": "application/x-amz-json-1.1",
  };
  const body = { logGroupName };
  return createSignedHeaders(
    baseUrl,
    httpMethod,
    headers,
    JSON.stringify(body, null, 2),
    service,
  );
};

const createSignedHeaders = async (
  baseUrl,
  httpMethod,
  headers,
  body,
  service,
) => {
  const url = new URL(baseUrl);
  const { hostname, pathname, searchParams } = url;
  const accessKey = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const sessionToken = process.env.AWS_SESSION_TOKEN;
  const region = process.env.AWS_DEFAULT_REGION;
  const isoDate = new Date().toISOString();
  const [yyyy, MM, dd] = isoDate.split("T")[0].split("-");
  const [HH, mm, ss] = isoDate.split("T")[1].split(".")[0].split(":");
  const headerLowerCase = Object.entries(headers).reduce(
    (acc, [key, value]) => ({ ...acc, [key.toLowerCase()]: value }),
    {},
  );
  const headersToSign = {
    ...headerLowerCase,
    host: hostname,
    "x-amz-date": `${yyyy}${MM}${dd}T${HH}${mm}${ss}Z`,
    "x-amz-content-sha256": crypto
      .createHash("sha256")
      .update(body)
      .digest("hex"),
  };
  if (sessionToken !== undefined) {
    Object.assign(headersToSign, { "x-amz-security-token": sessionToken });
  }

  // Step 1: Create a canonical request
  const canonicalUri =
    service === "s3" ? encodeURI(pathname) : encodeURIComponent(pathname);
  const canonicalQueryString = [...searchParams.entries()]
    .sort(([keyA, valueA], [keyB, valueB]) =>
      keyA.localeCompare(keyB) !== 0
        ? keyA.localeCompare(keyB)
        : valueA.localeCompare(valueB),
    )
    .reduce((acc, [key, value]) => {
      return `${acc}&${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    }, "");
  const canonicalHeaders = Object.keys(headersToSign)
    .sort((a, b) => a.localeCompare(b))
    .reduce((acc, key) => {
      return [...acc, `${key}:${headersToSign[key].trim()}`];
    }, [])
    .join("\n");
  const signedHeaders = Object.keys(headersToSign)
    .sort((a, b) => a.localeCompare(b))
    .join(";");
  const hashedPayload = crypto.createHash("sha256").update(body).digest("hex");
  const canonicalRequest = [
    httpMethod,
    canonicalUri,
    canonicalQueryString,
    canonicalHeaders,
    signedHeaders,
    hashedPayload,
  ].join("\n");

  // Step 2: Create a hash of the canonical request
  const hashedCanonicalRequest = crypto
    .createHash("sha256")
    .update(canonicalRequest)
    .digest("hex");

  // Step 3: Create a string to sign
  const algorithm = "AWS4-HMAC-SHA256";
  const requestDateTime = `${yyyy}${MM}${dd}T${HH}${mm}${ss}Z`;
  const credentialScope = `${yyyy}${MM}${dd}/${region}/${service}/aws4_request`;
  const stringToSign = [
    algorithm,
    requestDateTime,
    credentialScope,
    hashedCanonicalRequest,
  ].join("\n");

  // Step 4: Calculate the signature
  const dateKey = crypto
    .createHmac("sha256", `AWS4${secretAccessKey}`)
    .update(`${yyyy}${MM}${dd}`)
    .digest();
  const dateRegionKey = crypto
    .createHmac("sha256", dateKey)
    .update(region)
    .digest();
  const dateRegionServiceKey = crypto
    .createHmac("sha256", dateRegionKey)
    .update(service)
    .digest();
  const signingKey = crypto
    .createHmac("sha256", dateRegionServiceKey)
    .update("aws4_request")
    .digest();
  const signature = crypto
    .createHmac("sha256", signingKey)
    .update(stringToSign)
    .digest("hex");

  // Step 5: Add the signature to the request
  return {
    "X-Amz-Algorithm": "AWS4-HMAC-SHA256",
  };
};

async function main() {
  await putObject("hryssmz", "sample.txt", "Hello World!\n").then(console.log);
  await createLogGroup("あああ123").then(console.log);
}

main();
