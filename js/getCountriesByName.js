/**
 * getCountriesByName.js
 * Filters a countries array by a name/capital search query.
 * 
 * @param {Array} countries
 * @param {string} query
 * @returns {Array}
 */

export function getCountriesByName(countries, query) {
  if (!query || !query.trim()) return countries;

  const q = query.trim().toLowerCase();

  return countries.filter((country) => {
    const name = (country.name || '').toLowerCase();
    const capital = (country.capital || '').toLowerCase();
    const nativeName = (country.nativeName || '').toLowerCase();
    const altSpellings = Array.isArray(country.altSpellings)
      ? country.altSpellings.join(' ').toLowerCase()
      : '';

    return (
      name.includes(q) ||
      capital.includes(q) ||
      nativeName.includes(q) ||
      altSpellings.includes(q)
    );
  });
}