const querystring = require('querystring');
const request = require('request-promise');
const parse = require('../lib/parse');
const cache = require('persistent-cache');

const cats = cache({ name: 'cache' });

const URL = 'http://crab.agiv.be/Examples/Home/ExecOperation';
const reWKT = /POLYGON |LINESTRING |\(|\)/g;

const float = string => parseFloat(string.replace(',', '.'), 10);
const coordinate = string => string.split(' ').map(float)
const point = ([x, y]) => ({ x, y });
const shape = wkt => wkt.replace(reWKT, '').split(', ').map(coordinate).map(point);
const chain = (fn, ...args) => object => fn(object, ...args) || object;
const dir = object => chain(console.dir, { colors: true, depth: null })(object);

const genId = (operation, query) => `${operation}/${JSON.stringify(query)}`
  .replace(/\{|\}|"/g, '')
  .replace(/\/|\:/g, '-');

const begin = ({ BeginDatum: datum, BeginTijd: tijd, BeginBewerking, BeginOrganisatie }) => ({ begin: {
  datum, tijd,
  bewerking: { id: +BeginBewerking },
  organisatie: { id: +BeginOrganisatie },
} });

const bounds = ({ MinimumX, MinimumY, MaximumX, MaximumY }) => ({ bounds: {
  min: { x: float(MinimumX), y: float(MinimumY) },
  max: { x: float(MaximumX), y: float(MaximumY) },
} });

const center = ({ CenterX, CenterY }) => ({ center: { x: float(CenterX), y: float(CenterY) } });

const namen = ({ taalNaam, naam }) => ({ namen: { [taalNaam]: naam } });

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

const Taal = ({ Code: id, Naam: naam, Definitie: definitie }) => ({ id, naam, definitie });

const Gewest = ({ GewestId: id, TaalCodeGewestNaam: taalNaam, GewestNaam: naam }) => Object.assign(
  o.id({ id }),
  o.namen({ taalNaam, naam })
);

const Gemeente = ({ GemeenteId: id, TaalCodeGemeenteNaam: taalNaam, GemeenteNaam: naam, TaalCode: taal, TaalCodeTweedeTaal: taal2 }) => Object.assign(
  o.id({ id }),
  o.namen({ taalNaam, naam }),
  { talen: [taalNaam] },
  o.taal({ taal }),
  { taal2: taal2 ? { id: taal2 } : null }
);

const Straatnaam = ({ StraatnaamId: id, TaalCodeTweedeTaal: taal2, TaalCode: taal, Straatnaam: naam, StraatnaamTweedeTaal: naam2, StraatnaamLabel: label }) => Object.assign(
  o.id({ id }),
  { namen: taal2 ? { [taal]: naam, [taal2]: naam2 } : { [taal]: naam } },
  { talen: taal2 ? [taal, taal2] : [taal] },
  o.taal({ taal }),
  { taal2: taal2 ? { id: taal2 } : null },
  { label }
);

const Huisnummer = ({ HuisnummerId: id, Huisnummer: nummer }) => ({ id: +id, nummer });

const Perceel = ({ IdentificatorPerceel: id }) => ({ id });

const Gebouw = ({ IdentificatorGebouw: id, AardGebouw: aard, StatusGebouw: status }) => Object.assign(
  o.id({ id }),
  o.aard({ aard }),
  o.status({ status })
);

const Terrein = ({ IdentificatorTerreinobject: id, AardTerreinobject: aard }) => Object.assign(
  { id },
  o.aard({ aard })
);

const Wegobject = ({ IdentificatorWegobject: id, AardWegobject: aard }) => Object.assign(
  o.id({ id }),
  o.aard({ aard })
);

const Wegsegment = ({ IdentificatorWegsegment: id, StatusWegsegment: status }) => Object.assign(
  o.id({ id }),
  o.status({ status })
);

function assign() {
  const args = [].slice.call(arguments);
  return object => {
    const result = {};
    args.forEach(fn => Object.assign(result, fn(object)));
    return result;
  };
}

const mapping = {
  ListTalen: () => Taal,
  ListGewesten: () => Gewest,
  GetGewestByGewestIdAndTaalCode: () => assign(Gewest, center, bounds, begin),
  ListGemeentenByGewestId: ({ GewestId }) => assign(Gemeente, () => o.gewest({ GewestId }), x => ({
    nis: { id: +x.NISGemeenteCode }
  })),
  GetGemeenteByGemeenteId: () => assign(Gemeente, x => ({
    nis: { id: +x.NisGemeenteCode },
  }), center, bounds, begin),
  ListStraatnamenByGemeenteId: ({ GemeenteId }) => assign(Straatnaam, () => o.gemeente({ GemeenteId })),
  GetStraatnaamByStraatnaamId: () => assign(Straatnaam, o.gemeente, begin),
  ListHuisnummersByStraatnaamId: ({ StraatnaamId }) => assign(Huisnummer, () => o.straat({ StraatnaamId })),
  GetHuisnummerByHuisnummerId: () => assign(Huisnummer, o.straat, begin),
  ListPercelenByHuisnummerId: ({ HuisnummerId }) => assign(Perceel, () => o.huisnummer({ HuisnummerId })),
  GetPerceelByIdentificatorPerceel: () => assign(Perceel, center, begin),
  ListGebouwenByHuisnummerId: ({ HuisnummerId }) => assign(Gebouw, () => o.huisnummer({ HuisnummerId })),
  GetGebouwByIdentificatorGebouw: () => assign(Gebouw, x => ({ geometrie: {
    methode: { id: +x.GeometriemethodeGebouw },
    polygon: shape(x.Geometrie)
  } }), begin),
  ListTerreinobjectenByHuisnummerId: ({ HuisnummerId }) => assign(Terrein, () => o.huisnummer({ HuisnummerId })),
  GetTerreinobjectByIdentificatorTerreinobject: () => assign(Terrein, center, bounds),
  ListWegobjectenByStraatnaamId: ({ StraatnaamId }) => assign(Wegobject, () => o.straat({ StraatnaamId })),
  GetWegobjectByIdentificatorWegobject: () => assign(Wegobject, center, bounds),
  ListWegsegmentenByStraatnaamId: ({ StraatnaamId }) => assign(Wegsegment, () => o.straat({ StraatnaamId })),
  GetWegsegmentByIdentificatorWegsegment: () => assign(Wegsegment, x => ({
    geometrie: { methode: +x.GeometriemethodeWegsegment, lineString: shape(x.Geometrie) },
  }), begin),
};

const toNameValue = object => Object.entries(object)
  .map(([key, value]) => ({ Name: key, Value: value }));

const toQuery = object => Object.entries(object)
  .map(([key, value]) => `${key}=${value}`).join('&');

const cacheList = id => {
  return new Promise((resolve, reject) => {
    cats.get(id, function(err, result) {
      if (err) reject(err);
      resolve(result);
    });
  });
};

const cacheObject = id => {
  return new Promise((resolve, reject) => {
    cats.get(id, function(err, result) {
      if (err) reject(err);
      resolve(result);
    });
  });
};

const list = (operation, query) => {
  const id = genId(operation, query);
  const handle = html => {
    /* console.dir(operation);
    console.dir(query);
    console.dir(html);*/
    const parsed = parse(html);
    const r = parsed.map(mapping[operation](query));
    return r;
  };
  return cacheList(id).then(x => {
    // console.log(`${id} from cache`);
    return x;
  }).then(handle).catch(err => {
    const parameters = toNameValue(query);
    const parametersJson = querystring.escape(JSON.stringify(parameters));
    return request({
      url: URL,
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: toQuery({ operation, parametersJson })
    })
    .then(handle)
    .then(obj => {
      cats.put(id, obj, () => {
        // console.log(`stored ${id} in cache`);
      });
      return obj;
    }).catch(e => console.error(e));
  });
};

const object = (operation, query) => {
  const id = genId(operation, query);
  const handle = array => array.length ? array[0] : null;
  return cacheObject(id).then(x => {
    // console.log(`${id} from cache`);
    return x;
  }).then(handle).catch(err => {
    return list(operation, query)
    .then(result => {
      cats.put(id, result, () => {
        // console.log(`stored ${id} in cache`);
      });
      return result;
    }).then(handle);
  });
};

module.exports = { list, object, dir };
