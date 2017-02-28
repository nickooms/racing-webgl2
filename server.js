const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
const express = require('express');
// const morgan = require('morgan');
// const config = require('config');
const cors = require('cors');

const { list, object } = require('./app/lib/crab');
// const GRBImage = require('./GRBImage');
const Objects = require('./app/routes');
const imageRoutes = require('./image');
const apiRoutes = require('./api');
// const db = require('./db');

const SorteerVeld = 0;

const { taal, gewest, gemeente, straat, huisnummer, wegobject,
  wegsegment, terreinobject, gebouw, perceel } = Objects;

const operations = objects => Object.entries(objects)
  .map(([objectName, obj]) => ({
    [objectName]: Object.entries(obj).map(([operationName]) => operationName),
  })).reduce((result, obj) => Object.assign(result, obj), {});

const {
  ListTalen,
} = taal;

const {
  ListGewesten,
  GetGewestByGewestIdAndTaalCode,
} = gewest;

const {
  ListGemeentenByGewestId,
  GetGemeenteByGemeenteId,
} = gemeente;

const {
  ListStraatnamenByGemeenteId,
  GetStraatnaamByStraatnaamId,
} = straat;

const {
  ListHuisnummersByStraatnaamId,
  GetHuisnummerByHuisnummerId,
} = huisnummer;

const {
  ListWegobjectenByStraatnaamId,
  GetWegobjectByIdentificatorWegobject,
} = wegobject;

const {
  ListWegsegmentenByStraatnaamId,
  GetWegsegmentByIdentificatorWegsegment,
} = wegsegment;

const {
  ListTerreinobjectenByHuisnummerId,
  GetTerreinobjectByIdentificatorTerreinobject,
} = terreinobject;

const {
  ListGebouwenByHuisnummerId,
  GetGebouwByIdentificatorGebouw,
} = gebouw;

const {
  ListPercelenByHuisnummerId,
  GetPerceelByIdentificatorPerceel,
} = perceel;

const PORT = 8080;

const app = express();
app.use(cors({ exposedHeaders: ['Link'] }));
// if (config.util.getEnv('NODE_ENV') !== 'test') app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/json' }));

app.get('/', (req, res) => res.json(operations(Objects)));

const svg = ({ width, height, viewBox, objects }) => `
<svg width="${width}" height="${height}" viewBox="${viewBox}" style="background-color: #000000; width: 1000px; height: 1000px;">
  ${objects.join('\n  ')}
</svg>`;

const error = e => console.error(e);

const getIds = (array) => {
  const lst = [];
  array.forEach(x => lst.push(x));
  const ids = [];
  lst.forEach(objs => objs.forEach(obj => ids.push(obj.id)));
  return [...new Set(ids)];
};

const perceelById = id => object('GetPerceelByIdentificatorPerceel', { IdentificatorPerceel: id });

const percelenByHuisnummer = HuisnummerId => list('ListPercelenByHuisnummerId', { HuisnummerId, SorteerVeld });

const percelenByHuisnummers = huisnummers => Promise.all(huisnummers
  .map(({ id }) => percelenByHuisnummer(id)))
  .then(array => Promise.all(getIds(array).map(perceelById))
  .catch(error))
.catch(error);

const terreinById = id => object('GetTerreinobjectByIdentificatorTerreinobject', { IdentificatorTerreinobject: id });

const terreinenByHuisnummer = HuisnummerId => list('ListTerreinobjectenByHuisnummerId', { HuisnummerId, SorteerVeld });

const terreinenByHuisnummers = huisnummers =>
  Promise.all(huisnummers.map(({ id }) => terreinenByHuisnummer(id)))
  .then(array => Promise.all(getIds(array).map(terreinById)))
  .catch(error);

const gebouwById = id => object('GetGebouwByIdentificatorGebouw', { IdentificatorGebouw: id });

const gebouwenByHuisnummer = HuisnummerId => list('ListGebouwenByHuisnummerId', { HuisnummerId, SorteerVeld });

const gebouwenByHuisnummers = huisnummers => Promise.all(huisnummers
  .map(({ id }) => gebouwenByHuisnummer(id)))
  .then(array => Promise.all(getIds(array).map(gebouwById))
  .catch(error))
.catch(error);

