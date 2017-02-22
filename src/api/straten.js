import resource from 'resource-router-middleware';
import straten from '../models/straten';

// export default ({ config, db }) => resource({
export default () => resource({
  id : 'straat',
  load(req, id, callback) {
    const straat = straten.find(x => x.id == id);
    const err = straat ? null : 'Not found';
    callback(err, straat);
  },
  index({ params }, res) {
    res.json(straten);
  },
  create({ body }, res) {
    body.id = straten.length.toString(36);
    straten.push(body);
    res.json(body);
  },
  read({ straat }, res) {
    res.json(straat);
  },
  update({ straat, body }, res) {
    for (let key in body) {
      if (key !== 'id') straat[key] = body[key];
    }
    res.sendStatus(204);
  },
  delete({ straat }, res) {
    straten.splice(straten.indexOf(straat), 1);
    res.sendStatus(204);
  }
});
