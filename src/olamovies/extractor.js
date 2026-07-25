import cheerio from 'cheerio-without-node-native';
import { parseQuality, getNuvioQuality, buildStreamTitle, filterByQuality } from '../_shared/quality.js';
import { titlesMatch } from '../_shared/search.js';

export function extractSearchResults(html, targetTitle, targetYear) {
  const $ = cheerio.load(html);
  const results = [];

  // Match standard WP article/post containers or just headings
  $('article, .type-post, .post').each((i, el) => {
    const titleEl = $(el).find('h2 a, h3 a, .entry-title a').first();
    const title = titleEl.text().trim();
    const url = titleEl.attr('href');

    if (title && url) {
      if (titlesMatch(title, targetTitle, targetYear)) {
         results.push({ title, url });
      }
    }
  });

  // Fallback if the above selectors don't match any posts
  if (results.length === 0) {
    $('h2 a, h3 a').each((i, el) => {
      const title = $(el).text().trim();
      const url = $(el).attr('href');
      if (title && url && titlesMatch(title, targetTitle, targetYear)) {
        results.push({ title, url });
      }
    });
  }

  return results;
}

export function extractStreams(html) {
  const $ = cheerio.load(html);
  const streams = [];

  $('a[href^="https://links.ol-am.top/"]').each((i, el) => {
    const $el = $(el);
    const linkText = $el.text().trim();
    const url = $el.attr('href');

    if (!linkText || !url) return;
    
    // Parse quality from the link text (e.g. "2160p 4K UHD HDR10+ DV [9.58GB]")
    const parsedQuality = parseQuality(linkText);
    const nuvioQuality = getNuvioQuality(parsedQuality, linkText);
    
    if (nuvioQuality) {
      const streamTitle = buildStreamTitle(nuvioQuality, linkText);
      streams.push({
        name: 'OlaMovies',
        title: streamTitle,
        url: url,
        quality: nuvioQuality,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Referer': 'https://v3.olamovies.mov/'
        }
      });
    }
  });

  // Filter for 4K first, then 1080p
  return filterByQuality(streams);
}
