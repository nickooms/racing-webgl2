import resource from 'resource-router-middleware';
import querystring from 'querystring';
import request from 'request-promise';
import parse from './parse';
// import fs from 'fs';

const crabs = [];
const URL = 'http://crab.agiv.be/Examples/Home/ExecOperation';
const reWKT = /POLYGON |LINESTRING |\(|\)/g;

const float = string => parseFloat(string.replace(',', '.'), 10);
const coordinate = string => string.split(' ').map(float)
const point = ([x, y]) => ({ x, y });
const shape = wkt => wkt.replace(reWKT, '').split(', ').map(coordinate).map(point);
const chain = (fn, ...args) => object => fn(object, ...args) || object;
const dir = object => chain(console.dir, { colors: true, depth: null })(object);

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

// const namen = ({ taalNaam, naam }) => ({ namen: { [taalNaam]: naam } });

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

const Gewest = ({
  GewestId: id,
  TaalCodeGewestNaam: taalNaam,
  GewestNaam: naam
}) => Object.assign({},
  o.id({ id }),
  o.namen({ taalNaam, naam })
);

const Gemeente = ({
  GemeenteId: id,
  TaalCodeGemeenteNaam: taalNaam,
  GemeenteNaam: naam,
  TaalCode: taal,
  TaalCodeTweedeTaal: taal2
}) => Object.assign({},
  o.id({ id }),
  o.namen({ taalNaam, naam }),
  { talen: [taalNaam] },
  o.taal({ taal }),
  { taal2: taal2 === 'NULL' ? null : { id: taal2 } }
);

const Straatnaam = ({
  StraatnaamId: id,
  TaalCodeTweedeTaal: taal2,
  TaalCode: taal,
  Straatnaam: naam,
  StraatnaamTweedeTaal: naam2,
  StraatnaamLabel: label
}) => Object.assign({},
  o.id({ id }),
  { namen: taal2 === 'NULL' ? { [taal]: naam } : { [taal]: naam, [taal2]: naam2 } },
  { talen: taal2 === 'NULL' ? [taal] : [taal, taal2] },
  o.taal({ taal }),
  { taal2: taal2 === 'NULL' ? null : { id: taal2 } },
  { label }
);

const Huisnummer = ({
  HuisnummerId: id,
  Huisnummer: nummer
}) => ({
  id: +id,
  nummer
});

const Perceel = ({
  IdentificatorPerceel: id
}) => ({
  id
});

const Gebouw = ({
  IdentificatorGebouw: id,
  AardGebouw: aard,
  StatusGebouw: status
}) => Object.assign({},
  o.id({ id }),
  o.aard({ aard }),
  o.status({ status })
);

const Terrein = ({
  IdentificatorTerreinobject: id,
  AardTerreinobject: aard
}) => Object.assign({},
  { id },
  o.aard({ aard })
);

const Wegobject = ({
  IdentificatorWegobject: id,
  AardWegobject: aard
}) => Object.assign({},
  o.id({ id }),
  o.aard({ aard })
);

const Wegsegment = ({
  IdentificatorWegsegment: id,
  StatusWegsegment: status
}) => Object.assign({},
  o.id({ id }),
  o.status({ status })
);

const assign = (...args) => x => Object.assign(...args.map(fn => fn(x)));

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
  GetGebouwByIdentificatorGebouw: () => assign(Gebouw, x => ({
    geometrie: { methode: +x.GeometriemethodeGebouw, polygon: shape(x.Geometrie) },
  }), begin),
  ListTerreinobjectenByHuisnummerId: ({ HuisnummerId }) => assign(Terrein, () => o.huisnummer({ HuisnummerId })),
  GetTerreinobjectByIdentificatorTerreinobject: () => assign(Terrein, center, bounds),
  ListWegobjectenByStraatnaamId: ({ StraatnaamId }) => assign(Wegobject, () => o.straat({ StraatnaamId })),
  GetWegobjectByIdentificatorWegobject: () => assign(Wegobject, center, bounds),
  ListWegsegmentenByStraatnaamId: ({ StraatnaamId }) => assign(Wegsegment, () => o.straat({ StraatnaamId })),
  GetWegsegmentByIdentificatorWegsegment: () => assign(Wegsegment, x => ({
    geometrie: { methode: +x.GeometriemethodeWegsegment, lineString: shape(x.Geometrie) },
  }), begin),
};

// export default ({ config, db }) => resource({
export default () => resource({
  id : 'crab',
  load(req, id, callback) {
    let crab = crabs.find(crab => crab.id === id), err = crab ? null : 'Not found';
    callback(err, crab);
  },
  index({ params }, res) {
    const { query } = res.req;
    const { operation } = query;
    const parameters = Object.entries(query)
      .filter(([key]) => key !== 'operation');
    const parametersJson = parameters
      .map(([key, value]) => ({ Name: key, Value: value }));
    const url = `operation=${operation}&parametersJson=${querystring.escape(JSON.stringify(parametersJson))}`;
    request({
      url: URL,
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: url
    }).then(response => {
      const obj = parse(response);
      // let data, file;
      const fn = mapping[operation];
      if (fn) res.json(dir(obj.map(fn(query))));
    });
  },
  create({ body }, res) {
    body.id = crabs.length.toString(36);
    crabs.push(body);
    res.json(body);
  },
  read({ crab }, res) {
    res.json(crab);
  },
  update({ crab, body }, res) {
    for (let key in body) {
      if (key !== 'id') crab[key] = body[key];
    }
    res.sendStatus(204);
  },
  delete({ crab }, res) {
    crabs.splice(crabs.indexOf(crab), 1);
    res.sendStatus(204);
  }
});
