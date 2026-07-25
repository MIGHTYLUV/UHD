import { fetchText } from '../_shared/http.js';
import { normalizeTitle, encodeSearchQuery } from '../_shared/search.js';
import { parseQuality, getNuvioQuality, buildStreamTitle, filterByQuality } from '../_shared/quality.js';
import cheerio from 'cheerio-without-node-native';

const BASE_URL = 'https://pahe.ink';

export async function searchPahe(tmdbInfo, mediaType, season, episode) {
  try {
    const query = encodeSearchQuery(tmdbInfo.title);
    const searchUrl = `${BASE_URL}/?s=${query}`;
    
    console.log(`[Pahe] Searching: ${searchUrl}`);
    const html = await fetchText(searchUrl);
    if (!html) return null;

    const $ = cheerio.load(html);
    let bestMatchUrl = null;

    $('.post-box-title').each((_, el) => {
      const a = $(el).find('a');
      const postTitle = a.text().trim();
      const postUrl = a.attr('href');
      
      if (!postTitle || !postUrl) return;

      const normPost = normalizeTitle(postTitle);
      const normQuery = normalizeTitle(tmdbInfo.title);

      if (mediaType === 'movie') {
        if (normPost.includes(normQuery) && postTitle.includes(tmdbInfo.year.toString())) {
          bestMatchUrl = postUrl;
          return false; // break
        }
      } else {
        // TV Show
        if (normPost.includes(normQuery) && normPost.includes(`season ${season}`)) {
          bestMatchUrl = postUrl;
          return false; // break
        }
      }
    });

    return bestMatchUrl;
  } catch (error) {
    console.error('[Pahe] Search error:', error);
    return null;
  }
}

export async function extractLinks(pageUrl, tmdbInfo, mediaType, season, episode) {
  try {
    console.log(`[Pahe] Extracting from: ${pageUrl}`);
    const html = await fetchText(pageUrl);
    if (!html) return [];

    const $ = cheerio.load(html);
    const streams = [];
    const entryTitle = $('h1.entry-title').text() || '';

    $('.entry-content p, .entry-content h3').each((_, el) => {
      const text = $(el).text().trim();
      if (!text) return;

      const qualityMatch = parseQuality(text) || parseQuality(entryTitle);
      const nuvioQuality = getNuvioQuality(qualityMatch || '1080p');

      $(el).find('a').each((_, a) => {
        const url = $(a).attr('href');
        const host = $(a).text().trim();
        
        if (url && (host.toLowerCase().includes('mega') || host.toLowerCase().includes('mediafire') || host.toLowerCase().includes('1fichier'))) {
          const streamTitle = buildStreamTitle(nuvioQuality, `${tmdbInfo.title} - ${host}`);
          
          streams.push({
            name: 'Pahe',
            title: streamTitle,
            url: url,
            quality: nuvioQuality,
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
              'Referer': BASE_URL
            }
          });
        }
      });
    });

    return filterByQuality(streams);
  } catch (error) {
    console.error('[Pahe] Extractor error:', error);
    return [];
  }
}
