import React, { Component, PropTypes } from 'react';
import fetch from 'isomorphic-fetch';
import muiThemeable from 'material-ui/styles/muiThemeable';
import AppBar from 'material-ui/AppBar';
import { Tabs, Tab } from 'material-ui/Tabs';
import Drawer from 'material-ui/Drawer';
import { Card, CardTitle, CardText } from 'material-ui/Card';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import SwipeableViews from 'react-swipeable-views';
import BuildingList from './BuildingList';
import PlotList from './PlotList';
import DrawerList from './DrawerList';

const URL = 'http://localhost:8080/housenumber';
const HOUSE_NUMBER = 0;
const BUILDINGS = 1;
const PLOTS = 2;

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
  bar: {
    height: 48,
  },
  text: {
    marginLeft: 20,
    height: 48,
  },
  card: {
    flex: 1,
  },
};

class HouseNumber extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      open: false,
      slideIndex: HOUSE_NUMBER,
      houseNumber: null,
      buildings: null,
      plots: null,
    };
  }

  componentDidMount() {
    this.load(1373962);
  }

  handleChange = value => this.setState({ slideIndex: value });

  handleToggle = () => this.setState({ open: !this.state.open });

  handleClose = () => this.setState({ open: false });

  handleRequestChange = open => this.setState({ open });

  get id() {
    return this.state.houseNumber.id;
  }

  async load(id) {
    const response = await fetch(`${URL}/${id}`);
    const houseNumber = await response.json();
    this.setState({ houseNumber });
  }

  loadBuildings = async () => {
    const response = await fetch(`${URL}/${this.id}/buildings`);
    const buildings = await response.json();
    this.setState({ buildings });
  };

  loadPlots = async () => {
    const response = await fetch(`${URL}/${this.id}/plots`);
    const plots = await response.json();
    this.setState({ plots });
  };

  render() {
    const { handleClose, handleToggle, handleChange, handleRequestChange } = this;
    const { open, slideIndex, houseNumber, buildings, plots } = this.state;
    const { bar } = styles;
    const { muiTheme: {
      palette: { accent2Color },
    } } = this.props;
    const cardTitle = { backgroundColor: accent2Color };
    return (
      <div>
        <Drawer docked={false} open={open} onRequestChange={handleRequestChange} width={200}>
          <DrawerList handleClose={handleClose} />
        </Drawer>
        <AppBar style={bar} zDepth={0} title="House Number" onLeftIconButtonTouchTap={handleToggle} />
        <Tabs onChange={handleChange} value={slideIndex}>
          <Tab value={HOUSE_NUMBER} label="House Number" />
          <Tab value={BUILDINGS} label="Buildings" onActive={this.loadBuildings} />
          <Tab value={PLOTS} label="Plots" onActive={this.loadPlots} />
        </Tabs>
        <SwipeableViews index={slideIndex} onChangeIndex={handleChange}>
          <Card style={{ margin: 40, width: 400 }} zDepth={2} initiallyExpanded>
            <CardTitle
              actAsExpander
              showExpandableButton
              title={houseNumber && houseNumber.number}
              style={cardTitle}
            />
            <CardText expandable style={{ padding: 0 }}>
              <List>
                <ListItem primaryText="ID" rightAvatar={<strong><br />{houseNumber && houseNumber.id}</strong>} />
                <Divider />
                <ListItem primaryText="Number" rightAvatar={<strong><br />{houseNumber && houseNumber.number}</strong>} />
                <Divider />
              </List>
            </CardText>
          </Card>
          <BuildingList houseNumber={houseNumber} buildings={buildings} />
          <PlotList houseNumber={houseNumber} plots={plots} />
        </SwipeableViews>
      </div>
    );
  }
}

HouseNumber.defaultProps = {
  muiTheme: {},
};

HouseNumber.propTypes = {
  muiTheme: PropTypes.shape({}),
};

export default muiThemeable()(HouseNumber);
