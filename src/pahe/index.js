import { getTmdbInfo } from '../_shared/tmdb.js';
import { searchPahe, extractLinks } from './extractor.js';

export const name = 'Pahe';

export async function getStreams(tmdbId, mediaType, season, episode) {
  try {
    const tmdbInfo = await getTmdbInfo(tmdbId, mediaType, season, episode);
    if (!tmdbInfo) {
      console.log('[Pahe] Could not fetch TMDB info');
      return [];
    }
    
    console.log(`[Pahe] Fetching streams for: ${tmdbInfo.title}`);
    
    const pageUrl = await searchPahe(tmdbInfo, mediaType, season, episode);
    if (!pageUrl) {
      console.log(`[Pahe] No search results for: ${tmdbInfo.title}`);
      return [];
    }

    const streams = await extractLinks(pageUrl, tmdbInfo, mediaType, season, episode);
    return streams;
  } catch (error) {
    console.error(`[Pahe] Error in getStreams:`, error);
    return [];
  }
}
