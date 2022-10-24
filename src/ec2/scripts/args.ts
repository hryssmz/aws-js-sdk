// ec2/scripts/args.ts
export const keyPairName = "my-key-pair";
export const keyPairPath = `${__dirname}/../../../${keyPairName}.pem`;
export const sgName = "my-security-group";
export const imageId = "ami-0de5311b2a443fb89";
export const ipIngress = [
  {
    FromPort: 22,
    ToPort: 22,
    IpProtocol: "tcp",
    IpRanges: [{ CidrIp: "0.0.0.0/0" }],
  },
];
export const ec2User = "ec2-user";
