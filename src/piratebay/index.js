/**
 * ThePirateBay Provider
 * Site: https://thepiratebay.org
 * API: https://apibay.org
 * 
 * Features:
 * - Uses apibay.org API for fast JSON search
 * - Returns magnet links with seeders info
 * - 4K and 1080p stream filtering
 */

import { extractStreams } from './extractor.js';

async function getStreams(tmdbId, mediaType, season, episode) {
    try {
        console.log(`[ThePirateBay] Request: ${mediaType} ${tmdbId}`);
        const streams = await extractStreams(tmdbId, mediaType, season, episode);
        return streams;
    } catch (error) {
        console.error(`[ThePirateBay] Error: ${error.message}`);
        return [];
    }
}

module.exports = { getStreams };
