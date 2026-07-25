/**
 * Quality Parsing Utilities
 * Extract quality information from title strings and filter streams.
 */

/**
 * Parse quality tags from a title string
 * @param {string} title - e.g. "Thor 2011 2160p 4K UHD HDR10+ DV BluRay x265 10bit"
 * @returns {object} { resolution, is4K, isHDR, isDV, isRemux, isIMAX, codec, source, size }
 */
export function parseQuality(title) {
    const t = title || '';
    const upper = t.toUpperCase();

    const is4K = /2160[pP]|4K|UHD/i.test(t);
    const is1080p = /1080[pP]/i.test(t);
    const is720p = /720[pP]/i.test(t);
    
    const isHDR = /HDR10\+?|HDR/i.test(t);
    const isDV = /\bDV\b|Dolby[\s\-]?Vision/i.test(t);
    const isRemux = /REMUX/i.test(t);
    const isIMAX = /IMAX/i.test(t);
    const isAtmos = /Atmos/i.test(t);

    // Codec
    let codec = '';
    if (/x265|HEVC|H\.?265/i.test(t)) codec = 'x265';
    else if (/x264|AVC|H\.?264/i.test(t)) codec = 'x264';

    // Source
    let source = '';
    if (/BluRay|BDRip|BD\b/i.test(t)) source = 'BluRay';
    else if (/WEB[\s\-]?DL/i.test(t)) source = 'WEB-DL';
    else if (/WEBRip/i.test(t)) source = 'WEBRip';
    else if (/HDTV/i.test(t)) source = 'HDTV';

    // File size extraction
    const sizeMatch = t.match(/\[?([\d.]+)\s*(GB|MB)\]?/i);
    const size = sizeMatch ? `${sizeMatch[1]} ${sizeMatch[2].toUpperCase()}` : '';

    // Resolution label
    let resolution = '720p';
    if (is4K) resolution = '2160p';
    else if (is1080p) resolution = '1080p';
    else if (is720p) resolution = '720p';

    return {
        resolution,
        is4K,
        is1080p,
        is720p,
        isHDR,
        isDV,
        isRemux,
        isIMAX,
        isAtmos,
        codec,
        source,
        size,
    };
}

/**
 * Get the Nuvio quality string
 * @param {object} quality - from parseQuality()
 * @returns {string} "4K", "1080p", or "720p"
 */
export function getNuvioQuality(quality) {
    if (quality.is4K) return '4K';
    if (quality.is1080p) return '1080p';
    return '720p';
}

/**
 * Build a descriptive title for the stream
 * @param {object} quality - from parseQuality()
 * @param {string} extraInfo - additional info like filename
 * @returns {string}
 */
export function buildStreamTitle(quality, extraInfo = '') {
    const parts = [quality.resolution];
    
    if (quality.isHDR) parts.push('HDR');
    if (quality.isDV) parts.push('DV');
    if (quality.isRemux) parts.push('REMUX');
    if (quality.isIMAX) parts.push('IMAX');
    if (quality.isAtmos) parts.push('Atmos');
    if (quality.source) parts.push(quality.source);
    if (quality.codec) parts.push(quality.codec);
    if (quality.size) parts.push(`[${quality.size}]`);
    if (extraInfo) parts.push(extraInfo);

    return parts.join(' ');
}

/**
 * Filter streams: prioritize 4K, fallback to 1080p
 * @param {Array} streams - Array of stream objects with quality info
 * @returns {Array} Filtered streams
 */
export function filterByQuality(streams) {
    const streams4K = streams.filter(s => s._quality && s._quality.is4K);
    const streams1080 = streams.filter(s => s._quality && s._quality.is1080p);

    // Prefer 4K, fallback to 1080p
    let result = [];
    if (streams4K.length > 0) {
        result = streams4K;
    }
    // Always include 1080p as fallback
    if (streams1080.length > 0) {
        result = result.concat(streams1080);
    }

    // Clean up internal _quality property
    return result.map(s => {
        const { _quality, ...clean } = s;
        return clean;
    });
}
