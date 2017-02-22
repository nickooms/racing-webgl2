const { list, object, dir } = require('../lib/crab');

const LIST = 'ListTalen';
const SorteerVeld = 0;

module.exports = {
  [LIST]: (req, res) => {
    list(LIST, { SorteerVeld })
      .then(result => res.json(result));
  }
};
