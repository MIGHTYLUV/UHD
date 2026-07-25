/**
 * ThePirateBay Extractor
 * 
 * Uses apibay.org JSON API:
 *   Search: https://apibay.org/q.php?q=QUERY&cat=200 (200 = Video category)
 *   Format: JSON array of objects [{id, name, info_hash, leechers, seeders, num_files, size, added, status, category, imdb}]
 */

import { fetchJson, API_URL } from './http.js';
import { getTmdbInfo, buildSearchQuery } from '../_shared/tmdb.js';
import { parseQuality, getNuvioQuality, buildStreamTitle, filterByQuality } from '../_shared/quality.js';
import { encodeSearchQuery } from '../_shared/search.js';

const PROVIDER_NAME = 'ThePirateBay';

/**
 * Build a magnet URI from info_hash and name
 */
function buildMagnetLink(infoHash, name) {
    const trackers = [
        'udp://tracker.coppersurfer.tk:6969/announce',
        'udp://tracker.openbittorrent.com:6969/announce',
        'udp://tracker.opentrackr.org:1337',
        'udp://tracker.leechers-paradise.org:6969/announce',
        'udp://opentracker.i2p.rocks:6969/announce',
        'udp://open.demonii.com:1337/announce',
    ];

    const encodedName = encodeURIComponent(name);
    const trString = trackers.map(tr => `&tr=${encodeURIComponent(tr)}`).join('');
    
    return `magnet:?xt=urn:btih:${infoHash}&dn=${encodedName}${trString}`;
}

/**
 * Format bytes to readable size
 */
function formatSize(bytes) {
    const num = parseInt(bytes, 10);
    if (isNaN(num) || num === 0) return '';
    const gb = num / (1024 * 1024 * 1024);
    if (gb >= 1) return `${gb.toFixed(2)} GB`;
    const mb = num / (1024 * 1024);
    return `${mb.toFixed(0)} MB`;
}

export async function extractStreams(tmdbId, mediaType, season, episode) {
    console.log(`[${PROVIDER_NAME}] Extracting: ${mediaType} ${tmdbId}`);

    try {
        const tmdbInfo = await getTmdbInfo(tmdbId, mediaType);
        if (!tmdbInfo.title) {
            console.log(`[${PROVIDER_NAME}] Could not get TMDB info`);
            return [];
        }

        let query = tmdbInfo.title;
        if (mediaType === 'movie' && tmdbInfo.year) {
            query += ` ${tmdbInfo.year}`;
        } else if (mediaType === 'tv' && season && episode) {
            const s = String(season).padStart(2, '0');
            const e = String(episode).padStart(2, '0');
            query += ` S${s}E${e}`;
        }

        // Cat 200 = Video (201 = Movies, 205 = TV, 207 = HD Movies, 208 = HD TV)
        const searchUrl = `${API_URL}/q.php?q=${encodeSearchQuery(query)}&cat=200`;
        console.log(`[${PROVIDER_NAME}] Fetching API: ${searchUrl}`);

        const results = await fetchJson(searchUrl);

        if (!Array.isArray(results) || results.length === 0 || results[0].name === 'No results found') {
            console.log(`[${PROVIDER_NAME}] No results found`);
            return [];
        }

        const streams = [];

        for (const item of results) {
            if (!item.info_hash || item.info_hash === '0000000000000000000000000000000000000000') continue;

            const name = item.name || '';
            const quality = parseQuality(name);

            // Filter for 4K and 1080p content
            if (!quality.is4K && !quality.is1080p) continue;

            const sizeStr = formatSize(item.size);
            const seeders = item.seeders || '0';
            const extraInfo = `${sizeStr ? `[${sizeStr}]` : ''} ⚙️${seeders} seeds`;

            const magnet = buildMagnetLink(item.info_hash, name);

            streams.push({
                name: PROVIDER_NAME,
                title: buildStreamTitle(quality, extraInfo),
                url: magnet,
                quality: getNuvioQuality(quality),
                _quality: quality,
            });
        }

        console.log(`[${PROVIDER_NAME}] Found ${streams.length} raw streams`);
        return filterByQuality(streams);

    } catch (err) {
        console.error(`[${PROVIDER_NAME}] Error: ${err.message}`);
        return [];
    }
}
