import { getTmdbInfo } from '../_shared/tmdb.js';
import { encodeSearchQuery } from '../_shared/search.js';
import { fetchHtml, getBaseUrl } from './http.js';
import { extractSearchResults, extractStreams } from './extractor.js';

export async function getStreams(tmdbId, mediaType, season, episode) {
  try {
    const info = await getTmdbInfo(tmdbId, mediaType, season, episode);
    if (!info) {
      console.log(`[OlaMovies] Could not get TMDB info for ${tmdbId}`);
      return [];
    }

    const { title, year } = info;
    const query = encodeSearchQuery(`${title} ${year}`);
    const searchUrl = `${getBaseUrl()}/?s=${query}`;

    const searchHtml = await fetchHtml(searchUrl);
    if (!searchHtml) return [];

    const results = extractSearchResults(searchHtml, title, year);
    if (results.length === 0) {
      console.log(`[OlaMovies] No matching results found for ${title} (${year})`);
      return [];
    }

    // Process the best matching result
    const targetUrl = results[0].url;
    console.log(`[OlaMovies] Found match: ${results[0].title}, fetching ${targetUrl}`);

    const detailHtml = await fetchHtml(targetUrl);
    if (!detailHtml) return [];

    const streams = extractStreams(detailHtml);
    console.log(`[OlaMovies] Found ${streams.length} valid streams`);

    return streams;

  } catch (error) {
    console.error(`[OlaMovies] Error getting streams:`, error);
    return [];
  }
}
