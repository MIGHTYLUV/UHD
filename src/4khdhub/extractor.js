import { fetchHtml, BASE_URL } from './http.js';
import cheerio from 'cheerio-without-node-native';
import { parseQuality, getNuvioQuality, buildStreamTitle, filterByQuality } from '../_shared/quality.js';

export async function search(title, tmdbId, mediaType) {
    try {
        const query = encodeURIComponent(title);
        const searchUrl = `${BASE_URL}/?s=${query}`;
        console.log(`[4KHDHub] Searching: ${searchUrl}`);
        
        const html = await fetchHtml(searchUrl);
        if (!html) return null;
        
        const $ = cheerio.load(html);
        
        let foundUrl = null;
        
        $('a.movie-card').each((i, el) => {
            const href = $(el).attr('href');
            if (href) {
                const targetSuffix = mediaType === 'movie' ? `-movie-${tmdbId}/` : `-series-${tmdbId}/`;
                if (href.endsWith(targetSuffix) || href.includes(targetSuffix)) {
                    foundUrl = href;
                    return false; // break loop
                }
            }
        });
        
        if (foundUrl) {
            console.log(`[4KHDHub] Found URL: ${foundUrl}`);
            // make sure it's absolute
            if (!foundUrl.startsWith('http')) {
                foundUrl = `${BASE_URL}${foundUrl.startsWith('/') ? '' : '/'}${foundUrl}`;
            }
            return foundUrl;
        }
        
        console.log(`[4KHDHub] No matching URL found for TMDB ID: ${tmdbId}`);
        return null;
    } catch (err) {
        console.error(`[4KHDHub] Search error: ${err.message}`);
        return null;
    }
}

export async function extractStreams(pageUrl, mediaType, season, episode) {
    try {
        console.log(`[4KHDHub] Extracting streams from: ${pageUrl}`);
        const html = await fetchHtml(pageUrl);
        if (!html) return [];
        
        const $ = cheerio.load(html);
        const streams = [];
        
        if (mediaType === 'movie') {
            $('.download-item').each((i, el) => {
                const header = $(el).find('.download-header').text().trim();
                const fileTitle = $(el).find('.file-title').text().trim();
                const badges = [];
                $(el).find('.badge').each((j, badge) => {
                    badges.push($(badge).text().trim());
                });
                
                const combinedInfo = `${header} ${fileTitle} ${badges.join(' ')}`;
                const qualityData = parseQuality(combinedInfo);
                const quality = getNuvioQuality(qualityData);
                
                const sizeBadge = badges.find(b => b.includes('GB') || b.includes('MB')) || '';
                const titleStr = buildStreamTitle(fileTitle || header, qualityData, sizeBadge);
                
                $(el).find('a.btn').each((j, btn) => {
                    const link = $(btn).attr('href');
                    const btnText = $(btn).text().trim();
                    if (link && link.startsWith('http')) {
                        streams.push({
                            name: '4KHDHub',
                            title: `${titleStr} [${btnText}]`,
                            url: link,
                            quality: quality,
                            headers: {
                                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                                'Referer': pageUrl
                            }
                        });
                    }
                });
            });
        } else {
            // For TV shows
            const targetEpText = `S${String(season).padStart(2, '0')}E${String(episode).padStart(2, '0')}`;
            const targetEpFallback = `S${season} E${episode}`;
            
            $('.download-item').each((i, el) => {
                const header = $(el).find('.download-header').text().trim();
                const fileTitle = $(el).find('.file-title').text().trim();
                const combinedInfo = `${header} ${fileTitle}`;
                
                if (combinedInfo.toUpperCase().includes(targetEpText) || 
                    combinedInfo.toUpperCase().includes(targetEpFallback) ||
                    combinedInfo.match(new RegExp(`S0*${season}[^0-9]*E0*${episode}`, 'i'))) {
                    
                    const badges = [];
                    $(el).find('.badge').each((j, badge) => {
                        badges.push($(badge).text().trim());
                    });
                    
                    const qualityData = parseQuality(`${combinedInfo} ${badges.join(' ')}`);
                    const quality = getNuvioQuality(qualityData);
                    const sizeBadge = badges.find(b => b.includes('GB') || b.includes('MB')) || '';
                    const titleStr = buildStreamTitle(fileTitle || header, qualityData, sizeBadge);
                    
                    $(el).find('a.btn').each((j, btn) => {
                        const link = $(btn).attr('href');
                        const btnText = $(btn).text().trim();
                        if (link && link.startsWith('http')) {
                            streams.push({
                                name: '4KHDHub',
                                title: `${titleStr} [${btnText}]`,
                                url: link,
                                quality: quality,
                                headers: {
                                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                                    'Referer': pageUrl
                                }
                            });
                        }
                    });
                }
            });
            
            if (streams.length === 0) {
                 $('.download-item').each((i, el) => {
                    const header = $(el).find('.download-header').text().trim();
                    const fileTitle = $(el).find('.file-title').text().trim();
                    const combinedInfo = `${header} ${fileTitle}`;
                    
                    if (combinedInfo.match(new RegExp(`S0*${season}`, 'i')) && !combinedInfo.match(/E\d+/i)) {
                        const badges = [];
                        $(el).find('.badge').each((j, badge) => {
                            badges.push($(badge).text().trim());
                        });
                        
                        const qualityData = parseQuality(`${combinedInfo} ${badges.join(' ')}`);
                        const quality = getNuvioQuality(qualityData);
                        const sizeBadge = badges.find(b => b.includes('GB') || b.includes('MB')) || '';
                        const titleStr = buildStreamTitle(fileTitle || header, qualityData, sizeBadge);
                        
                        $(el).find('a.btn').each((j, btn) => {
                            const link = $(btn).attr('href');
                            const btnText = $(btn).text().trim();
                            if (link && link.startsWith('http')) {
                                streams.push({
                                    name: '4KHDHub',
                                    title: `[Season Pack] ${titleStr} [${btnText}]`,
                                    url: link,
                                    quality: quality,
                                    headers: {
                                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                                        'Referer': pageUrl
                                    }
                                });
                            }
                        });
                    }
                 });
            }
        }
        
        return filterByQuality(streams);
    } catch (err) {
        console.error(`[4KHDHub] Extract error: ${err.message}`);
        return [];
    }
}
