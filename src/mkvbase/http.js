import { DEFAULT_HEADERS, fetchText as baseFetchText } from '../_shared/http.js';

export const SITE_URL = 'https://mkvbase.site';

export const HEADERS = {
    ...DEFAULT_HEADERS,
    "Referer": `${SITE_URL}/`,
};

export async function fetchText(url, options = {}) {
    return baseFetchText(url, {
        ...options,
        headers: {
            ...HEADERS,
            ...(options.headers || {}),
        },
    });
}
