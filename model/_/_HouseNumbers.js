const { list, object } = require('../app/lib/crab');
const HouseNumber = require('./HouseNumber');
const { flatten } = require('../functional');

const GotHouseNumbers = Symbol('GotHouseNumbers');
const GetHouseNumbers = Symbol('GetHouseNumbers');
const GotPlots = Symbol('GotPlots');
const GetPlots = Symbol('GetPlots');
const GotBuildings = Symbol('GotBuildings');
const GetBuildings = Symbol('GetBuildings');
const SorteerVeld = 0;

class HouseNumbers extends Array {
  static get [Symbol.species]() {
    return Array;
  }

  static async byStreet(streetId) {
    const result = await list('ListHuisnummersByStraatnaamId', { StraatnaamId: streetId, SorteerVeld });
    const items = await Promise.all(result.map(async ({ id }) => {
      const houseNumber = new HouseNumber(id);
      await houseNumber.get();
      return houseNumber;
    }));
    const houseNumbers = new HouseNumbers(items);
    houseNumbers.street = streetId;
    return houseNumbers;
  }

  constructor(objectsOrIds) {
    super();
    this[GotHouseNumbers] = false;
    this[GotPlots] = false;
    this[GotBuildings] = false;
    if (objectsOrIds) {
      objectsOrIds.forEach((objectOrId) => {
        if (Number.isInteger(objectOrId)) {
          this.push(new HouseNumber(objectOrId));
        } else if (objectOrId instanceof HouseNumber) {
          this.push(objectOrId);
        }
      });
      this[GotHouseNumbers] = true;
    }
  }

  async get() {
    await Promise.all(this.map(async (houseNumber) => {
      await houseNumber.get();
      return houseNumber;
    }));
    return this;
  }

  async [GetPlots]() {
    if (!this[GotPlots]) {
      this.plots = flatten(await Promise.all(this.map(async (houseNumber) => {
        const plots = await houseNumber.getPlots();
        return plots;
        // return houseNumber.plots;
      })));
      this[GotPlots] = true;
      // console.log(plots);
    }
  }

  async getPlots() {
    await this[GetPlots]();
    return this.plots;
  }

  async buildings() {
    if (!this[GotBuildings]) await this.get({ buildings: true });
    return this.buildings;
  }

  byId(id) {
    const withIds = this.filter(houseNumber => houseNumber.id === id);
    return withIds.length ? withIds[0] : null;
  }
}

module.exports = HouseNumbers;
