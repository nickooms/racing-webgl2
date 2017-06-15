import React from 'react';
import PropTypes from 'prop-types';
import PlotsSVG from './PlotsSVG';
import PlotList from './PlotList';

const Plots = (props) => {
  const { street, plots } = props;
  return (
    <div style={{ flexDirection: 'row', display: 'flex', alignItems: 'flex-start' }}>
      <PlotList street={street} plots={plots} style={{ flex: 1 }} />
      <PlotsSVG street={street} plots={plots} style={{ flex: 1 }} />
    </div>
  );
};

Plots.defaultProps = {
  street: {},
  plots: {},
};

Plots.propTypes = {
  street: PropTypes.shape({}),
  plots: PropTypes.arrayOf(PropTypes.shape({})),
};

export default Plots;
