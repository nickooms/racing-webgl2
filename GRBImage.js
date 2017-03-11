const Canvas = require('canvas');
const earcut = require('earcut');
const fs = require('fs');

const { list, object } = require('./app/lib/crab');
const MarchingSquares = require('./MarchingSquares');
const { compose, flatten } = require('./functional');
const { query, getFeatureInfo } = require('./WMS');
const { bold, red, gray, cyan, green, yellow } = require('./Logging');
const GeoPunt = require('./GeoPunt');
const Point = require('./models/Point');
// const Line = require('./models/Line');
const Wegbaan = require('./models/Wegbaan');
const Perceel = require('./models/Perceel');
const Wegsegment = require('./models/Wegsegment');
const Wegknoop = require('./models/Wegknoop');
const WegknoopType = require('./models/WegknoopType');
const Wegverbinding = require('./models/Wegverbinding');
const GRBCanvas = require('./GRBCanvas');
const simplify = require('./simplify');
const { float3 } = require('./util');
const BBOX = require('./BBOX');

const Street = require('./model/Street');

const SorteerVeld = 0;

const Image = Canvas.Image;

const dir = x => console.dir(x, { colors: true, depth: null });

const error = e => console.error(e);

const gemeenteById = id =>
  object('GetGemeenteByGemeenteId', { GemeenteId: id });

const straatById = id =>
  object('GetStraatnaamByStraatnaamId', { StraatnaamId: id });

const wegsegmentById = id =>
  object('GetWegsegmentByIdentificatorWegsegment', { IdentificatorWegsegment: id });

const wegobjectById = id =>
  object('GetWegobjectByIdentificatorWegobject', { IdentificatorWegobject: id });

const wegsegmentenByStraat = id =>
  list('ListWegsegmentenByStraatnaamId', { StraatnaamId: id, SorteerVeld });

const getWegsegmenten = x => Promise.all(x.map(({ id }) => wegsegmentById(id)));

const wegobjectenByStraat = id =>
  list('ListWegobjectenByStraatnaamId', { StraatnaamId: id, SorteerVeld });

const getWegobjecten = wegobjecten =>
  Promise.all(wegobjecten.map(({ id }) => wegobjectById(id)));

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

const prop = name => x => x[name];

const geometrie = prop('geometrie');

const lineString = compose(prop('lineString'), geometrie);

const centers = x => x.map(prop('center'));
const lineStrings = x => x.map(lineString);

const flatMap = (array, fn) => flatten(array.map(fn));

const SIZE = 1000;

class Layers {
  static get BSK() {
    return 'GRB_BSK';
  }
  static get WKN() {
    return 'GRB_WKN';
  }
  static get WBN() {
    return 'GRB_WBN';
  }
  static get WGO() {
    return 'GRB_WGO';
  }
  static get WVB() {
    return 'GRB_WVB';
  }
  static get ADP() {
    return 'GRB_ADP';
  }
  static get HNR_ADP() {
    return 'GRB_HNR_ADP';
  }
  static get GBG() {
    return 'GRB_GBG';
  }
  static fromNames(names) {
    return names.split(',').map(name => Layers[name]);
  }
}

const getLayer = async ({ width = SIZE, height = SIZE, bbox, layers = 'GRB_WBN' }) => {
  const { img } = await query({ width, height, bbox, layers });
  return new GRBCanvas(width, height, bbox, img);
};

const { HNR_ADP, GBG, BSK, WBN, WGO, WVB, WKN, ADP } = Layers;

const unique = (objects) => {
  const map = new Map();
  objects.forEach((x) => {
    const { id } = x;
    if (!map.has(id)) map.set(id, x);
  });
  return Array.from(map.values());
};

const List = {
  huisnummers(straatId) {
    return list('ListHuisnummersByStraatnaamId', {
      StraatnaamId: straatId,
      SorteerVeld,
    });
  },
  percelen(huisnummerId) {
    return list('ListPercelenByHuisnummerId', {
      HuisnummerId: huisnummerId,
      SorteerVeld,
    });
  },
};

const Obj = {
  huisnummer(id) {
    return object('GetHuisnummerByHuisnummerId', {
      HuisnummerId: id,
    });
  },
  perceel(id) {
    return object('GetPerceelByIdentificatorPerceel', {
      IdentificatorPerceel: id,
    });
  },
};

