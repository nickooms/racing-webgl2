import React from 'react';
import PropTypes from 'prop-types';
import BuildingsSVG from './BuildingsSVG';
import BuildingList from './BuildingList';

const BuildingsView = (props) => {
  const { street, buildings } = props;
  return (
    <div style={{ flexDirection: 'row', display: 'flex', alignItems: 'flex-start' }}>
      <BuildingList street={street} buildings={buildings} style={{ flex: 1 }} />
      <BuildingsSVG street={street} buildings={buildings} style={{ flex: 1 }} />
    </div>
  );
};

BuildingsView.defaultProps = {
  street: {},
  buildings: [],
};

BuildingsView.propTypes = {
  street: PropTypes.shape({}),
  buildings: PropTypes.arrayOf(PropTypes.shape({})),
};

export default BuildingsView;
