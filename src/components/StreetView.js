import React from 'react';
import PropTypes from 'prop-types';
import StreetSVG from './StreetSVG';
import StreetCard from './StreetCard';

const StreetView = (props) => {
  const { street, city, plots, buildings, roadObjects, roadSegments } = props;
  return (
    <div style={{ flexDirection: 'row', display: 'flex', alignItems: 'flex-start' }}>
      <StreetCard {...{ street, city }} style={{ flex: 1 }} />
      <StreetSVG {...{ street, plots, buildings, roadObjects, roadSegments }} style={{ flex: 1 }} />
    </div>
  );
};

StreetView.defaultProps = {
  street: {},
  city: {},
  plots: [],
  buildings: [],
  roadObjects: [],
  roadSegments: [],
};

StreetView.propTypes = {
  street: PropTypes.shape({}),
  city: PropTypes.shape({}),
  plots: PropTypes.arrayOf(PropTypes.shape({})),
  buildings: PropTypes.arrayOf(PropTypes.shape({})),
  roadObjects: PropTypes.arrayOf(PropTypes.shape({})),
  roadSegments: PropTypes.arrayOf(PropTypes.shape({})),
};

export default StreetView;
