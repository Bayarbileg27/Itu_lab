// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Theme toggle (ocean <-> forest)
const btn = document.getElementById("themeToggle");
btn.addEventListener("click", () => {
  const cur = document.body.getAttribute("data-theme") || "ocean";
  document.body.setAttribute("data-theme", cur === "ocean" ? "forest" : "ocean");
});

// See more (demo)
document.getElementById("seeMoreBtn").addEventListener("click", () => {
  alert("Одоохондоо тоглоом байхгүй бнө.");
});
