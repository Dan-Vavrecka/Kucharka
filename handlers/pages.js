const fs = require("fs");
const path = require("path");
const store = require("../storage/recipesStore");

const VIEWS_DIR = path.join(__dirname, "..", "views");

function handlePages(req, res) {
  // 1. Obsluha CSS souborů
  // Pokud URL končí .css, hledáme ho ve složce public
  if (req.url.endsWith(".css")) {
    const cssFileName = path.basename(req.url); // získá název souboru (např. style_i1.css)
    const cssPath = path.join(__dirname, "..", "public", cssFileName);

    if (fs.existsSync(cssPath)) {
      res.writeHead(200, { "Content-Type": "text/css" });
      res.end(fs.readFileSync(cssPath));
      return true;
    }
  }

  // 2. Obsluha klientského JS (app.js)
  if (req.url === "/public/app.js" || req.url === "/app.js") {
    const jsPath = path.join(__dirname, "..", "public", "app.js");
    if (fs.existsSync(jsPath)) {
      res.writeHead(200, { "Content-Type": "application/javascript" });
      res.end(fs.readFileSync(jsPath));
      return true;
    }
  }

  // 3. Hlavní stránka (Seznam receptů)
  if (req.url === "/" || req.url === "/index1.html") {
    const recipes = store.getAll();
    const rows = recipes.map(r => {
      const flags = { "Itálie": "🇮🇹", "USA": "🇺🇸", "Česká republika": "🇨🇿" };
      const stars = "★".repeat(r.difficulty) + "☆".repeat(3 - r.difficulty);
      
      return `<tr>
        <td>${r.name}</td>
        <td class="flag">${flags[r.origin] || "🏳️"} ${r.origin}</td>
        <td>${r.prepTime}</td>
        <td class="stars" style="color: #FF9800">${stars}</td>
      </tr>`;
    }).join("");

    let html = fs.readFileSync(path.join(VIEWS_DIR, "index1.html"), "utf-8");
    // Vložíme řádky do tabulky
    html = html.replace("<tbody>", "<tbody>" + (rows || "<tr><td colspan='4'>Žádné recepty.</td></tr>"));
    
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(html);
    return true;
  }

  // 4. Stránka pro přidání receptu
  if (req.url === "/pridani.html") {
    const htmlPath = path.join(VIEWS_DIR, "pridani.html");
    if (fs.existsSync(htmlPath)) {
      const html = fs.readFileSync(htmlPath, "utf-8");
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(html);
      return true;
    }
  }

  return false; // Pokud žádná cesta nesouhlasí
}

module.exports = { handlePages };