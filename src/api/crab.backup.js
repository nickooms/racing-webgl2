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

const mapping = {
  taal: ({ Code: id, Naam: naam, Definitie: definitie }) => ({ id, naam, definitie }),
  gewest: ({ GewestId: id, TaalCodeGewestNaam, GewestNaam }) => ({
    id: +id,
    namen: { [TaalCodeGewestNaam]: GewestNaam },
  }),
  gemeente: ({ GemeenteId: id, TaalCodeGemeenteNaam, GemeenteNaam, TaalCode, TaalCodeTweedeTaal }) => ({
    id: +id,
    namen: { [TaalCodeGemeenteNaam]: GemeenteNaam },
    talen: [TaalCodeGemeenteNaam],
    taal: { id: TaalCode },
    taal2: TaalCodeTweedeTaal === 'NULL' ? null : { id: TaalCodeTweedeTaal },
  }),
  straatnaam: ({ StraatnaamId: id, TaalCodeTweedeTaal, TaalCode, Straatnaam, StraatnaamTweedeTaal, StraatnaamLabel: label }) => ({
    id: +id,
    namen: TaalCodeTweedeTaal === 'NULL' ? { [TaalCode]: Straatnaam } : { [TaalCode]: Straatnaam, [TaalCodeTweedeTaal]: StraatnaamTweedeTaal },
    talen: TaalCodeTweedeTaal === 'NULL' ? [TaalCode] : [TaalCode, TaalCodeTweedeTaal],
    taal: { id: TaalCode },
    taal2: TaalCodeTweedeTaal === 'NULL' ? null : { id: TaalCodeTweedeTaal },
    label,
  }),
  huisnummer: ({ HuisnummerId: id, Huisnummer: nummer }) => ({
    id: +id,
    nummer,
  }),
  perceel: ({ IdentificatorPerceel: id }) => ({
    id,
  }),
  gebouw: ({ IdentificatorGebouw: id, AardGebouw, StatusGebouw }) => ({
    id: +id,
    aard: { id: +AardGebouw },
    status: { id: +StatusGebouw },
  }),
  terrein: ({ IdentificatorTerreinobject: id, AardTerreinobject }) => ({
    id,
    aard: { id: +AardTerreinobject },
  }),
  wegobject: ({ IdentificatorWegobject: id, AardWegobject }) => ({
    id: +id,
    aard: { id: +AardWegobject },
  }),
  wegsegment: ({ IdentificatorWegsegment: id, StatusWegsegment }) => ({
    id: +id,
    status: { id: +StatusWegsegment },
  }),
/* };

const mapping = {*/
  ListTalen: () => mapping.taal,
  ListGewesten: () => mapping.gewest,
  GetGewestByGewestIdAndTaalCode: () => x => Object.assign(mapping.gewest(x), center(x), bounds(x), begin(x)),
  ListGemeentenByGewestId: ({ GewestId }) => x => Object.assign(mapping.gemeente(x), {
    nis: { id: +x.NISGemeenteCode },
    gewest: { id: +GewestId },
  }),
  GetGemeenteByGemeenteId: () => x => Object.assign(mapping.gemeente(x), {
    nis: { id: +x.NisGemeenteCode },
  }, center(x), bounds(x), begin(x)),
  ListStraatnamenByGemeenteId: ({ GemeenteId }) => x => Object.assign(mapping.straatnaam(x), {
    gemeente: { id: +GemeenteId },
  }),
  GetStraatnaamByStraatnaamId: () => x => Object.assign(mapping.straatnaam(x), {
    gemeente: { id: +x.GemeenteId },
  }, begin(x)),
  ListHuisnummersByStraatnaamId: ({ StraatnaamId }) => x => Object.assign(mapping.huisnummer(x), {
    straat: { id: +StraatnaamId },
  }),
  GetHuisnummerByHuisnummerId: () => x => Object.assign(mapping.huisnummer(x), {
    straat: { id: +x.StraatnaamId },
  }, begin(x)),
  ListPercelenByHuisnummerId: ({ HuisnummerId }) => x => Object.assign(mapping.perceel(x), {
    huisnummer: { id: +HuisnummerId },
  }),
  GetPerceelByIdentificatorPerceel: () => x => Object.assign(mapping.perceel(x), center(x), begin(x)),
  ListGebouwenByHuisnummerId: ({ HuisnummerId }) => x => Object.assign(mapping.gebouw(x), {
    huisnummer: { id: +HuisnummerId },
  }),
  GetGebouwByIdentificatorGebouw: () => x => Object.assign(mapping.gebouw(x), {
    geometrie: { methode: +x.GeometriemethodeGebouw, polygon: shape(x.Geometrie) },
  }, begin(x)),
  ListTerreinobjectenByHuisnummerId: ({ HuisnummerId }) => x => Object.assign(mapping.terrein(x), {
    huisnummer: { id: +HuisnummerId },
  }),
  GetTerreinobjectByIdentificatorTerreinobject: () => x => Object.assign(mapping.terrein(x), center(x), bounds(x)),
  ListWegobjectenByStraatnaamId: ({ StraatnaamId }) => x => Object.assign(mapping.wegobject(x), {
    straat: { id: +StraatnaamId },
  }),
  GetWegobjectByIdentificatorWegobject: () => x => Object.assign(mapping.wegobject(x), center(x), bounds(x)),
  ListWegsegmentenByStraatnaamId: ({ StraatnaamId }) => x => Object.assign(mapping.wegsegment(x), {
    straat: { id: +StraatnaamId },
  }),
  GetWegsegmentByIdentificatorWegsegment: () => x => Object.assign(mapping.wegsegment(x), {
    geometrie: { methode: +x.GeometriemethodeWegsegment, lineString: shape(x.Geometrie) },
  }, begin(x)),
}

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
      switch (operation) {
        case 'ListTalen':
        case 'ListGewesten':
        case 'GetGewestByGewestIdAndTaalCode':
        case 'ListGemeentenByGewestId':
        case 'GetGemeenteByGemeenteId':
        case 'ListStraatnamenByGemeenteId':
        case 'GetStraatnaamByStraatnaamId':
        case 'ListHuisnummersByStraatnaamId':
        case 'GetHuisnummerByHuisnummerId':
        case 'ListPercelenByHuisnummerId':
        case 'GetPerceelByIdentificatorPerceel':
        case 'ListGebouwenByHuisnummerId':
        case 'GetGebouwByIdentificatorGebouw':
        case 'ListTerreinobjectenByHuisnummerId':
        case 'GetTerreinobjectByIdentificatorTerreinobject':
        case 'ListWegobjectenByStraatnaamId':
        case 'GetWegobjectByIdentificatorWegobject':
        case 'ListWegsegmentenByStraatnaamId':
        case 'GetWegsegmentByIdentificatorWegsegment':
          res.json(dir(obj.map(mapping[operation](query))));
          break;
        default:
          break;
      }
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
