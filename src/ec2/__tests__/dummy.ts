// ec2/__tests__/dummy.ts
export {
  keyPairName,
  keyPairPath,
  ipPermissions,
  sgDesc,
  sgName,
} from "../../utils/dummy";
import { isLocal } from "./utils";

export const runInstanceSec = isLocal ? 0 : 45;
export const startInstanceSec = isLocal ? 0 : 30;
export const stopInstanceSec = isLocal ? 0 : 15;
export const termInstanceSec = isLocal ? 0 : 30;
