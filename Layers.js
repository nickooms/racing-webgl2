const { query, capabilities } = require('./WMS');
const GRBCanvas = require('./GRBCanvas');
const { dir } = require('./util');

const SIZE = 1000;

class Layers {
  static get BSK() { return 'GRB_BSK'; }

  static get WKN() { return 'GRB_WKN'; }

  static get WBN() { return 'GRB_WBN'; }

  static get WGO() { return 'GRB_WGO'; }

  static get WVB() { return 'GRB_WVB'; }

  static get ADP() { return 'GRB_ADP'; }

  static get HNR_ADP() { return 'GRB_HNR_ADP'; }

  static get GBG() { return 'GRB_GBG'; }

  static get HNR_GBG() { return 'GRB_HNR_GBG'; }

  static fromNames(names) {
    return names.split(',').map(name => Layers[name]);
  }

  static async getLayer({
    layers = 'GRB_WBN',
    width = SIZE,
    height = SIZE,
    bbox,
  }) {
    const { img } = await query({ width, height, bbox, layers });
    return new GRBCanvas(width, height, bbox, img);
  }

  static async json(req, res) {
    const layers = await capabilities();
    const capability = layers.WMS_Capabilities.Capability[0];
    const layerInfo = capability.Layer[0].Layer[0].Layer.map(({
      Name: [id],
      Title: [name],
      Abstract: [description]
    }) => ({
      id,
      name,
      description
    }));
    dir(layerInfo);
    res.json(layerInfo);
  }
}

module.exports = Layers;
