// utils/index.ts
import { createWriteStream, statSync } from "node:fs";
import { readFile, rm } from "node:fs/promises";
import archiver from "archiver";

export { accountAlias, defaultClientConfig, region } from "./config";

export type Action = (...args: string[]) => Promise<string>;

export const camelize = (s: string) =>
  s.replace(/-./g, x => x[1].toUpperCase());

export const sleep = async (sec: number) => {
  await new Promise(resolve => setTimeout(resolve, sec * 1000));
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const jsonSerialize = (obj: any) => {
  return JSON.stringify(obj, null, 2);
};

export const jsonFormat = (jsonStr: string) => {
  return jsonSerialize(JSON.parse(jsonStr));
};

export const base64Decode = (base64Str: string) => {
  return Buffer.from(base64Str, "base64").toString("utf-8");
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
