(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))a(i);new MutationObserver(i=>{for(const o of i)if(o.type==="childList")for(const s of o.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&a(s)}).observe(document,{childList:!0,subtree:!0});function n(i){const o={};return i.integrity&&(o.integrity=i.integrity),i.referrerPolicy&&(o.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?o.credentials="include":i.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function a(i){if(i.ep)return;i.ep=!0;const o=n(i);fetch(i.href,o)}})();function M(){try{return localStorage.getItem("theme")||"light"}catch{return"light"}}function B(e){document.documentElement.setAttribute("data-theme",e);try{localStorage.setItem("theme",e)}catch{}}function I(e){return e==="light"?"dark":"light"}function N(e,t){if(!t||!t.trim())return e;const n=t.trim().toLowerCase();return e.filter(a=>{const i=(a.name||"").toLowerCase(),o=(a.capital||"").toLowerCase(),s=(a.nativeName||"").toLowerCase(),p=Array.isArray(a.altSpellings)?a.altSpellings.join(" ").toLowerCase():"";return i.includes(n)||o.includes(n)||s.includes(n)||p.includes(n)})}function S(e,t){return!t||!t.trim()?e:e.filter(n=>n.region===t)}const T=e=>e?e.toLocaleString():"N/A";function d(e){return String(e||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function _(e=[]){return e.map(t=>t.name||t.code).join(", ")||"N/A"}function O(e=[]){return e.map(t=>t.name).join(", ")||"N/A"}function j(e,t,n,{onBack:a,onSelectCountry:i}){var l,g;const o=(t.borders||[]).map(r=>n.find(h=>h.alpha3Code===r)||{name:r,alpha3Code:r}),s=(t.topLevelDomain||[]).filter(Boolean).join(", ")||"N/A",p=_(t.currencies),m=O(t.languages),w=((l=t.flags)==null?void 0:l.svg)||((g=t.flags)==null?void 0:g.png)||t.flag||"",u=o.length?`
      <div class="border-country-group">
        <p><b>  Border Countries:</b></p>
        <div class="border-country-list">
          ${o.map(r=>`<button class="border-pill" data-code="${r.alpha3Code}">${d(r.name)}</button>`).join("")}
        </div>
      </div>
    `:`
      <div class="border-country-group">
        <p><b>Border Countries:</b></p>
        <div class="border-country-list">
          <span class="no-borders">None</span>
        </div>
      </div>
    `;e.innerHTML=`
    <div class="detail-page">
      <button class="back-btn" id="backBtn" type="button" aria-label="Go back">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
          stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        Back
      </button>

      <div class="detail-layout">
        <div class="detail-flag-wrap">
          <img src="${d(w)}" alt="Flag of ${d(t.name)}" />
        </div>

        <div class="detail-content">
          <h1 class="detail-name">${d(t.name)}</h1>

          <div class="detail-facts">
            <div>
              <p class="detail-fact"><strong>Native Name: </strong><span>${d(t.nativeName||t.name||"N/A")}</span></p>
              <p class="detail-fact"><strong>Population: </strong><span>${T(t.population)}</span></p>
              <p class="detail-fact"><strong>Region: </strong><span>${d(t.region||"N/A")}</span></p>
              <p class="detail-fact"><strong>Sub Region: </strong><span>${d(t.subregion||"N/A")}</span></p>
              <p class="detail-fact"><strong>Capital: </strong><span>${d(t.capital||"N/A")}</span></p>
            </div>

            <div>
              <p class="detail-fact"><strong>Top Level Domain: </strong><span>${d(s)}</span></p>
              <p class="detail-fact"><strong>Currencies: </strong><span>${d(p)}</span></p>
              <p class="detail-fact"><strong>Languages: </strong><span>${d(m)}</span></p>
            </div>
          </div>

          ${u}
        </div>
      </div>
    </div>
  `;const v=document.getElementById("backBtn");v&&v.addEventListener("click",a),e.querySelectorAll(".border-pill").forEach(r=>{r.addEventListener("click",()=>{const h=n.find(x=>x.alpha3Code===r.dataset.code);h&&i(h)})})}let b=[],c=M(),E="",f="";B(c);fetch("./data.json").then(e=>{if(!e.ok)throw new Error("Failed to load country data");return e.json()}).then(e=>{b=e,D()}).catch(e=>{document.getElementById("root").innerHTML=`
      <p style="padding:40px;color:red;">Failed to load country data: ${e.message}</p>
    `});function D(){H(),F(),$()}function H(){document.getElementById("root").innerHTML=`
    <header class="header">
      <div class="header__inner">
        <span class="header__logo">Where in the world?</span>
        <button class="theme-toggle" id="themeBtn" aria-label="Toggle dark mode">
          ${C(c)}
          <span id="themeLabel">${c==="dark"?"Dark Mode":"Light Mode"}</span>
        </button>
      </div>
    </header>
    <main id="content"></main>
  `}function F(){document.getElementById("themeBtn").addEventListener("click",()=>{c=I(c),B(c),document.getElementById("themeBtn").innerHTML=`${C(c)}<span id="themeLabel">${c==="dark"?"Dark Mode":"Light Mode"}</span>`})}function C(e){return e==="light"?`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
      stroke="currentColor" stroke-width="2" aria-hidden="true">
      <circle cx="12" cy="12" r="5"/>
      <path stroke-linecap="round" stroke-linejoin="round"
        d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42
           M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
    </svg>`:`<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"
    stroke="none" stroke-width="2" aria-hidden="true">
    <path stroke-linecap="round" stroke-linejoin="round"
      d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
  </svg>`}function $(){const e=document.getElementById("content");e.innerHTML=`
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
          value="${L(E)}"
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
          <span id="filterLabel">${f||"Filter by Region"}</span>

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
      <div id="skeletonGrid" class="skeleton-grid">${R(8)}</div>
      <div id="mainGrid" style="display:none">
        <p class="results-count" id="resultsCount"></p>
        <div class="countries-grid" id="countriesGrid"></div>
      </div>
    </div>
  `,setTimeout(()=>{const t=document.getElementById("skeletonGrid"),n=document.getElementById("mainGrid");t&&(t.style.display="none"),n&&(n.style.display="block"),k(),G()},600)}function G(){const e=document.getElementById("searchInput"),t=document.getElementById("filterContainer"),n=document.getElementById("filterButton"),a=document.getElementById("filterDropdown"),i=document.getElementById("filterLabel"),o=document.getElementById("resetFilterOption"),s=a.querySelectorAll(".filter-option");function p(){o&&(o.style.display=f?"block":"none")}function m(){i.textContent=f||"Filter by Region"}function w(){p(),a.classList.add("show"),n.classList.add("open"),n.setAttribute("aria-expanded","true")}function u(){a.classList.remove("show"),n.classList.remove("open"),n.setAttribute("aria-expanded","false")}function v(){a.classList.contains("show")?u():w()}e.addEventListener("input",l=>{E=l.target.value.trim(),k()}),n.addEventListener("click",v),s.forEach(l=>{const g=()=>{f=l.dataset.region,m(),p(),u(),k()};l.addEventListener("click",g),l.addEventListener("keydown",r=>{(r.key==="Enter"||r.key===" ")&&(r.preventDefault(),g())})}),document.addEventListener("click",l=>{t.contains(l.target)||u()}),m(),p()}function k(){const e=document.getElementById("resultsCount"),t=document.getElementById("countriesGrid");if(!e||!t)return;let n=S(b,f);if(n=N(n,E),e.textContent=n.length>0?`${n.length} ${n.length===1?"country":"countries"} found`:"",n.length===0){t.innerHTML=`
      <div class="empty">
        <div class="empty__icon">🌍</div>
        <div class="empty__title">No countries found</div>
        <div class="empty__sub">Try adjusting your search or filter</div>
      </div>
    `;return}t.innerHTML=n.map(a=>P(a)).join(""),t.querySelectorAll(".card").forEach(a=>{const i=()=>{const o=b.find(s=>s.alpha3Code===a.dataset.code);A(o)};a.addEventListener("click",i),a.addEventListener("keydown",o=>{(o.key==="Enter"||o.key===" ")&&(o.preventDefault(),i())})})}function P(e){var n,a,i;const t=((n=e.flags)==null?void 0:n.svg)||((a=e.flags)==null?void 0:a.png)||e.flag||"";return`
    <article
      class="card"
      tabindex="0"
      role="button"
      data-code="${e.alpha3Code}"
      aria-label="View details for ${L(e.name)}"
    >
      <div class="card__flag-wrap">
        <img
          class="card__flag"
          src="${t}"
          alt="Flag of ${L(e.name)}"
          loading="lazy"
          onerror="this.onerror=null; this.src='${((i=e.flags)==null?void 0:i.svg)||e.flag||""}'"
        />
      </div>

      <div class="card__body">
        <h2 class="card__name">${y(e.name)}</h2>
        <div class="card__detail">
          <p><span>Population: </span><span class="val">${q(e.population)}</span></p>
          <p><span>Region: </span><span class="val">${y(e.region||"N/A")}</span></p>
          <p><span>Capital: </span><span class="val">${y(e.capital||"N/A")}</span></p>
        </div>
      </div>
    </article>
  `}function R(e){return Array.from({length:e}).map(()=>`
      <div class="skeleton-card">
        <div class="skeleton-flag"></div>
        <div class="skeleton-body">
          <div class="skeleton-line medium"></div>
          <div class="skeleton-line short" style="margin-top:16px"></div>
          <div class="skeleton-line medium"></div>
          <div class="skeleton-line short"></div>
        </div>
      </div>
    `).join("")}function A(e){if(!e)return;window.scrollTo({top:0,behavior:"smooth"});const t=document.getElementById("content");j(t,e,b,{onBack:()=>{$(),window.scrollTo({top:0,behavior:"smooth"})},onSelectCountry:n=>A(n)})}function q(e){return e?e.toLocaleString():"N/A"}function y(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function L(e){return String(e||"").replace(/"/g,"&quot;")}
