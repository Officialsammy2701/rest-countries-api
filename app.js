/**
 * app.js
 * Main entry point for Rest Countries Explorer.
 * Handles rendering the home page (grid + controls) and
 * delegates detail view to pages/country-details/country-details.js.
 **/

import { getInitialTheme, applyTheme, toggleTheme } from "./js/theme.js";
import { getCountriesByName } from "./js/getCountriesByName.js";
import { getCountriesByRegion } from "./js/getCountriesByRegion.js";

import {
  renderDetailPage,
  destroyDetailPage,
} from "./features/country-details/country-details.js";

/* --------------------------------------------------
   State
-------------------------------------------------- */
let allCountries = [];
let currentTheme = getInitialTheme();
let searchQuery = "";
let selectedRegion = "";

/* --------------------------------------------------
   Bootstrap
-------------------------------------------------- */
applyTheme(currentTheme);

fetch("./data.json")
  .then((r) => {
    if (!r.ok) {
      throw new Error("Failed to load country data");
    }
    return r.json();
  })
  .then((data) => {
    allCountries = data;
    init();
  })
  .catch((err) => {
    document.getElementById("root").innerHTML = `
      <p style="padding:40px;color:red;">Failed to load country data: ${err.message}</p>
    `;
  });

/* --------------------------------------------------
   Init
-------------------------------------------------- */
function init() {
  renderShell();
  bindHeader();
  renderHomePage();
}

/* --------------------------------------------------
   Shell (header + content wrapper)
-------------------------------------------------- */
function renderShell() {
  document.getElementById("root").innerHTML = `
    <header class="header">
      <div class="header__inner">
        <span class="header__logo">Where in the world?</span>
        <button class="theme-toggle" id="themeBtn" aria-label="Toggle dark mode">
          ${getThemeIcon(currentTheme)}
          <span id="themeLabel">${currentTheme === "dark" ? "Dark Mode" : "Light Mode"}</span>
        </button>
      </div>
    </header>
    <main id="content"></main>
  `;
}

function bindHeader() {
  document.getElementById("themeBtn").addEventListener("click", () => {
    currentTheme = toggleTheme(currentTheme);
    applyTheme(currentTheme);

    document.getElementById("themeBtn").innerHTML =
      `${getThemeIcon(currentTheme)}<span id="themeLabel">${currentTheme === "dark" ? "Dark Mode" : "Light Mode"}</span>`;
  });
}

