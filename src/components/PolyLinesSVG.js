import React from 'react';
import PropTypes from 'prop-types';
import muiThemeable from 'material-ui/styles/muiThemeable';
import { flatten } from '../../functional';
import BBOX from '../util/BBOX';
import PolyLine from './PolyLine';
import SVG from './SVG';

const PolyLinesSVG = (...propNames) => muiThemeable()((props) => {
  const objects = [];
  propNames.forEach((propName) => {
    const propObjects = props[propName];
    if (propObjects) objects.push(...propObjects);
  });
  if (!objects.length) return null;
  const polyLines = flatten(objects.map(object => object.polyLine.map(([x, y]) => ({ x, y }))));
  const bbox = new BBOX({ points: polyLines.map(({ x, y }) => [x, y]) }).grow({ percent: 10 });
  return (
    <SVG viewBox={SVG.viewBox(bbox)} {...{ props }}>
      {objects.map(({ id, polyLine }) => (
        <PolyLine key={id} points={SVG.points(polyLine)} />
      ))}
    </SVG>
  );
});

PolyLinesSVG.propTypes = { propNames: PropTypes.arrayOf(PropTypes.string) };

export default PolyLinesSVG;
