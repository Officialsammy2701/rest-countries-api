/**
 * country-details.js
 * Renders the country detail page into a given container element.
 */

const fmt = (n) => (n ? n.toLocaleString() : 'N/A');

function escapeHTML(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatCurrencies(currencies = []) {
  return currencies.map((currency) => currency.name || currency.code).join(', ') || 'N/A';
}

function formatLanguages(languages = []) {
  return languages.map((language) => language.name).join(', ') || 'N/A';
}

export function renderDetailPage(container, country, allCountries, { onBack, onSelectCountry }) {
  const borderCountries = (country.borders || []).map((code) => {
    return allCountries.find((c) => c.alpha3Code === code) || { name: code, alpha3Code: code };
  });

  const tld = (country.topLevelDomain || []).filter(Boolean).join(', ') || 'N/A';
  const currencies = formatCurrencies(country.currencies);
  const languages = formatLanguages(country.languages);
  const flagSrc = country.flags?.svg || country.flags?.png || country.flag || '';

  const bordersHTML = borderCountries.length
    ? `
      <div class="border-country-group">
        <p><b>  Border Countries:</b></p>
        <div class="border-country-list">
          ${borderCountries
            .map(
              (bc) =>
                `<button class="border-pill" data-code="${bc.alpha3Code}">${escapeHTML(bc.name)}</button>`
            )
            .join('')}
        </div>
      </div>
    `
    : `
      <div class="border-country-group">
        <p><b>Border Countries:</b></p>
        <div class="border-country-list">
          <span class="no-borders">None</span>
        </div>
      </div>
    `;

  container.innerHTML = `
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
          <img src="${escapeHTML(flagSrc)}" alt="Flag of ${escapeHTML(country.name)}" />
        </div>

        <div class="detail-content">
          <h1 class="detail-name">${escapeHTML(country.name)}</h1>

          <div class="detail-facts">
            <div>
              <p class="detail-fact"><strong>Native Name: </strong><span>${escapeHTML(country.nativeName || country.name || 'N/A')}</span></p>
              <p class="detail-fact"><strong>Population: </strong><span>${fmt(country.population)}</span></p>
              <p class="detail-fact"><strong>Region: </strong><span>${escapeHTML(country.region || 'N/A')}</span></p>
              <p class="detail-fact"><strong>Sub Region: </strong><span>${escapeHTML(country.subregion || 'N/A')}</span></p>
              <p class="detail-fact"><strong>Capital: </strong><span>${escapeHTML(country.capital || 'N/A')}</span></p>
            </div>

            <div>
              <p class="detail-fact"><strong>Top Level Domain: </strong><span>${escapeHTML(tld)}</span></p>
              <p class="detail-fact"><strong>Currencies: </strong><span>${escapeHTML(currencies)}</span></p>
              <p class="detail-fact"><strong>Languages: </strong><span>${escapeHTML(languages)}</span></p>
            </div>
          </div>

          ${bordersHTML}
        </div>
      </div>
    </div>
  `;

  const backBtn = document.getElementById('backBtn');
  if (backBtn) {
    backBtn.addEventListener('click', onBack);
  }

  container.querySelectorAll('.border-pill').forEach((btn) => {
    btn.addEventListener('click', () => {
      const found = allCountries.find((c) => c.alpha3Code === btn.dataset.code);
      if (found) onSelectCountry(found);
    });
  });
}

export function destroyDetailPage() {
  // No teardown needed for now
}