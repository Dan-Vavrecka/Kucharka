const fs = require("fs");
const path = require("path");
const store = require("../storage/recipesStore"); // Přidáno: musíme načíst databázi

const PUBLIC_DIR = path.join(__dirname, "..", "public");
const VIEWS = path.join(__dirname, "..", "views"); // Přidáno: definice cesty k HTML

module.exports = {
    handlePages: (req, res) => {
        const url = req.url;

        // Obsluha statických souborů (CSS, JS, Obrázky)
if (url.endsWith(".css") || url.endsWith(".js") || url.endsWith(".jpg") || url.endsWith(".png")) {
    const fileName = path.basename(url);
    const filePath = path.join(PUBLIC_DIR, fileName);

    if (fs.existsSync(filePath)) {
        // Určení správného typu obsahu (MIME type)
        let contentType = "text/plain";
        if (url.endsWith(".css")) contentType = "text/css";
        if (url.endsWith(".js"))  contentType = "application/javascript";
        if (url.endsWith(".jpg")) contentType = "image/jpeg";
        if (url.endsWith(".png")) contentType = "image/png";

        res.writeHead(200, { "Content-Type": contentType });
        res.end(fs.readFileSync(filePath));
        return true;
    }
}

        // 2. Seznam (index)
        if (url === "/" || url === "/index1.html") {
            try {
                const recipes = store.getAll();
                const rows = recipes.map(r => `
                    <tr>
                        <td>${r.name}</td>
                        <td>${r.origin}</td>
                        <td>${r.prepTime}</td>
                        <td style="color:orange">${"★".repeat(r.difficulty)}</td>
                        <td>
                            <button onclick="location.href='/edit/${r.id}'">✏️</button>
                            <button onclick="deleteItem(${r.id})">🗑️</button>
                        </td>
                    </tr>`).join("");
                
                let html = fs.readFileSync(path.join(VIEWS, "index1.html"), "utf-8");
                res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
                res.end(html.replace("<tbody>", "<tbody>" + rows));
                return true;
            } catch (err) {
                console.error("Chyba při načítání indexu:", err);
            }
        }

        // 3. GET /edit/:id - zobrazení formuláře pro editaci
        if (url.startsWith("/edit/")) {
            try {
                const html = fs.readFileSync(path.join(VIEWS, "editace.html"), "utf-8");
                res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
                res.end(html);
                return true;
            } catch (err) {
                console.error("Chyba při načítání editace:", err);
            }
        }

        // 4. Přidání
        if (url === "/pridani.html") {
            try {
                const html = fs.readFileSync(path.join(VIEWS, "pridani.html"), "utf-8");
                res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
                res.end(html);
                return true;
            } catch (err) {
                console.error("Chyba při načítání přidání:", err);
            }
        }

        // Pokud nic nesouhlasí, pustíme požadavek dál (do handleApiRecipes nebo 404)
        return false;
    }
};