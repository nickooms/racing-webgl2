const { list, object, dir } = require('../lib/crab');

const LIST = 'ListGemeentenByGewestId';
const GET = 'GetGemeenteByGemeenteId';
const SorteerVeld = 0;

module.exports = {
  [LIST]: ({ params: { GewestId } }, res) => {
    list(LIST, { GewestId, SorteerVeld })
      .then(result => res.json(result));
  },
  [GET]: ({ params: { GemeenteId } }, res) => {
    object(GET, { GemeenteId })
      .then(result => res.json(result));
  }
};
