const store = require("../storage/recipesStore");

function sendJson(res, status, data) {
    res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify(data));
}

module.exports = {
    handleApiRecipes: (req, res) => {
        const url = req.url;
        const method = req.method;

        // GET /items - seznam
        if (url === "/items" && method === "GET") {
            sendJson(res, 200, store.getAll());
            return true;
        }

        // GET /item?id=... - jeden záznam
        if (url.startsWith("/item") && method === "GET") {
            const params = new URLSearchParams(url.split("?")[1]);
            const id = params.get("id");
            const item = store.getById(id);
            item ? sendJson(res, 200, item) : sendJson(res, 404, { error: "Nenalezeno" });
            return true;
        }

        // POST /items - vytvoření
        if (url === "/items" && method === "POST") {
            let body = "";
            req.on("data", c => body += c);
            req.on("end", () => {
                try {
                    const data = JSON.parse(body || "{}");
                    sendJson(res, 201, store.create(data));
                } catch (e) { sendJson(res, 400, { error: "Bad JSON" }); }
            });
            return true;
        }

        // POST /edit/:id - uložení úprav
        if (url.startsWith("/edit/") && method === "POST") {
            const id = url.split("/")[2];
            let body = "";
            req.on("data", c => body += c);
            req.on("end", () => {
                try {
                    const data = JSON.parse(body || "{}");
                    const updated = store.update(id, data);
                    sendJson(res, updated ? 200 : 404, updated || { error: "Nenalezeno" });
                } catch (e) { sendJson(res, 400, { error: "Bad JSON" }); }
            });
            return true;
        }

        // DELETE /delete/:id - smazání
        if (url.startsWith("/delete/") && method === "DELETE") {
            const id = url.split("/")[2];
            const success = store.remove(id);
            sendJson(res, success ? 200 : 404, { success });
            return true;
        }

        return false;
    }
};