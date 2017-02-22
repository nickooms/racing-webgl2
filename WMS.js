const request = require('request');
// const fetch = require('node-fetch');
const Canvas = require('canvas');
// const fs = require('fs');

const url = 'http://geoservices.informatievlaanderen.be/raadpleegdiensten/GRB/wms';

const Image = Canvas.Image;

const WMS = {
  query({ width, height, layers = 'GRB_WBN', bbox }) {
    return new Promise((resolve, reject) => {
      const { min, max } = bbox;
      const params = {
        SERVICE: 'WMS',
        REQUEST: 'GetMap',
        FORMAT: 'image/png',
        TRANSPARENT: 'TRUE',
        STYLES: layers,
        VERSION: '1.3.0',
        LAYERS: layers,
        WIDTH: width,
        HEIGHT: height,
        CRS: 'EPSG:31370',
        BBOX: [min.x, min.y, max.x, max.y].join(','),
      };
      const qs = Object.entries(params)
        .map(([key, value]) => `${key}=${value}`)
        .join('&');
      const filename = `./images/${params.BBOX}.png`;
      request.get({ url: `${url}?${qs}`, encoding: null }, (err, res, body) => {
        if (err) reject(err);
        const image = new Image();
        image.onerror = e => reject(e);
        image.onload = () => resolve({ img: image, filename });
        image.src = new Buffer(body, 'binary');
      });
    });
  },
};

module.exports = WMS;
