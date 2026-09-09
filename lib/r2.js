// Hand-rolled AWS Signature V4 for R2, using only Web Crypto — no AWS SDK.
//
// The SDK (@aws-sdk/client-s3) turned out to crash outright in this Workers
// runtime: its internal config resolution tries to read a local
// ~/.aws/config file (via Node's fs.readFile) even when credentials are
// passed directly, and Workers has no real filesystem to read from. Rather
// than patch deep internals of a dependency, this implements the same
// well-documented SigV4 algorithm R2 expects, using only crypto.subtle,
// which is natively supported here with zero compatibility concerns.

async function hmac(key, message) {
  const keyData = typeof key === "string" ? new TextEncoder().encode(key) : key;
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  return new Uint8Array(await crypto.subtle.sign("HMAC", cryptoKey, new TextEncoder().encode(message)));
}

async function sha256Hex(message) {
  const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(message));
  return toHex(new Uint8Array(hash));
}

function toHex(bytes) {
  return [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function amzDate(date) {
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

async function getSigningKey(secretKey, dateStamp, region, service) {
  const kDate = await hmac("AWS4" + secretKey, dateStamp);
  const kRegion = await hmac(kDate, region);
  const kService = await hmac(kRegion, service);
  return hmac(kService, "aws4_request");
}

function r2Config() {
  return {
    accountId: process.env.R2_ACCOUNT_ID,
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    bucket: process.env.R2_BUCKET_NAME,
    region: "auto",
    service: "s3",
  };
}

function canonicalUriFor(bucket, key) {
  return `/${bucket}/${key.split("/").map(encodeURIComponent).join("/")}`;
}

export async function presignUpload(key) {
  const { accountId, accessKeyId, secretAccessKey, bucket, region, service } = r2Config();
  const host = `${accountId}.r2.cloudflarestorage.com`;

  const now = new Date();
  const amzDateStr = amzDate(now);
  const dateStamp = amzDateStr.slice(0, 8);
  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
  const canonicalUri = canonicalUriFor(bucket, key);

  const queryParams = {
    "X-Amz-Algorithm": "AWS4-HMAC-SHA256",
    "X-Amz-Credential": `${accessKeyId}/${credentialScope}`,
    "X-Amz-Date": amzDateStr,
    "X-Amz-Expires": "300",
    "X-Amz-SignedHeaders": "host",
  };
  const canonicalQuerystring = Object.keys(queryParams)
    .sort()
    .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(queryParams[k])}`)
    .join("&");

  const canonicalRequest = [
    "PUT",
    canonicalUri,
    canonicalQuerystring,
    `host:${host}\n`,
    "host",
    "UNSIGNED-PAYLOAD",
  ].join("\n");

  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDateStr,
    credentialScope,
    await sha256Hex(canonicalRequest),
  ].join("\n");

  const signingKey = await getSigningKey(secretAccessKey, dateStamp, region, service);
  const signature = toHex(await hmac(signingKey, stringToSign));

  return `https://${host}${canonicalUri}?${canonicalQuerystring}&X-Amz-Signature=${signature}`;
}

export async function deleteObject(key) {
  const { accountId, accessKeyId, secretAccessKey, bucket, region, service } = r2Config();
  const host = `${accountId}.r2.cloudflarestorage.com`;

  const now = new Date();
  const amzDateStr = amzDate(now);
  const dateStamp = amzDateStr.slice(0, 8);
  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
  const canonicalUri = canonicalUriFor(bucket, key);
  const payloadHash = await sha256Hex("");

  const canonicalHeaders = `host:${host}\nx-amz-content-sha256:${payloadHash}\nx-amz-date:${amzDateStr}\n`;
  const signedHeaders = "host;x-amz-content-sha256;x-amz-date";

  const canonicalRequest = ["DELETE", canonicalUri, "", canonicalHeaders, signedHeaders, payloadHash].join(
    "\n"
  );

  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDateStr,
    credentialScope,
    await sha256Hex(canonicalRequest),
  ].join("\n");

  const signingKey = await getSigningKey(secretAccessKey, dateStamp, region, service);
  const signature = toHex(await hmac(signingKey, stringToSign));

  const authorization = `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  const res = await fetch(`https://${host}${canonicalUri}`, {
    method: "DELETE",
    headers: {
      "x-amz-content-sha256": payloadHash,
      "x-amz-date": amzDateStr,
      Authorization: authorization,
    },
  });

  if (!res.ok && res.status !== 404) {
    throw new Error(`R2 delete failed with status ${res.status}`);
  }
}
