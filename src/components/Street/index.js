import React, { Component } from 'react';
import fetch from 'node-fetch';
import muiThemeable from 'material-ui/styles/muiThemeable';
import AppBar from 'material-ui/AppBar';
import {Tabs, Tab} from 'material-ui/Tabs';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import SwipeableViews from 'react-swipeable-views';
import HouseNumberList from '../HouseNumberList';

const STREET = 0;
const HOUSE_NUMBERS = 1;
const ROAD_OBJECTS = 2;

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
  paper: {
    margin: 40,
    padding: 20,
  },
  bar: {
    height: 48,
  }
};

class Street extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      open: false,
      slideIndex: HOUSE_NUMBERS,
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
    this.setState({ street });
  }

  render() {
    const { handleClose, handleToggle, handleChange } = this;
    const { open, slideIndex, street } = this.state;
    const { paper, headline, bar } = styles;
    return (
      <div>
        <Drawer docked={false} open={open} onRequestChange={(open) => this.setState({open})} width={200}>
          <MenuItem onTouchTap={handleClose}>Menu Item</MenuItem>
          <MenuItem onTouchTap={handleClose}>Menu Item 2</MenuItem>
        </Drawer>
        <AppBar style={bar} zDepth={0} title="Street" onLeftIconButtonTouchTap={handleToggle} />
        <Toolbar style={bar}>
          <ToolbarGroup>
            <Tabs onChange={handleChange} value={slideIndex}>
              <Tab value={STREET} label="Street" />
              <Tab value={HOUSE_NUMBERS} label="House Numbers" />
              <Tab value={ROAD_OBJECTS} label="Road Objects" />
            </Tabs>
          </ToolbarGroup>
        </Toolbar>
        <SwipeableViews index={slideIndex} onChangeIndex={handleChange}>
          <Paper style={paper}>
            <h2 style={headline}>Tabs with slide effect</h2>
            Swipe to see the next slide.<br />
          </Paper>
          <Paper style={paper}>
            <HouseNumberList houseNumbers={street && street.houseNumbers} />
          </Paper>
          <Paper style={paper}>
            slide n°3
          </Paper>
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
