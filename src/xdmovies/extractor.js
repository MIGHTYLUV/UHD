/**
 * XDMovies Extractor
 * 
 * Site: https://top.xdmovies.wtf
 * 
 * URL Structure:
 *   Movies: /movies/{slug}-{quality}-{languages}-download-{tmdbId}
 *   TV: /tvshows/{slug}-{quality}-{languages}-download-{tmdbId}
 *   Episodes: /episodes/{show-slug}-{season}x{episode}/
 * 
 * The site embeds TMDB IDs directly in URLs, making matching straightforward.
 * Download links are on the detail page, typically Google Drive or direct links.
 */

import { fetchText, SITE_URL, HEADERS } from './http.js';
import { getTmdbInfo, buildSearchQuery } from '../_shared/tmdb.js';
import { parseQuality, getNuvioQuality, buildStreamTitle, filterByQuality } from '../_shared/quality.js';
import { normalizeTitle, titlesMatch, encodeSearchQuery } from '../_shared/search.js';
import cheerio from 'cheerio-without-node-native';

const PROVIDER_NAME = 'XDMovies';

/**
 * Search XDMovies and find the page matching our TMDB ID
 */
async function findContentUrl(tmdbId, mediaType) {
    // Strategy 1: Try direct search by TMDB ID (site embeds it in URLs)
    try {
        const searchUrl = `${SITE_URL}/?s=${tmdbId}`;
        console.log(`[${PROVIDER_NAME}] Searching by TMDB ID: ${searchUrl}`);
        const html = await fetchText(searchUrl);
        const $ = cheerio.load(html);

        // Look for links containing the TMDB ID
        const type = mediaType === 'movie' ? 'movies' : 'tvshows';
        let matchUrl = null;

        $('a[href]').each((_, el) => {
            const href = $(el).attr('href') || '';
            // Match URLs like /movies/slug-download-{tmdbId} or ending with -{tmdbId}
            if (href.includes(`/${type}/`) && href.includes(`-${tmdbId}`)) {
                matchUrl = href;
                return false; // break
            }
        });

        if (matchUrl) {
            // Ensure full URL
            if (matchUrl.startsWith('/')) matchUrl = SITE_URL + matchUrl;
            console.log(`[${PROVIDER_NAME}] Found by TMDB ID: ${matchUrl}`);
            return matchUrl;
        }
    } catch (err) {
        console.log(`[${PROVIDER_NAME}] TMDB ID search failed: ${err.message}`);
    }

    // Strategy 2: Search by title
    try {
        const query = await buildSearchQuery(tmdbId, mediaType);
        const searchUrl = `${SITE_URL}/?s=${encodeSearchQuery(query)}`;
        console.log(`[${PROVIDER_NAME}] Searching by title: ${searchUrl}`);
        const html = await fetchText(searchUrl);
        const $ = cheerio.load(html);

        const tmdbInfo = await getTmdbInfo(tmdbId, mediaType);
        let matchUrl = null;
        let bestScore = 0;

        // Look through search result links
        $('article a[href], .result-item a[href], .search-page a[href], a.movie-link, a.movie-card, .movie-grid a').each((_, el) => {
            const href = $(el).attr('href') || '';
            const title = $(el).find('h3, h2, .title, .movie-card-title').first().text().trim() || $(el).text().trim();

            // Check if URL contains TMDB ID
            if (href.includes(`-${tmdbId}`)) {
                matchUrl = href;
                return false;
            }

            // Fuzzy title match
            if (titlesMatch(title, tmdbInfo.title)) {
                matchUrl = href;
                return false;
            }
        });

        if (matchUrl) {
            if (matchUrl.startsWith('/')) matchUrl = SITE_URL + matchUrl;
            console.log(`[${PROVIDER_NAME}] Found by title: ${matchUrl}`);
            return matchUrl;
        }
    } catch (err) {
        console.log(`[${PROVIDER_NAME}] Title search failed: ${err.message}`);
    }

    return null;
}

/**
 * Parse download links from a movie/TV show detail page
 */
