const { list, object } = require('../app/lib/crab');

const SorteerVeld = 0;

const GotCRAB = Symbol('GotCRAB');
const GetCRAB = Symbol('GetCRAB');
const GetById = 'GetHuisnummerByHuisnummerId';
const ID = 'HuisnummerId';

const CRABMapping = crab => ({
  number: crab.nummer,
  [GotCRAB]: true,
  /* name: crab.namen[crab.taal.id],
  names: crab.namen,
  language: crab.taal.id,
  languages: crab.talen,
  label: crab.label,
  city: crab.gemeente.id,*/
});

const DEFAULTS = {
  id: undefined,
  [GotCRAB]: false,
  /* name: undefined,
  names: undefined,
  language: undefined,
  languages: undefined,
  label: undefined,
  city: undefined,*/
  // huisnummers: undefined,
};

class HouseNumber {
  /* static async byStreet(streetId) {
    const result = await list('ListHuisnummersByStraatnaamId', { StraatnaamId: streetId, SorteerVeld });
    const items = await Promise.all(result.map(async ({ id }) => {
      const houseNumber = new HouseNumber(id);
      await houseNumber.get();
      return houseNumber;
    }));
    return items;
  }*/

  constructor(objectOrId) {
    Object.assign(this, DEFAULTS);
    if (Number.isInteger(objectOrId)) {
      this.id = objectOrId;
    }
  }

  async [GetCRAB]() {
    const result = await object(GetById, { [ID]: this.id });
    Object.assign(this, CRABMapping(result));
    return result;
  }

  async get() {
    if (!this[GotCRAB]) await this[GetCRAB]();
    return this;
  }
}

const test = async () => {
  /* const street = new Street(7338);
  await street.get();
  console.log(street);*/
};

test();

module.exports = HouseNumber;
