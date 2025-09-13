// Optional MaxMind geolocation helper
// Usage: set env MAXMIND_DB to the path of GeoLite2-City.mmdb in the server container/host.
// If the db or module is missing, the functions will gracefully return null.

let maxmind = null;
let cityReader = null;

async function initMaxMind(dbPath) {
  try {
    if (!dbPath) return false;
    // Lazy require so the app can run without the dependency when disabled
    // eslint-disable-next-line global-require
    maxmind = require('maxmind');
    cityReader = await maxmind.open(dbPath);
    return true;
  } catch (e) {
    console.warn('[geo] MaxMind disabled:', e.message);
    maxmind = null;
    cityReader = null;
    return false;
  }
}

function getClientIp(req) {
  // Prefer explicit headers from proxy/CDN first
  const cf = (req.headers['cf-connecting-ip'] || '').toString().trim();
  if (cf) return cf;
  const real = (req.headers['x-real-ip'] || '').toString().trim();
  if (real) return real;
  const xfwd = (req.headers['x-forwarded-for'] || '').toString();
  if (xfwd) return xfwd.split(',')[0].trim();
  return req.ip || req.connection?.remoteAddress || null;
}

function lookupCity(req) {
  try {
    if (!cityReader) return null;
    const ip = getClientIp(req);
    if (!ip) return null;
    const res = cityReader.get(ip);
    // res may be undefined for private IPs
    if (!res) return null;
    const city = res.city?.names?.en || null;
    const subdivisions = Array.isArray(res.subdivisions) ? res.subdivisions : [];
    const region = subdivisions[0]?.names?.en || null;
    const country = res.country?.iso_code || null;
    return { city, region, country };
  } catch {
    return null;
  }
}

function lookupCityByIp(ip) {
  try {
    if (!cityReader || !ip) return null;
    const res = cityReader.get(ip);
    if (!res) return null;
    const city = res.city?.names?.en || null;
    const subdivisions = Array.isArray(res.subdivisions) ? res.subdivisions : [];
    const region = subdivisions[0]?.names?.en || null;
    const country = res.country?.iso_code || null;
    return { city, region, country };
  } catch {
    return null;
  }
}

// Map a MaxMind city/region to one of our supported city slugs
function mapToSlug(geo) {
  if (!geo) return null;
  const c = (geo.city || '').toLowerCase();
  const r = (geo.region || '').toLowerCase();
  // Expand as you add more cities
  if (c.includes('boston')) return 'boston';
  if (c.includes('albany') && r.includes('new york')) return 'albany';
  if (c.includes('pittsburgh')) return 'pittsburgh';
  if (c.includes('schenectady')) return 'schenectady';
  if (c.includes('champaign') || c.includes('urbana') || c.includes('savoy')) return 'champaign-urbana-savoy';
  return null;
}

module.exports = { initMaxMind, lookupCity, lookupCityByIp, mapToSlug };
