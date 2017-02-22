import resource from 'resource-router-middleware';
import gemeenten from '../models/gemeenten';

// export default ({ config, db }) => resource({
export default () => resource({
  id : 'gemeente',
  load(req, id, callback) {
    const gemeente = gemeenten.find(x => x.id == id);
    const err = gemeente ? null : 'Not found';
    callback(err, gemeente);
  },
  index({ params }, res) {
    res.json(gemeenten);
  },
  create({ body }, res) {
    body.id = gemeenten.length.toString(36);
    gemeenten.push(body);
    res.json(body);
  },
  read({ gemeente }, res) {
    res.json(gemeente);
  },
  update({ gemeente, body }, res) {
    for (let key in body) {
      if (key !== 'id') gemeente[key] = body[key];
    }
    res.sendStatus(204);
  },
  delete({ gemeente }, res) {
    gemeenten.splice(gemeenten.indexOf(gemeente), 1);
    res.sendStatus(204);
  }
});
