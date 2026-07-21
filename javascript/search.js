/* ==========================================================
   TAZA BAZAR — search.js
   Live search: header dropdown suggestions + product filter.
   ========================================================== */

function tazaSearchProducts(query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return TAZA_PRODUCTS.filter((p) =>
    p.name.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q)
  );
}

function buildSearchResultsPanel(results, panel) {
  if (!results.length) {
    panel.innerHTML = `<div class="search-result-empty" style="padding:1rem;color:var(--color-ink-400);font-size:0.85rem;">No matching items found</div>`;
    return;
  }
  panel.innerHTML = results.slice(0, 6).map((p) => `
    <a href="product-details.html?id=${p.id}" class="search-result-item" style="display:flex;align-items:center;gap:0.7rem;padding:0.6rem 1rem;">
      <img src="${p.image}" alt="" width="40" height="40" style="width:40px;height:40px;object-fit:cover;border-radius:8px;">
      <span>
        <strong style="display:block;font-size:0.88rem;">${p.name}</strong>
        <small style="color:var(--color-ink-400);">${p.category} · ${tazaFormatTaka(tazaTodayPrice(p))}</small>
      </span>
    </a>
  `).join("");
}

function initHeaderSearch() {
  const forms = document.querySelectorAll("[data-search-form]");
  forms.forEach((form) => {
    const input = form.querySelector("input[type='search'], input[type='text']");
    if (!input) return;

    let panel = form.querySelector(".search-results-panel");
    if (!panel) {
      panel = document.createElement("div");
      panel.className = "search-results-panel";
      panel.style.cssText = "position:absolute;top:calc(100% + 8px);left:0;right:0;background:var(--color-white);border:1px solid var(--color-ivory-300);border-radius:var(--radius-md);box-shadow:var(--shadow-md);max-height:340px;overflow:auto;z-index:50;display:none;";
      form.appendChild(panel);
    }

    input.addEventListener("input", () => {
      const results = tazaSearchProducts(input.value);
      if (!input.value.trim()) {
        panel.style.display = "none";
        return;
      }
      buildSearchResultsPanel(results, panel);
      panel.style.display = "block";
    });

    input.addEventListener("focus", () => {
      if (input.value.trim()) panel.style.display = "block";
    });

    document.addEventListener("click", (e) => {
      if (!form.contains(e.target)) panel.style.display = "none";
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (input.value.trim()) {
        window.location.href = "category.html?search=" + encodeURIComponent(input.value.trim());
      }
    });
  });
}

/* ==========================
   Live filter on category page (if a search query is present)
========================== */
function applySearchQueryFilter() {
  const grid = document.querySelector("[data-product-grid]");
  if (!grid) return;
  const params = new URLSearchParams(window.location.search);
  const query = params.get("search");
  if (!query) return;

  const results = tazaSearchProducts(query);
  grid.innerHTML = results.length
    ? results.map(buildProductCard).join("")
    : `<p class="no-results">No results for "${query}" — try another search term.</p>`;

  const heading = document.querySelector("[data-search-heading]");
  if (heading) heading.textContent = `Search results for "${query}"`;

  observeReveal();
  bindQuantitySelectors();
  bindAddToCartButtons();
  bindFavoriteButtons();
}

document.addEventListener("DOMContentLoaded", () => {
  initHeaderSearch();
  setTimeout(applySearchQueryFilter, 0);
});
