import { fetchText, DEFAULT_HEADERS } from '../_shared/http.js';

const BASE_URL = 'https://v3.olamovies.mov';

export async function fetchHtml(url) {
  console.log(`[OlaMovies] Fetching ${url}`);
  return fetchText(url, {
    ...DEFAULT_HEADERS,
    Referer: BASE_URL
  });
}

export function getBaseUrl() {
  return BASE_URL;
}
