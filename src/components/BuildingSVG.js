import React, { PropTypes } from 'react';
import muiThemeable from 'material-ui/styles/muiThemeable';
import BBOX from '../util/BBOX';

const BuildingSVG = ({
  building,
  muiTheme: { palette: { primary1Color: color } },
}) => {
  if (!building || !building.polygon) return null;
  const polygon = building.polygon.map(([x, y]) => [y, x]);
  const points = polygon.map(([x, y]) => `${x},${y}`).join(' ');
  const { left, top, width, height } = new BBOX({ points: polygon }).grow({ percent: 10 });
  const viewBox = `${left} ${top} ${width} ${height}`;
  return (
    <svg width="400" height="400" viewBox={viewBox}>
      <polygon points={points} stroke={color} fill={color} fillOpacity={0.5} strokeWidth={0.1} />
    </svg>
  );
};

BuildingSVG.defaultProps = {
  building: null,
  muiTheme: null,
};

BuildingSVG.propTypes = {
  building: PropTypes.shape({}),
  muiTheme: PropTypes.shape({}),
};

export default muiThemeable()(BuildingSVG);
