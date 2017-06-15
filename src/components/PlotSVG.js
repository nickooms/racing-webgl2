import React from 'react';
import PropTypes from 'prop-types';
import muiThemeable from 'material-ui/styles/muiThemeable';
import BBOX from '../util/BBOX';
import Polygon from './Polygon';
import SVG from './SVG';

const PlotSVG = ({ plot }) => {
  if (!plot) return null;
  const { polygon: points } = plot;
  const bbox = new BBOX({ points })
    .grow({ percent: 10 });
  return (
    <SVG viewBox={SVG.viewBox(bbox)}>
      <Polygon points={SVG.points(points)} />
    </SVG>
  );
};

PlotSVG.defaultProps = { plot: null };

PlotSVG.propTypes = { plot: PropTypes.shape({}) };

export default muiThemeable()(PlotSVG);
