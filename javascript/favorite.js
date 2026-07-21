/* ==========================================================
   TAZA BAZAR — favorite.js
   Favorites: add / remove / toggle, persisted to LocalStorage,
   favorites page rendering.
   ========================================================== */

const TAZA_FAV_KEY = "tazabazar_favorites";

window.TazaFavorites = (function () {
  function read() {
    try {
      const raw = localStorage.getItem(TAZA_FAV_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function write(ids) {
    localStorage.setItem(TAZA_FAV_KEY, JSON.stringify(ids));
    updateBadge();
  }

  function has(productId) {
    return read().includes(productId);
  }

  function add(productId) {
    const ids = read();
    if (!ids.includes(productId)) {
      ids.push(productId);
      write(ids);
    }
  }

  function remove(productId) {
    write(read().filter((id) => id !== productId));
  }

  function toggle(productId) {
    if (has(productId)) {
      remove(productId);
      return false;
    }
    add(productId);
    return true;
  }

  function count() {
    return read().length;
  }

  function updateBadge() {
    document.querySelectorAll("[data-fav-count]").forEach((el) => {
      el.textContent = count();
    });
  }

  return { read, write, has, add, remove, toggle, count, updateBadge };
})();

/* ==========================
   Favorites Page Rendering
========================== */
function renderFavoritesPage() {
  const grid = document.querySelector("[data-favorites-grid]");
  const emptyState = document.querySelector("[data-fav-empty]");
  if (!grid) return;

  const ids = window.TazaFavorites.read();
  const products = TAZA_PRODUCTS.filter((p) => ids.includes(p.id));

  if (!products.length) {
    grid.style.display = "none";
    if (emptyState) emptyState.style.display = "block";
    return;
  }

  grid.style.display = "";
  if (emptyState) emptyState.style.display = "none";
  grid.innerHTML = products.map(buildProductCard).join("");

  observeReveal();
  bindQuantitySelectors();
  bindAddToCartButtons();
  bindFavoriteButtons();

  // Re-render if a card's favorite is removed from this page
  grid.querySelectorAll("[data-fav-id]").forEach((btn) => {
    btn.addEventListener("click", () => {
      setTimeout(renderFavoritesPage, 300);
    }, { once: true });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderFavoritesPage();

  const clearBtn = document.querySelector("[data-clear-favorites]");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      window.TazaFavorites.write([]);
      window.tazaShowToast("Favorites cleared");
      renderFavoritesPage();
    });
  }
});
