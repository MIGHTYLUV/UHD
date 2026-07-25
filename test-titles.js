const fs = require('fs');
const cheerio = require('cheerio-without-node-native');
const t = fs.readFileSync('C:/Users/Admin/.gemini/antigravity/brain/925a6151-fcf9-4503-9d01-6e20f5e369ea/.system_generated/steps/289/content.md', 'utf8');
const $ = cheerio.load(t);
$('article a[href], .result-item a[href], .search-page a[href], a.movie-link, a.movie-card, .movie-grid a').each((_, el) => {
    console.log('T:', $(el).find('h3, h2, .title, .movie-card-title').first().text().trim() || $(el).text().trim());
});
