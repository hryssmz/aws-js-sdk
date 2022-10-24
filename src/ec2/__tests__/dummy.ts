// ec2/__tests__/dummy.ts
import { isLocal } from "./utils";

export const keyPairName = "dummy-key-pair";
export const keyPairPath = `${__dirname}/${keyPairName}.pem`;
export const sgName = "dummy-security-group";
export const sgDesc = "Dummy Security Group";
export const ipPermissions = [
  {
    FromPort: 22,
    ToPort: 22,
    IpProtocol: "tcp",
    IpRanges: [{ CidrIp: "0.0.0.0/0" }],
  },
];

export const runInstanceSec = isLocal ? 0 : 45;
export const startInstanceSec = isLocal ? 0 : 30;
export const stopInstanceSec = isLocal ? 0 : 15;
export const termInstanceSec = isLocal ? 0 : 30;
