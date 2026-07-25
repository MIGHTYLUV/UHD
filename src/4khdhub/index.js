import { getTmdbInfo } from '../_shared/tmdb.js';
import { search, extractStreams } from './extractor.js';

export async function getStreams(tmdbId, mediaType, season, episode) {
    try {
        console.log(`[4KHDHub] Fetching streams for TMDB ID: ${tmdbId}, Type: ${mediaType}`);
        
        // 1. Get TMDB info for searching
        const tmdbInfo = await getTmdbInfo(tmdbId, mediaType);
        if (!tmdbInfo || !tmdbInfo.title) {
            console.log(`[4KHDHub] Failed to get TMDB info for ID: ${tmdbId}`);
            return [];
        }
        
        // 2. Search site to find exact URL
        const pageUrl = await search(tmdbInfo.title, tmdbId, mediaType);
        if (!pageUrl) {
            return [];
        }
        
        // 3. Extract streams from the page
        const streams = await extractStreams(pageUrl, mediaType, season, episode);
        
        console.log(`[4KHDHub] Found ${streams.length} streams`);
        return streams;
        
    } catch (err) {
        console.error(`[4KHDHub] Fatal error: ${err.message}`);
        return [];
    }
}
