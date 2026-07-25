import { getTmdbInfo, buildSearchQuery } from '../_shared/tmdb.js';
import { fetchSearch, fetchPost } from './http.js';
import { parseSearch, parseLinks } from './extractor.js';

export async function getStreams(tmdbId, mediaType, season, episode) {
    try {
        console.log(`[UHDMovies] Fetching streams for TMDB ID: ${tmdbId}, Type: ${mediaType}`);
        
        const tmdbInfo = await getTmdbInfo(tmdbId, mediaType);
        if (!tmdbInfo) {
            console.log(`[UHDMovies] TMDB info not found for ${tmdbId}`);
            return [];
        }
        
        const { title, year } = tmdbInfo;
        // Search format: ?s=query
        const query = buildSearchQuery(title, year);
        console.log(`[UHDMovies] Searching for: ${query}`);
        
        const searchHtml = await fetchSearch(query);
        const postUrl = parseSearch(searchHtml, title, year);
        
        if (!postUrl) {
            console.log(`[UHDMovies] No matching post found for ${title} (${year})`);
            return [];
        }
        
        console.log(`[UHDMovies] Found post URL: ${postUrl}`);
        const postHtml = await fetchPost(postUrl);
        const streams = parseLinks(postHtml, title + ' ' + year);
        
        console.log(`[UHDMovies] Found ${streams.length} streams`);
        return streams;
        
    } catch (error) {
        console.error(`[UHDMovies] Error getting streams: ${error.message}`);
        return [];
    }
}
