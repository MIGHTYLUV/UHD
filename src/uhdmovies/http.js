import { fetchText, DEFAULT_HEADERS } from '../_shared/http.js';

const BASE_URL = 'https://uhdmovies.casa';

export async function fetchSearch(query) {
    const url = `${BASE_URL}/?s=${encodeURIComponent(query)}`;
    return await fetchText(url);
}

export async function fetchPost(url) {
    return await fetchText(url);
}

export { BASE_URL, DEFAULT_HEADERS };
