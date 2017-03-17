import React, { Component } from 'react';

class Faces extends Component {
  render() {
    const { faces } = this.props;
    return (
      <ul>
        {
          faces && faces.map((number, index) => (
            <li key={index}>
              {number}
            </li>
          ))
        }
      </ul>
    );
  }
}

export default Faces;
