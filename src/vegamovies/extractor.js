/**
 * VegaMovies Extractor
 * 
 * Site: https://vegamovies.navy
 * CMS: WordPress
 * 
 * ⚠️ This site often returns empty HTML due to Cloudflare / JS rendering.
 * The provider will attempt scraping but may need the Nuvio runtime's
 * fetch() to bypass protections that our tooling can't.
 */

import { fetchText, SITE_URL, HEADERS } from './http.js';
import { buildSearchQuery, getTmdbInfo } from '../_shared/tmdb.js';
import { parseQuality, getNuvioQuality, buildStreamTitle, filterByQuality } from '../_shared/quality.js';
import { normalizeTitle, titlesMatch, encodeSearchQuery } from '../_shared/search.js';
import cheerio from 'cheerio-without-node-native';

const PROVIDER_NAME = 'VegaMovies';

/**
 * Search for content on VegaMovies
 */
async function searchContent(query) {
    const searchUrl = `${SITE_URL}/?s=${encodeSearchQuery(query)}`;
    console.log(`[${PROVIDER_NAME}] Searching: ${searchUrl}`);
    
    const html = await fetchText(searchUrl);
    if (!html || html.length < 500) {
        console.log(`[${PROVIDER_NAME}] Empty or minimal response (${html.length} chars)`);
        return [];
    }

    const $ = cheerio.load(html);
    const results = [];

    // WordPress search results - common selectors
    $('article a[href], .post-title a[href], h2 a[href], .entry-title a[href]').each((_, el) => {
        const href = $(el).attr('href') || '';
        const title = $(el).text().trim();
        if (href.includes(SITE_URL) || href.startsWith('/')) {
            results.push({
                url: href.startsWith('/') ? SITE_URL + href : href,
                title,
            });
        }
    });

    return results;
}

/**
 * Parse download links from a VegaMovies detail page
 */
function parseDetailPage(html) {
    const $ = cheerio.load(html);
    const streams = [];

    // VegaMovies typically has download links in the entry-content area
    const content = $('.entry-content, .thecontent, .post-content, article');

    // Look for download links
    content.find('a[href]').each((_, el) => {
        const $el = $(el);
        const href = $el.attr('href') || '';
        const text = $el.text().trim();
        const parentText = $el.parent().text().trim();
        
        // Skip internal/nav links
        if (href.includes('vegamovies') && !href.includes('redirect')) return;
        if (href.startsWith('#') || href.startsWith('javascript:')) return;
        if (href.includes('t.me/') || href.includes('facebook.com')) return;

        // Check if it's a download link
        const isDownload = (
            href.includes('drive.google.com') ||
            href.includes('hubcloud') ||
            href.includes('gdtot') ||
            href.includes('filepress') ||
            href.includes('links.') ||
            href.includes('redirect') ||
            text.toLowerCase().includes('download') ||
            text.toLowerCase().includes('gdrive') ||
            text.toLowerCase().includes('g-drive')
        );

        if (!isDownload) return;

        // Parse quality from surrounding text
        const contextText = text + ' ' + parentText;
        const quality = parseQuality(contextText);

        // Only 4K and 1080p
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

    return streams;
}

/**
 * Main extraction function
 */
export async function extractStreams(tmdbId, mediaType, season, episode) {
    console.log(`[${PROVIDER_NAME}] Extracting: ${mediaType} ${tmdbId}`);

    try {
        const tmdbInfo = await getTmdbInfo(tmdbId, mediaType);
        if (!tmdbInfo.title) {
            console.log(`[${PROVIDER_NAME}] Could not get TMDB info`);
            return [];
        }

        const query = mediaType === 'movie' && tmdbInfo.year
            ? `${tmdbInfo.title} ${tmdbInfo.year}`
            : tmdbInfo.title;

        // Search
        const results = await searchContent(query);
        if (results.length === 0) {
            console.log(`[${PROVIDER_NAME}] No search results`);
            return [];
        }

        // Find best match
        let bestUrl = null;
        for (const result of results) {
            if (titlesMatch(result.title, tmdbInfo.title)) {
                // For movies, also check year
                if (mediaType === 'movie' && tmdbInfo.year && !result.title.includes(tmdbInfo.year)) {
                    continue;
                }
                bestUrl = result.url;
                break;
            }
        }

        // If no match found, try first result
        if (!bestUrl && results.length > 0) {
            bestUrl = results[0].url;
        }

        if (!bestUrl) {
            console.log(`[${PROVIDER_NAME}] No matching result found`);
            return [];
        }

        // Fetch and parse detail page
        console.log(`[${PROVIDER_NAME}] Fetching detail: ${bestUrl}`);
        const html = await fetchText(bestUrl);
        const allStreams = parseDetailPage(html);

        console.log(`[${PROVIDER_NAME}] Found ${allStreams.length} raw streams`);
        return filterByQuality(allStreams);
    } catch (err) {
        console.error(`[${PROVIDER_NAME}] Error: ${err.message}`);
        return [];
    }
}
