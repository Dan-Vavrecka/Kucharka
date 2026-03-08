const fs = require("fs");
const path = require("path");
const store = require("../storage/recipesStore");

const VIEWS = path.join(__dirname, "..", "views");
const PUBLIC = path.join(__dirname, "..", "public");

module.exports = {
    handlePages: (req, res) => {
        const url = req.url;

        // Statické soubory (CSS, JS)
        if (url.endsWith(".css") || url.endsWith(".js")) {
            const p = path.join(PUBLIC, path.basename(url));
            if (fs.existsSync(p)) {
                res.writeHead(200, { "Content-Type": url.endsWith(".css") ? "text/css" : "application/javascript" });
                res.end(fs.readFileSync(p));
                return true;
            }
        }

        // Seznam (index)
        if (url === "/" || url === "/index1.html") {
            const recipes = store.getAll();
            const rows = recipes.map(r => `
                <tr>
                    <td>${r.name}</td>
                    <td>${r.origin}</td>
                    <td>${r.prepTime}</td>
                    <td>${"★".repeat(r.difficulty)}</td>
                    <td>
                        <button onclick="location.href='/edit/${r.id}'">✏️</button>
                        <button onclick="deleteItem(${r.id})">🗑️</button>
                    </td>
                </tr>`).join("");
            let html = fs.readFileSync(path.join(VIEWS, "index1.html"), "utf-8");
            res.end(html.replace("<tbody>", "<tbody>" + rows));
            return true;
        }

        // GET /edit/:id - zobrazení formuláře pro editaci
        if (url.startsWith("/edit/")) {
            const html = fs.readFileSync(path.join(VIEWS, "editace.html"), "utf-8");
            res.end(html);
            return true;
        }

        // Přidání
        if (url === "/pridani.html") {
            res.end(fs.readFileSync(path.join(VIEWS, "pridani.html")));
            return true;
        }

        return false;
    }
};