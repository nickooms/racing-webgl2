const { list, object } = require('../app/lib/crab');
const HouseNumber = require('./HouseNumber');

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
    return new HouseNumbers(items);
  }

  constructor(objectsOrIds) {
    // console.log(objectsOrIds);
    super();
    objectsOrIds.forEach((objectOrId) => {
      if (Number.isInteger(objectOrId)) {
        this.push(new HouseNumber(objectOrId));
      } else if (objectOrId instanceof HouseNumber) {
        this.push(objectOrId);
      }
    });
  }

  async get() {
    await Promise.all(this.map(async (houseNumber) => {
      await houseNumber.get();
      return houseNumber;
    }));
    return this;
  }
}

module.exports = HouseNumbers;
