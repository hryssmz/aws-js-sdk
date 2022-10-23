// ec2/scripts/args.ts
export const keyPairName = "my-key-pair";
export const keyPairPath = `${__dirname}/../../${keyPairName}.pem`;
export const sgName = "my-security-group";
export const cidrIp = "0.0.0.0/0";
export const ec2User = "ec2-user";
