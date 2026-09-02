const crypto = require("crypto");
const { getStore } = require("@netlify/blobs");

function verify(token) {
  const secret = process.env.CONFIGLIB_SECRET || "please-set-a-secret";
  const parts = String(token || "").split(".");
  if (parts.length !== 2) return null;
  const [payload, sig] = parts;
  const expect = crypto.createHmac("sha256", secret).update(payload).digest("base64url");
  if (expect !== sig) return null;
  let data;
  try { data = JSON.parse(Buffer.from(payload, "base64url").toString()); } catch (e) { return null; }
  if (!data || Date.now() > data.exp) return null;
  return data;
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "" };
  let body = {};
  try { body = JSON.parse(event.body || "{}"); } catch (e) {}
  if (!verify(body.token)) return { statusCode: 401, body: JSON.stringify({ error: "unauthorized" }) };
  if (!Array.isArray(body.parts)) return { statusCode: 400, body: JSON.stringify({ error: "bad parts" }) };

  const store = getStore("configlib");
  await store.setJSON("parts", body.parts);
  return { statusCode: 200, headers: { "content-type": "application/json" }, body: JSON.stringify({ ok: true }) };
};
