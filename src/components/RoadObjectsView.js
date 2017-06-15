import React from 'react';
import PropTypes from 'prop-types';
import RoadObjectsSVG from './RoadObjectsSVG';
import RoadObjectList from './RoadObjectList';

const RoadObjectsView = (props) => {
  const { street, roadObjects } = props;
  return (
    <div style={{ flexDirection: 'row', display: 'flex', alignItems: 'flex-start' }}>
      <RoadObjectList street={street} roadObjects={roadObjects} style={{ flex: 1 }} />
      <RoadObjectsSVG street={street} roadObjects={roadObjects} style={{ flex: 1 }} />
    </div>
  );
};

RoadObjectsView.defaultProps = {
  street: {},
  roadObjects: [],
};

RoadObjectsView.propTypes = {
  street: PropTypes.shape({}),
  roadObjects: PropTypes.arrayOf(PropTypes.shape({})),
};

export default RoadObjectsView;
