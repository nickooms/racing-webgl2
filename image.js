const GRBImage = require('./GRBImage');

const imageRoutes = (app) => {
  app.route('/image/wegobjecten/:StraatnaamId/*')
    .get(GRBImage.wegobjecten);
  app.route('/image/wegsegment/:IdentificatorWegsegment')
    .get(GRBImage.wegsegment);
  app.route('/image/wegsegmenten/:StraatnaamId/*')
    .get(GRBImage.wegsegmenten);
  app.route('/image/wegbaan/:StraatnaamId')
    .get(GRBImage.wegbaan);
};

module.exports = imageRoutes;
