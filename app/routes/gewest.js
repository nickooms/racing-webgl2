const { list, object, dir } = require('../lib/crab');

const LIST = 'ListGewesten';
const GET = 'GetGewestByGewestIdAndTaalCode';
const SorteerVeld = 0;

module.exports = {
  [LIST]: (req, res) => {
    list(LIST, { SorteerVeld })
      .then(result => res.json(result));
  },
  [GET]: ({ params: { GewestId, TaalCode } }, res) => {
    object(GET, { GewestId, TaalCode })
      .then(result => res.json(result));
  }
};
