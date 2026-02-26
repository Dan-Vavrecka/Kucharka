const store = require("../storage/recipesStore");

function sendJson(res, status, data) {
    res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify(data));
}

module.exports = {
    handleApiRecipes: (req, res) => {
        const parts = req.url.split("/");
        const id = parts[3] ? Number(parts[3]) : null;

        if (req.url === "/api/recipes" && req.method === "GET") {
            sendJson(res, 200, store.getAll());
            return true;
        }

        if (req.url.startsWith("/api/recipes/") && req.method === "GET") {
            const r = store.getById(id);
            r ? sendJson(res, 200, r) : sendJson(res, 404, { error: "Nenalezeno" });
            return true;
        }

        if ((req.url === "/api/recipes" && req.method === "POST") || 
            (req.url.startsWith("/api/recipes/") && req.method === "PUT")) {
            let body = "";
            req.on("data", c => body += c);
            req.on("end", () => {
                const data = JSON.parse(body || "{}");
                if (req.method === "POST") sendJson(res, 201, store.create(data));
                else sendJson(res, store.update(id, data) ? 200 : 404, data);
            });
            return true;
        }

        if (req.method === "DELETE" && id) {
            sendJson(res, store.remove(id) ? 200 : 404, { success: true });
            return true;
        }
        return false;
    }
};