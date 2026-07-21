/* ==========================================================
   TAZA BAZAR — darkmode.js
   Theme toggle with LocalStorage persistence and smooth
   transition. Applies before paint to avoid flash where possible.
   ========================================================== */

const TAZA_THEME_KEY = "tazabazar_theme";

function tazaApplyTheme(theme) {
  document.body.setAttribute("data-theme", theme);
  document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
    btn.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
  });
}

function tazaInitTheme() {
  const saved = localStorage.getItem(TAZA_THEME_KEY);
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = saved || (prefersDark ? "dark" : "light");
  tazaApplyTheme(theme);
}

function tazaToggleTheme() {
  const current = document.body.getAttribute("data-theme") === "dark" ? "dark" : "light";
  const next = current === "dark" ? "light" : "dark";
  tazaApplyTheme(next);
  localStorage.setItem(TAZA_THEME_KEY, next);
}

document.addEventListener("DOMContentLoaded", () => {
  tazaInitTheme();
  document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
    btn.addEventListener("click", tazaToggleTheme);
  });
});
