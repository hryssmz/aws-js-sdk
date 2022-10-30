// iam/scripts/listUsersV4.ts
import axios, { AxiosError } from "axios";
import { createSignedHeaders } from "../../utils";

async function main() {
  const method = "GET";
  const service = "iam";
  const region = "us-east-1";
  const host = "iam.amazonaws.com";
  const endpoint = `https://${host}/`;
  const query: Record<string, string | string[]> = {
    Action: "ListUsers",
    Version: "2010-05-08",
  };

  const headers = await createSignedHeaders({
    host,
    method,
    region,
    service,
    query,
  });

  const request = axios.get(endpoint, { headers, params: query });
  return request;
}

main()
  .then(({ data }) => {
    console.log(JSON.stringify(data, null, 2));
  })
  .catch(({ response }: AxiosError) => {
    console.error(JSON.stringify(response?.data, null, 2));
  });
