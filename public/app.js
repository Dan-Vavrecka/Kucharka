document.addEventListener("DOMContentLoaded", () => {
  // Tlačítko pro přechod na přidání (v index1.html)
  const addBtn = document.querySelector(".circle-btn");
  if (addBtn) {
    addBtn.addEventListener("click", () => {
      window.location.href = "/pridani.html";
    });
  }

  // Odeslání formuláře (v pridani.html)
  const submitBtn = document.querySelector(".submit-circle");
  const form = document.querySelector("#recipeForm");

  if (submitBtn && form) {
    submitBtn.addEventListener("click", async (e) => { // přidej 'e' sem
      e.preventDefault(); // toto zastaví klasické odeslání prohlížečem
      
      // tvůj fetch kód...
  
      const formData = new FormData(form);
      const payload = Object.fromEntries(formData.entries());

      if (!payload.name) return alert("Vyplňte prosím název receptu.");

      try {
        const res = await fetch("/api/recipes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          window.location.href = "/index1.html";
        } else {
          alert("Chyba při ukládání.");
        }
      } catch (err) {
        console.error("Network error:", err);
      }
    });
  }
});