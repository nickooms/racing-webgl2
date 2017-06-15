import React from 'react';
import PropTypes from 'prop-types';
import muiThemeable from 'material-ui/styles/muiThemeable';
import BBOX from '../util/BBOX';
import Polygon from './Polygon';
import SVG from './SVG';

const BuildingSVG = ({ building }) => {
  if (!building) return null;
  const { polygon: points } = building;
  const bbox = new BBOX({ points })
    .grow({ percent: 10 });
  return (
    <SVG viewBox={SVG.viewBox(bbox)}>
      <Polygon points={SVG.points(points)} />
    </SVG>
  );
};

BuildingSVG.defaultProps = { building: null };

BuildingSVG.propTypes = { building: PropTypes.shape({}) };

export default muiThemeable()(BuildingSVG);
