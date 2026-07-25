/**
 * VegaMovies Provider
 * Site: https://vegamovies.navy
 * 
 * ⚠️ LIMITED: This site uses heavy JS rendering / Cloudflare protection.
 * The provider attempts to scrape but may not work reliably.
 * 
 * Features:
 * - WordPress-based, search via /?s=query
 * - 4K/2160p and 1080p content with Hindi dual audio
 * - Google Drive links behind shorteners
 */

import { extractStreams } from './extractor.js';

async function getStreams(tmdbId, mediaType, season, episode) {
    try {
        console.log(`[VegaMovies] Request: ${mediaType} ${tmdbId}`);
        const streams = await extractStreams(tmdbId, mediaType, season, episode);
        return streams;
    } catch (error) {
        console.error(`[VegaMovies] Error: ${error.message}`);
        return [];
    }
}

module.exports = { getStreams };
