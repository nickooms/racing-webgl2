import React, { Component } from 'react';
import PropTypes from 'prop-types';
import fetch from 'isomorphic-fetch';
import muiThemeable from 'material-ui/styles/muiThemeable';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import { Card, CardTitle, CardMedia } from 'material-ui/Card';
import DrawerList from './DrawerList';
import BuildingSVG from './BuildingSVG';

const URL = 'http://localhost:8080/building';

class Building extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      id: props.params.buildingId,
      open: false,
      building: null,
    };
  }

  componentDidMount() {
    this.load(this.state.id);
  }

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
    const { handleClose, handleToggle, handleRequestChange } = this;
    const { open, building } = this.state;
    return (
      <div>
        <Drawer docked={false} open={open} onRequestChange={handleRequestChange} width={200}>
          <DrawerList handleClose={handleClose} />
        </Drawer>
        <AppBar zDepth={0} title="Building" onLeftIconButtonTouchTap={handleToggle} />
        <Card style={{ margin: 40 }} zDepth={2} initiallyExpanded>
          <CardMedia overlay={<CardTitle title="Building" subtitle={building && building.id} />}>
            <BuildingSVG building={building} />
          </CardMedia>
        </Card>
      </div>
    );
  }
}

Building.defaultProps = {
  params: { building: null },
};

Building.propTypes = {
  params: PropTypes.shape({
    buildingId: PropTypes.string,
  }),
};

export default muiThemeable()(Building);
