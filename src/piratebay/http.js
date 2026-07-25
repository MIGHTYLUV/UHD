/**
 * ThePirateBay HTTP Utilities
 */

import { DEFAULT_HEADERS, fetchJson as baseFetchJson, fetchText as baseFetchText } from '../_shared/http.js';

export const API_URL = 'https://apibay.org';
export const SITE_URL = 'https://thepiratebay.org';

export const HEADERS = {
    ...DEFAULT_HEADERS,
    "Referer": `${SITE_URL}/`,
};

export async function fetchJson(url, options = {}) {
    return baseFetchJson(url, {
        ...options,
        headers: {
            ...HEADERS,
            ...(options.headers || {}),
        },
    });
}

export async function fetchText(url, options = {}) {
    return baseFetchText(url, {
        ...options,
        headers: {
            ...HEADERS,
            ...(options.headers || {}),
        },
    });
}
