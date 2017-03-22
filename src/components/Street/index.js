import React, { Component } from 'react';
import fetch from 'node-fetch';
import muiThemeable from 'material-ui/styles/muiThemeable';
import HouseNumberList from '../HouseNumberList';

class Street extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = { street: null };
  }

  componentDidMount() {
    this.load(7338);
  }

  async load(id) {
    const response = await fetch(`http://localhost:8080/street/${id}`);
    const street = await response.json();
    // console.dir(street);
    this.setState({ street });
  }

  render() {
    return (
      <HouseNumberList houseNumbers={this.state.street && this.state.street.houseNumbers} />
    );
  }
}

export default muiThemeable()(Street);

/*  import React, { PropTypes } from 'react';
import './../index.css';

const Street = ({ id = 7338 }) => (
  <div>
    <h1>Street</h1>
    <div className="center">
      <span className="flex margin">Id :</span>
      <span className="flex margin">{id}</span>
    </div>
  </div>
);

Street.propTypes = {
  id: PropTypes.number.isRequired,
};

export default Street;*/
