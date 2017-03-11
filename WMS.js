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
const base = 'cache/WMS';
const caches = {
  GetFeatureInfo: new Cache({ base, name: 'GetFeatureInfo' }),
  GetMap: new Cache({ base, name: 'GetMap' }),
};

const keyValue = ([key, value]) => `${key}=${value}`;

const boundingBox = ({ min, max }) => [min.x, min.y, max.x, max.y].map(float3).join(',');

const qs = params => Object.entries(params).map(keyValue).join('&');

const WMS = {
  query: async ({
    width,
    height,
    layers = 'GRB_WBN',
    bbox: { min, max },
  }) => {
    const REQUEST = 'GetMap';
    const layerNames = layers instanceof Array ? layers.join(',') : layers;
    const bbox = boundingBox({ min, max });
    const id = `${layers}-${width}x${height}-${bbox}`;
    const cache = caches[REQUEST];
    const cached = await cache.get(id);
    return new Promise((resolve, reject) => {
      const params = Object.assign({}, PARAMS, {
        REQUEST,
        STYLES: layerNames,
        layers: layerNames,
        width,
        height,
        bbox,
      });
      const filename = `./images/${params.bbox}.png`;
      const image = new Image();
      image.onerror = e => reject(e);
      image.onload = () => resolve({ img: image, filename });
      if (cached) {
        image.src = new Buffer(cached, 'binary');
        return;
      }
      request.get({ url: `${URL}?${qs(params)}`, encoding: null }, (err, res, body) => {
        if (err) reject(err);
        cache.put(id, body);
        image.src = new Buffer(body, 'binary');
      });
    });
  },
  getFeatureInfo: async ({
    layers = 'GRB_WBN',
    width,
    height,
    bbox: { min, max },
    x,
    y,
  }) => {
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
    try {
      const obj = await response.json();
      await cache.put(id, obj);
      return obj;
    } catch (e) {
      console.log(e);
      // for (let a in response) console.log(a);
      console.log(response._raw.toString());
    }
  },
};

module.exports = WMS;
