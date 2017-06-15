import React, { Component } from 'react';

class SVG extends Component {
  static viewBox(bbox) {
    const { left, top, width, height } = bbox;
    return `${left} ${top} ${width} ${height}`;
  }

  static points(polygon) {
    return polygon
      .map(([x, y]) => `${x},${y}`)
      .join(' ');
  }

  render() {
    const { width = '50%', viewBox, children, style } = this.props;
    return (
      <svg width={width} viewBox={viewBox} style={style}>
        {children}
      </svg>
    );
  }
}

export default SVG;