const wegsegmentById = id => object('GetWegsegmentByIdentificatorWegsegment', { IdentificatorWegsegment: id });

const wegobjectById = id => object('GetWegobjectByIdentificatorWegobject', { IdentificatorWegobject: id });

const wegsegmentenByStraat = ({ params: { StraatnaamId } }, res) => {
  list('ListWegsegmentenByStraatnaamId', { StraatnaamId, SorteerVeld })
    .then(array => Promise.all(array.map(({ id }) => wegsegmentById(id)))
      .then(result => res.send(JSON.stringify(result, null, 2))));
};

const wegobjectenByStraat = ({ params: { StraatnaamId } }, res) => {
  list('ListWegobjectenByStraatnaamId', { StraatnaamId, SorteerVeld })
    .then(array => Promise.all(array.map(({ id }) => wegobjectById(id)))
      .then(result => res.send(JSON.stringify(result, null, 2))));
};

const SVG = {
  straat: ({ params: { StraatnaamId } }, res) => {
    console.time('straat');
    list('ListHuisnummersByStraatnaamId', { StraatnaamId, SorteerVeld })
    .then((huisnummers) => {
      const objects = [];
      const min = { x: Infinity, y: Infinity };
      const max = { x: -Infinity, y: -Infinity };
      Promise.all([
        percelenByHuisnummers(huisnummers),
        gebouwenByHuisnummers(huisnummers),
        terreinenByHuisnummers(huisnummers),
      ]).then(([percelen, gebouwen, terreinen]) => {
        gebouwen.forEach(({ geometrie }) => {
          geometrie.polygon.forEach(({ x, y }) => {
            min.x = Math.min(min.x, x);
            min.y = Math.min(min.y, y);
            max.x = Math.max(max.x, x);
            max.y = Math.max(max.y, y);
          });
        });
        const width = (max.x - min.x).toFixed(3);
        const height = (max.y - min.y).toFixed(3);
        terreinen.forEach(({ id/* , bounds*/ }) => {
          const points = [min, { x: min.x, y: max.y }, max, { x: max.x, y: min.y }].map(({ x, y }) => [x, y].map(v => v.toFixed(3)).join(',')).join(' ');
          objects.push(`<polygon id="${id}" points="${points}" stroke="gray" stroke-width="0.1" fill="gray" fill-opacity="${0.1}" />`);
        });
        gebouwen.forEach(({ id, geometrie }) => {
          const { polygon } = geometrie;
          const points = polygon.map(({ x, y }) => [x, y].map(v => v.toFixed(3)).join(',')).join(' ');
          objects.push(`<polygon id="${id}" points="${points}" stroke="white" stroke-width="0.1" fill="white" fill-opacity="${0.2}" />`);
        });
        percelen.forEach(({ id, center }) => {
          const { x, y } = center;
          objects.push(`<circle id="${id}" cx="${x}" cy="${y}" r="0.5" stroke="white" stroke-width="0.1" fill="white" fill-opacity="${0.2}" />`);
        });
        const viewBox = `${min.x} ${min.y} ${width} ${height}`;
        console.timeEnd('straat');
        res.send(svg({ width, height, viewBox, objects }));
      }).catch(error);
    }).catch(error);
  },
  huisnummer: ({ params: { HuisnummerId } }, res) => {
    console.time('huisnummer');
    const objects = [];
    const min = { x: Infinity, y: Infinity };
    const max = { x: -Infinity, y: -Infinity };
    Promise.all([
      percelenByHuisnummers([{ id: HuisnummerId }]),
      gebouwenByHuisnummers([{ id: HuisnummerId }]),
      terreinenByHuisnummers([{ id: HuisnummerId }]),
    ]).then(([percelen, gebouwen, terreinen]) => {
      gebouwen.forEach(({ geometrie }) => {
        geometrie.polygon.forEach(({ x, y }) => {
          min.x = Math.min(min.x, x);
          min.y = Math.min(min.y, y);
          max.x = Math.max(max.x, x);
          max.y = Math.max(max.y, y);
        });
      });
      const width = (max.x - min.x).toFixed(3);
      const height = (max.y - min.y).toFixed(3);
      terreinen.forEach(({ id }) => {
        const points = [min, { x: min.x, y: max.y }, max, { x: max.x, y: min.y }].map(({ x, y }) => [x, y].map(v => v.toFixed(3)).join(',')).join(' ');
        objects.push(`<polygon id="${id}" points="${points}" stroke="gray" stroke-width="0.1" fill="gray" fill-opacity="${0.1}" />`);
      });
      gebouwen.forEach(({ id, geometrie }) => {
        const { polygon } = geometrie;
        const points = polygon.map(({ x, y }) => [x, y].map(v => v.toFixed(3)).join(',')).join(' ');
        objects.push(`<polygon id="${id}" points="${points}" stroke="white" stroke-width="0.1" fill="white" fill-opacity="${0.2}" />`);
      });
      percelen.forEach(({ id, center }) => {
        const { x, y } = center;
        objects.push(`<circle id="${id}" cx="${x}" cy="${y}" r="0.5" stroke="white" stroke-width="0.1" fill="white" fill-opacity="${0.2}" />`);
      });
      const viewBox = `${min.x} ${min.y} ${width} ${height}`;
      console.timeEnd('huisnummer');
      res.send(svg({ width, height, viewBox, objects }));
    }).catch(error);
  },
};

