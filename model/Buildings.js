const { list, object } = require('../app/lib/crab');
const { flatten } = require('../functional');

const SorteerVeld = 0;

class Buildings {
  static async byHouseNumbers(houseNumbers) {
    const buildings = flatten(await Promise.all(houseNumbers.map(async (houseNumber) => {
      const result = await list('ListGebouwenByHuisnummerId', { HuisnummerId: houseNumber.id, SorteerVeld });
      // console.log(result);
      return result;
    })));
    // console.log(buildings);
    return buildings;
  }
}

module.exports = Buildings;
