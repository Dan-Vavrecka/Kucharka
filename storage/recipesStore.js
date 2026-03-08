const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(__dirname, "..", "data", "recipes.json");

function load() {
    try {
        if (!fs.existsSync(DATA_FILE)) return [];
        return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8") || "[]");
    } catch (e) { return []; }
}

function save(data) {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

module.exports = {
    getAll: () => load(),
    getById: (id) => load().find(r => r.id === Number(id)),
    create: (data) => {
        const recipes = load();
        const newRecipe = { 
            id: Date.now(), 
            name: data.name, 
            origin: data.origin, 
            prepTime: data.prepTime, 
            difficulty: Number(data.difficulty) || 1 
        };
        recipes.push(newRecipe);
        save(recipes);
        return newRecipe;
    },
    update: (id, data) => {
        const recipes = load();
        const idx = recipes.findIndex(r => r.id === Number(id));
        if (idx === -1) return null;
        recipes[idx] = { ...recipes[idx], ...data, id: Number(id) };
        save(recipes);
        return recipes[idx];
    },
    remove: (id) => {
        const recipes = load();
        const filtered = recipes.filter(r => r.id !== Number(id));
        save(filtered);
        return recipes.length !== filtered.length;
    }
};