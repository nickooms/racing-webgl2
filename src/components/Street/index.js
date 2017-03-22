import React, { Component } from 'react';
import fetch from 'node-fetch';
import muiThemeable from 'material-ui/styles/muiThemeable';
import AppBar from 'material-ui/AppBar';
import {Tabs, Tab} from 'material-ui/Tabs';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import SwipeableViews from 'react-swipeable-views';
import HouseNumberList from '../HouseNumberList';

const styles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },
  slide: {
    padding: 10,
  },
};

class Street extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      open: false,
      slideIndex: 0,
      street: null
    };
  }

  handleChange = value => this.setState({ slideIndex: value });

  handleToggle = () => this.setState({ open: !this.state.open });

  handleClose = () => this.setState({ open: false });

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
      <div>
        <AppBar title="Street" onTouchTap={this.handleToggle} />
        <Drawer docked={false} open={this.state.open} onRequestChange={(open) => this.setState({open})} width={200}>
          <MenuItem onTouchTap={this.handleClose}>Menu Item</MenuItem>
          <MenuItem onTouchTap={this.handleClose}>Menu Item 2</MenuItem>
        </Drawer>
        <Tabs onChange={this.handleChange} value={this.state.slideIndex}>
          <Tab value={0} label="Street" />
          <Tab value={1} label="HouseNumbers" />
          <Tab value={2} label="RoadObjects" />
        </Tabs>
        <SwipeableViews index={this.state.slideIndex} onChangeIndex={this.handleChange}>
          <div>
            <h2 style={styles.headline}>Tabs with slide effect</h2>
            Swipe to see the next slide.<br />
          </div>
          <div style={styles.slide}>
            <HouseNumberList houseNumbers={this.state.street && this.state.street.houseNumbers} />
          </div>
          <div style={styles.slide}>
            slide n°3
          </div>
        </SwipeableViews>
      </div>
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
