/* const mongoose = require('mongoose');
const Huisnummer = require('../models/huisnummer');*/
const { list, object, dir } = require('../lib/crab');

const LIST = 'ListHuisnummersByStraatnaamId';
const GET = 'GetHuisnummerByHuisnummerId';
const SorteerVeld = 0;

/* const postHuisnummer = (req, res) => new Huisnummer(req.body).save((err, book) => {
  if (err) {
    res.send(err);
  } else {
    res.json({ message: 'Huisnummer successfully added!', huisnummer });
  }
});*/

module.exports = {
  [LIST]: ({ params: { StraatnaamId } }, res) => {
    list(LIST, { StraatnaamId, SorteerVeld })
      .then(result => res.json(result));
  },
  [GET]: ({ params: { HuisnummerId } }, res) => {
    object(GET, { HuisnummerId })
      .then(result => res.json(result));
  }
};
