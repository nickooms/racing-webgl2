const fetch = require('node-fetch');
const { Image } = require('canvas');
const request = require('request');

const { float3 } = require('./util');
const Cache = require('./Cache');

const URL = 'http://geoservices.informatievlaanderen.be/raadpleegdiensten/GRB/wms';
const INFO_FORMAT = 'application/json';
const PARAMS = {
  SERVICE: 'WMS',
  FORMAT: 'image/png',
  TRANSPARENT: 'TRUE',
  VERSION: '1.3.0',
  CRS: 'EPSG:31370',
};
const caches = {
  GetFeatureInfo: new Cache({ base: 'cache/WMS', name: 'GetFeatureInfo' }),
};

const keyValue = ([key, value]) => `${key}=${value}`;

const boundingBox = ({ min, max }) => [min.x, min.y, max.x, max.y].map(float3).join(',');

const qs = params => Object.entries(params).map(keyValue).join('&');

const WMS = {
  query({ width, height, layers = 'GRB_WBN', bbox: { min, max } }) {
    const bbox = boundingBox({ min, max });
    return new Promise((resolve, reject) => {
      const params = Object.assign({}, PARAMS, {
        REQUEST: 'GetMap',
        STYLES: layers,
        layers,
        width,
        height,
        bbox,
      });
      const filename = `./images/${params.bbox}.png`;
      request.get({ url: `${URL}?${qs(params)}`, encoding: null }, (err, res, body) => {
        if (err) reject(err);
        const image = new Image();
        image.onerror = e => reject(e);
        image.onload = () => resolve({ img: image, filename });
        image.src = new Buffer(body, 'binary');
      });
    });
  },
  getFeatureInfo: async ({ layers = 'GRB_WBN', width, height, bbox: { min, max }, x, y }) => {
    const REQUEST = 'GetFeatureInfo';
    const bbox = boundingBox({ min, max });
    const id = `${layers}-${width}x${height}-${bbox}-${x},${y}`;
    const cache = caches[REQUEST];
    const cached = await cache.get(id);
    if (cached) return cached;
    const params = Object.assign({}, PARAMS, {
      REQUEST,
      STYLES: layers,
      layers,
      width,
      height,
      bbox,
      INFO_FORMAT,
      QUERY_LAYERS: layers,
      FEATURE_COUNT: 10,
      I: x,
      J: y,
    });
    const response = await fetch(`${URL}?${qs(params)}`);
    const obj = await response.json();
    await cache.put(id, obj);
    return obj;
  },
};

module.exports = WMS;
