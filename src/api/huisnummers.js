import resource from 'resource-router-middleware';
import huisnummers from '../models/huisnummers';

// export default ({ config, db }) => resource({
export default () => resource({
  id : 'huisnummer',
  load(req, id, callback) {
    const huisnummer = huisnummers.find(x => x.id == id);
    const err = huisnummer ? null : 'Not found';
    callback(err, huisnummer);
  },
  index({ params }, res) {
    res.json(huisnummers);
  },
  create({ body }, res) {
    body.id = huisnummers.length.toString(36);
    huisnummers.push(body);
    res.json(body);
  },
  read({ huisnummer }, res) {
    res.json(huisnummer);
  },
  update({ huisnummer, body }, res) {
    for (let key in body) {
      if (key !== 'id') huisnummer[key] = body[key];
    }
    res.sendStatus(204);
  },
  delete({ huisnummer }, res) {
    huisnummers.splice(huisnummers.indexOf(huisnummer), 1);
    res.sendStatus(204);
  }
});
