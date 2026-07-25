import { fetchText, DEFAULT_HEADERS } from '../_shared/http.js';

export const BASE_URL = 'https://4khdhub.one';

export const HEADERS = {
    ...DEFAULT_HEADERS,
    'Origin': BASE_URL,
    'Referer': `${BASE_URL}/`
};

export async function fetchHtml(url) {
    return await fetchText(url, { headers: HEADERS });
}
