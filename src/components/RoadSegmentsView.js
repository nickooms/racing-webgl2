import React from 'react';
import PropTypes from 'prop-types';
import RoadSegmentsSVG from './RoadSegmentsSVG';
import RoadSegmentList from './RoadSegmentList';

const RoadSegmentsView = (props) => {
  const { street, roadSegments } = props;
  return (
    <div style={{ flexDirection: 'row', display: 'flex', alignItems: 'flex-start' }}>
      <RoadSegmentList street={street} roadSegments={roadSegments} style={{ flex: 1 }} />
      <RoadSegmentsSVG street={street} roadSegments={roadSegments} style={{ flex: 1 }} />
    </div>
  );
};

RoadSegmentsView.defaultProps = {
  street: {},
  roadSegments: [],
};

RoadSegmentsView.propTypes = {
  street: PropTypes.shape({}),
  roadSegments: PropTypes.arrayOf(PropTypes.shape({})),
};

export default RoadSegmentsView;
