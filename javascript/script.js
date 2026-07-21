/* ==========================================================
   TAZA BAZAR — script.js
   Core site behaviour: data store, header, hero slider,
   weekly chalkboard pricing, category & product rendering,
   quantity selectors, scroll reveal, smooth scroll.
   ========================================================== */

/* ==========================
   Shared Product Data
   (used by script.js, cart.js, search.js, favorite.js)
========================== */
const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/* Weekly price table — Taka (৳) per kg/unit, one entry per day of week */
const TAZA_PRODUCTS = [
  {
    id: "goat-meat",
    name: "Premium Goat Meat",
    category: "Goat Meat",
    unit: "kg",
    image: "images/prod-goat.svg",
    gallery: ["images/prod-goat.svg", "images/cat-goat.svg", "images/prod-goat.svg"],
    rating: 4.8,
    reviewsCount: 214,
    discount: 8,
    description: "Farm-raised goat meat, cleaned and cut to order the same morning it's delivered.",
    ingredients: ["Fresh goat meat", "No preservatives", "Hand-trimmed fat"],
    weeklyPrice: { Sunday: 900, Monday: 920, Tuesday: 880, Wednesday: 910, Thursday: 890, Friday: 930, Saturday: 900 }
  },
  {
    id: "broiler-chicken",
    name: "Broiler Chicken",
    category: "Chicken",
    unit: "kg",
    image: "images/prod-chicken.svg",
    gallery: ["images/prod-chicken.svg", "images/cat-chicken.svg", "images/prod-chicken.svg"],
    rating: 4.5,
    reviewsCount: 331,
    discount: 5,
    description: "Antibiotic-free broiler chicken, dressed fresh and delivered within hours.",
    ingredients: ["Fresh broiler chicken", "Skin on/off options", "No added water"],
    weeklyPrice: { Sunday: 210, Monday: 205, Tuesday: 215, Wednesday: 200, Thursday: 220, Friday: 225, Saturday: 210 }
  },
  {
    id: "desi-chicken",
    name: "Desi Chicken",
    category: "Desi Chicken",
    unit: "kg",
    image: "images/prod-desi-chicken.svg",
    gallery: ["images/prod-desi-chicken.svg", "images/cat-desi-chicken.svg", "images/prod-desi-chicken.svg"],
    rating: 4.9,
    reviewsCount: 152,
    discount: 0,
    description: "Free-range native chicken with firmer meat and richer flavour, sourced from village farms.",
    ingredients: ["Free-range desi chicken", "Sourced within 24 hrs"],
    weeklyPrice: { Sunday: 420, Monday: 430, Tuesday: 415, Wednesday: 425, Thursday: 440, Friday: 450, Saturday: 430 }
  },
  {
    id: "desi-duck",
    name: "Desi Duck",
    category: "Desi Duck",
    unit: "kg",
    image: "images/prod-duck.svg",
    gallery: ["images/prod-duck.svg", "images/cat-duck.svg", "images/prod-duck.svg"],
    rating: 4.6,
    reviewsCount: 88,
    discount: 10,
    description: "Traditional village-reared duck, ideal for bhuna and curry preparations.",
    ingredients: ["Fresh duck meat", "Hand cleaned"],
    weeklyPrice: { Sunday: 480, Monday: 470, Tuesday: 490, Wednesday: 475, Thursday: 500, Friday: 510, Saturday: 485 }
  },
  {
    id: "rui-fish",
    name: "Rui Fish",
    category: "Fish",
    unit: "kg",
    image: "images/prod-fish.svg",
    gallery: ["images/prod-fish.svg", "images/cat-fish.svg", "images/prod-fish.svg"],
    rating: 4.7,
    reviewsCount: 176,
    discount: 12,
    description: "River-fresh Rui fish, scaled and cut to your preferred size at no extra cost.",
    ingredients: ["Fresh river fish", "Cut to order"],
    weeklyPrice: { Sunday: 380, Monday: 375, Tuesday: 390, Wednesday: 370, Thursday: 395, Friday: 400, Saturday: 385 }
  },
  {
    id: "galda-prawn",
    name: "Galda Prawn",
    category: "Fish",
    unit: "kg",
    image: "images/prod-prawn.svg",
    gallery: ["images/prod-prawn.svg", "images/cat-fish.svg", "images/prod-prawn.svg"],
    rating: 4.9,
    reviewsCount: 97,
    discount: 0,
    description: "Large freshwater prawns, perfect for malai curry, packed on ice.",
    ingredients: ["Fresh galda prawn", "Deveined on request"],
    weeklyPrice: { Sunday: 950, Monday: 960, Tuesday: 940, Wednesday: 955, Thursday: 970, Friday: 980, Saturday: 950 }
  },
  {
    id: "mixed-veg",
    name: "Mixed Vegetable Box",
    category: "Vegetables",
    unit: "box",
    image: "images/prod-veg.svg",
    gallery: ["images/prod-veg.svg", "images/cat-veg.svg", "images/prod-veg.svg"],
    rating: 4.4,
    reviewsCount: 260,
    discount: 15,
    description: "A curated 3kg box of seasonal vegetables picked fresh from local growers each morning.",
    ingredients: ["Seasonal vegetables", "Locally sourced", "No cold storage"],
    weeklyPrice: { Sunday: 320, Monday: 310, Tuesday: 330, Wednesday: 300, Thursday: 315, Friday: 340, Saturday: 320 }
  },
  {
    id: "fruit-basket",
    name: "Fruit Basket",
    category: "Fruits",
    unit: "box",
    image: "images/prod-fruit.svg",
    gallery: ["images/prod-fruit.svg", "images/cat-fruit.svg", "images/prod-fruit.svg"],
    rating: 4.6,
    reviewsCount: 143,
    discount: 6,
    description: "A hand-picked seasonal fruit assortment, ready to eat and great for gifting.",
    ingredients: ["Seasonal fruits", "Hand selected"],
    weeklyPrice: { Sunday: 550, Monday: 540, Tuesday: 560, Wednesday: 530, Thursday: 545, Friday: 575, Saturday: 555 }
  }
];

