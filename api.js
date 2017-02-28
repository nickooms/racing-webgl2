const Wegbaan = require('./models/Wegbaan');
const db = require('./db');

const json = res => (err, data) => res[err ? 'send' : 'json'](err || data);

const { wegbaan } = db.models;

const apiRoutes = (app) => {
  app.route('/api/wegbanen')
    .get((req, res) => wegbaan.find({})
      .exec(json(res)));

  app.route('/api/wegbanen/:delete')
    .get((req, res) => Wegbaan.remove({})
      .exec(json(res)));

  app.route('/api/wegbanen/:straatId')
    .get(({ params: { straatId } }, res) => Wegbaan.find({ straatId })
      .exec(json(res)));
};

module.exports = apiRoutes;
