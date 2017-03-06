const GRBImage = require('./GRBImage');

const imageRoutes = (app) => {
  app.route('/image/wegobjecten/:straatId')
    .get(GRBImage.wegobjecten);

  app.route('/image/wegsegment/:IdentificatorWegsegment')
    .get(GRBImage.wegsegment);

  app.route('/image/wegsegmenten/:straatId')
    .get(GRBImage.wegsegmenten);

  app.route('/image/wegknopen/:straatId')
    .get(GRBImage.wegknopen);

  app.route('/image/wegbaan/:StraatnaamId')
    .get(GRBImage.wegbaan);

  app.route('/image/straat/:id')
    .get(GRBImage.straat);
};

module.exports = imageRoutes;
