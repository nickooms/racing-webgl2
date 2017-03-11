const { list, object } = require('../app/lib/crab');

const SorteerVeld = 0;

class Plots {
  static async byHouseNumbers(houseNumbers) {
    const plots = await Promise.all(houseNumbers.map(async (houseNumber) => {
      const result = await list('ListPercelenByHuisnummerId', { HuisnummerId: houseNumber.id, SorteerVeld });
      console.log(result);
    }));
    console.log(plots);
  }
}

module.exports = Plots;
