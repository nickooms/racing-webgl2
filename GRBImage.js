const format = require('fmt-obj');
const Canvas = require('canvas');
const earcut = require('earcut');
const fetch = require('node-fetch');
const fs = require('fs');

const { list, object } = require('./app/lib/crab');
const MarchingSquares = require('./MarchingSquares');
const { compose, flatten } = require('./functional');
const Wegbaan = require('./models/Wegbaan');
const GRBCanvas = require('./GRBCanvas');
const simplify = require('./simplify');
const Random = require('./Random');
const { query } = require('./WMS');
const BBOX = require('./BBOX');
// const db = require('./db');

const SorteerVeld = 0;

const Image = Canvas.Image;

const error = e => console.error(e);

const wegsegmentById = id =>
  object('GetWegsegmentByIdentificatorWegsegment', { IdentificatorWegsegment: id });

const wegobjectById = id =>
  object('GetWegobjectByIdentificatorWegobject', { IdentificatorWegobject: id });

const wegsegmentenByStraat = id =>
  list('ListWegsegmentenByStraatnaamId', { StraatnaamId: id, SorteerVeld });

const getWegsegmenten = x => Promise.all(x.map(({ id }) => wegsegmentById(id)));

const wegobjectenByStraat = id =>
  list('ListWegobjectenByStraatnaamId', { StraatnaamId: id, SorteerVeld });

const getWegobjecten = x => Promise.all(x.map(({ id }) => wegobjectById(id)));

const wegbaanByStraat = straat =>
  Promise.all([wegsegmentenByStraat(straat), wegobjectenByStraat(straat)])
  .then(([segmenten, objecten]) => Promise.all([
    getWegsegmenten(segmenten),
    getWegobjecten(objecten),
  ]));

const canvasToImg = canvas =>
  `<img src="${canvas.toDataURL()}" width="100%" height="100%">`;

const canvasListToHTML = canvasList =>
`<html>
  <head>
    <style>body { margin: 0; }</style>
  </head>
  <body>
    ${canvasList.map(canvas => canvasToImg(canvas))}
  </body>
</html>`;

const canvasToHTML = canvas => canvasListToHTML([canvas]);

const pixel = canvas => bbox => ({ x, y }) => {
  const { min, max } = bbox;
  return {
    x: parseInt(((x - min.x) / bbox.width) * canvas.width, 10),
    y: parseInt(((max.y - y) / bbox.height) * canvas.height, 10),
  };
};

const coordinatesToPixels = (canvas, bbox, coordinates) =>
  coordinates.map(pixel(canvas)(bbox));

const prop = name => x => x[name];

// const center = prop('center');
const geometrie = prop('geometrie');

const lineString = compose(prop('lineString'), geometrie);

const centers = x => x.map(prop('center'));
const lineStrings = x => x.map(lineString);

const SIZE = 1000;

const float3 = x => parseFloat(x.toFixed(3));

const getLayer = ({ width = SIZE, height = SIZE, bbox }) =>
  query({ width, height, bbox })
  .then(({ img }) => new GRBCanvas(width, height, bbox, img));

const getFeatureInfo = ({ width, height, bbox, x, y }) => {
  const url = 'http://geoservices.informatievlaanderen.be/raadpleegdiensten/GRB/wms';
  const params = {
    SERVICE: 'WMS',
    REQUEST: 'GetFeatureInfo',
    FORMAT: 'image/png',
    TRANSPARENT: 'TRUE',
    STYLES: 'GRB_WBN',
    VERSION: '1.3.0',
    LAYERS: 'GRB_WBN',
    WIDTH: width,
    HEIGHT: height,
    // CRS: 'EPSG:3857',
    CRS: 'EPSG:31370',
    BBOX: [
      bbox.min.x, // 490292.79086267675,
      bbox.min.y, // 6675608.460021957,
      bbox.max.x, // 490531.65657606855,
      bbox.max.y, // 6675690.868693077,
    ].join(','),
    INFO_FORMAT: 'application/json',
    QUERY_LAYERS: 'GRB_WBN',
    FEATURE_COUNT: 10,
    I: x,
    J: y,
  };
  const qs = Object.entries(params)
  .map(([key, value]) => `${key}=${value}`)
  .join('&');
  return fetch(`${url}?${qs}`);
};

