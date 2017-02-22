import resource from 'resource-router-middleware';
import wegsegmenten from '../models/wegsegmenten';

// export default ({ config, db }) => resource({
export default () => resource({
  id : 'wegsegment',
  load(req, id, callback) {
    const wegsegment = wegsegmenten.find(x => x.id == id);
    const err = wegsegment ? null : 'Not found';
    callback(err, wegsegment);
  },
  index({ params }, res) {
    res.json(wegsegmenten);
  },
  create({ body }, res) {
    body.id = wegsegmenten.length.toString(36);
    wegsegmenten.push(body);
    res.json(body);
  },
  read({ wegsegment }, res) {
    res.json(wegsegment);
  },
  update({ wegsegment, body }, res) {
    for (let key in body) {
      if (key !== 'id') wegsegment[key] = body[key];
    }
    res.sendStatus(204);
  },
  delete({ wegsegment }, res) {
    wegsegmenten.splice(wegsegmenten.indexOf(wegsegment), 1);
    res.sendStatus(204);
  }
});
