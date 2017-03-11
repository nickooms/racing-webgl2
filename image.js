const GRBImage = require('./GRBImage');

const routes = app => paths => paths
  .map(path => app
    .route(`/image/${path}`)
    .get(GRBImage[path.split('/')[0]]));

const imageRoutes = app => routes(app)([
  'wegobjecten/:straatId',
  'wegsegment/:IdentificatorWegsegment',
  'wegsegmenten/:straatId',
  'wegknopen/:straatId',
  'wegknopen/:straatId/:layerNames',
  'wegbaan/:straatId',
  'wegbaan/:straatId/:layerNames',
  'straat/:straatId',
]);

module.exports = imageRoutes;
