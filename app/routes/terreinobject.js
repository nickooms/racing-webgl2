const { list, object, dir } = require('../lib/crab');

const LIST = 'ListTerreinobjectenByHuisnummerId';
const GET = 'GetTerreinobjectByIdentificatorTerreinobject';
const SorteerVeld = 0;

module.exports = {
  [LIST]: ({ params: { HuisnummerId } }, res) => {
    list(LIST, { HuisnummerId, SorteerVeld })
      .then(result => res.json(result));
  },
  [GET]: ({ params: { IdentificatorTerreinobject } }, res) => {
    object(GET, { IdentificatorTerreinobject })
      .then(result => res.json(result));
  }
};