const GRB = {
  Straat: {
    async huisnummers(straatId) {
      const ids = (await List.huisnummers(straatId)).map(({ id }) => id);
      const huisnummers = await Promise.all(ids.map(id => GRB.Huisnummer.byId(id)));
      return huisnummers;
    },
  },
  Huisnummer: {
    async byId(id) {
      const huisnummer = await Obj.huisnummer(id);
      return huisnummer;
    },
    async percelen(huisnummerId) {
      const ids = (await List.percelen(huisnummerId)).map(({ id }) => id);
      const percelen = await Promise.all(ids.map(id => GRB.Perceel.byId(id)));
      console.log(percelen);
      return percelen;
    },
  },
  Perceel: {
    async byId(id) {
      const perceel = await Obj.perceel(id);
      return perceel;
    },
  },
  Wegverbinding: {
    async fromFeature(feature) {
      const { geometry, properties } = feature;
      const id = parseInt(feature.id.split('.')[1], 10);
      const { LSTRNMID: fromStraatId, RSTRNMID: toStraatId } = properties;
      const obj = { geometry, fromStraatId, toStraatId };
      const wegverbinding = await Wegverbinding
        .findOneAndUpdate({ id }, obj, { upsert: true, new: true });
      console.log(`${cyan('[DB]')} ${gray('Add')} ${bold('Wegverbinding')} { id: ${yellow(wegverbinding.id)} }`);
      return wegverbinding;
    },
  },
};

const grb = canvas => ({
  Wegverbinding: {
    async fromFeature(feature) {
      const { geometry, properties } = feature;
      const id = parseInt(feature.id.split('.')[1], 10);
      const { LSTRNMID: fromStraatId, RSTRNMID: toStraatId } = properties;
      const obj = { geometry, fromStraatId, toStraatId };
      const wegverbinding = await Wegverbinding
        .findOneAndUpdate({ id }, obj, { upsert: true, new: true });
      console.log(`${cyan('[DB]')} ${gray('Add')} ${bold('Wegverbinding')} { id: ${yellow(wegverbinding.id)} }`);
      return wegverbinding;
    },
  },
  Wegknoop: {
    async wegverbindingen(wegknoop) {
      const { x, y } = wegknoop;
      const pixel = canvas.pixel({ x, y });
      const { features } = await canvas.featureInfo(WVB, pixel);
      const fromFeature = GRB.Wegverbinding.fromFeature;
      const wegverbindingen = await Promise.all(features.map(fromFeature));
      wegknoop.wegverbindingen = wegverbindingen.map(wegverbinding => wegverbinding._id);
      await wegknoop.save();
      // console.log(wegverbindingen);
      return wegverbindingen;
    },
  },
});