const TAZA_CATEGORIES = [
  { name: "Meat", image: "images/cat-meat.svg", filter: "Goat Meat" },
  { name: "Goat Meat", image: "images/cat-goat.svg", filter: "Goat Meat" },
  { name: "Chicken", image: "images/cat-chicken.svg", filter: "Chicken" },
  { name: "Desi Chicken", image: "images/cat-desi-chicken.svg", filter: "Desi Chicken" },
  { name: "Desi Duck", image: "images/cat-duck.svg", filter: "Desi Duck" },
  { name: "Fish", image: "images/cat-fish.svg", filter: "Fish" },
  { name: "Vegetables", image: "images/cat-veg.svg", filter: "Vegetables" },
  { name: "Fruits", image: "images/cat-fruit.svg", filter: "Fruits" },
  { name: "Sneaks", image: "images/cat-snacks.svg", filter: "Snacks" }
];

/* Helper: get today's day name */
function tazaGetToday() {
  return DAY_NAMES[new Date().getDay()];
}

/* Helper: today's price for a product */
function tazaTodayPrice(product) {
  return product.weeklyPrice[tazaGetToday()];
}

/* Helper: previous (yesterday) price for comparison badges */
function tazaPrevDayPrice(product) {
  const idx = new Date().getDay();
  const prevIdx = (idx + 6) % 7;
  return product.weeklyPrice[DAY_NAMES[prevIdx]];
}

/* Helper: format currency */
function tazaFormatTaka(amount) {
  return "৳" + Math.round(amount).toLocaleString("en-US");
}

