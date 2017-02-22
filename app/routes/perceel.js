const { list, object, dir } = require('../lib/crab');

const LIST = 'ListPercelenByHuisnummerId';
const GET = 'GetPerceelByIdentificatorPerceel';
const SorteerVeld = 0;

module.exports = {
  [LIST]: ({ params: { HuisnummerId } }, res) => {
    list(LIST, { HuisnummerId, SorteerVeld })
      .then(result => res.json(result));
  },
  [GET]: ({ params: { IdentificatorPerceel1, IdentificatorPerceel2 } }, res) => {
    object(GET, { IdentificatorPerceel: `${IdentificatorPerceel1}/${IdentificatorPerceel2}` })
      .then(result => res.json(result));
  }
};
