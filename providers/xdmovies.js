/**
 * xdmovies - Built from src/xdmovies/
 * Generated: 2026-07-25T16:56:07.711Z
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

// src/xdmovies/http.js
var SITE_URL = "https://top.xdmovies.wtf";
var HEADERS = __spreadProps(__spreadValues({}, DEFAULT_HEADERS), {
  "Referer": `${SITE_URL}/`,
  "Origin": SITE_URL
});
function fetchText2(_0) {
  return __async(this, arguments, function* (url, options = {}) {
    return fetchText(url, __spreadProps(__spreadValues({}, options), {
      headers: __spreadValues(__spreadValues({}, HEADERS), options.headers || {})
    }));
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
function buildSearchQuery(tmdbId, mediaType) {
  return __async(this, null, function* () {
    const info = yield getTmdbInfo(tmdbId, mediaType);
    if (!info.title) {
      throw new Error(`Could not resolve TMDB ID ${tmdbId}`);
    }
    return mediaType === "movie" && info.year ? `${info.title} ${info.year}` : info.title;
  });
}

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

// src/_shared/search.js
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
function encodeSearchQuery(query) {
  return encodeURIComponent(query).replace(/%20/g, "+");
}

// src/xdmovies/extractor.js
var import_cheerio_without_node_native = __toESM(require("cheerio-without-node-native"));
var PROVIDER_NAME = "XDMovies";
function findContentUrl(tmdbId, mediaType) {
  return __async(this, null, function* () {
    try {
      const searchUrl = `${SITE_URL}/?s=${tmdbId}`;
      console.log(`[${PROVIDER_NAME}] Searching by TMDB ID: ${searchUrl}`);
      const html = yield fetchText2(searchUrl);
      const $ = import_cheerio_without_node_native.default.load(html);
      const type = mediaType === "movie" ? "movies" : "tvshows";
      let matchUrl = null;
      $("a[href]").each((_, el) => {
        const href = $(el).attr("href") || "";
        if (href.includes(`/${type}/`) && href.includes(`-${tmdbId}`)) {
          matchUrl = href;
          return false;
        }
      });
      if (matchUrl) {
        if (matchUrl.startsWith("/"))
          matchUrl = SITE_URL + matchUrl;
        console.log(`[${PROVIDER_NAME}] Found by TMDB ID: ${matchUrl}`);
        return matchUrl;
      }
    } catch (err) {
      console.log(`[${PROVIDER_NAME}] TMDB ID search failed: ${err.message}`);
    }
    try {
      const query = yield buildSearchQuery(tmdbId, mediaType);
      const searchUrl = `${SITE_URL}/?s=${encodeSearchQuery(query)}`;
      console.log(`[${PROVIDER_NAME}] Searching by title: ${searchUrl}`);
      const html = yield fetchText2(searchUrl);
      const $ = import_cheerio_without_node_native.default.load(html);
      const tmdbInfo = yield getTmdbInfo(tmdbId, mediaType);
      let matchUrl = null;
      let bestScore = 0;
      $("article a[href], .result-item a[href], .search-page a[href]").each((_, el) => {
        const href = $(el).attr("href") || "";
        const title = $(el).text().trim();
        if (href.includes(`-${tmdbId}`)) {
          matchUrl = href;
          return false;
        }
        if (titlesMatch(title, tmdbInfo.title)) {
          matchUrl = href;
          return false;
        }
      });
      if (matchUrl) {
        if (matchUrl.startsWith("/"))
          matchUrl = SITE_URL + matchUrl;
        console.log(`[${PROVIDER_NAME}] Found by title: ${matchUrl}`);
        return matchUrl;
      }
    } catch (err) {
      console.log(`[${PROVIDER_NAME}] Title search failed: ${err.message}`);
    }
    return null;
  });
}
function parseDownloadLinks(html) {
  const $ = import_cheerio_without_node_native.default.load(html);
  const streams = [];
  $("a[href]").each((_, el) => {
    const $el = $(el);
    const href = $el.attr("href") || "";
    const text = $el.text().trim();
    const parentText = $el.parent().text().trim();
    if (href.includes("xdmovies.wtf") && !href.includes("download"))
      return;
    if (href.startsWith("#") || href.startsWith("javascript:"))
      return;
    if (href.includes("facebook.com") || href.includes("twitter.com"))
      return;
    if (href.includes("instagram.com") || href.includes("telegram"))
      return;
    const isDownloadLink = href.includes("drive.google.com") || href.includes("hubcloud") || href.includes("hubdrive") || href.includes("pixeldrain") || href.includes("1fichier") || href.includes("gdtot") || href.includes("filepress") || text.toLowerCase().includes("download") || $el.hasClass("btn") || $el.hasClass("download");
    if (!isDownloadLink)
      return;
    const contextText = text + " " + parentText;
    const quality = parseQuality(contextText);
    if (!quality.is4K && !quality.is1080p)
      return;
    streams.push({
      name: PROVIDER_NAME,
      title: buildStreamTitle(quality),
      url: href,
      quality: getNuvioQuality(quality),
      headers: HEADERS,
      _quality: quality
    });
  });
  $("iframe[src], iframe[data-src]").each((_, el) => {
    const src = $(el).attr("src") || $(el).attr("data-src") || "";
    if (src && !src.includes("youtube") && !src.includes("google.com/recaptcha")) {
      streams.push({
        name: PROVIDER_NAME,
        title: "Stream",
        url: src,
        quality: "1080p",
        headers: HEADERS,
        _quality: { is4K: false, is1080p: true }
      });
    }
  });
  return streams;
}
function findEpisodeUrl(showUrl, season, episode) {
  return __async(this, null, function* () {
    try {
      const html = yield fetchText2(showUrl);
      const $ = import_cheerio_without_node_native.default.load(html);
      const seasonStr = String(season);
      const episodeStr = String(episode);
      let episodeUrl = null;
      $("a[href]").each((_, el) => {
        const href = $(el).attr("href") || "";
        const text = $(el).text().trim().toLowerCase();
        if (href.includes(`${season}x${episode}`) || href.includes(`${seasonStr.padStart(2, "0")}x${episodeStr.padStart(2, "0")}`) || text.includes(`season ${season}`) && text.includes(`episode ${episode}`)) {
          episodeUrl = href;
          return false;
        }
      });
      if (episodeUrl) {
        if (episodeUrl.startsWith("/"))
          episodeUrl = SITE_URL + episodeUrl;
        return episodeUrl;
      }
    } catch (err) {
      console.log(`[${PROVIDER_NAME}] Episode lookup failed: ${err.message}`);
    }
    return null;
  });
}
function extractStreams(tmdbId, mediaType, season, episode) {
  return __async(this, null, function* () {
    console.log(`[${PROVIDER_NAME}] Extracting: ${mediaType} ${tmdbId} S${season || "-"}E${episode || "-"}`);
    const contentUrl = yield findContentUrl(tmdbId, mediaType);
    if (!contentUrl) {
      console.log(`[${PROVIDER_NAME}] No content found for TMDB ID ${tmdbId}`);
      return [];
    }
    let targetUrl = contentUrl;
    if (mediaType === "tv" && season && episode) {
      const episodeUrl = yield findEpisodeUrl(contentUrl, season, episode);
      if (episodeUrl) {
        targetUrl = episodeUrl;
      }
    }
    const html = yield fetchText2(targetUrl);
    const allStreams = parseDownloadLinks(html);
    console.log(`[${PROVIDER_NAME}] Found ${allStreams.length} raw streams`);
    const filtered = filterByQuality(allStreams);
    console.log(`[${PROVIDER_NAME}] Returning ${filtered.length} streams after quality filter`);
    return filtered;
  });
}

// src/xdmovies/index.js
function getStreams(tmdbId, mediaType, season, episode) {
  return __async(this, null, function* () {
    try {
      console.log(`[XDMovies] Request: ${mediaType} ${tmdbId}`);
      const streams = yield extractStreams(tmdbId, mediaType, season, episode);
      return streams;
    } catch (error) {
      console.error(`[XDMovies] Error: ${error.message}`);
      return [];
    }
  });
}
module.exports = { getStreams };
