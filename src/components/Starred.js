import React, { PropTypes } from 'react';

const Starred = ({ color }) => (
  <svg
    viewBox="0 0 24 24"
    style={{
      display: 'block',
      color,
      fill: color,
      height: 24,
      width: 24,
      userSelect: 'none',
      transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
      position: 'absolute',
      top: 0,
      margin: 12,
      right: 4,
    }}
  >
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);

Starred.propTypes = {
  color: PropTypes.string.isRequired,
};

export default Starred;
