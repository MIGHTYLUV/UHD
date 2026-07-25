/**
 * Search & Title Matching Utilities
 * Normalize titles and match search results to TMDB data.
 */

/**
 * Normalize a title for comparison
 * Removes special chars, extra spaces, converts to lowercase
 * @param {string} title 
 * @returns {string} Normalized title
 */
export function normalizeTitle(title) {
    return (title || '')
        .toLowerCase()
        .replace(/[''`]/g, '')           // Remove apostrophes
        .replace(/[&]/g, 'and')          // & → and
        .replace(/[:–—\-]/g, ' ')        // Dashes/colons → space
        .replace(/[^\w\s]/g, '')         // Remove other special chars
        .replace(/\s+/g, ' ')           // Collapse spaces
        .trim();
}

/**
 * Check if two titles match (fuzzy)
 * @param {string} title1 
 * @param {string} title2 
 * @returns {boolean}
 */
export function titlesMatch(title1, title2) {
    const n1 = normalizeTitle(title1);
    const n2 = normalizeTitle(title2);
    
    if (n1 === n2) return true;
    
    // Check if one contains the other
    if (n1.includes(n2) || n2.includes(n1)) return true;
    
    // Word-level comparison: check if all words of the shorter title appear in the longer one
    const words1 = n1.split(' ').filter(w => w.length > 1);
    const words2 = n2.split(' ').filter(w => w.length > 1);
    const shorter = words1.length <= words2.length ? words1 : words2;
    const longer = words1.length > words2.length ? words1 : words2;
    
    const matchCount = shorter.filter(w => longer.includes(w)).length;
    const matchRatio = matchCount / shorter.length;
    
    return matchRatio >= 0.8;
}

/**
 * Check if a year appears in a title/text
 * @param {string} text 
 * @param {string} year - e.g. "2011"
 * @returns {boolean}
 */
export function yearMatches(text, year) {
    if (!year) return true; // If no year, don't filter
    return text.includes(year);
}

/**
 * URL-encode a search query for WordPress sites
 * @param {string} query 
 * @returns {string}
 */
export function encodeSearchQuery(query) {
    return encodeURIComponent(query).replace(/%20/g, '+');
}

/**
 * Build a season/episode identifier string
 * @param {number} season 
 * @param {number} episode 
 * @returns {string} e.g. "S01E05" or "S01" or ""
 */
export function buildEpisodeId(season, episode) {
    if (!season) return '';
    const s = String(season).padStart(2, '0');
    if (!episode) return `S${s}`;
    const e = String(episode).padStart(2, '0');
    return `S${s}E${e}`;
}

/**
 * Extract year from a title string
 * @param {string} title 
 * @returns {string|null}
 */
export function extractYear(title) {
    const match = (title || '').match(/\b(19|20)\d{2}\b/);
    return match ? match[0] : null;
}
