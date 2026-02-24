const store = require("../storage/recipesStore");

function sendJson(res, status, data) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(data));
}

function handleApiRecipes(req, res) {
  // GET /api/recipes
  if (req.url === "/api/recipes" && req.method === "GET") {
    return sendJson(res, 200, store.getAll());
  }

  // POST /api/recipes
  if (req.url === "/api/recipes" && req.method === "POST") {
    let body = "";
    req.on("data", (ch) => (body += ch));
    req.on("end", () => {
      try {
        const data = JSON.parse(body || "{}");
        if (!data.name) return sendJson(res, 400, { error: "Chybí název" });
        const created = store.create(data);
        sendJson(res, 201, created);
      } catch (e) {
        sendJson(res, 400, { error: "Neplatný JSON" });
      }
    });
    return true;
  }
  return false;
}

module.exports = { handleApiRecipes };