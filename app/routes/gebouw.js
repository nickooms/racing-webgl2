const { list, object, dir } = require('../lib/crab');

const LIST = 'ListGebouwenByHuisnummerId';
const GET = 'GetGebouwByIdentificatorGebouw';
const SorteerVeld = 0;

module.exports = {
  [LIST]: ({ params: { HuisnummerId } }, res) => {
    list(LIST, { HuisnummerId, SorteerVeld })
      .then(result => res.json(result));
  },
  [GET]: ({ params: { IdentificatorGebouw } }, res) => {
    object(GET, { IdentificatorGebouw })
      .then(result => res.json(result));
  }
};
