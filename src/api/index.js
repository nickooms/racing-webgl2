// import { version } from '../../package.json';
import { Router } from 'express';
import gewesten from './gewesten';
import gemeenten from './gemeenten';
import straten from './straten';
import huisnummers from './huisnummers';
import wegobjecten from './wegobjecten';
import wegsegmenten from './wegsegmenten';
import gebouwen from './gebouwen';
import facets from './facets';
import crab from './crab';

const SorteerVeld = 0;
const TaalCode = 'nl';
const GewestId = 1;
const GemeenteId = 71;
const StraatnaamId = 7338;
const HuisnummerId = 1373962;
const IdentificatorPerceel = '11020I0449/00G000';
const IdentificatorWegobject = 53835939;
const IdentificatorWegsegment = 262050;
const IdentificatorTerreinobject = '11020_I_0449_G_000_00';
const IdentificatorGebouw = 1874906;

const Operations = {
	ListTalen: { SorteerVeld },
	ListGewesten: { SorteerVeld },
	GetGewestByGewestIdAndTaalCode: { GewestId, TaalCode },
	ListGemeentenByGewestId: { GewestId, SorteerVeld },
	GetGemeenteByGemeenteId: { GemeenteId },
	ListStraatnamenByGemeenteId: { GemeenteId, SorteerVeld },
	GetStraatnaamByStraatnaamId: { StraatnaamId },
	ListHuisnummersByStraatnaamId: { StraatnaamId, SorteerVeld },
	GetHuisnummerByHuisnummerId: { HuisnummerId },
	ListPercelenByHuisnummerId: { HuisnummerId },
	GetPerceelByIdentificatorPerceel: { IdentificatorPerceel },
	ListGebouwenByHuisnummerId: { HuisnummerId, SorteerVeld },
	GetGebouwByIdentificatorGebouw: { IdentificatorGebouw },
	ListTerreinobjectenByHuisnummerId: { HuisnummerId, SorteerVeld },
	GetTerreinobjectByIdentificatorTerreinobject: { IdentificatorTerreinobject },
	ListWegobjectenByStraatnaamId: { StraatnaamId, SorteerVeld },
	GetWegobjectByIdentificatorWegobject: { IdentificatorWegobject },
	ListWegsegmentenByStraatnaamId: { StraatnaamId, SorteerVeld },
	GetWegsegmentByIdentificatorWegsegment: { IdentificatorWegsegment },
};

const link = (href, text) => `<a href="${href}">${text}</a>`;

const operation = ([key, value]) => link(`api/crab?operation=${key}&${parameters(value)}`, key);

const parameter = ([param, val]) => `${param}=${val}`;

const parameters = param => Object.entries(param).map(parameter).join('&');

export default ({ config, db }) => {
	let api = Router();
	api.use('/crab', crab({ config, db }));
	api.use('/facets', facets({ config, db }));
	api.use('/gewesten', gewesten({ config, db }));
	api.use('/gemeenten', gemeenten({ config, db }));
	api.use('/straten', straten({ config, db }));
	api.use('/huisnummers', huisnummers({ config, db }));
	api.use('/wegobjecten', wegobjecten({ config, db }));
	api.use('/wegsegmenten', wegsegmenten({ config, db }));
	api.use('/gebouwen', gebouwen({ config, db }));
	api.get('/', (req, res) => res.send(Object.entries(Operations).map(operation).join('<br>')));
	return api;
};
