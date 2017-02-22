import resource from 'resource-router-middleware';
import gewesten from '../models/gewesten';

// export default ({ config, db }) => resource({
export default () => resource({
  id : 'gewest',
  load(req, id, callback) {
    const gewest = gewesten.find(x => x.id == id);
    const err = gewest ? null : 'Not found';
    callback(err, gewest);
  },
  index({ params }, res) {
    res.json(gewesten);
  },
  create({ body }, res) {
    body.id = gewesten.length.toString(36);
    gewesten.push(body);
    res.json(body);
  },
  read({ gewest }, res) {
    res.json(gewest);
  },
  update({ gewest, body }, res) {
    for (let key in body) {
      if (key !== 'id') gewest[key] = body[key];
    }
    res.sendStatus(204);
  },
  delete({ gewest }, res) {
    gewesten.splice(gewesten.indexOf(gewest), 1);
    res.sendStatus(204);
  }
});