const GRBImage = {
  wegbaan: ({ params: { StraatnaamId: straatId } }, res) => {
    console.log(`wegbaan ${straatId}`);
    wegbaanByStraat(straatId)
    .then(([wegsegmenten, wegobjecten]) => {
      const canvasList = [];
      /* const ids = new Map();
      wegsegmenten.forEach((wegsegment) => {
        wegsegment.geometrie.lineString.forEach(point =>
          ids.set(point, { type: 'Wegsegment', id: wegsegment.id }));
      });
      wegobjecten.forEach((wegobject) => {
        ids.set(wegobject.center, { type: 'Wegobject', id: wegobject.id });
      });*/
      const coordinates = flatten([lineStrings(wegsegmenten), centers(wegobjecten)]);
      // console.log(`coordinates => ${format(coordinates)}`);
      const bbox = new BBOX(coordinates);
      const width = SIZE;
      const height = SIZE;
      getLayer({ width, height, bbox })
      .then((canvas) => {
        canvasList.push(canvas);
        Promise.all(coordinates.map((coordinate) => {
          // console.log(`coordinate => ${format(coordinate)}`);
          const fill = canvas.flood(coordinate, [GRBCanvas.Red, GRBCanvas.Green]);
          if (fill) {
            const { bboxDetail } = fill;
            bboxDetail.grow(parseInt((bboxDetail.width + bboxDetail.height) / 20, 10));
            return getLayer({ width: SIZE, height: SIZE, bbox: bboxDetail })
            .then((detailCanvas) => {
              const detailFilled = detailCanvas.flood(coordinate, [GRBCanvas.Red, GRBCanvas.Green]);
              if (detailFilled) {
                const { fillCanvas } = detailFilled;
                canvasList.push(fillCanvas);
                const px = detailCanvas.pixel(coordinate);
                getFeatureInfo({
                  width: detailCanvas.width,
                  height: detailCanvas.height,
                  bbox: bboxDetail,
                  x: px.x,
                  y: px.y,
                })
                .then(response => response.json())
                .then(({ features: [feature] }) => {
                  const { geometry, properties } = feature;
                  const id = feature.id.split('.')[1];
                  const border = MarchingSquares.getBlobOutlinePoints(fillCanvas);
                  const corners = simplify(border, 1.5);
                  /* const vertices = geometry.coordinates[0]
                    .map(([x, y]) => ({ x, y }))
                    .map(c => fillCanvas.pixel(c))
                    .map(({ x, y }) => [x, y]);*/
                  const vertices = corners.map(({ x, y }) => [x, y]);
                  // console.log('geometry');
                  /* console.log(geometry.coordinates[0]
                    .map(([x, y]) => ({ x, y }))
                    .map(c => fillCanvas.pixel(c))
                    .map(({ x, y }) => [x, y]));
                  console.log('vertices');
                  console.log(vertices);*/
                  const coords = corners
                    .map(corner => fillCanvas.coordinate(corner))
                    .map(({ x, y }) => [float3(x), float3(y)]);
                  const bboxCoords = new BBOX(corners.map(corner => fillCanvas.coordinate(corner)));
                  const { center: mid } = bboxCoords;
                  const centeredCoords = coords.concat([coords[0]]).map(([x, y]) =>
                    [float3((mid.x - x)), 0, float3((mid.y - y))]);
                  const position = flatten(centeredCoords);
                  const center = [float3(mid.x), float3(mid.y)];
                  const normal = flatten(coords.concat([null, null]).map(() => [0, 1, 0]));
                  const texcoord = flatten(coords.map(() => [0, 0]));
                  const triangles = earcut(flatten(vertices));
                  const indices = flatten(triangles);
                  const ctx = fillCanvas.ctx;
                  for (let i = triangles.length; i;) {
                    ctx.beginPath();
                    for (let j = 0; j < 3; j++) {
                      --i;
                      const triangle = triangles[i];
                      ctx.moveTo(vertices[triangle][0], vertices[triangle][1]);
                    }
                    ctx.closePath();
                    ctx.stroke();
                  }
                  const type = properties.LBLTYPE;
                  const obj = {
                    type,
                    straatId,
                    position/* : flatten(centeredCoords)*/,
                    center/* : [float3(mid.x), float3(mid.y)]*/,
                    normal/* : flatten(coords.concat([null, null]).map(() => [0, 1, 0]))*/,
                    texcoord/* : flatten(coords.map(() => [0, 0]))*/,
                    indices/* : flatten(triangles)*/,
                  };
                  Wegbaan.findOneAndUpdate({ id }, obj, { upsert: true, new: true })
                  .then(wegbaan => console.log(`Added ${wegbaan.type} ${wegbaan.id}`))
                  .catch(error);
                })
                .catch(e => console.error(e));
                /* const border = MarchingSquares.getBlobOutlinePoints(fillCanvas);
                const corners = simplify(border, 1.5);
                const vertices = corners.map(({ x, y }) => [x, y]);
                const coords = corners
                  .map(corner => fillCanvas.coordinate(corner))
                  .map(({ x, y }) => [float3(x), float3(y)]);
                const bboxCoords = new BBOX(corners.map(corner => fillCanvas.coordinate(corner)));
                const { center: mid } = bboxCoords;
                const centeredCoords = coords.concat([coords[0]]).map(([x, y]) =>
                  [float3((mid.x - x)), 0, float3((mid.y - y))]);
                const triangles = earcut(flatten(vertices));
                const ctx = fillCanvas.ctx;
                for (let i = triangles.length; i;) {
                  ctx.beginPath();
                  for (let j = 0; j < 3; j++) {
                    --i;
                    const triangle = triangles[i];
                    ctx.moveTo(vertices[triangle][0], vertices[triangle][1]);
                  }
                  ctx.closePath();
                  ctx.stroke();
                }*/
                // const { id, type } = ids.get(coordinate);
                /* const obj = {
                  type,
                  straatId,
                  position: flatten(centeredCoords),
                  center: [float3(mid.x), float3(mid.y)],
                  normal: flatten(coords.concat([null, null]).map(() => [0, 1, 0])),
                  texcoord: flatten(coords.map(() => [0, 0])),
                  indices: flatten(triangles),
                };
                Wegbaan.findOneAndUpdate({ id }, obj, { upsert: true, new: true })
                .then(wegbaan => console.log(`Added ${wegbaan.type} ${wegbaan.id}`))
                .catch(error);*/
              }
              return detailCanvas;
            })
            .catch(error);
          }
          return Promise.resolve(null);
        }))
        .then(() => res.send(canvasListToHTML(canvasList)))
        .catch(error);
      })
      .catch(error);
    })
    .catch(error);
  },
  wegsegmenten: ({ params: { StraatnaamId } }, res) => {
    list('ListWegsegmentenByStraatnaamId', { StraatnaamId, SorteerVeld })
      .then(array => Promise.all(array.map(({ id }) => wegsegmentById(id)))
        .then((wegsegmentenList) => {
          const lines = wegsegmentenList.map(({ geometrie: { lineString: line } }) => line);
          const points = flatten(lines);
          const bbox = new BBOX(points);
          const width = parseInt(bbox.width * 10, 10);
          const height = parseInt(bbox.height * 10, 10);
          query({ width, height, bbox }, (img/* , filename*/) => {
            const canvas = new Canvas(width, height);
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            ctx.strokeWidth = 5;
            lines.forEach((line) => {
              const color = Random.color();
              ctx.strokeStyle = color;
              ctx.fillStyle = color;
              const pixels = coordinatesToPixels(canvas, bbox, line);
              const { left, bottom, w, h } = new BBOX(pixels);
              ctx.strokeRect(left, bottom, w, h);
              ctx.beginPath();
              pixels.forEach(({ x, y }, pixelIndex) => {
                ctx.fillRect(x - 4, y - 4, 9, 9);
                ctx[pixelIndex === 0 ? 'moveTo' : 'lineTo'](x, y);
              });
              ctx.stroke();
            });
            res.send(canvasToHTML(canvas));
          });
        }));
  },
  wegobjecten: ({ params: { StraatnaamId } }, res) => {
    list('ListWegobjectenByStraatnaamId', { StraatnaamId, SorteerVeld })
      .then(array => Promise.all(array.map(({ id }) => wegobjectById(id)))
        .then((wegobjectenList) => {
          const bounds = wegobjectenList.map(({ bounds: { min, max } }) => [min, max]);
          const bbox = new BBOX(flatten(bounds));
          const width = parseInt(bbox.width * 10, 10);
          const height = parseInt(bbox.height * 10, 10);
          query({ width, height, bbox }, (img) => {
            const canvas = new Canvas(width, height);
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            ctx.strokeWidth = 5;
            wegobjectenList.forEach(({ bounds: bound, center: point }) => {
              const color = Random.color();
              ctx.strokeStyle = color;
              ctx.fillStyle = color;
              const pixels = coordinatesToPixels(canvas, bbox, [bound.min, bound.max]);
              const [{ x, y }] = coordinatesToPixels(canvas, bbox, [point]);
              const { min } = new BBOX(pixels);
              ctx.strokeRect(min.x, min.y, width, height);
              ctx.fillRect(x - 4, y - 4, 9, 9);
            });
            res.send(canvasToHTML(canvas));
          });
        }));
  },
  wegsegment: (req, res) => {
    const id = req.params.IdentificatorWegsegment;
    wegsegmentById(id).then((obj) => {
      const line = obj.geometrie.lineString;
      const bbox = new BBOX(line);
      const WIDTH = parseInt(bbox.width * 10, 10);
      const HEIGHT = parseInt(bbox.height * 10, 10);
      const canvas = new Canvas(WIDTH, HEIGHT);
      const ctx = canvas.getContext('2d');
      fs.readFile(`${__dirname}/images/GRB-GRB_WBN.png`, (err, squid) => {
        if (err) throw err;
        const img = new Image();
        img.src = squid;
        ctx.drawImage(img, 0, 0, img.width, img.height);
      });
      res.send(id);
    });
  },
};

module.exports = GRBImage;
