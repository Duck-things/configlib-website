const crypto = require("crypto");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "" };
  let body = {};
  try { body = JSON.parse(event.body || "{}"); } catch (e) {}
  const username = String(body.username || "");
  const passcode = String(body.passcode || "");

  const admins = (process.env.CONFIGLIB_ADMINS || "")
    .split(",").map(s => s.trim()).filter(Boolean);

  const ok = admins.some(entry => {
    const idx = entry.indexOf(":");
    if (idx < 0) return false;
    const u = entry.slice(0, idx), p = entry.slice(idx + 1);
    return u.toLowerCase() === username.toLowerCase() && p === passcode;
  });

  if (!ok) return { statusCode: 401, body: JSON.stringify({ error: "bad credentials" }) };

  const secret = process.env.CONFIGLIB_SECRET || "please-set-a-secret";
  const exp = Date.now() + 8 * 3600 * 1000;
  const payload = Buffer.from(JSON.stringify({ u: username, exp })).toString("base64url");
  const sig = crypto.createHmac("sha256", secret).update(payload).digest("base64url");

  return {
    statusCode: 200,
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ token: payload + "." + sig, user: username })
  };
};
