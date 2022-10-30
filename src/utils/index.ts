// utils/index.ts
import { exec } from "node:child_process";
import { createWriteStream, statSync } from "node:fs";
import { readFile, rm } from "node:fs/promises";
import querystring from "node:querystring";
import { promisify } from "node:util";
import archiver from "archiver";
import { HmacSHA256, SHA256 } from "crypto-js";
import { DateTime } from "luxon";

export { accountAlias, defaultClientConfig, isLocal, region } from "../config";

export const sleep = async (sec: number) => {
  await new Promise(resolve => setTimeout(resolve, sec * 1000));
};

export const zip = async (sourceDir: string) => {
  const zipPath = `${sourceDir}.zip`;
  await new Promise((resolve, reject) => {
    const stats = statSync(sourceDir);
    if (!stats.isDirectory()) {
      reject();
    }
    const archive = archiver("zip");

    // Create a file to stream archive data to.
    const output = createWriteStream(zipPath);

    // 'close' event is fired when archiver has been finalized.
    output.on("close", resolve);

    // Pipe archive data to the file.
    archive.pipe(output);

    // Append files from directory, puttings them at the root of archive.
    archive.directory(sourceDir, false);

    // Finalize the archive.
    archive.finalize();
  });
  const buffer = await readFile(zipPath);
  await rm(zipPath);
  return buffer;
};

export interface CreateSignedHeadersInput {
  method: string;
  host: string;
  region: string;
  service: string;
  paths?: string[];
  query?: Record<string, string | string[]>;
  payload?: string;
  contentType?: string;
}

export const createSignedHeaders = async ({
  method,
  host,
  region,
  service,
  paths = [],
  query = {},
  payload = "",
  contentType = "application/json",
}: CreateSignedHeadersInput) => {
  const execAsync = promisify(exec);
  const accessKey = await execAsync("aws configure get aws_access_key_id").then(
    ({ stdout }) => stdout.trim()
  );
  const secretKey = await execAsync(
    "aws configure get aws_secret_access_key"
  ).then(({ stdout }) => stdout.trim());
  const now = DateTime.now().setZone("utc");
  const amzDate = now.toFormat("yyyyMMdd'T'HHmmss'Z'");
  const dateStamp = now.toFormat("yyyyMMdd");

  // ************* TASK 1: CREATE A CANONICAL REQUEST *************
  const canonicalURI =
    paths.length === 0
      ? "/"
      : ["", ...paths, ""]
          .map(path => encodeURIComponent(encodeURIComponent(path)))
          .join("/");

  const canonicalQuery = Object.keys(query)
    .sort((a, b) => (a < b ? -1 : 1))
    .reduce((acc, k) => {
      const v = query[k];
      acc[k] = typeof v === "string" ? v : v.sort((a, b) => (a < b ? -1 : 1));
      return acc;
    }, {} as Record<string, string | string[]>);
  const canonicalQueryString = querystring.stringify(canonicalQuery);

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
  const signedHeaders = Object.keys(headersToSign)
    .sort((a, b) => a.localeCompare(b))
    .map(k => k.toLowerCase())
    .join(";");

  const payloadHash = SHA256(payload).toString();

  const canonicalRequest = [
    method,
    canonicalURI,
    canonicalQueryString,
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join("\n");

  // ************* TASK 2: CREATE THE STRING TO SIGN*************
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
  const kDate = HmacSHA256(dateStamp, "AWS4" + secretKey);
  const kRegion = HmacSHA256(region, kDate);
  const kService = HmacSHA256(service, kRegion);
  const signingKey = HmacSHA256(termString, kService);
  const signature = HmacSHA256(stringToSign, signingKey).toString();

  // ************* TASK 4: ADD SIGNING INFORMATION TO THE REQUEST *************
  const credential = [accessKey, credentialScope].join("/");
  const authorizationHeader = `${algorithm} ${[
    `Credential=${credential}`,
    `SignedHeaders=${signedHeaders}`,
    `Signature=${signature}`,
  ].join(", ")}`;
  const headers: Record<string, string> = {
    "X-Amz-Date": amzDate,
    Authorization: authorizationHeader,
    "Content-Type": contentType,
  };

  return headers;
};
