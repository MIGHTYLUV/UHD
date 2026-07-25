/**
 * pahe - Built from src/pahe/
 * Generated: 2026-07-25T17:20:01.525Z
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
var __export = (target, all) => {
  for (var name2 in all)
    __defProp(target, name2, { get: all[name2], enumerable: true });
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

// src/pahe/index.js
var pahe_exports = {};
__export(pahe_exports, {
  getStreams: () => getStreams,
  name: () => name
});
module.exports = __toCommonJS(pahe_exports);

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

// src/_shared/search.js
function normalizeTitle(title) {
  return (title || "").toLowerCase().replace(/[''`]/g, "").replace(/[&]/g, "and").replace(/[:–—\-]/g, " ").replace(/[^\w\s]/g, "").replace(/\s+/g, " ").trim();
}
function encodeSearchQuery(query) {
  return encodeURIComponent(query).replace(/%20/g, "+");
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

// src/pahe/extractor.js
var import_cheerio_without_node_native = __toESM(require("cheerio-without-node-native"));
var BASE_URL = "https://pahe.ink";
function searchPahe(tmdbInfo, mediaType, season, episode) {
  return __async(this, null, function* () {
    try {
      const query = encodeSearchQuery(tmdbInfo.title);
      const searchUrl = `${BASE_URL}/?s=${query}`;
      console.log(`[Pahe] Searching: ${searchUrl}`);
      const html = yield fetchText(searchUrl);
      if (!html)
        return null;
      const $ = import_cheerio_without_node_native.default.load(html);
      let bestMatchUrl = null;
      $(".post-box-title").each((_, el) => {
        const a = $(el).find("a");
        const postTitle = a.text().trim();
        const postUrl = a.attr("href");
        if (!postTitle || !postUrl)
          return;
        const normPost = normalizeTitle(postTitle);
        const normQuery = normalizeTitle(tmdbInfo.title);
        if (mediaType === "movie") {
          if (normPost.includes(normQuery) && postTitle.includes(tmdbInfo.year.toString())) {
            bestMatchUrl = postUrl;
            return false;
          }
        } else {
          if (normPost.includes(normQuery) && normPost.includes(`season ${season}`)) {
            bestMatchUrl = postUrl;
            return false;
          }
        }
      });
      return bestMatchUrl;
    } catch (error) {
      console.error("[Pahe] Search error:", error);
      return null;
    }
  });
}
function extractLinks(pageUrl, tmdbInfo, mediaType, season, episode) {
  return __async(this, null, function* () {
    try {
      console.log(`[Pahe] Extracting from: ${pageUrl}`);
      const html = yield fetchText(pageUrl);
      if (!html)
        return [];
      const $ = import_cheerio_without_node_native.default.load(html);
      const streams = [];
      const entryTitle = $("h1.entry-title").text() || "";
      $(".entry-content p, .entry-content h3").each((_, el) => {
        const text = $(el).text().trim();
        if (!text)
          return;
        const qualityMatch = parseQuality(text) || parseQuality(entryTitle);
        const nuvioQuality = getNuvioQuality(qualityMatch || "1080p");
        $(el).find("a").each((_2, a) => {
          const url = $(a).attr("href");
          const host = $(a).text().trim();
          if (url && (host.toLowerCase().includes("mega") || host.toLowerCase().includes("mediafire") || host.toLowerCase().includes("1fichier"))) {
            const streamTitle = buildStreamTitle(nuvioQuality, `${tmdbInfo.title} - ${host}`);
            streams.push({
              name: "Pahe",
              title: streamTitle,
              url,
              quality: nuvioQuality,
              headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Referer": BASE_URL
              }
            });
          }
        });
      });
      return filterByQuality(streams);
    } catch (error) {
      console.error("[Pahe] Extractor error:", error);
      return [];
    }
  });
}

// src/pahe/index.js
var name = "Pahe";
function getStreams(tmdbId, mediaType, season, episode) {
  return __async(this, null, function* () {
    try {
      const tmdbInfo = yield getTmdbInfo(tmdbId, mediaType, season, episode);
      if (!tmdbInfo) {
        console.log("[Pahe] Could not fetch TMDB info");
        return [];
      }
      console.log(`[Pahe] Fetching streams for: ${tmdbInfo.title}`);
      const pageUrl = yield searchPahe(tmdbInfo, mediaType, season, episode);
      if (!pageUrl) {
        console.log(`[Pahe] No search results for: ${tmdbInfo.title}`);
        return [];
      }
      const streams = yield extractLinks(pageUrl, tmdbInfo, mediaType, season, episode);
      return streams;
    } catch (error) {
      console.error(`[Pahe] Error in getStreams:`, error);
      return [];
    }
  });
}
