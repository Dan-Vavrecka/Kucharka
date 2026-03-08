async function deleteItem(id) {
    if (confirm("Smazat položku?")) {
        const res = await fetch(`/delete/${id}`, { method: "DELETE" });
        if (res.ok) location.reload();
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    const path = window.location.pathname;

    // Pokud jsme na stránce editace (URL /edit/123)
    if (path.startsWith("/edit/")) {
        const id = path.split("/")[2];
        const res = await fetch(`/item?id=${id}`);
        if (res.ok) {
            const r = await res.json();
            document.getElementById("edit-name").value = r.name;
            document.getElementById("edit-origin").value = r.origin;
            document.getElementById("edit-time").value = r.prepTime;
            document.getElementById("edit-diff").value = r.difficulty;
        }

        document.getElementById("updateBtn").onclick = async () => {
            const data = Object.fromEntries(new FormData(document.getElementById("editForm")));
            const saveRes = await fetch(`/edit/${id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
            if (saveRes.ok) location.href = "/index1.html";
        };
    }

    // Stránka přidání
    const submitBtn = document.getElementById("submitBtn");
    if (submitBtn) {
        submitBtn.onclick = async () => {
            const data = Object.fromEntries(new FormData(document.getElementById("recipeForm")));
            const res = await fetch("/items", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
            if (res.ok) location.href = "/index1.html";
        };
    }
});