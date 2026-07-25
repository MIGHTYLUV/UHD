/**
 * VegaMovies HTTP Utilities
 */

import { DEFAULT_HEADERS, fetchText as baseFetchText } from '../_shared/http.js';

export const SITE_URL = 'https://vegamovies.navy';

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