/* ==========================
   Header: sticky shadow + mobile menu
========================== */
function initHeader() {
  const header = document.querySelector(".site-header");
  const hamburger = document.querySelector(".hamburger");
  const mobileNav = document.querySelector(".mobile-nav");

  if (header) {
    const onScroll = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  if (hamburger && mobileNav) {
    hamburger.addEventListener("click", () => {
      const isOpen = mobileNav.classList.toggle("is-open");
      hamburger.classList.toggle("is-active", isOpen);
      hamburger.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }
}

/* ==========================
   Hero Slider
========================== */
function initHeroSlider() {
  const slides = document.querySelectorAll(".hero-slide");
  const dotsWrap = document.querySelector(".hero-dots");
  if (!slides.length) return;

  let current = 0;
  let timer = null;

  function goTo(index) {
    slides.forEach((s, i) => s.classList.toggle("is-active", i === index));
    if (dotsWrap) {
      dotsWrap.querySelectorAll("button").forEach((d, i) => d.classList.toggle("is-active", i === index));
    }
    current = index;
  }

  function next() { goTo((current + 1) % slides.length); }
  function prev() { goTo((current - 1 + slides.length) % slides.length); }

  function restartAutoplay() {
    clearInterval(timer);
    timer = setInterval(next, 5500);
  }

  if (dotsWrap) {
    slides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", "Go to slide " + (i + 1));
      dot.addEventListener("click", () => { goTo(i); restartAutoplay(); });
      dotsWrap.appendChild(dot);
    });
  }

  const nextBtn = document.querySelector(".hero-arrow.next");
  const prevBtn = document.querySelector(".hero-arrow.prev");
  if (nextBtn) nextBtn.addEventListener("click", () => { next(); restartAutoplay(); });
  if (prevBtn) prevBtn.addEventListener("click", () => { prev(); restartAutoplay(); });

  goTo(0);
  restartAutoplay();
}

/* ==========================
   Chalkboard — Today's Market Price
========================== */
function initChalkboard() {
  const board = document.querySelector(".chalk-board-frame");
  if (!board) return;

  const todayLabel = board.querySelector(".chalk-today-label");
  const ticker = board.querySelector(".week-ticker");
  const tabsWrap = board.querySelector(".chalk-product-select");
  if (!ticker) return;

  const today = tazaGetToday();
  if (todayLabel) todayLabel.textContent = today + " · " + new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long" });

  function renderTicker(product) {
    ticker.innerHTML = "";
    DAY_NAMES.forEach((day) => {
      const cell = document.createElement("div");
      cell.className = "day" + (day === today ? " is-today" : "");
      cell.innerHTML = `<span class="d-name">${day.slice(0, 3)}</span><span class="d-price">${tazaFormatTaka(product.weeklyPrice[day])}</span>`;
      ticker.appendChild(cell);
    });
  }

  if (tabsWrap) {
    tabsWrap.innerHTML = "";
    TAZA_PRODUCTS.slice(0, 6).forEach((product, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = product.name;
      if (i === 0) btn.classList.add("is-active");
      btn.addEventListener("click", () => {
        tabsWrap.querySelectorAll("button").forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        renderTicker(product);
      });
      tabsWrap.appendChild(btn);
    });
  }

  renderTicker(TAZA_PRODUCTS[0]);
}

/* ==========================
   Category Grid Rendering
========================== */
function initCategoryGrid() {
  const grid = document.querySelector("[data-category-grid]");
  if (!grid) return;

  grid.innerHTML = TAZA_CATEGORIES.map((cat) => `
    <article class="category-card reveal">
      <a class="cat-img" href="category.html?cat=${encodeURIComponent(cat.filter)}" aria-label="Explore ${cat.name}">
        <img src="${cat.image}" alt="${cat.name}" loading="lazy" width="500" height="420">
      </a>
      <div class="cat-body">
        <h3>${cat.name}</h3>
        <a class="btn btn-outline btn-sm btn-block" href="category.html?cat=${encodeURIComponent(cat.filter)}">Explore</a>
      </div>
    </article>
  `).join("");

  observeReveal();
}

/* ==========================
   Product Card Builder (shared by home, category, favorite pages)
========================== */
function buildProductCard(product) {
  const today = tazaTodayPrice(product);
  const prevRaw = tazaPrevDayPrice(product);
  const showPrev = product.discount > 0 ? Math.round(today / (1 - product.discount / 100)) : prevRaw;
  const stars = "★".repeat(Math.round(product.rating)) + "☆".repeat(5 - Math.round(product.rating));
  const isFav = window.TazaFavorites ? window.TazaFavorites.has(product.id) : false;

  return `
    <article class="product-card reveal" data-product-id="${product.id}" data-category="${product.category}">
      <div class="product-media">
        <a href="product-details.html?id=${product.id}">
          <img src="${product.image}" alt="${product.name}" loading="lazy" width="600" height="520">
        </a>
        ${product.discount > 0 ? `<span class="discount-badge">-${product.discount}%</span>` : ""}
        <button type="button" class="fav-toggle${isFav ? " is-active" : ""}" data-fav-id="${product.id}" aria-label="Toggle favorite for ${product.name}" aria-pressed="${isFav}">
          <svg viewBox="0 0 24 24"><path d="M12 21s-7.5-4.6-10-9.2C.4 8.4 2 4.8 5.6 4.1c2-.4 4 .5 5 2.2 1-1.7 3-2.6 5-2.2 3.6.7 5.2 4.3 3.6 7.7C19.5 16.4 12 21 12 21z"/></svg>
        </button>
      </div>
      <div class="product-body">
        <span class="product-cat">${product.category}</span>
        <h3><a href="product-details.html?id=${product.id}">${product.name}</a></h3>
        <p class="product-desc">${product.description}</p>
        <div class="rating" aria-label="Rated ${product.rating} out of 5">${stars} <span class="r-count">(${product.reviewsCount})</span></div>
        <div class="price-row">
          <span class="price-today">${tazaFormatTaka(today)}<small>/${product.unit}</small></span>
          ${product.discount > 0 ? `<span class="price-prev">${tazaFormatTaka(showPrev)}</span>` : ""}
        </div>
        <div class="qty-selector" data-qty-wrap>
          <button type="button" data-qty-minus aria-label="Decrease quantity">−</button>
          <input type="text" value="1" inputmode="numeric" data-qty-input aria-label="Quantity">
          <button type="button" data-qty-plus aria-label="Increase quantity">+</button>
        </div>
        <div class="product-actions">
          <button type="button" class="btn btn-primary btn-sm" data-add-to-cart="${product.id}">Add to Cart</button>
          <a class="btn btn-outline btn-sm" href="product-details.html?id=${product.id}">View Details</a>
        </div>
      </div>
    </article>
  `;
}

function initProductGrid() {
  const grid = document.querySelector("[data-product-grid]");
  if (!grid) return;

  const toolbar = document.querySelector("[data-product-filter]");
  const urlParams = new URLSearchParams(window.location.search);
  const initialCat = urlParams.get("cat");

  function render(filter) {
    const list = filter && filter !== "All" ? TAZA_PRODUCTS.filter((p) => p.category === filter) : TAZA_PRODUCTS;
    grid.innerHTML = list.length
      ? list.map(buildProductCard).join("")
      : `<p class="no-results">No products found in this category yet — check back soon.</p>`;
    observeReveal();
    bindQuantitySelectors();
    bindAddToCartButtons();
    bindFavoriteButtons();
  }

  if (toolbar) {
    toolbar.querySelectorAll("[data-filter-value]").forEach((chip) => {
      chip.addEventListener("click", () => {
        toolbar.querySelectorAll("[data-filter-value]").forEach((c) => c.classList.remove("is-active"));
        chip.classList.add("is-active");
        render(chip.dataset.filterValue);
      });
    });
    if (initialCat) {
      toolbar.querySelectorAll("[data-filter-value]").forEach((c) => {
        c.classList.toggle("is-active", c.dataset.filterValue === initialCat);
      });
    }
  }

  render(initialCat || "All");
}

/* ==========================
   Quantity Selectors
========================== */
function bindQuantitySelectors() {
  document.querySelectorAll("[data-qty-wrap]").forEach((wrap) => {
    if (wrap.dataset.bound) return;
    wrap.dataset.bound = "true";
    const input = wrap.querySelector("[data-qty-input]");
    wrap.querySelector("[data-qty-minus]").addEventListener("click", () => {
      const val = Math.max(1, parseInt(input.value || "1", 10) - 1);
      input.value = val;
    });
    wrap.querySelector("[data-qty-plus]").addEventListener("click", () => {
      const val = Math.min(99, parseInt(input.value || "1", 10) + 1);
      input.value = val;
    });
    input.addEventListener("change", () => {
      let val = parseInt(input.value, 10);
      if (isNaN(val) || val < 1) val = 1;
      if (val > 99) val = 99;
      input.value = val;
    });
  });
}

function bindAddToCartButtons() {
  document.querySelectorAll("[data-add-to-cart]").forEach((btn) => {
    if (btn.dataset.bound) return;
    btn.dataset.bound = "true";
    btn.addEventListener("click", () => {
      const id = btn.dataset.addToCart;
      const card = btn.closest("[data-product-id], .pd-info");
      const qtyInput = card ? card.querySelector("[data-qty-input]") : null;
      const qty = qtyInput ? parseInt(qtyInput.value, 10) || 1 : 1;
      if (window.TazaCart) {
        window.TazaCart.addItem(id, qty);
        window.tazaShowToast("Added " + qty + " × " + (TAZA_PRODUCTS.find((p) => p.id === id) || {}).name + " to cart");
      }
    });
  });
}

function bindFavoriteButtons() {
  document.querySelectorAll("[data-fav-id]").forEach((btn) => {
    if (btn.dataset.bound) return;
    btn.dataset.bound = "true";
    btn.addEventListener("click", () => {
      const id = btn.dataset.favId;
      if (!window.TazaFavorites) return;
      const nowFav = window.TazaFavorites.toggle(id);
      btn.classList.toggle("is-active", nowFav);
      btn.setAttribute("aria-pressed", nowFav ? "true" : "false");
      window.tazaShowToast(nowFav ? "Added to favorites" : "Removed from favorites");
    });
  });
}

/* ==========================
   Product Details Page
========================== */
const TAZA_REVIEWS = [
  { name: "Farhana K.", initial: "F", date: "2 days ago", stars: 5, text: "Exactly as fresh as promised — delivered within the hour and cut just how I asked." },
  { name: "Imran S.", initial: "I", date: "1 week ago", stars: 4, text: "Good quality overall, though delivery took a bit longer than the estimate." },
  { name: "Nusrat J.", initial: "N", date: "2 weeks ago", stars: 5, text: "Been ordering weekly for two months now — the price board keeps things honest." }
];

function initProductDetailsPage() {
  const wrap = document.querySelector("[data-pd-wrap]");
  if (!wrap) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id") || TAZA_PRODUCTS[0].id;
  const product = TAZA_PRODUCTS.find((p) => p.id === id) || TAZA_PRODUCTS[0];

  document.title = product.name + " — Taza Bazar";

  const today = tazaTodayPrice(product);
  const prevRaw = tazaPrevDayPrice(product);
  const showPrev = product.discount > 0 ? Math.round(today / (1 - product.discount / 100)) : prevRaw;
  const stars = "★".repeat(Math.round(product.rating)) + "☆".repeat(5 - Math.round(product.rating));
  const isFav = window.TazaFavorites ? window.TazaFavorites.has(product.id) : false;

  wrap.innerHTML = `
    <div class="pd-layout">
      <div>
        <div class="pd-gallery-main"><img id="pdMainImage" src="${product.gallery[0]}" alt="${product.name}" width="600" height="600"></div>
        <div class="pd-thumbs">
          ${product.gallery.map((src, i) => `<button type="button" class="${i === 0 ? "is-active" : ""}" data-pd-thumb="${src}"><img src="${src}" alt="${product.name} view ${i + 1}"></button>`).join("")}
        </div>
      </div>
      <div class="pd-info">
        <span class="product-cat">${product.category}</span>
        <h1>${product.name}</h1>
        <div class="rating" aria-label="Rated ${product.rating} out of 5">${stars} <span class="r-count">(${product.reviewsCount} reviews)</span></div>
        <div class="pd-price-row">
          <span class="price-today">${tazaFormatTaka(today)}<small>/${product.unit}</small></span>
          ${product.discount > 0 ? `<span class="price-prev">${tazaFormatTaka(showPrev)}</span><span class="discount-badge" style="position:static;">-${product.discount}%</span>` : ""}
        </div>
        <p class="pd-desc">${product.description}</p>
        <div class="pd-buy-box">
          <div class="qty-selector" data-qty-wrap>
            <button type="button" data-qty-minus aria-label="Decrease quantity">−</button>
            <input type="text" value="1" inputmode="numeric" data-qty-input aria-label="Quantity">
            <button type="button" data-qty-plus aria-label="Increase quantity">+</button>
          </div>
          <button type="button" class="btn btn-primary" data-add-to-cart="${product.id}">Add to Cart</button>
          <button type="button" class="fav-toggle${isFav ? " is-active" : ""}" style="position:static;" data-fav-id="${product.id}" aria-label="Toggle favorite" aria-pressed="${isFav}">
            <svg viewBox="0 0 24 24"><path d="M12 21s-7.5-4.6-10-9.2C.4 8.4 2 4.8 5.6 4.1c2-.4 4 .5 5 2.2 1-1.7 3-2.6 5-2.2 3.6.7 5.2 4.3 3.6 7.7C19.5 16.4 12 21 12 21z"/></svg>
          </button>
        </div>

        <div class="pd-tabs" role="tablist">
          <button type="button" class="pd-tab-btn is-active" data-pd-tab="ingredients">Ingredients</button>
          <button type="button" class="pd-tab-btn" data-pd-tab="price">Weekly Price</button>
          <button type="button" class="pd-tab-btn" data-pd-tab="reviews">Reviews</button>
        </div>
        <div class="pd-tab-panel is-active" data-pd-panel="ingredients">
          <ul class="ingredient-list">${product.ingredients.map((i) => `<li>${i}</li>`).join("")}</ul>
        </div>
        <div class="pd-tab-panel" data-pd-panel="price">
          <div class="week-ticker" style="background:var(--color-ivory-200);padding:1rem;border-radius:var(--radius-md);">
            ${DAY_NAMES.map((day) => `<div class="day${day === tazaGetToday() ? " is-today" : ""}" style="color:var(--color-ink-900);"><span class="d-name" style="color:var(--color-ink-400);">${day.slice(0, 3)}</span><span class="d-price" style="color:var(--color-brick-600);">${tazaFormatTaka(product.weeklyPrice[day])}</span></div>`).join("")}
          </div>
        </div>
        <div class="pd-tab-panel" data-pd-panel="reviews">
          ${TAZA_REVIEWS.map((r) => `
            <div class="review">
              <div class="review-avatar">${r.initial}</div>
              <div>
                <div class="review-name">${r.name} <span class="review-date">· ${r.date}</span></div>
                <div class="rating" style="margin:0.2rem 0;">${"★".repeat(r.stars)}${"☆".repeat(5 - r.stars)}</div>
                <p style="margin:0;color:var(--color-ink-700);font-size:0.9rem;">${r.text}</p>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    </div>
  `;

  // Gallery thumbs
  wrap.querySelectorAll("[data-pd-thumb]").forEach((btn) => {
    btn.addEventListener("click", () => {
      wrap.querySelectorAll("[data-pd-thumb]").forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      document.getElementById("pdMainImage").src = btn.dataset.pdThumb;
    });
  });

  // Tabs
  wrap.querySelectorAll("[data-pd-tab]").forEach((btn) => {
    btn.addEventListener("click", () => {
      wrap.querySelectorAll("[data-pd-tab]").forEach((b) => b.classList.remove("is-active"));
      wrap.querySelectorAll("[data-pd-panel]").forEach((p) => p.classList.remove("is-active"));
      btn.classList.add("is-active");
      wrap.querySelector(`[data-pd-panel="${btn.dataset.pdTab}"]`).classList.add("is-active");
    });
  });

  // Related products
  const relatedGrid = document.querySelector("[data-pd-related]");
  if (relatedGrid) {
    const related = TAZA_PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
    const fallback = related.length ? related : TAZA_PRODUCTS.filter((p) => p.id !== product.id).slice(0, 4);
    relatedGrid.innerHTML = fallback.map(buildProductCard).join("");
  }

  bindQuantitySelectors();
  bindAddToCartButtons();
  bindFavoriteButtons();
  observeReveal();
}

/* ==========================
   Toast Notifications
========================== */
window.tazaShowToast = function (message) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(window._tazaToastTimer);
  window._tazaToastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2600);
};

/* ==========================
   Scroll Reveal Animation
========================== */
let tazaObserver;
function observeReveal() {
  if (!("IntersectionObserver" in window)) {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
    return;
  }
  if (!tazaObserver) {
    tazaObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          tazaObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
  }
  document.querySelectorAll(".reveal:not(.is-visible)").forEach((el) => tazaObserver.observe(el));
}

/* ==========================
   Page Loader
========================== */
function initLoader() {
  const overlay = document.querySelector(".loader-overlay");
  if (!overlay) return;
  window.addEventListener("load", () => {
    setTimeout(() => overlay.classList.add("is-hidden"), 250);
  });
}

/* ==========================
   Update header cart/favorite counts on load
========================== */
function refreshHeaderCounts() {
  if (window.TazaCart) window.TazaCart.updateBadge();
  if (window.TazaFavorites) window.TazaFavorites.updateBadge();
}

/* ==========================
   Init
========================== */
document.addEventListener("DOMContentLoaded", () => {
  initLoader();
  initHeader();
  initHeroSlider();
  initChalkboard();
  initCategoryGrid();
  initProductGrid();
  initProductDetailsPage();
  bindQuantitySelectors();
  bindAddToCartButtons();
  bindFavoriteButtons();
  observeReveal();
  refreshHeaderCounts();

  // Footer year
  document.querySelectorAll("[data-current-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
});
