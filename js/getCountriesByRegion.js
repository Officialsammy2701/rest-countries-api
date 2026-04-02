/**
 * getCountriesByRegion.js
 * Filters a countries array by world region.
 *
 * @param {Array} countries
 * @param {string} region
 * @returns {Array}
 */
export function getCountriesByRegion(countries, region) {
  if (!region || !region.trim()) return countries;
  return countries.filter((country) => country.region === region);
}