const { getStore } = require("@netlify/blobs");

exports.handler = async () => {
  try {
    const store = getStore("configlib");
    const parts = await store.get("parts", { type: "json" });
    if (parts) {
      return {
        statusCode: 200,
        headers: { "content-type": "application/json", "cache-control": "no-store" },
        body: JSON.stringify(parts)
      };
    }
  } catch (e) {}
  return { statusCode: 404, headers: { "content-type": "application/json" }, body: "[]" };
};
