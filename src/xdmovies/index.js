/**
 * XDMovies Provider
 * Site: https://top.xdmovies.wtf
 * 
 * Features:
 * - TMDB ID embedded in URLs for accurate matching
 * - 4K/2160p and 1080p content
 * - English and Hindi language support
 */

import { extractStreams } from './extractor.js';

async function getStreams(tmdbId, mediaType, season, episode) {
    try {
        console.log(`[XDMovies] Request: ${mediaType} ${tmdbId}`);
        const streams = await extractStreams(tmdbId, mediaType, season, episode);
        return streams;
    } catch (error) {
        console.error(`[XDMovies] Error: ${error.message}`);
        return [];
    }
}

module.exports = { getStreams };