const GRBImage = {
  polygon3d: async ({ feature, canvas, straatId }) => {
    const { geometry: { coordinates: [polygon] } } = feature;
    const id = feature.id.split('.')[1];
    const vertices = polygon;
    const corners = polygon.map(([x, y]) => ({ x, y }));
    const coordinates = polygon
      .map(Point.fromArray)
      .map(coordinate => canvas.pixel(coordinate));
    const coords = corners
      .map(corner => canvas.coordinate(corner))
      .map(({ x, y }) => [float3(x), float3(y)]);
    const bboxCoords = new BBOX(corners.map(corner => canvas.coordinate(corner)));
    const { center: mid } = bboxCoords;
    const centeredCoords = coords.concat([coords[0]]).map(([x, y]) =>
      [float3((mid.x - x)), 0, float3((mid.y - y))]);
    const position = flatten(centeredCoords);
    const center = [float3(mid.x), float3(mid.y)];
    const normal = flatten(coords.concat([null, null]).map(() => [0, 1, 0]));
    const texcoord = flatten(coords.map(() => [0, 0]));
    const triangles = earcut(flatten(vertices));
    const indices = flatten(triangles);
    const ctx = canvas.ctx;
    for (let i = triangles.length; i;) {
      ctx.beginPath();
      for (let j = 0; j < 3; j++) {
        --i;
        const triangle = triangles[i];
        ctx[j === 0 ? 'moveTo' : 'lineTo'](vertices[triangle][0], vertices[triangle][1]);
      }
      ctx.closePath();
      ctx.stroke();
    }
    try {
      const type = 'perceel';
      const obj = { type, straatId, position, center, normal, texcoord, indices };
      const perceel = await Perceel
        .findOneAndUpdate({ id, type }, obj, { upsert: true, new: true });
      console.log(`Added ${perceel.type} ${perceel.id}`);
    } catch (e) {
      console.log(e);
    }
    return coordinates;
  },
  straat: async ({ params: { straatId } }, res) => {
    GRBImage.log('straat', { straatId: +straatId });
    const huisnummers = await GRB.Straat.huisnummers(+straatId);
    const huisnummerIds = huisnummers.map(({ id }) => id);
    const percelen = unique(flatten(await Promise.all(huisnummerIds.map(id => List.percelen(id)))));
    const perceelObjects = await Promise.all(percelen.map(({ id }) => Obj.perceel(id)));
    const straat = await straatById(+straatId);
    const straatNaam = straat.namen[straat.taal.id];
    const gemeente = await gemeenteById(straat.gemeente.id);
    const gemeenteNaam = gemeente.namen[gemeente.taal.id];
    const location = await GeoPunt.straat(gemeenteNaam, straatNaam);
    const { LocationResult: [{ BoundingBox: { LowerLeft, UpperRight } }] } = location;
    const min = { x: LowerLeft.X_Lambert72, y: LowerLeft.Y_Lambert72 };
    const max = { x: UpperRight.X_Lambert72, y: UpperRight.Y_Lambert72 };
    const bbox = new BBOX([min, max]);
    const canvas = await getLayer({ bbox, layers: [ADP/* , GBG*/] });
    const perceelCenters = perceelObjects
      .map(({ center }) => center)
      .map(x => canvas.pixel(x));
    await Promise.all(perceelCenters.map(async (perceel) => {
      const color = canvas.color(perceel);
      if (color) {
        const { features } = await canvas.featureInfo(ADP, perceel);
        // features.forEach(({ geometry: { coordinates: [polygon] } }) => {
        await Promise.all(features.map(async (feature) => {
          const coordinates = await GRBImage
            .polygon3d({ canvas, feature, straatId });
          /* const { geometry: { coordinates: [polygon] } } = feature;
          const id = feature.id.split('.')[1];
          const vertices = polygon;
          const corners = polygon.map(([x, y]) => ({ x, y }));
          const coordinates = polygon
            .map(Point.fromArray)
            .map(coordinate => canvas.pixel(coordinate));
          const coords = corners
            .map(corner => canvas.coordinate(corner))
            .map(({ x, y }) => [float3(x), float3(y)]);
          const bboxCoords = new BBOX(corners.map(corner => canvas.coordinate(corner)));
          const { center: mid } = bboxCoords;
          const centeredCoords = coords.concat([coords[0]]).map(([x, y]) =>
            [float3((mid.x - x)), 0, float3((mid.y - y))]);
          const position = flatten(centeredCoords);
          const center = [float3(mid.x), float3(mid.y)];
          const normal = flatten(coords.concat([null, null]).map(() => [0, 1, 0]));
          const texcoord = flatten(coords.map(() => [0, 0]));
          const triangles = earcut(flatten(vertices));
          const indices = flatten(triangles);
          const ctx = canvas.ctx;
          for (let i = triangles.length; i;) {
            ctx.beginPath();
            for (let j = 0; j < 3; j++) {
              --i;
              const triangle = triangles[i];
              ctx[j === 0 ? 'moveTo' : 'lineTo'](vertices[triangle][0], vertices[triangle][1]);
            }
            ctx.closePath();
            ctx.stroke();
          }
          const type = 'perceel';
          const obj = { type, straatId, position, center, normal, texcoord, indices };
          Perceel.findOneAndUpdate({ id, type }, obj, { upsert: true, new: true })
          .then(wegbaan => console.log(`Added ${wegbaan.type} ${wegbaan.id}`))
          .catch(error);*/
          canvas.polygon(coordinates);
        }));
      }
    }));
    // canvas.points(perceelCenters);
    res.send(canvasToHTML(canvas));
  },
  wegbaan: async ({ params: { straatId, layerNames = 'WBN,WGO' } }, res) => {
    GRBImage.log('wegbaan', { straatId: +straatId, layers: layerNames });
    const layers = layerNames.split(',').map(name => Layers[name]);
    const [wegsegmenten, wegobjecten] = await wegbaanByStraat(+straatId);
    const canvasList = [];
    const coordinates = flatten([lineStrings(wegsegmenten), centers(wegobjecten)]);
    const bbox = new BBOX(coordinates);
    const fillColors = [GRBCanvas.Red, GRBCanvas.Green];
    const canvas = await getLayer({ bbox, layers });
    canvasList.push(canvas);
    Promise.all(coordinates.map((coordinate) => {
      const fill = canvas.flood(coordinate, fillColors);
      if (fill) {
        const { bboxDetail } = fill;
        bboxDetail.grow(parseInt((bboxDetail.width + bboxDetail.height) / 20, 10));
        return getLayer({ bbox: bboxDetail, layers })
          .then((detailCanvas) => {
            const detailFilled = detailCanvas.flood(coordinate, fillColors);
            if (detailFilled) {
              const { fillCanvas } = detailFilled;
              canvasList.push(fillCanvas);
              const px = detailCanvas.pixel(coordinate);
              fillCanvas.points([px]);
              getFeatureInfo({
                width: detailCanvas.width,
                height: detailCanvas.height,
                bbox: bboxDetail,
                x: px.x,
                y: px.y,
              })
              .then(({ features: [feature] }) => {
                const { /* geometry, */properties } = feature;
                const id = feature.id.split('.')[1];
                const border = MarchingSquares.getBlobOutlinePoints(fillCanvas);
                const corners = simplify(border, 1.5);
                const vertices = corners.map(({ x, y }) => [x, y]);
                /* const vertices2 = simplify(geometry.coordinates[0]
                  .map(([x, y]) => ({ x, y }))
                  .map(c => fillCanvas.pixel(c)), 1.5)
                  .map(({ x, y }) => [x, y]);*/
                // if (vertices.length === 7) {}
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
                    ctx[j === 0 ? 'moveTo' : 'lineTo'](vertices[triangle][0], vertices[triangle][1]);
                  }
                  ctx.closePath();
                  ctx.stroke();
                }
                const type = `${properties.LBLTYPE} ${layerNames}`;
                const obj = { type, straatId, position, center, normal, texcoord, indices };
                Wegbaan.findOneAndUpdate({ id, type }, obj, { upsert: true, new: true })
                .then(wegbaan => console.log(`Added ${wegbaan.type} ${wegbaan.id}`))
                .catch(error);
              })
              .catch(error);
            }
            return detailCanvas;
          })
          .catch(error);
      }
      return Promise.resolve(null);
    }))
    .then(() => res.send(canvasListToHTML(canvasList)))
    .catch(error);
    const pixels = coordinates.map(coordinate => canvas.pixel(coordinate));
    // console.log(pixels.length);
    canvas.points(pixels);
  },
  wegsegmenten: async ({ params: { straatId } }, res) => {
    const ids = (await wegsegmentenByStraat(straatId)).map(({ id }) => id);
    const wegsegmenten = await Promise.all(ids.map(id => wegsegmentById(id)));
    const points = flatMap(wegsegmenten, ({ geometrie: { lineString: line } }) => [line]);
    const bbox = new BBOX(points);
    const canvas = await getLayer({ bbox, layers: 'GRB_WBN,GRB_WVB' });
    const endPoints = flatMap(wegsegmenten, ({ geometrie: { lineString: line } }) =>
      [line[0], line[line.length - 1]]);
    const arrayToPoint = ([x, y]) => ({ x, y });
    const uniquePoints = [...new Set(endPoints.map(({ x, y }) => [x, y].join(',')))]
      .map(p => p.split(',').map(parseFloat).map(float3))
      .map(arrayToPoint)
      .map(point => canvas.pixel(point));
    canvas.points(uniquePoints);
    uniquePoints.forEach((px) => {
      getFeatureInfo({
        width: canvas.width,
        height: canvas.height,
        layers: 'GRB_WKN',
        bbox,
        x: px.x,
        y: px.y,
      }).then(({ features }) => dir(features));
    });
    res.send(canvasToHTML(canvas));
  },
  log: (operation, params) => {
    console.log(`${cyan('[GRBImage]')} ${bold(red(operation))} { ${Object.entries(params).map(([key, value]) => {
      if (typeof value === 'number') return `${key}: ${yellow(value)}`;
      if (typeof value === 'string') return `${key}: ${green(`'${value}'`)}`;
      return `${key}: ${value}`;
    }).join(', ')} }`);
  },
  wegknopen: async ({ params: { straatId, layerNames = 'WKN,WBN,WGO' } }, res) => {
    GRBImage.log('wegknopen', { straatId: +straatId, layers: layerNames });
    const layers = Layers.fromNames(layerNames);
    const fillColors = [GRBCanvas.Red, GRBCanvas.Green];
    const wegsegmenten = await Wegsegment.byStraat(+straatId);
    const lines = wegsegmenten.map(wegsegment => wegsegment.line);
    const bbox = new BBOX(flatten(lines));
    bbox.grow(Math.max(bbox.width, bbox.height) / 10);
    const canvas = await getLayer({ bbox, layers });
    const ends = flatten(lines.map(line => [line[0], line[line.length - 1]]));
    const uniquePoints = [...new Set(ends.map(({ x, y }) => [x, y].join(',')))]
      .map(point => point.split(',').map(parseFloat).map(float3))
      .map(Point.fromArray)
      .map(point => canvas.pixel(point));
    const wegknopen = await Promise.all(uniquePoints.map(async (pixel) => {
      canvas.flood(canvas.coordinate(pixel), fillColors);
      const { features: [feature] } = await canvas.featureInfo(WKN, pixel);
      const { properties: { TYPE, LBLTYPE } } = feature;
      const wegknoopType = { id: TYPE, name: LBLTYPE };
      const type = await WegknoopType
        .findOneAndUpdate({ id: TYPE }, wegknoopType, { upsert: true, new: true });
      console.log(`${cyan('[DB]')} ${gray('Add')} ${bold('WegknoopType')} { id: ${yellow(type.id)}, name: ${green(`'${type.name}'`)} }`);
      const id = parseInt(feature.id.split('.')[1], 10);
      // console.log(feature);
      const [x, y] = feature.geometry.coordinates;
      const obj = { x, y, straatId, type };
      const wegknoop = await Wegknoop
        .findOneAndUpdate({ id }, obj, { upsert: true, new: true });
      console.log(`${cyan('[DB]')} ${gray('Add')} ${bold('Wegknoop')} { id: ${yellow(wegknoop.id)} }`);
      return wegknoop;
    }));
    // console.log(wegknopen);
    const getWegverbindingen = grb(canvas).Wegknoop.wegverbindingen;
    const straatWegverbindingen = await Promise.all(wegknopen.map(getWegverbindingen));
    /* const straatWegverbindingen = await Promise.all(wegknopen.map(async (wegknoop) => {
      const { x, y } = wegknoop;
      const pixel = canvas.pixel({ x, y });
      const { features } = await canvas.featureInfo(WVB, pixel);
      const wegverbindingen = await Promise.all(features.map(async (feature) => {
        const { geometry, properties } = feature;
        // console.log(properties);
        const id = parseInt(feature.id.split('.')[1], 10);
        const { LSTRNMID: fromStraatId, RSTRNMID: toStraatId } = properties;
        const obj = { geometry, fromStraatId, toStraatId };
        const wegverbinding = await Wegverbinding
          .findOneAndUpdate({ id }, obj, { upsert: true, new: true });
        console.log(`${cyan('[DB]')} ${gray('Add')} ${bold('Wegverbinding')} { id: ${yellow(wegverbinding.id)} }`);
        return wegverbinding;
      }));
      wegknoop.wegverbindingen = wegverbindingen.map(wegverbinding => wegverbinding._id);
      await wegknoop.save();
      // console.log(wegverbindingen);
      return wegverbindingen;
    }));*/
    // console.log(straatWegverbindingen);
    // console.log([...new Set(flatten(straatWegverbindingen).map(({ id }) => id))]);
    const wegverbindingen = unique(flatten(straatWegverbindingen))
      .filter(({ fromStraatId: from, toStraatId: to }) =>
        (from === +straatId) && (to === +straatId));
    wegverbindingen.forEach(({ geometry: { coordinates } }) => {
      canvas.line(coordinates
        .map(([x, y]) => ({ x, y }))
        .map(coordinate => canvas.pixel(coordinate)));
    });
    // console.log(wegverbindingen);

    canvas.points(uniquePoints);
    const stratenList = await Promise.all(uniquePoints.map(async (pixel) => {
      const { features } = await canvas.featureInfo(WVB, pixel);
      const wegknoopStraten = [];
      features.forEach((feature) => {
        const { LSTRNMID, LSTRNM, RSTRNMID, RSTRNM } = feature.properties;
        wegknoopStraten.push({ id: LSTRNMID, naam: LSTRNM });
        wegknoopStraten.push({ id: RSTRNMID, naam: RSTRNM });
      });
      return wegknoopStraten;
    }));
    const straten = {};
    flatten(stratenList).forEach((straat) => {
      if (!straten[straat.id]) straten[straat.id] = straat;
    });
    dir(Object.values(straten));
    res.send(canvasToHTML(canvas));
  },
  wegobjecten: async ({ params: { straatId } }, res) => {
    const ids = (await wegobjectenByStraat(straatId)).map(({ id }) => id);
    const wegobjecten = await Promise.all(ids.map(id => wegobjectById(id)));
    dir(wegobjecten);
    const bounds = wegobjecten.map(({ bounds: { min, max } }) => [min, max]);
    const bbox = new BBOX(flatten(bounds));
    const canvas = await getLayer({ bbox });
    wegobjecten.forEach((wegobject) => {
      canvas.points([canvas.pixel(wegobject.center)]);
      const { min, max } = wegobject.bounds;
      const points = [min, { x: min.x, y: max.y }, max, { x: max.x, y: min.y }, min];
      const pixels = points.map(point => canvas.pixel(point));
      canvas.polygon(pixels);
    });
    res.send(canvasToHTML(canvas));
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
