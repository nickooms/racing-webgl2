import React, { Component } from 'react';
import fetch from 'isomorphic-fetch';
import muiThemeable from 'material-ui/styles/muiThemeable';
import AppBar from 'material-ui/AppBar';
// import { Tabs, Tab } from 'material-ui/Tabs';
import Drawer from 'material-ui/Drawer';
import { Card, CardTitle, CardMedia } from 'material-ui/Card';
// import SwipeableViews from 'react-swipeable-views';
import DrawerList from './DrawerList';
import BuildingSVG from './BuildingSVG';

const URL = 'http://localhost:8080/building';
const BUILDING = 0;

const styles = {
  bar: {
    height: 48,
  },
};

class Building extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      open: false,
      slideIndex: BUILDING,
      building: null,
    };
  }

  componentDidMount() {
    this.load(1874906);
  }

  handleChange = value => this.setState({ slideIndex: value });

  handleToggle = () => this.setState({ open: !this.state.open });

  handleClose = () => this.setState({ open: false });

  handleRequestChange = open => this.setState({ open });

  get id() {
    return this.state.building.id;
  }

  async load(id) {
    const response = await fetch(`${URL}/${id}`);
    const building = await response.json();
    this.setState({ building });
  }

  render() {
    const { handleClose, handleToggle, /* handleChange,*/ handleRequestChange } = this;
    const { open, /* slideIndex,*/ building } = this.state;
    // const { bar } = styles;
    return (
      <div>
        <Drawer docked={false} open={open} onRequestChange={handleRequestChange} width={200}>
          <DrawerList handleClose={handleClose} />
        </Drawer>
        <AppBar zDepth={0} title="Building" onLeftIconButtonTouchTap={handleToggle} />
        {/* <Tabs onChange={handleChange} value={slideIndex}>
          <Tab value={BUILDING} label="Building" />
        </Tabs>
        <SwipeableViews index={slideIndex} onChangeIndex={handleChange}>*/}
        <Card style={{ margin: 40 }} zDepth={2} initiallyExpanded>
          <CardMedia overlay={<CardTitle title="Building" subtitle={building && building.id} />}>
            <BuildingSVG building={building} />
          </CardMedia>
        </Card>
        {/* </SwipeableViews>*/}
      </div>
    );
  }
}

export default muiThemeable()(Building);
