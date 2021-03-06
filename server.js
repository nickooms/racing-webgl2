// const { color: { red, yellow, green, blue, cyan, close } } = require('ansi-styles');
const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
const express = require('express');
// const morgan = require('morgan');
// const config = require('config');
const chalk = require('chalk');
const cors = require('cors');

const { list, object } = require('./app/lib/crab');
const { red, yellow, bold } = require('./Logging');
// const GRBImage = require('./GRBImage');
const Objects = require('./app/routes');
const imageRoutes = require('./image');
const apiRoutes = require('./api');
const Layers = require('./Layers');
const City = require('./model/City');
const Street = require('./model/Street');
const HouseNumber = require('./model/HouseNumber');
const Building = require('./model/Building');
const Plot = require('./model/Plot');
// const RoadObject = require('./model/RoadObject');
// const { dir } = require('./util');
const { flatten } = require('./functional');

process.on('unhandledRejection', (reason, promise) => {
  console.log(chalk.red.bold('[PROCESS] Unhandled Promise Rejection'));
  console.log(chalk.red.bold('- - - - - - - - - - - - - - - - - - -'));
  console.log(reason);
  console.log(promise);
  console.log(chalk.red.bold('- -'));
});
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

app.route('/layers')
  .get(Layers.json);

const pre = x => `
  <html>
    <body>
      <pre>${JSON.stringify(x, null, 2)}</pre>
    </body>
  </html>
`;

const getId = ({ id }) => id;

// const onlyId = ({ id }) => ({ id });

const unique = x => [...new Set(x)];

const uniqueIds = x => unique(x.map(getId));

app.route('/city/:id')
  .get(async ({ params: { id } }, res) => {
    const city = new City(id);
    await city.get();
    res.json(city);
  });
app.route('/city/:id/streets')
  .get(async ({ params: { id } }, res) => {
    const city = new City(id);
    const streets = await city.Streets;
    await streets.get();
    res.json(streets);
  });

app.route('/street/:id')
  .get(async ({ params: { id } }, res) =>
    res.json(await new Street(id).get()));
app.route('/street/:id/city')
  .get(async ({ params: { id } }, res) => {
    const street = new Street(id);
    await street.get();
    const city = await street.City;
    res.json(city);
  });
const streetChild = x => app.route(`/street/:id/${x.toLowerCase()}`)
  .get(async ({ params: { id } }, res) =>
    res.json(await new Street(id)[x]));
streetChild('HouseNumbers');
streetChild('RoadObjects');
streetChild('RoadSegments');

const streetBuildings = async ({ params: { id, fmt = false } }, res) => {
  const street = new Street(id);
  const houseNumbers = await street.HouseNumbers;
  const buildingIdPromises = houseNumbers.map(x => x.Buildings);
  const houseNumbersBuildings = await Promise.all(buildingIdPromises);
  const ids = uniqueIds(flatten(houseNumbersBuildings));
  const buildingPromises = ids.map(x => new Building(x).get());
  const buildings = await Promise.all(buildingPromises);
  if (fmt) res.send(pre(buildings)); else res.json(buildings);
};

app.route('/street/:id/buildings').get(streetBuildings);
app.route('/street/:id/buildings/:fmt').get(streetBuildings);

const streetPlots = async ({ params: { id, fmt = false } }, res) => {
  const street = new Street(id);
  const houseNumbers = await street.HouseNumbers;
  const plotIdPromises = houseNumbers.map(x => x.Plots);
  const houseNumbersPlots = await Promise.all(plotIdPromises);
  const ids = uniqueIds(flatten(houseNumbersPlots));
  const plotPromises = ids.map(x => new Plot(x).get());
  const plots = await Promise.all(plotPromises);
  if (fmt) res.send(pre(plots)); else res.json(plots);
};

app.route('/street/:id/plots').get(streetPlots);
app.route('/street/:id/plots/:fmt').get(streetPlots);

/* const streetRoadObjects = async ({ params: { id, fmt = false } }, res) => {
  const street = new Street(id);
  const roadObjects = await street.RoadObjects;
  if (fmt) res.send(pre(roadObjects)); else res.json(roadObjects);
};

app.route('/street/:id/roadObjects').get(streetRoadObjects);
app.route('/street/:id/roadObjects/:fmt').get(streetRoadObjects);*/

app.route('/housenumber/:id')
  .get(async ({ params: { id } }, res) =>
    res.json(await new HouseNumber(id).get()));
const houseNumberChild = x => app.route(`/housenumber/:id/${x.toLowerCase()}`)
  .get(async ({ params: { id } }, res) =>
    res.json(await new HouseNumber(id)[x]));
houseNumberChild('Buildings');
houseNumberChild('Plots');

app.route('/building/:id')
  .get(async ({ params: { id } }, res) =>
    res.json(await new Building(+id).get()));

app.route('/plot/:id')
  .get(async ({ params: { id } }, res) =>
    res.json(await new Plot(id).get()));

imageRoutes(app);

apiRoutes(app);

app.listen(PORT);
console.log(`${bold(red('Listening on port'))} ${bold(yellow(PORT))}`);

module.exports = app;
