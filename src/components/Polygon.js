import React from 'react';
import PropTypes from 'prop-types';
import muiThemeable from 'material-ui/styles/muiThemeable';

const { string, number, shape } = PropTypes;

const Polygon = ({
  points,
  fillOpacity,
  strokeWidth,
  muiTheme: { palette: { primary1Color: color } },
  style,
}) => (
  <polygon {...{ points, stroke: color, fill: color, fillOpacity, strokeWidth, style }} />
);

Polygon.defaultProps = {
  fillOpacity: 0.5,
  strokeWidth: 0.1,
  style: {},
};

const entries = x => [...Object.entries(x)];

const requiredProp = ([name, propType]) => ({ [name]: propType }).isRequired;

const required = x => Object.assign({}, ...entries(x).map(requiredProp));

Polygon.propTypes = Object.assign(required({
  points: string,
  muiTheme: shape({}),
}, {
  fillOpacity: number,
  strokeWidth: number,
  style: shape({}),
}));

export default muiThemeable()(Polygon);
