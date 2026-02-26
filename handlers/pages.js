const fs = require("fs");
const path = require("path");
const store = require("../storage/recipesStore");

const VIEWS_DIR = path.join(__dirname, "..", "views");
const PUBLIC_DIR = path.join(__dirname, "..", "public");

function handlePages(req, res) {
    if (req.url === "/favicon.ico") { res.writeHead(204); return res.end(); }

    // CSS a JS soubory
    if (req.url.endsWith(".css") || req.url.endsWith(".js")) {
        const filePath = path.join(PUBLIC_DIR, path.basename(req.url));
        if (fs.existsSync(filePath)) {
            const type = req.url.endsWith(".css") ? "text/css" : "application/javascript";
            res.writeHead(200, { "Content-Type": type });
            return res.end(fs.readFileSync(filePath));
        }
    }

    // Index / Seznam
    if (req.url === "/" || req.url === "/index1.html") {
        const recipes = store.getAll();
        const rows = recipes.map(r => `
            <tr>
                <td>${r.name}</td>
                <td>${r.origin}</td>
                <td>${r.prepTime}</td>
                <td style="color:orange">${"★".repeat(r.difficulty)}</td>
                <td>
                    <button onclick="location.href='/editace.html?id=${r.id}'">✏️</button>
                    <button onclick="deleteRecipe(${r.id})">🗑️</button>
                </td>
            </tr>`).join("");

        let html = fs.readFileSync(path.join(VIEWS_DIR, "index1.html"), "utf-8");
        html = html.replace("<tbody>", "<tbody>" + (rows || "<tr><td colspan='5'>Seznam je prázdný</td></tr>"));
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        return res.end(html);
    }

    // Přidání a Editace
    if (req.url === "/pridani.html" || req.url.startsWith("/editace.html")) {
        const file = req.url.startsWith("/editace.html") ? "editace.html" : "pridani.html";
        const html = fs.readFileSync(path.join(VIEWS_DIR, file), "utf-8");
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        return res.end(html);
    }

    return false;
}

module.exports = { handlePages };