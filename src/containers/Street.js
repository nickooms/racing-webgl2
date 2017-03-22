import React, { Component } from 'react';
import fetch from 'node-fetch';
import HouseNumberList from '../components/HouseNumberList';

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
    const street = response.json();
    console.log(street);
    this.setState({ street });
  }

  render() {
    return (
      <HouseNumberList />
    );
  }
}

export default Street;
