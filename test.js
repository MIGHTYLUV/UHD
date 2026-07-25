/**
 * Provider Test Script
 * 
 * Usage:
 *   node test.js xdmovies 550 movie
 *   node test.js 4khdhub 872585 movie
 *   node test.js olamovies 1396 tv 1 1
 */

const path = require('path');

async function main() {
    const args = process.argv.slice(2);
    const providerName = args[0] || 'xdmovies';
    const tmdbId = args[1] || '550'; // Default: Fight Club
    const mediaType = args[2] || 'movie';
    const season = args[3] ? parseInt(args[3], 10) : null;
    const episode = args[4] ? parseInt(args[4], 10) : null;

    console.log(`\n🧪 Testing provider: [${providerName}]`);
    console.log(`🎬 Target: ${mediaType} TMDB:${tmdbId} S:${season || '-'} E:${episode || '-'}\n`);

    const providerPath = path.join(__dirname, 'providers', `${providerName}.js`);

    try {
        const provider = require(providerPath);
        if (!provider.getStreams) {
            console.error(`❌ Provider ${providerName}.js does not export getStreams()`);
            return;
        }

        const startTime = Date.now();
        const streams = await provider.getStreams(tmdbId, mediaType, season, episode);
        const duration = ((Date.now() - startTime) / 1000).toFixed(2);

        console.log(`\n✅ Finished in ${duration}s. Found ${streams.length} stream(s):\n`);

        streams.forEach((stream, index) => {
            console.log(`--- Stream #${index + 1} ---`);
            console.log(`Name:    ${stream.name}`);
            console.log(`Title:   ${stream.title}`);
            console.log(`Quality: ${stream.quality}`);
            console.log(`URL:     ${stream.url}`);
            if (stream.headers) {
                console.log(`Headers: ${JSON.stringify(stream.headers)}`);
            }
            console.log('');
        });

    } catch (err) {
        console.error(`❌ Error testing ${providerName}:`, err);
    }
}

main();
