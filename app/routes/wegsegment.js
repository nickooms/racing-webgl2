const { list, object, dir } = require('../lib/crab');

const LIST = 'ListWegsegmentenByStraatnaamId';
const GET = 'GetWegsegmentByIdentificatorWegsegment';
const SorteerVeld = 0;

module.exports = {
  [LIST]: ({ params: { StraatnaamId } }, res) => {
    list(LIST, { StraatnaamId, SorteerVeld })
      .then(result => res.json(result));
  },
  [GET]: ({ params: { IdentificatorWegsegment } }, res) => {
    object(GET, { IdentificatorWegsegment })
      .then(result => res.json(result));
  }
};
