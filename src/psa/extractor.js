import { fetchText, SITE_URL, HEADERS } from './http.js';
import { buildSearchQuery, getTmdbInfo } from '../_shared/tmdb.js';
import { parseQuality, getNuvioQuality, buildStreamTitle, filterByQuality } from '../_shared/quality.js';
import { normalizeTitle, titlesMatch, encodeSearchQuery } from '../_shared/search.js';
import cheerio from 'cheerio-without-node-native';

const PROVIDER_NAME = 'PSA';

export async function extractStreams(tmdbId, mediaType, season, episode) {
    console.log(`[${PROVIDER_NAME}] ⚠️ This provider is currently disabled (Cloudflare protected)`);
    // TODO: Implement when CF bypass is available
    return [];
}
