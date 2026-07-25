/**
 * XDMovies Provider - HTTP Utilities
 * Handles requests to top.xdmovies.wtf
 */

import { DEFAULT_HEADERS, fetchText as baseFetchText } from '../_shared/http.js';

export const SITE_URL = 'https://top.xdmovies.wtf';

export const HEADERS = {
    ...DEFAULT_HEADERS,
    "Referer": `${SITE_URL}/`,
    "Origin": SITE_URL,
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