function getThemeIcon(theme) {
  if (theme === "light") {
    return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
      stroke="currentColor" stroke-width="2" aria-hidden="true">
      <circle cx="12" cy="12" r="5"/>
      <path stroke-linecap="round" stroke-linejoin="round"
        d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42
           M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
    </svg>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"
    stroke="none" stroke-width="2" aria-hidden="true">
    <path stroke-linecap="round" stroke-linejoin="round"
      d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
  </svg>`;
}

/* --------------------------------------------------
   Home Page
-------------------------------------------------- */
function renderHomePage() {
  const content = document.getElementById("content");

  content.innerHTML = `
    <div class="controls">
      <div class="search-wrap">
        <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" fill="none"
          viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <circle cx="11" cy="11" r="8"></circle>
          <path stroke-linecap="round" d="M21 21l-4.35-4.35"></path>
        </svg>

        <input
          type="search"
          id="searchInput"
          class="search-input"
          placeholder="Search for a country..."
          value="${escapeAttr(searchQuery)}"
          aria-label="Search countries"
        />
      </div>

      <div class="filter-container" id="filterContainer">
        <button
          class="filter-button"
          id="filterButton"
          type="button"
          aria-haspopup="listbox"
          aria-expanded="false"
        >
          <span id="filterLabel">${selectedRegion || "Filter by Region"}</span>

          <svg
            class="filter-chevron"
            id="filterChevron"
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="8"
            viewBox="0 0 12 8"
            aria-hidden="true"
          >
            <path
              d="M1 1l5 5 5-5"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
          </svg>
        </button>

        <ul class="filter-dropdown" id="filterDropdown" role="listbox">
          <li
            class="filter-option filter-reset-option"
            data-region=""
            role="option"
            tabindex="0"
            id="resetFilterOption"
          >
            Clear Filter
          </li>
          <li class="filter-option" data-region="Africa" role="option" tabindex="0">Africa</li>
          <li class="filter-option" data-region="Americas" role="option" tabindex="0">America</li>
          <li class="filter-option" data-region="Asia" role="option" tabindex="0">Asia</li>
          <li class="filter-option" data-region="Europe" role="option" tabindex="0">Europe</li>
          <li class="filter-option" data-region="Oceania" role="option" tabindex="0">Oceania</li>
        </ul>
      </div>
    </div>

    <div class="grid-wrap">
      <div id="skeletonGrid" class="skeleton-grid">${buildSkeletons(8)}</div>
      <div id="mainGrid" style="display:none">
        <p class="results-count" id="resultsCount"></p>
        <div class="countries-grid" id="countriesGrid"></div>
      </div>
    </div>
  `;

  setTimeout(() => {
    const skeletonGrid = document.getElementById("skeletonGrid");
    const mainGrid = document.getElementById("mainGrid");

    if (skeletonGrid) skeletonGrid.style.display = "none";
    if (mainGrid) mainGrid.style.display = "block";

    renderGrid();
    bindHomeControls();
  }, 600);
}

function bindHomeControls() {
  const searchInput = document.getElementById("searchInput");
  const filterContainer = document.getElementById("filterContainer");
  const filterButton = document.getElementById("filterButton");
  const filterDropdown = document.getElementById("filterDropdown");
  const filterLabel = document.getElementById("filterLabel");
  const resetFilterOption = document.getElementById("resetFilterOption");
  const filterOptions = filterDropdown.querySelectorAll(".filter-option");

  function updateResetOptionVisibility() {
    if (!resetFilterOption) return;
    resetFilterOption.style.display = selectedRegion ? "block" : "none";
  }

  function updateFilterLabel() {
    filterLabel.textContent = selectedRegion || "Filter by Region";
  }

  function openDropdown() {
    updateResetOptionVisibility();
    filterDropdown.classList.add("show");
    filterButton.classList.add("open");
    filterButton.setAttribute("aria-expanded", "true");
  }

  function closeDropdown() {
    filterDropdown.classList.remove("show");
    filterButton.classList.remove("open");
    filterButton.setAttribute("aria-expanded", "false");
  }

  function toggleDropdown() {
    const isOpen = filterDropdown.classList.contains("show");
    if (isOpen) {
      closeDropdown();
    } else {
      openDropdown();
    }
  }

  searchInput.addEventListener("input", (e) => {
    searchQuery = e.target.value.trim();
    renderGrid();
  });

  filterButton.addEventListener("click", toggleDropdown);

  filterOptions.forEach((option) => {
    const activateOption = () => {
      selectedRegion = option.dataset.region;
      updateFilterLabel();
      updateResetOptionVisibility();
      closeDropdown();
      renderGrid();
    };

    option.addEventListener("click", activateOption);

    option.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        activateOption();
      }
    });
  });

  document.addEventListener("click", (e) => {
    if (!filterContainer.contains(e.target)) {
      closeDropdown();
    }
  });

  updateFilterLabel();
  updateResetOptionVisibility();
}

function renderGrid() {
  const countEl = document.getElementById("resultsCount");
  const gridEl = document.getElementById("countriesGrid");

  if (!countEl || !gridEl) return;

  let list = getCountriesByRegion(allCountries, selectedRegion);
  list = getCountriesByName(list, searchQuery);

  countEl.textContent =
    list.length > 0
      ? `${list.length} ${list.length === 1 ? "country" : "countries"} found`
      : "";

  if (list.length === 0) {
    gridEl.innerHTML = `
      <div class="empty">
        <div class="empty__icon">🌍</div>
        <div class="empty__title">No countries found</div>
        <div class="empty__sub">Try adjusting your search or filter</div>
      </div>
    `;
    return;
  }

  gridEl.innerHTML = list.map((c) => buildCard(c)).join("");

  gridEl.querySelectorAll(".card").forEach((card) => {
    const handler = () => {
      const country = allCountries.find(
        (c) => c.alpha3Code === card.dataset.code,
      );
      showDetail(country);
    };

    card.addEventListener("click", handler);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handler();
      }
    });
  });
}

function buildCard(c) {
  const flagSrc = c.flags?.svg || c.flags?.png || c.flag || '';
  return `
    <article
      class="card"
      tabindex="0"
      role="button"
      data-code="${c.alpha3Code}"
      aria-label="View details for ${escapeAttr(c.name)}"
    >
      <div class="card__flag-wrap">
        <img
          class="card__flag"
          src="${flagSrc}"
          alt="Flag of ${escapeAttr(c.name)}"
          loading="lazy"
          onerror="this.onerror=null; this.src='${c.flags?.svg || c.flag || ''}'"
        />
      </div>

      <div class="card__body">
        <h2 class="card__name">${escapeHTML(c.name)}</h2>
        <div class="card__detail">
          <p><span>Population: </span><span class="val">${fmt(c.population)}</span></p>
          <p><span>Region: </span><span class="val">${escapeHTML(c.region || "N/A")}</span></p>
          <p><span>Capital: </span><span class="val">${escapeHTML(c.capital || "N/A")}</span></p>
        </div>
      </div>
    </article>
  `;
}

function buildSkeletons(n) {
  return Array.from({ length: n })
    .map(
      () => `
      <div class="skeleton-card">
        <div class="skeleton-flag"></div>
        <div class="skeleton-body">
          <div class="skeleton-line medium"></div>
          <div class="skeleton-line short" style="margin-top:16px"></div>
          <div class="skeleton-line medium"></div>
          <div class="skeleton-line short"></div>
        </div>
      </div>
    `,
    )
    .join("");
}

/* --------------------------------------------------
   Detail navigation
-------------------------------------------------- */
function showDetail(country) {
  if (!country) return;

  window.scrollTo({ top: 0, behavior: "smooth" });

  const content = document.getElementById("content");

  renderDetailPage(content, country, allCountries, {
    onBack: () => {
      destroyDetailPage();
      renderHomePage();
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    onSelectCountry: (c) => showDetail(c),
  });
}

/* --------------------------------------------------
   Utilities
-------------------------------------------------- */
function fmt(n) {
  return n ? n.toLocaleString() : "N/A";
}

function escapeHTML(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttr(str) {
  return String(str || "").replace(/"/g, "&quot;");
}
