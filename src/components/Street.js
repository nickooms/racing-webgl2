import React, { Component } from 'react';
import fetch from 'isomorphic-fetch';
import muiThemeable from 'material-ui/styles/muiThemeable';
import AppBar from 'material-ui/AppBar';
import { Tabs, Tab } from 'material-ui/Tabs';
import Drawer from 'material-ui/Drawer';
import SwipeableViews from 'react-swipeable-views';
import HouseNumberList from './HouseNumberList';
import BuildingsView from './BuildingsView';
import Plots from './Plots';
import RoadObjectsView from './RoadObjectsView';
import RoadSegmentsView from './RoadSegmentsView';
import DrawerList from './DrawerList';
import StreetView from './StreetView';

const LOADER = Symbol('Loader');
const URL = 'http://localhost:8080/street';
const STREET = 0;
const HOUSE_NUMBERS = 1;
const BUILDINGS = 2;
const PLOTS = 3;
const ROAD_OBJECTS = 4;
const ROAD_SEGMENTS = 5;

class Street extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      open: false,
      tabIndex: STREET,
      street: null,
      houseNumbers: null,
      buildings: null,
      plots: null,
      roadObjects: null,
      roadSegments: null,
      city: null,
    };
  }

  componentDidMount = () => this.load(7338);

  URL = URL;

  handleChange = tabIndex => this.setState({ tabIndex });

  handleToggle = () => this.setState({ open: !this.state.open });

  handleClose = () => this.setState({ open: false });

  handleRequestChange = open => this.setState({ open });

  get id() {
    return this.state.id;
  }

  set id(id) {
    this.setState({ id });
  }

  [LOADER] = async (url) => {
    const response = await fetch(url);
    const json = await response.json();
    return json;
  };

  loadUrl = url => async () => {
    this.setState({ [url]: await this[LOADER](`${URL}/${this.id}/${url.toLowerCase()}`) });
  }

  load = async (id) => {
    this.setState({ id, street: await this[LOADER](`${URL}/${id}`) });
    await this.loadCity();
  };

  loadHouseNumbers = this.loadUrl('houseNumbers');

  loadBuildings = this.loadUrl('buildings');

  loadPlots = this.loadUrl('plots');

  loadRoadObjects = this.loadUrl('roadObjects');

  loadRoadSegments = this.loadUrl('roadSegments');

  loadCity = this.loadUrl('city');

  render() {
    const { handleClose, handleToggle, handleChange, handleRequestChange } = this;
    const {
      open,
      tabIndex,
      street,
      city,
      houseNumbers,
      buildings,
      plots,
      roadObjects,
      roadSegments,
    } = this.state;
    return (
      <div>
        <Drawer docked={false} open={open} onRequestChange={handleRequestChange} width={200}>
          <DrawerList handleClose={handleClose} />
        </Drawer>
        <AppBar title="Street" style={{ height: 48 }} zDepth={0} onLeftIconButtonTouchTap={handleToggle} />
        <Tabs value={tabIndex} onChange={handleChange}>
          <Tab label="Street" value={STREET} />
          <Tab label="House Numbers" value={HOUSE_NUMBERS} onActive={this.loadHouseNumbers} />
          <Tab label="Buildings" value={BUILDINGS} onActive={this.loadBuildings} />
          <Tab label="Plots" value={PLOTS} onActive={this.loadPlots} />
          <Tab label="Road Objects" value={ROAD_OBJECTS} onActive={this.loadRoadObjects} />
          <Tab label="Road Segments" value={ROAD_SEGMENTS} onActive={this.loadRoadSegments} />
        </Tabs>
        <SwipeableViews index={tabIndex} onChangeIndex={handleChange}>
          <StreetView {...{ street, city, buildings, plots, roadObjects, roadSegments }} />
          <HouseNumberList {...{ street, houseNumbers }} />
          <BuildingsView {...{ street, buildings }} />
          <Plots {...{ street, plots }} />
          <RoadObjectsView {...{ street, roadObjects }} />
          <RoadSegmentsView {...{ street, roadSegments }} />
        </SwipeableViews>
      </div>
    );
  }
}

export default muiThemeable()(Street);
