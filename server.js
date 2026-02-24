const http = require("http");
const { handleApiRecipes } = require("./handlers/apiRecipes");
const { handlePages } = require("./handlers/pages");



const PORT = 3000;

const server = http.createServer((req, res) => {
  // 1. Zkusíme obsloužit API požadavky (GET/POST /api/recipes)
  if (handleApiRecipes(req, res)) return;

  // 2. Zkusíme obsloužit stránky a statické soubory
  if (handlePages(req, res)) return;

  // 3. Nenalezeno
  res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("404 - Nenalezeno");
});

server.listen(PORT, () => {
  console.log(`Server běží na http://localhost:${PORT}`);
});