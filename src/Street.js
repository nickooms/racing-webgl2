import React, { Component } from 'react';

import HouseNumbers from './HouseNumbers';
import Faces from './Faces';
import { faces } from './assets/egg';

class Street extends Component {
  render() {
    const { street } = this.props;
    const { houseNumbers } = street;
    return (
      <div>
        <HouseNumbers { ...{ houseNumbers } } />
        <Faces { ...{ faces }} />
      </div>
    );
  }
}

export default Street;
