import resource from 'resource-router-middleware';
import wegobjecten from '../models/wegobjecten';

// export default ({ config, db }) => resource({
export default () => resource({
  id : 'wegobject',
  load(req, id, callback) {
    const wegobject = wegobjecten.find(x => x.id == id);
    const err = wegobject ? null : 'Not found';
    callback(err, wegobject);
  },
  index({ params }, res) {
    res.json(wegobjecten);
  },
  create({ body }, res) {
    body.id = wegobjecten.length.toString(36);
    wegobjecten.push(body);
    res.json(body);
  },
  read({ wegobject }, res) {
    res.json(wegobject);
  },
  update({ wegobject, body }, res) {
    for (let key in body) {
      if (key !== 'id') wegobject[key] = body[key];
    }
    res.sendStatus(204);
  },
  delete({ wegobject }, res) {
    wegobjecten.splice(wegobjecten.indexOf(wegobject), 1);
    res.sendStatus(204);
  }
});
