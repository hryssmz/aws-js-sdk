// s3/scripts/args.ts
import { accountAlias } from "../../utils";

export const bucket = `my-bucket-${accountAlias}`;
export const objectKey = "my-object.txt";
export const objectBody = "My Body";
export const binaryKey = "s3-logo.png";
export const binaryPath = `${__dirname}/files/s3-logo.png`;
