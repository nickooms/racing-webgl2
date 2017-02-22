import resource from 'resource-router-middleware';
import gebouwen from '../models/gebouwen';

// export default ({ config, db }) => resource({
export default () => resource({
  id : 'gebouw',
  load(req, id, callback) {
    const gebouw = gebouwen.find(x => x.id == id);
    const err = gebouw ? null : 'Not found';
    callback(err, gebouw);
  },
  index({ params }, res) {
    res.json(gebouwen);
  },
  create({ body }, res) {
    body.id = gebouwen.length.toString(36);
    gebouwen.push(body);
    res.json(body);
  },
  read({ gebouw }, res) {
    res.json(gebouw);
  },
  update({ gebouw, body }, res) {
    for (let key in body) {
      if (key !== 'id') gebouw[key] = body[key];
    }
    res.sendStatus(204);
  },
  delete({ gebouw }, res) {
    gebouwen.splice(gebouwen.indexOf(gebouw), 1);
    res.sendStatus(204);
  }
});
