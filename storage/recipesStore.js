const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(__dirname, "..", "data", "recipes.json");

function load() {
  try {
    if (!fs.existsSync(DATA_FILE)) return [];
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw || "[]");
  } catch (e) {
    return [];
  }
}

function save(data) {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

function getAll() {
  return load();
}

function create({ name, origin, prepTime, difficulty }) {
  const recipes = load();
  const newId = recipes.length ? Math.max(...recipes.map((r) => r.id)) + 1 : 1;
  const recipe = { 
    id: newId, 
    name, 
    origin, 
    prepTime, 
    difficulty: Number(difficulty) 
  };
  recipes.push(recipe);
  save(recipes);
  return recipe;
}

module.exports = { getAll, create };