app.route('/game')
  .get((req, res) => res.sendFile(`${__dirname}/game/index.html`));
app.route('/game/:filename')
  .get((req, res) => res.sendFile(`${__dirname}/game/${req.params.filename}`));

app.route('/talen')
  .get(ListTalen);

app.route('/gewesten')
  .get(ListGewesten);
app.route('/gewest/:GewestId/:TaalCode')
  .get(GetGewestByGewestIdAndTaalCode);

app.route('/gemeenten/:GewestId')
  .get(ListGemeentenByGewestId);
app.route('/gemeente/:GemeenteId')
  .get(GetGemeenteByGemeenteId);

app.route('/straten/:GemeenteId')
  .get(ListStraatnamenByGemeenteId);
app.route('/straat/:StraatnaamId')
  .get(GetStraatnaamByStraatnaamId);

app.route('/huisnummers/:StraatnaamId')
  .get(ListHuisnummersByStraatnaamId);
app.route('/huisnummer/:HuisnummerId')
  .get(GetHuisnummerByHuisnummerId);

app.route('/wegobjecten/:StraatnaamId')
  .get(ListWegobjectenByStraatnaamId);
app.route('/wegobjecten/:StraatnaamId/*')
  .get(wegobjectenByStraat);
app.route('/wegobject/:IdentificatorWegobject')
  .get(GetWegobjectByIdentificatorWegobject);

app.route('/wegsegmenten/:StraatnaamId')
  .get(ListWegsegmentenByStraatnaamId);
app.route('/wegsegmenten/:StraatnaamId/*')
  .get(wegsegmentenByStraat);
app.route('/wegsegment/:IdentificatorWegsegment')
  .get(GetWegsegmentByIdentificatorWegsegment);

app.route('/terreinobjecten/:HuisnummerId')
  .get(ListTerreinobjectenByHuisnummerId);
app.route('/terreinobject/:IdentificatorTerreinobject')
  .get(GetTerreinobjectByIdentificatorTerreinobject);

app.route('/gebouwen/:HuisnummerId')
  .get(ListGebouwenByHuisnummerId);
app.route('/gebouw/:IdentificatorGebouw')
  .get(GetGebouwByIdentificatorGebouw);

app.route('/percelen/:HuisnummerId')
  .get(ListPercelenByHuisnummerId);
app.route('/perceel/:IdentificatorPerceel1/:IdentificatorPerceel2')
  .get(GetPerceelByIdentificatorPerceel);

app.route('/svg/straat/:StraatnaamId')
  .get(SVG.straat);
app.route('/svg/huisnummer/:HuisnummerId')
  .get(SVG.huisnummer);

/* app.route('/image/wegobjecten/:StraatnaamId/*')
  .get(GRBImage.wegobjecten);
app.route('/image/wegsegment/:IdentificatorWegsegment')
  .get(GRBImage.wegsegment);
app.route('/image/wegsegmenten/:StraatnaamId/*')
  .get(GRBImage.wegsegmenten);
app.route('/image/wegbaan/:StraatnaamId')
  .get(GRBImage.wegbaan);*/
imageRoutes(app);

apiRoutes(app);

app.listen(PORT);
console.log(`Listening on port ${PORT}`);

module.exports = app;
