import cheerio from 'cheerio-without-node-native';
import { parseQuality, getNuvioQuality, buildStreamTitle, filterByQuality } from '../_shared/quality.js';
import { titlesMatch } from '../_shared/search.js';
import { BASE_URL } from './http.js';

export function parseSearch(html, targetTitle, targetYear) {
    const $ = cheerio.load(html);
    const results = [];
    
    // Gridlove theme typically uses article tags
    $('article').each((i, el) => {
        const titleEl = $(el).find('.entry-title a, h2 a, h3 a');
        const titleText = titleEl.text().trim();
        const url = titleEl.attr('href');
        
        if (titleText && url) {
            results.push({ title: titleText, url });
        }
    });

    for (const result of results) {
        if (titlesMatch(result.title, targetTitle, targetYear)) {
            return result.url;
        }
    }
    
    return null;
}

export function parseLinks(html, postTitle) {
    const $ = cheerio.load(html);
    const streams = [];
    
    const content = $('.entry-content, .thecontent');
    let currentQualityStr = '';
    
    content.find('*').each((i, el) => {
        const tag = el.tagName.toLowerCase();
        const text = $(el).text().trim();
        
        // Check for quality headers
        if (['h2', 'h3', 'h4', 'h5', 'h6', 'strong', 'p'].includes(tag)) {
            if (/2160p|4k|1080p|720p/i.test(text) && text.length < 50) {
                currentQualityStr = text;
            }
        }
        
        // Extract download links
        if (tag === 'a') {
            const url = $(el).attr('href');
            if (url && (url.includes('drive.google') || url.includes('links.') || url.includes('share') || url.includes('hubcloud') || $(el).hasClass('maxbutton') || text.toLowerCase().includes('download'))) {
                
                // Exclude common non-download links
                if (url.includes('imdb.com') || url.includes('youtube.com') || url.includes('wikipedia.org')) {
                    return;
                }

                const linkQualityStr = text + ' ' + currentQualityStr + ' ' + postTitle;
                const parsedQualityInfo = parseQuality(linkQualityStr);
                const quality = getNuvioQuality(parsedQualityInfo);
                
                if (quality) {
                    const title = buildStreamTitle(parsedQualityInfo, text.length > 3 ? text : `Download ${quality}`);
                    
                    streams.push({
                        name: 'UHDMovies',
                        title: title,
                        url: url,
                        quality: quality,
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                            'Referer': BASE_URL + '/'
                        }
                    });
                }
            }
        }
    });
    
    // Deduplicate by URL
    const uniqueStreams = [];
    const seenUrls = new Set();
    for (const stream of streams) {
        if (!seenUrls.has(stream.url)) {
            seenUrls.add(stream.url);
            uniqueStreams.push(stream);
        }
    }

    return filterByQuality(uniqueStreams);
}
