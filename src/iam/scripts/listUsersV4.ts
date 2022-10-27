// iam/scripts/listUsersV4.ts
import { exec } from "node:child_process";
import querystring from "node:querystring";
import { promisify } from "node:util";
import axios, { AxiosError } from "axios";
import { HmacSHA256, SHA256 } from "crypto-js";
import { DateTime } from "luxon";

async function main() {
  // ************* REQUEST VALUES *************
  const method = "GET";
  const service = "iam";
  const host = "iam.amazonaws.com";
  const region = "us-east-1";
  const endpoint = "https://iam.amazonaws.com";
  const queryToSign: Record<string, string | string[]> = {
    Action: "ListUsers",
    Version: "2010-05-08",
  };
  const paths = [] as string[];

  // Read AWS access key from aws configure command.
  // Best practice is NOT to embed credentials in code.
  const execAsync = promisify(exec);
  const accessKey = await execAsync("aws configure get aws_access_key_id").then(
    ({ stdout }) => stdout.trim()
  );
  const secretKey = await execAsync(
    "aws configure get aws_secret_access_key"
  ).then(({ stdout }) => stdout.trim());

  // Create a date for headers and the credential string
  const now = DateTime.now().setZone("utc");
  const amzDate = now.toFormat("yyyyMMdd'T'HHmmss'Z'");
  const dateStamp = now.toFormat("yyyyMMdd");

  // ************* TASK 1: CREATE A CANONICAL REQUEST *************
  // http://docs.aws.amazon.com/general/latest/gr/sigv4-create-canonical-request.html

  // Step 1 is to define the verb (GET, POST, etc.)--already done.

  // Step 2: Create canonical URI--the part of the URI from domain to query
  // string (use '/' if no path)
  const canonicalURI =
    paths.length === 0
      ? "/"
      : ["", ...paths, ""]
          .map(path => encodeURIComponent(encodeURIComponent(path)))
          .join("/");

  // Step 3: Create the canonical query string. In this example (a GET request),
  // request parameters are in the query string. Query string values must
  // be URL-encoded (space=%20). The parameters must be sorted by name.
  const canonicalQuery = Object.keys(queryToSign)
    .sort((a, b) => (a < b ? -1 : 1))
    .reduce((acc, k) => {
      const v = queryToSign[k];
      acc[k] = typeof v === "string" ? v : v.sort((a, b) => (a < b ? -1 : 1));
      return acc;
    }, {} as Record<string, string | string[]>);
  const canonicalQueryString = querystring.stringify(canonicalQuery);

  // Step 4: Create the canonical headers and signed headers. Header names
  // must be trimmed and lowercase, and sorted in code point order from
  // low to high. Note that there is a trailing \n.
  const headersToSign: Record<string, string> = {
    Host: host,
    "X-Amz-Date": amzDate,
  };
  const canonicalHeaders = Object.keys(headersToSign)
    .sort((a, b) => a.localeCompare(b))
    .reduce((acc, k) => {
      const header =
        k.toLowerCase() + ":" + headersToSign[k].trim().replace(/  +/g, " ");
      return acc + header + "\n";
    }, "");

  // Step 5: Create the list of signed headers. This lists the headers
  // in the canonical_headers list, delimited with ";" and in alpha order.
  // Note: The request can include any headers; canonical_headers and
  // signed_headers lists those that you want to be included in the
  // hash of the request. "Host" and "x-amz-date" are always required.
  const signedHeaders = Object.keys(headersToSign)
    .sort((a, b) => a.localeCompare(b))
    .map(k => k.toLowerCase())
    .join(";");

  // Step 6: Create payload hash (hash of the request body content).
  // requests, the payload is an empty string ("").
  const payload = "";
  const payloadHash = SHA256(payload).toString();

  // Step 7: Combine elements to create canonical request
  const canonicalRequest = [
    method,
    canonicalURI,
    canonicalQueryString,
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join("\n");

  // ************* TASK 2: CREATE THE STRING TO SIGN*************
  // Match the algorithm to the hashing algorithm you use, either SHA-1 or
  // SHA-256 (recommended)
  const algorithm = "AWS4-HMAC-SHA256";
  const termString = "aws4_request";
  const credentialScope = [dateStamp, region, service, termString].join("/");
  const stringToSign = [
    algorithm,
    amzDate,
    credentialScope,
    SHA256(canonicalRequest).toString(),
  ].join("\n");

  // ************* TASK 3: CALCULATE THE SIGNATURE *************
  // Key derivation functions. See:
  // https://docs.aws.amazon.com/general/latest/gr/signature-v4-examples.html#signature-v4-examples-javascript
  const kDate = HmacSHA256(dateStamp, "AWS4" + secretKey);
  const kRegion = HmacSHA256(region, kDate);
  const kService = HmacSHA256(service, kRegion);
  const signingKey = HmacSHA256(termString, kService);

  // Sign the stringToSign using the signingKey
  const signature = HmacSHA256(stringToSign, signingKey).toString();

  // ************* TASK 4: ADD SIGNING INFORMATION TO THE REQUEST *************
  // The signing information can be either in a query string value or in
  // a header named Authorization. This code shows how to use a header.
  // Create authorization header and add to request headers
  const credential = [accessKey, credentialScope].join("/");
  const authorizationHeader = `${algorithm} ${[
    `Credential=${credential}`,
    `SignedHeaders=${signedHeaders}`,
    `Signature=${signature}`,
  ].join(", ")}`;
  const headers = {
    "x-amz-date": amzDate,
    Authorization: authorizationHeader,
  };

  // ************* SEND THE REQUEST *************
  const request = axios.get(endpoint, { headers, params: queryToSign });
  return request;
}

main()
  .then(({ data }) => {
    console.log(JSON.stringify(data, null, 2));
  })
  .catch(({ response }: AxiosError) => {
    console.error(JSON.stringify(response?.data, null, 2));
  });
