/**
 * 4khdhub - Built from src/4khdhub/
 * Generated: 2026-07-25T17:20:01.468Z
 */
var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/_shared/search.js
var search_exports = {};
__export(search_exports, {
  buildEpisodeId: () => buildEpisodeId,
  encodeSearchQuery: () => encodeSearchQuery,
  extractYear: () => extractYear,
  normalizeTitle: () => normalizeTitle,
  titlesMatch: () => titlesMatch,
  yearMatches: () => yearMatches
});
function normalizeTitle(title) {
  return (title || "").toLowerCase().replace(/[''`]/g, "").replace(/[&]/g, "and").replace(/[:–—\-]/g, " ").replace(/[^\w\s]/g, "").replace(/\s+/g, " ").trim();
}
function titlesMatch(title1, title2) {
  const n1 = normalizeTitle(title1);
  const n2 = normalizeTitle(title2);
  if (n1 === n2)
    return true;
  if (n1.includes(n2) || n2.includes(n1))
    return true;
  const words1 = n1.split(" ").filter((w) => w.length > 1);
  const words2 = n2.split(" ").filter((w) => w.length > 1);
  const shorter = words1.length <= words2.length ? words1 : words2;
  const longer = words1.length > words2.length ? words1 : words2;
  const matchCount = shorter.filter((w) => longer.includes(w)).length;
  const matchRatio = matchCount / shorter.length;
  return matchRatio >= 0.8;
}
function yearMatches(text, year) {
  if (!year)
    return true;
  return text.includes(year);
}
function encodeSearchQuery(query) {
  return encodeURIComponent(query).replace(/%20/g, "+");
}
function buildEpisodeId(season, episode) {
  if (!season)
    return "";
  const s = String(season).padStart(2, "0");
  if (!episode)
    return `S${s}`;
  const e = String(episode).padStart(2, "0");
  return `S${s}E${e}`;
}
function extractYear(title) {
  const match = (title || "").match(/\b(19|20)\d{2}\b/);
  return match ? match[0] : null;
}
var init_search = __esm({
  "src/_shared/search.js"() {
  }
});

// src/4khdhub/index.js
var khdhub_exports = {};
__export(khdhub_exports, {
  getStreams: () => getStreams
});
module.exports = __toCommonJS(khdhub_exports);

// src/_shared/http.js
var DEFAULT_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9,hi;q=0.8",
  "Cache-Control": "no-cache"
};
function fetchText(_0) {
  return __async(this, arguments, function* (url, options = {}, retries = 2) {
    const _a = options, { headers: extraHeaders } = _a, restOptions = __objRest(_a, ["headers"]);
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = yield fetch(url, __spreadValues({
          headers: __spreadValues(__spreadValues({}, DEFAULT_HEADERS), extraHeaders)
        }, restOptions));
        if (!response.ok) {
          throw new Error(`HTTP ${response.status} for ${url}`);
        }
        return yield response.text();
      } catch (err) {
        if (attempt === retries) {
          throw err;
        }
        yield new Promise((r) => setTimeout(r, (attempt + 1) * 1e3));
      }
    }
  });
}
function fetchJson(_0) {
  return __async(this, arguments, function* (url, options = {}) {
    const text = yield fetchText(url, __spreadProps(__spreadValues({}, options), {
      headers: __spreadValues({
        "Accept": "application/json"
      }, options.headers || {})
    }));
    return JSON.parse(text);
  });
}

// src/_shared/tmdb.js
var TMDB_API_KEY = "ebfc7be4cc7fa987bd5616de3c688c5d";
var TMDB_BASE = "https://api.themoviedb.org/3";
var cache = {};
function getTmdbInfo(tmdbId, mediaType) {
  return __async(this, null, function* () {
    const cacheKey = `${mediaType}_${tmdbId}`;
    if (cache[cacheKey]) {
      return cache[cacheKey];
    }
    try {
      const url = `${TMDB_BASE}/${mediaType}/${tmdbId}?api_key=${TMDB_API_KEY}&language=en-US`;
      const data = yield fetchJson(url);
      const title = mediaType === "movie" ? data.title : data.name;
      const originalTitle = mediaType === "movie" ? data.original_title : data.original_name;
      const releaseDate = mediaType === "movie" ? data.release_date : data.first_air_date;
      const year = releaseDate ? releaseDate.split("-")[0] : "";
      const info = {
        title: title || originalTitle || "",
        originalTitle: originalTitle || title || "",
        year,
        imdbId: data.imdb_id || ""
      };
      cache[cacheKey] = info;
      return info;
    } catch (err) {
      console.error(`[TMDB] Error fetching ${mediaType}/${tmdbId}: ${err.message}`);
      return { title: "", originalTitle: "", year: "", imdbId: "" };
    }
  });
}

// src/4khdhub/http.js
var BASE_URL = "https://4khdhub.one";
var HEADERS = __spreadProps(__spreadValues({}, DEFAULT_HEADERS), {
  "Origin": BASE_URL,
  "Referer": `${BASE_URL}/`
});
function fetchHtml(url) {
  return __async(this, null, function* () {
    return yield fetchText(url, { headers: HEADERS });
  });
}

// src/4khdhub/extractor.js
var import_cheerio_without_node_native = __toESM(require("cheerio-without-node-native"));

// src/_shared/quality.js
function parseQuality(title) {
  const t = title || "";
  const upper = t.toUpperCase();
  const is4K = /2160[pP]|4K|UHD/i.test(t);
  const is1080p = /1080[pP]/i.test(t);
  const is720p = /720[pP]/i.test(t);
  const isHDR = /HDR10\+?|HDR/i.test(t);
  const isDV = /\bDV\b|Dolby[\s\-]?Vision/i.test(t);
  const isRemux = /REMUX/i.test(t);
  const isIMAX = /IMAX/i.test(t);
  const isAtmos = /Atmos/i.test(t);
  let codec = "";
  if (/x265|HEVC|H\.?265/i.test(t))
    codec = "x265";
  else if (/x264|AVC|H\.?264/i.test(t))
    codec = "x264";
  let source = "";
  if (/BluRay|BDRip|BD\b/i.test(t))
    source = "BluRay";
  else if (/WEB[\s\-]?DL/i.test(t))
    source = "WEB-DL";
  else if (/WEBRip/i.test(t))
    source = "WEBRip";
  else if (/HDTV/i.test(t))
    source = "HDTV";
  const sizeMatch = t.match(/\[?([\d.]+)\s*(GB|MB)\]?/i);
  const size = sizeMatch ? `${sizeMatch[1]} ${sizeMatch[2].toUpperCase()}` : "";
  let resolution = "720p";
  if (is4K)
    resolution = "2160p";
  else if (is1080p)
    resolution = "1080p";
  else if (is720p)
    resolution = "720p";
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
    size
  };
}
function getNuvioQuality(quality) {
  if (quality.is4K)
    return "4K";
  if (quality.is1080p)
    return "1080p";
  return "720p";
}
function buildStreamTitle(quality, extraInfo = "") {
  const parts = [quality.resolution];
  if (quality.isHDR)
    parts.push("HDR");
  if (quality.isDV)
    parts.push("DV");
  if (quality.isRemux)
    parts.push("REMUX");
  if (quality.isIMAX)
    parts.push("IMAX");
  if (quality.isAtmos)
    parts.push("Atmos");
  if (quality.source)
    parts.push(quality.source);
  if (quality.codec)
    parts.push(quality.codec);
  if (quality.size)
    parts.push(`[${quality.size}]`);
  if (extraInfo)
    parts.push(extraInfo);
  return parts.join(" ");
}
function filterByQuality(streams) {
  const streams4K = streams.filter((s) => s._quality && s._quality.is4K);
  const streams1080 = streams.filter((s) => s._quality && s._quality.is1080p);
  let result = [];
  if (streams4K.length > 0) {
    result = streams4K;
  }
  if (streams1080.length > 0) {
    result = result.concat(streams1080);
  }
  return result.map((s) => {
    const _a = s, { _quality } = _a, clean = __objRest(_a, ["_quality"]);
    return clean;
  });
}

// src/4khdhub/extractor.js
function search(title, tmdbId, mediaType) {
  return __async(this, null, function* () {
    try {
      const query = encodeURIComponent(title);
      const searchUrl = `${BASE_URL}/?s=${query}`;
      console.log(`[4KHDHub] Searching: ${searchUrl}`);
      const html = yield fetchHtml(searchUrl);
      if (!html)
        return null;
      const $ = import_cheerio_without_node_native.default.load(html);
      let foundUrl = null;
      const { titlesMatch: titlesMatch2 } = yield Promise.resolve().then(() => (init_search(), search_exports));
      $("a.movie-card").each((i, el) => {
        const href = $(el).attr("href");
        const cardTitle = $(el).find(".movie-card-title, h3, h2").text().trim();
        if (href && titlesMatch2(cardTitle, title)) {
          foundUrl = href;
          return false;
        }
      });
      if (foundUrl) {
        console.log(`[4KHDHub] Found URL: ${foundUrl}`);
        if (!foundUrl.startsWith("http")) {
          foundUrl = `${BASE_URL}${foundUrl.startsWith("/") ? "" : "/"}${foundUrl}`;
        }
        return foundUrl;
      }
      console.log(`[4KHDHub] No matching URL found for title: ${title}`);
      return null;
    } catch (err) {
      console.error(`[4KHDHub] Search error: ${err.message}`);
      return null;
    }
  });
}
function extractStreams(pageUrl, mediaType, season, episode) {
  return __async(this, null, function* () {
    try {
      console.log(`[4KHDHub] Extracting streams from: ${pageUrl}`);
      const html = yield fetchHtml(pageUrl);
      if (!html)
        return [];
      const $ = import_cheerio_without_node_native.default.load(html);
      const streams = [];
      if (mediaType === "movie") {
        $(".download-item").each((i, el) => {
          const header = $(el).find(".download-header").text().trim();
          const fileTitle = $(el).find(".file-title").text().trim();
          const badges = [];
          $(el).find(".badge").each((j, badge) => {
            badges.push($(badge).text().trim());
          });
          const combinedInfo = `${header} ${fileTitle} ${badges.join(" ")}`;
          const qualityData = parseQuality(combinedInfo);
          const quality = getNuvioQuality(qualityData);
          const sizeBadge = badges.find((b) => b.includes("GB") || b.includes("MB")) || "";
          const titleStr = buildStreamTitle(fileTitle || header, qualityData, sizeBadge);
          $(el).find("a.btn").each((j, btn) => {
            const link = $(btn).attr("href");
            const btnText = $(btn).text().trim();
            if (link && link.startsWith("http")) {
              streams.push({
                name: "4KHDHub",
                title: `${titleStr} [${btnText}]`,
                url: link,
                quality,
                headers: {
                  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                  "Referer": pageUrl
                }
              });
            }
          });
        });
      } else {
        const targetEpText = `S${String(season).padStart(2, "0")}E${String(episode).padStart(2, "0")}`;
        const targetEpFallback = `S${season} E${episode}`;
        $(".download-item").each((i, el) => {
          const header = $(el).find(".download-header").text().trim();
          const fileTitle = $(el).find(".file-title").text().trim();
          const combinedInfo = `${header} ${fileTitle}`;
          if (combinedInfo.toUpperCase().includes(targetEpText) || combinedInfo.toUpperCase().includes(targetEpFallback) || combinedInfo.match(new RegExp(`S0*${season}[^0-9]*E0*${episode}`, "i"))) {
            const badges = [];
            $(el).find(".badge").each((j, badge) => {
              badges.push($(badge).text().trim());
            });
            const qualityData = parseQuality(`${combinedInfo} ${badges.join(" ")}`);
            const quality = getNuvioQuality(qualityData);
            const sizeBadge = badges.find((b) => b.includes("GB") || b.includes("MB")) || "";
            const titleStr = buildStreamTitle(fileTitle || header, qualityData, sizeBadge);
            $(el).find("a.btn").each((j, btn) => {
              const link = $(btn).attr("href");
              const btnText = $(btn).text().trim();
              if (link && link.startsWith("http")) {
                streams.push({
                  name: "4KHDHub",
                  title: `${titleStr} [${btnText}]`,
                  url: link,
                  quality,
                  headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                    "Referer": pageUrl
                  }
                });
              }
            });
          }
        });
        if (streams.length === 0) {
          $(".download-item").each((i, el) => {
            const header = $(el).find(".download-header").text().trim();
            const fileTitle = $(el).find(".file-title").text().trim();
            const combinedInfo = `${header} ${fileTitle}`;
            if (combinedInfo.match(new RegExp(`S0*${season}`, "i")) && !combinedInfo.match(/E\d+/i)) {
              const badges = [];
              $(el).find(".badge").each((j, badge) => {
                badges.push($(badge).text().trim());
              });
              const qualityData = parseQuality(`${combinedInfo} ${badges.join(" ")}`);
              const quality = getNuvioQuality(qualityData);
              const sizeBadge = badges.find((b) => b.includes("GB") || b.includes("MB")) || "";
              const titleStr = buildStreamTitle(fileTitle || header, qualityData, sizeBadge);
              $(el).find("a.btn").each((j, btn) => {
                const link = $(btn).attr("href");
                const btnText = $(btn).text().trim();
                if (link && link.startsWith("http")) {
                  streams.push({
                    name: "4KHDHub",
                    title: `[Season Pack] ${titleStr} [${btnText}]`,
                    url: link,
                    quality,
                    headers: {
                      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                      "Referer": pageUrl
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
  });
}

// src/4khdhub/index.js
function getStreams(tmdbId, mediaType, season, episode) {
  return __async(this, null, function* () {
    try {
      console.log(`[4KHDHub] Fetching streams for TMDB ID: ${tmdbId}, Type: ${mediaType}`);
      const tmdbInfo = yield getTmdbInfo(tmdbId, mediaType);
      if (!tmdbInfo || !tmdbInfo.title) {
        console.log(`[4KHDHub] Failed to get TMDB info for ID: ${tmdbId}`);
        return [];
      }
      const pageUrl = yield search(tmdbInfo.title, tmdbId, mediaType);
      if (!pageUrl) {
        return [];
      }
      const streams = yield extractStreams(pageUrl, mediaType, season, episode);
      console.log(`[4KHDHub] Found ${streams.length} streams`);
      return streams;
    } catch (err) {
      console.error(`[4KHDHub] Fatal error: ${err.message}`);
      return [];
    }
  });
}
