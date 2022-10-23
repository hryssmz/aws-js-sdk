// utils/index.ts
import { createWriteStream, statSync } from "node:fs";
import { readFile, rm } from "node:fs/promises";
import archiver from "archiver";

export { accountAlias, defaultClientConfig, isLocal } from "../config";

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
