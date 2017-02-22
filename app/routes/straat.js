const { list, object, dir } = require('../lib/crab');

const LIST = 'ListStraatnamenByGemeenteId';
const GET = 'GetStraatnaamByStraatnaamId';
const SorteerVeld = 0;

module.exports = {
  [LIST]: ({ params: { GemeenteId } }, res) => {
    list(LIST, { GemeenteId, SorteerVeld })
      .then(result => res.json(result));
  },
  [GET]: ({ params: { StraatnaamId } }, res) => {
    object(GET, { StraatnaamId })
      .then(result => res.json(result));
  }
};
