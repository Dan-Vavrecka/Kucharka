const http = require("http");
const { handleApiRecipes } = require("./handlers/apiRecipes");
const { handlePages } = require("./handlers/pages");

const server = http.createServer((req, res) => {
    // 1. Zkusíme, jestli jde o API požadavek (/api/...)
    if (handleApiRecipes(req, res)) return;

    // 2. Pokud ne, zkusíme, jestli jde o stránku nebo soubor
    if (handlePages(req, res)) return;

    // 3. Pokud nic z toho, 404
    res.writeHead(404);
    res.end("Stránka nenalezena");
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`🚀 Server běží na http://localhost:${PORT}`);
});