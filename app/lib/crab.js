const querystring = require('querystring');
const request = require('request-promise');
const parse = require('../lib/parse');
const Cache = require('../../Cache');

const caches = {};
const URL = 'http://crab.agiv.be/Examples/Home/ExecOperation';
const reWKT = /POLYGON |LINESTRING |\(|\)/g;

const float = string => parseFloat(string.replace(',', '.'), 10);
const coordinate = string => string.split(' ').map(float);
const point = ([x, y]) => ({ x, y });
const shape = wkt => wkt.replace(reWKT, '').split(', ').map(coordinate).map(point);
const chain = (fn, ...args) => object => fn(object, ...args) || object;
const dir = object => chain(console.dir, { colors: true, depth: null })(object);

const genId = query => JSON.stringify(query)
  .replace(/\{|\}|"/g, '')
  .replace(/:/g, '=');

const begin = ({
  BeginDatum: datum,
  BeginTijd: tijd,
  BeginBewerking,
  BeginOrganisatie,
}) => ({
  begin: {
    datum,
    tijd,
    bewerking: { id: +BeginBewerking },
    organisatie: { id: +BeginOrganisatie },
  },
});

const bounds = ({
  MinimumX,
  MinimumY,
  MaximumX,
  MaximumY,
}) => ({ bounds: {
  min: { x: float(MinimumX), y: float(MinimumY) },
  max: { x: float(MaximumX), y: float(MaximumY) },
} });

const center = ({
  CenterX,
  CenterY,
}) => ({ center: { x: float(CenterX), y: float(CenterY) } });

const o = {
  taal: ({ taal }) => ({ taal: { id: taal } }),
  namen: ({ taalNaam, naam }) => ({ namen: { [taalNaam]: naam } }),
  aard: ({ aard }) => ({ aard: { id: +aard } }),
  status: ({ status }) => ({ status: { id: +status } }),
  id: ({ id }) => ({ id: +id }),
  gewest: ({ GewestId }) => ({ gewest: { id: +GewestId } }),
  gemeente: ({ GemeenteId }) => ({ gemeente: { id: +GemeenteId } }),
  straat: ({ StraatnaamId }) => ({ straat: { id: +StraatnaamId } }),
  huisnummer: ({ HuisnummerId }) => ({ huisnummer: { id: +HuisnummerId } }),
};

const Taal = ({
  Code: id,
  Naam: naam,
  Definitie: definitie,
}) => ({ id, naam, definitie });

const Gewest = ({
  GewestId: id,
  TaalCodeGewestNaam: taalNaam,
  GewestNaam: naam,
}) => Object.assign(
  o.id({ id }),
  o.namen({ taalNaam, naam }));

const Gemeente = ({
  GemeenteId: id,
  TaalCodeGemeenteNaam: taalNaam,
  GemeenteNaam: naam,
  TaalCode: taal,
  TaalCodeTweedeTaal: taal2,
}) => Object.assign(
  o.id({ id }),
  o.namen({ taalNaam, naam }),
  { talen: [taalNaam] },
  o.taal({ taal }),
  { taal2: taal2 ? { id: taal2 } : null });

const Straatnaam = ({
  StraatnaamId: id,
  TaalCodeTweedeTaal: taal2,
  TaalCode: taal,
  Straatnaam: naam,
  StraatnaamTweedeTaal: naam2,
  StraatnaamLabel: label,
}) => Object.assign(
  o.id({ id }),
  { namen: taal2 ? { [taal]: naam, [taal2]: naam2 } : { [taal]: naam } },
  { talen: taal2 ? [taal, taal2] : [taal] },
  o.taal({ taal }),
  { taal2: taal2 ? { id: taal2 } : null },
  { label });

const Huisnummer = ({
  HuisnummerId: id,
  Huisnummer: nummer,
}) => ({ id: +id, nummer });

const Perceel = ({
  IdentificatorPerceel: id,
}) => ({ id });

const Gebouw = ({
  IdentificatorGebouw: id,
  AardGebouw: aard,
  StatusGebouw: status,
}) => Object.assign(
  o.id({ id }),
  o.aard({ aard }),
  o.status({ status }));

const Terrein = ({
  IdentificatorTerreinobject: id,
  AardTerreinobject: aard,
}) => Object.assign(
  { id },
  o.aard({ aard }));

const Wegobject = ({
  IdentificatorWegobject: id,
  AardWegobject: aard,
}) => Object.assign(
  o.id({ id }),
  o.aard({ aard }));

const Wegsegment = ({
  IdentificatorWegsegment: id,
  StatusWegsegment: status,
}) => Object.assign(
  o.id({ id }),
  o.status({ status }));

const assign = (...args) => (object) => {
  const result = {};
  args.forEach(fn => Object.assign(result, fn(object)));
  return result;
};

const mapping = {
  ListTalen: () =>
    Taal,
  ListGewesten: () =>
    Gewest,
  GetGewestByGewestIdAndTaalCode: () =>
    assign(Gewest, center, bounds, begin),
  ListGemeentenByGewestId: ({ GewestId }) =>
    assign(Gemeente, () => o.gewest({ GewestId }), x => ({
      nis: { id: +x.NISGemeenteCode },
    })),
  GetGemeenteByGemeenteId: () =>
    assign(Gemeente, x => ({
      nis: { id: +x.NisGemeenteCode },
    }), center, bounds, begin),
  ListStraatnamenByGemeenteId: ({ GemeenteId }) =>
    assign(Straatnaam, () => o.gemeente({ GemeenteId })),
  GetStraatnaamByStraatnaamId: () =>
    assign(Straatnaam, o.gemeente, begin),
  ListHuisnummersByStraatnaamId: ({ StraatnaamId }) =>
    assign(Huisnummer, () => o.straat({ StraatnaamId })),
  GetHuisnummerByHuisnummerId: () =>
    assign(Huisnummer, o.straat, begin),
  ListPercelenByHuisnummerId: ({ HuisnummerId }) =>
    assign(Perceel, () => o.huisnummer({ HuisnummerId })),
  GetPerceelByIdentificatorPerceel: () =>
    assign(Perceel, center, begin),
  ListGebouwenByHuisnummerId: ({ HuisnummerId }) =>
    assign(Gebouw, () => o.huisnummer({ HuisnummerId })),
  GetGebouwByIdentificatorGebouw: () =>
    assign(Gebouw, x => ({ geometrie: {
      methode: { id: +x.GeometriemethodeGebouw },
      polygon: shape(x.Geometrie),
    } }), begin),
  ListTerreinobjectenByHuisnummerId: ({ HuisnummerId }) =>
    assign(Terrein, () => o.huisnummer({ HuisnummerId })),
  GetTerreinobjectByIdentificatorTerreinobject: () =>
    assign(Terrein, center, bounds),
  ListWegobjectenByStraatnaamId: ({ StraatnaamId }) =>
    assign(Wegobject, () => o.straat({ StraatnaamId })),
  GetWegobjectByIdentificatorWegobject: () =>
    assign(Wegobject, center, bounds),
  ListWegsegmentenByStraatnaamId: ({ StraatnaamId }) =>
    assign(Wegsegment, () => o.straat({ StraatnaamId })),
  GetWegsegmentByIdentificatorWegsegment: () =>
    assign(Wegsegment, x => ({
      geometrie: { methode: +x.GeometriemethodeWegsegment, lineString: shape(x.Geometrie) },
    }), begin),
};

const getCache = (name) => {
  if (!caches[name]) caches[name] = new Cache({ base: 'cache/CRAB', name });
  return caches[name];
};

const toNameValue = object => Object.entries(object)
  .map(([key, value]) => ({ Name: key, Value: value }));

const toQuery = object => Object.entries(object)
  .map(([key, value]) => `${key}=${value}`).join('&');

const list = async (operation, query) => {
  const id = genId(query);
  const handle = (html) => {
    const parsed = parse(html);
    const r = parsed.map(mapping[operation](query));
    return r;
  };
  const cache = getCache(operation);
  const cached = await cache.get(id);
  if (cached) return cached;
  const parameters = toNameValue(query);
  const parametersJson = querystring.escape(JSON.stringify(parameters));
  const response = await request({
    url: URL,
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: toQuery({ operation, parametersJson }),
  });
  const object = handle(response);
  await cache.put(id, object);
  return object;
};

const object = async (operation, query) => {
  const id = genId(query);
  const handle = array => (array.length ? array[0] : null);
  const cache = getCache(operation);
  const cached = await cache.get(id);
  if (cached) return handle(cached);
  const response = await list(operation, query);
  const obj = handle(response);
  return obj;
};

module.exports = { list, object, dir };
