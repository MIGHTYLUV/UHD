/**
 * Shared HTTP Utilities
 * Common fetch helpers with browser-like headers, retry, and cookie support.
 */

export const DEFAULT_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9,hi;q=0.8",
    "Cache-Control": "no-cache",
};

/**
 * Fetch text content from a URL with retries
 * @param {string} url - URL to fetch
 * @param {object} options - Additional fetch options
 * @param {number} retries - Number of retries (default: 2)
 * @returns {Promise<string>} Response text
 */
export async function fetchText(url, options = {}, retries = 2) {
    const { headers: extraHeaders, ...restOptions } = options;
    
    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            const response = await fetch(url, {
                headers: {
                    ...DEFAULT_HEADERS,
                    ...extraHeaders,
                },
                ...restOptions,
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status} for ${url}`);
            }

            return await response.text();
        } catch (err) {
            if (attempt === retries) {
                throw err;
            }
            // Wait before retry: 1s, 2s
            await new Promise(r => setTimeout(r, (attempt + 1) * 1000));
        }
    }
}

/**
 * Fetch JSON content from a URL
 * @param {string} url - URL to fetch
 * @param {object} options - Additional fetch options
 * @returns {Promise<object>} Parsed JSON
 */
export async function fetchJson(url, options = {}) {
    const text = await fetchText(url, {
        ...options,
        headers: {
            "Accept": "application/json",
            ...(options.headers || {}),
        },
    });
    return JSON.parse(text);
}

/**
 * Follow redirects and return the final URL
 * @param {string} url - Starting URL
 * @returns {Promise<string>} Final URL after redirects
 */
export async function followRedirects(url) {
    try {
        const response = await fetch(url, {
            headers: DEFAULT_HEADERS,
            redirect: 'follow',
        });
        return response.url || url;
    } catch (err) {
        return url;
    }
}
