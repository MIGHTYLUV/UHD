/**
 * TMDB API Helper
 * Fetches movie/TV show title and metadata from TMDB ID.
 */

import { fetchJson } from './http.js';

const TMDB_API_KEY = 'ebfc7be4cc7fa987bd5616de3c688c5d';
const TMDB_BASE = 'https://api.themoviedb.org/3';

// In-memory cache to avoid repeated API calls
const cache = {};

/**
 * Get movie/TV show details from TMDB
 * @param {string} tmdbId - TMDB ID
 * @param {string} mediaType - 'movie' or 'tv'
 * @returns {Promise<{title: string, year: string, originalTitle: string, imdbId: string}>}
 */
export async function getTmdbInfo(tmdbId, mediaType) {
    const cacheKey = `${mediaType}_${tmdbId}`;
    if (cache[cacheKey]) {
        return cache[cacheKey];
    }

    try {
        const url = `${TMDB_BASE}/${mediaType}/${tmdbId}?api_key=${TMDB_API_KEY}&language=en-US`;
        const data = await fetchJson(url);

        const title = mediaType === 'movie' ? data.title : data.name;
        const originalTitle = mediaType === 'movie' ? data.original_title : data.original_name;
        const releaseDate = mediaType === 'movie' ? data.release_date : data.first_air_date;
        const year = releaseDate ? releaseDate.split('-')[0] : '';

        const info = {
            title: title || originalTitle || '',
            originalTitle: originalTitle || title || '',
            year,
            imdbId: data.imdb_id || '',
        };

        cache[cacheKey] = info;
        return info;
    } catch (err) {
        console.error(`[TMDB] Error fetching ${mediaType}/${tmdbId}: ${err.message}`);
        return { title: '', originalTitle: '', year: '', imdbId: '' };
    }
}

/**
 * Build a search query string from TMDB info
 * @param {string} tmdbId 
 * @param {string} mediaType 
 * @returns {Promise<string>} Search query like "Thor 2011"
 */
export async function buildSearchQuery(tmdbId, mediaType) {
    const info = await getTmdbInfo(tmdbId, mediaType);
    if (!info.title) {
        throw new Error(`Could not resolve TMDB ID ${tmdbId}`);
    }
    // Return "Title Year" for movies, just "Title" for TV
    return mediaType === 'movie' && info.year
        ? `${info.title} ${info.year}`
        : info.title;
}
