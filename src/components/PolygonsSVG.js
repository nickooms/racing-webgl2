import React from 'react';
import PropTypes from 'prop-types';
import muiThemeable from 'material-ui/styles/muiThemeable';
import { flatten } from '../../functional';
import BBOX from '../util/BBOX';
import Polygon from './Polygon';
import SVG from './SVG';

const PolygonsSVG = (...propNames) => muiThemeable()((props) => {
  const objects = [];
  propNames.forEach((propName) => {
    const propObjects = props[propName];
    if (propObjects) objects.push(...propObjects);
  });
  if (!objects.length) return null;
  const polygons = flatten(objects.map(object => object.polygon.map(([x, y]) => ({ x, y }))));
  const bbox = new BBOX({ points: polygons.map(({ x, y }) => [x, y]) }).grow({ percent: 10 });
  return (
    <SVG viewBox={SVG.viewBox(bbox)} {...{ props }}>
      {objects.map(({ id, polygon }) => (
        <Polygon key={id} points={SVG.points(polygon)} />
      ))}
    </SVG>
  );
});

PolygonsSVG.propTypes = { propNames: PropTypes.arrayOf(PropTypes.string) };

export default PolygonsSVG;
