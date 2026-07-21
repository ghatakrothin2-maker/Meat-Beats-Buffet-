/* ==========================================================
   TAZA BAZAR — cart.js
   Shopping cart: add / remove / update quantity, totals,
   persisted to LocalStorage, cart page rendering.
   ========================================================== */

const TAZA_CART_KEY = "tazabazar_cart";
const DELIVERY_CHARGE = 60;

window.TazaCart = (function () {
  function read() {
    try {
      const raw = localStorage.getItem(TAZA_CART_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function write(items) {
    localStorage.setItem(TAZA_CART_KEY, JSON.stringify(items));
    updateBadge();
  }

  function addItem(productId, qty) {
    const items = read();
    const existing = items.find((i) => i.id === productId);
    if (existing) {
      existing.qty += qty;
    } else {
      items.push({ id: productId, qty: qty });
    }
    write(items);
  }

  function removeItem(productId) {
    write(read().filter((i) => i.id !== productId));
  }

  function setQty(productId, qty) {
    const items = read();
    const existing = items.find((i) => i.id === productId);
    if (existing) {
      existing.qty = Math.max(1, qty);
      write(items);
    }
  }

  function clear() {
    write([]);
  }

  function totalCount() {
    return read().reduce((sum, i) => sum + i.qty, 0);
  }

  function updateBadge() {
    document.querySelectorAll("[data-cart-count]").forEach((el) => {
      el.textContent = totalCount();
    });
  }

  return { read, write, addItem, removeItem, setQty, clear, totalCount, updateBadge };
})();

/* ==========================
   Cart Page Rendering
========================== */
function renderCartPage() {
  const tbody = document.querySelector("[data-cart-body]");
  const emptyState = document.querySelector("[data-cart-empty]");
  const cartLayout = document.querySelector("[data-cart-layout]");
  if (!tbody) return;

  const items = window.TazaCart.read();

  if (!items.length) {
    if (cartLayout) cartLayout.style.display = "none";
    if (emptyState) emptyState.style.display = "block";
    updateCartTotals();
    return;
  }

  if (cartLayout) cartLayout.style.display = "";
  if (emptyState) emptyState.style.display = "none";

  tbody.innerHTML = items.map((item) => {
    const product = TAZA_PRODUCTS.find((p) => p.id === item.id);
    if (!product) return "";
    const price = tazaTodayPrice(product);
    const lineTotal = price * item.qty;
    return `
      <tr data-cart-row="${product.id}">
        <td data-label="Product">
          <div class="cart-product">
            <img src="${product.image}" alt="${product.name}" width="64" height="64">
            <div>
              <div class="cart-product-name">${product.name}</div>
              <div class="cart-product-cat">${product.category}</div>
            </div>
          </div>
        </td>
        <td data-label="Price">${tazaFormatTaka(price)}/${product.unit}</td>
        <td data-label="Quantity">
          <div class="qty-selector" data-qty-wrap>
            <button type="button" data-qty-minus aria-label="Decrease quantity">−</button>
            <input type="text" value="${item.qty}" inputmode="numeric" data-qty-input data-cart-qty="${product.id}" aria-label="Quantity">
            <button type="button" data-qty-plus aria-label="Increase quantity">+</button>
          </div>
        </td>
        <td data-label="Total" class="cart-line-total">${tazaFormatTaka(lineTotal)}</td>
        <td data-label="Remove"><button type="button" class="cart-remove" data-cart-remove="${product.id}">Remove</button></td>
      </tr>
    `;
  }).join("");

  // Bind qty controls specific to cart rows
  tbody.querySelectorAll("[data-cart-qty]").forEach((input) => {
    input.addEventListener("change", () => {
      let val = parseInt(input.value, 10);
      if (isNaN(val) || val < 1) val = 1;
      window.TazaCart.setQty(input.dataset.cartQty, val);
      renderCartPage();
    });
  });
  tbody.querySelectorAll("[data-qty-wrap]").forEach((wrap) => {
    const input = wrap.querySelector("[data-qty-input]");
    wrap.querySelector("[data-qty-minus]").addEventListener("click", () => {
      const val = Math.max(1, parseInt(input.value || "1", 10) - 1);
      window.TazaCart.setQty(input.dataset.cartQty, val);
      renderCartPage();
    });
    wrap.querySelector("[data-qty-plus]").addEventListener("click", () => {
      const val = parseInt(input.value || "1", 10) + 1;
      window.TazaCart.setQty(input.dataset.cartQty, val);
      renderCartPage();
    });
  });
  tbody.querySelectorAll("[data-cart-remove]").forEach((btn) => {
    btn.addEventListener("click", () => {
      window.TazaCart.removeItem(btn.dataset.cartRemove);
      window.tazaShowToast("Item removed from cart");
      renderCartPage();
    });
  });

  updateCartTotals();
}

function updateCartTotals() {
  const items = window.TazaCart.read();
  const subtotal = items.reduce((sum, item) => {
    const product = TAZA_PRODUCTS.find((p) => p.id === item.id);
    return product ? sum + tazaTodayPrice(product) * item.qty : sum;
  }, 0);
  const delivery = items.length ? DELIVERY_CHARGE : 0;
  const total = subtotal + delivery;

  const subtotalEl = document.querySelector("[data-cart-subtotal]");
  const deliveryEl = document.querySelector("[data-cart-delivery]");
  const totalEl = document.querySelector("[data-cart-total]");
  if (subtotalEl) subtotalEl.textContent = tazaFormatTaka(subtotal);
  if (deliveryEl) deliveryEl.textContent = tazaFormatTaka(delivery);
  if (totalEl) totalEl.textContent = tazaFormatTaka(total);
}

document.addEventListener("DOMContentLoaded", () => {
  renderCartPage();

  const checkoutBtn = document.querySelector("[data-checkout]");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      if (!window.TazaCart.read().length) {
        window.tazaShowToast("Your cart is empty");
        return;
      }
      window.tazaShowToast("Order placed! Thank you for shopping with Taza Bazar.");
      window.TazaCart.clear();
      setTimeout(renderCartPage, 400);
    });
  }

  const promoBtn = document.querySelector("[data-apply-promo]");
  if (promoBtn) {
    promoBtn.addEventListener("click", () => {
      window.tazaShowToast("Promo code applied where valid");
    });
  }
});
