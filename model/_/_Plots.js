const { list, object } = require('../app/lib/crab');
const { flatten } = require('../functional');

const SorteerVeld = 0;

class Plots {
  static async byHouseNumbers(houseNumbers) {
    const plots = flatten(await Promise.all(houseNumbers.map(async (houseNumber) => {
      const result = await list('ListPercelenByHuisnummerId', { HuisnummerId: houseNumber.id, SorteerVeld });
      // console.log(result);
      return result;
    })));
    // console.log(plots);
    return plots;
  }
}

module.exports = Plots;
