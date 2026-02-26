async function deleteRecipe(id) {
  if (confirm("Smazat?")) {
      await fetch(`/api/recipes/${id}`, { method: "DELETE" });
      location.reload();
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(location.search);
  const id = params.get("id");

  // Načtení dat pro editaci
  if (location.pathname.includes("editace.html") && id) {
      const res = await fetch(`/api/recipes/${id}`);
      if (res.ok) {
          const r = await res.json();
          document.getElementById("edit-name").value = r.name;
          document.getElementById("edit-origin").value = r.origin;
          document.getElementById("edit-time").value = r.prepTime;
          document.getElementById("edit-diff").value = r.difficulty;
      }
  }

  // Odesílání (Přidání i Editace)
  const btn = document.getElementById("submitBtn") || document.getElementById("updateBtn");
  const form = document.getElementById("recipeForm") || document.getElementById("editForm");

  if (btn && form) {
      btn.onclick = async (e) => {
          e.preventDefault();
          const data = Object.fromEntries(new FormData(form));
          const method = id ? "PUT" : "POST";
          const url = id ? `/api/recipes/${id}` : "/api/recipes";

          const res = await fetch(url, {
              method: method,
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data)
          });
          if (res.ok) location.href = "/index1.html";
      };
  }

  const addBtn = document.querySelector(".circle-btn");
  if (addBtn) addBtn.onclick = () => location.href = "/pridani.html";
});