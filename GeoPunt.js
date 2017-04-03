const fetch = require('isomorphic-fetch');

const Cache = require('./Cache');

const cache = new Cache({ base: 'cache/GeoPunt', name: 'location' });
const URL = 'http://loc.geopunt.be/v2';

const straat = async (gemeenteNaam, straatNaam) => {
  const id = `${straatNaam}, ${gemeenteNaam}`;
  const cached = await cache.get(id);
  if (cached) return cached;
  const response = await fetch(`${URL}/location?q=${id}`);
  const object = await response.json();
  await cache.put(id, object);
  return object;
};

module.exports = { straat };
