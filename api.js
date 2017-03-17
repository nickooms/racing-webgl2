const Perceel = require('./models/Perceel');
const Gebouw = require('./models/Gebouw');
const Wegbaan = require('./models/Wegbaan');
require('./db');

const json = res => (err, data) => res[err ? 'send' : 'json'](err || data);

const apiRoutes = (app) => {
  app.route('/api/wegbanen')
    .get((req, res) => Wegbaan.find({})
      .exec(json(res)));

  app.route('/api/wegbanen/:delete')
    .get((req, res) => Wegbaan.remove({})
      .exec(json(res)));

  app.route('/api/wegbanen/:straatId')
    .get(({ params: { straatId } }, res) => Wegbaan.find({ straatId })
      .exec(json(res)));

  app.route('/api/percelen')
    .get((req, res) => Perceel.find({})
      .exec(json(res)));

  app.route('/api/hoofdgebouwen')
    .get((req, res) => Gebouw.find({})
      .exec(json(res)));
};

module.exports = apiRoutes;