function parseDownloadLinks(html) {
    const $ = cheerio.load(html);
    const streams = [];

    // Strategy 1: Look for download links in the page content
    // XDMovies uses various patterns for download links
    
    // Look for links with quality info
    $('a[href]').each((_, el) => {
        const $el = $(el);
        const href = $el.attr('href') || '';
        const text = $el.text().trim();
        const parentText = $el.parent().text().trim();
        
        // Skip navigation, social, and non-download links
        if (href.includes('xdmovies.wtf') && !href.includes('download')) return;
        if (href.startsWith('#') || href.startsWith('javascript:')) return;
        if (href.includes('facebook.com') || href.includes('twitter.com')) return;
        if (href.includes('instagram.com') || href.includes('telegram')) return;
        
        // Look for download-related links
        const isDownloadLink = (
            href.includes('drive.google.com') ||
            href.includes('hubcloud') ||
            href.includes('hubdrive') ||
            href.includes('pixeldrain') ||
            href.includes('1fichier') ||
            href.includes('gdtot') ||
            href.includes('filepress') ||
            text.toLowerCase().includes('download') ||
            $el.hasClass('btn') ||
            $el.hasClass('download')
        );

        if (!isDownloadLink) return;
        
        // Get quality info from surrounding context
        const contextText = text + ' ' + parentText;
        const quality = parseQuality(contextText);
        
        // Only include 4K and 1080p
        if (!quality.is4K && !quality.is1080p) return;

        streams.push({
            name: PROVIDER_NAME,
            title: buildStreamTitle(quality),
            url: href,
            quality: getNuvioQuality(quality),
            headers: HEADERS,
            _quality: quality,
        });
    });

    // Strategy 2: Look for iframe/embed sources (some pages use embedded players)
    $('iframe[src], iframe[data-src]').each((_, el) => {
        const src = $(el).attr('src') || $(el).attr('data-src') || '';
        if (src && !src.includes('youtube') && !src.includes('google.com/recaptcha')) {
            streams.push({
                name: PROVIDER_NAME,
                title: 'Stream',
                url: src,
                quality: '1080p',
                headers: HEADERS,
                _quality: { is4K: false, is1080p: true },
            });
        }
    });

    return streams;
}

/**
 * Handle TV show episode lookup
 */
async function findEpisodeUrl(showUrl, season, episode) {
    try {
        const html = await fetchText(showUrl);
        const $ = cheerio.load(html);
        
        const seasonStr = String(season);
        const episodeStr = String(episode);
        
        let episodeUrl = null;
        
        // Look for season/episode links
        $('a[href]').each((_, el) => {
            const href = $(el).attr('href') || '';
            const text = $(el).text().trim().toLowerCase();
            
            // Match patterns like "1x05", "S01E05", "Season 1 Episode 5"
            if (
                href.includes(`${season}x${episode}`) ||
                href.includes(`${seasonStr.padStart(2, '0')}x${episodeStr.padStart(2, '0')}`) ||
                (text.includes(`season ${season}`) && text.includes(`episode ${episode}`))
            ) {
                episodeUrl = href;
                return false;
            }
        });

        if (episodeUrl) {
            if (episodeUrl.startsWith('/')) episodeUrl = SITE_URL + episodeUrl;
            return episodeUrl;
        }
    } catch (err) {
        console.log(`[${PROVIDER_NAME}] Episode lookup failed: ${err.message}`);
    }
    return null;
}

/**
 * Main extraction function
 */
export async function extractStreams(tmdbId, mediaType, season, episode) {
    console.log(`[${PROVIDER_NAME}] Extracting: ${mediaType} ${tmdbId} S${season || '-'}E${episode || '-'}`);

    // Find the content page
    const contentUrl = await findContentUrl(tmdbId, mediaType);
    if (!contentUrl) {
        console.log(`[${PROVIDER_NAME}] No content found for TMDB ID ${tmdbId}`);
        return [];
    }

    let targetUrl = contentUrl;

    // For TV shows, try to find the specific episode page
    if (mediaType === 'tv' && season && episode) {
        const episodeUrl = await findEpisodeUrl(contentUrl, season, episode);
        if (episodeUrl) {
            targetUrl = episodeUrl;
        }
    }

    // Fetch and parse the detail page
    const html = await fetchText(targetUrl);
    const allStreams = parseDownloadLinks(html);

    console.log(`[${PROVIDER_NAME}] Found ${allStreams.length} raw streams`);

    // Filter by quality: 4K first, 1080p fallback
    const filtered = filterByQuality(allStreams);
    console.log(`[${PROVIDER_NAME}] Returning ${filtered.length} streams after quality filter`);

    return filtered;
}
