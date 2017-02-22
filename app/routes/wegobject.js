const { list, object, dir } = require('../lib/crab');

const LIST = 'ListWegobjectenByStraatnaamId';
const GET = 'GetWegobjectByIdentificatorWegobject';
const SorteerVeld = 0;

module.exports = {
  [LIST]: ({ params: { StraatnaamId } }, res) => {
    list(LIST, { StraatnaamId, SorteerVeld })
      .then(result => res.json(result));
  },
  [GET]: ({ params: { IdentificatorWegobject } }, res) => {
    object(GET, { IdentificatorWegobject })
      .then(result => res.json(result));
  }
};
