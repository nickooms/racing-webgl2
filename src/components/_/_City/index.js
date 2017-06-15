import React, { Component } from 'react';
import PropTypes from 'prop-types';
import fetch from 'isomorphic-fetch';
import muiThemeable from 'material-ui/styles/muiThemeable';
import AppBar from 'material-ui/AppBar';
import { Tabs, Tab } from 'material-ui/Tabs';
import Drawer from 'material-ui/Drawer';
import Paper from 'material-ui/Paper';
import { Card, CardTitle, CardText } from 'material-ui/Card';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
// import FlatButton from 'material-ui/FlatButton';
import SwipeableViews from 'react-swipeable-views';
// import HouseNumberList from '../HouseNumberList';
import StreetList from '../StreetList';
import DrawerList from '../DrawerList';

const URL = 'http://localhost:8080/city';
const CITY = 0;
const STREETS = 1;

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
  },
  text: {
    marginLeft: 20,
    height: 48,
  },
  card: {
    flex: 1,
  },
};

class City extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      open: false,
      slideIndex: CITY,
      city: null,
      streets: null,
    };
  }

  componentDidMount() {
    this.load(23);
  }

  handleChange = value => this.setState({ slideIndex: value });

  handleToggle = () => this.setState({ open: !this.state.open });

  handleClose = () => this.setState({ open: false });

  handleRequestChange = open => this.setState({ open });

  get id() {
    return this.state.city.id;
  }

  async load(id) {
    const response = await fetch(`${URL}/${id}`);
    const city = await response.json();
    this.setState({ city });
    // await this.loadGewest();
  }

  loadStreets = async () => {
    const response = await fetch(`${URL}/${this.id}/streets`);
    const streets = await response.json();
    this.setState({ streets });
  };

  render() {
    const { handleClose, handleToggle, handleChange, handleRequestChange } = this;
    const { open, slideIndex, city, streets } = this.state;
    const { paper, bar } = styles;
    const { muiTheme: {
      palette: { /* alternateTextColor, primary1Color,*/ accent2Color },
    } } = this.props;
    // const flatButton = { color: alternateTextColor, backgroundColor: primary1Color };
    const cardTitle = { backgroundColor: accent2Color };
    return (
      <div>
        <Drawer docked={false} open={open} onRequestChange={handleRequestChange} width={200}>
          <DrawerList handleClose={handleClose} />
        </Drawer>
        <AppBar style={bar} zDepth={0} title="City" onLeftIconButtonTouchTap={handleToggle} />
        <Tabs onChange={handleChange} value={slideIndex}>
          <Tab value={CITY} label="City" />
          <Tab value={STREETS} label="Streets" onActive={this.loadStreets} />
        </Tabs>
        <SwipeableViews index={slideIndex} onChangeIndex={handleChange}>
          <Card style={{ margin: 40, width: 400 }} zDepth={2} initiallyExpanded>
            <CardTitle
              actAsExpander
              showExpandableButton
              title={city && city.name}
              style={cardTitle}
            />
            <CardText expandable>
              <List>
                <ListItem primaryText="ID" rightAvatar={<strong><br />{city && city.id}</strong>} />
                <Divider />
                <ListItem primaryText="Name" rightAvatar={<strong><br />{city && city.name}</strong>} />
                <Divider />
              </List>
            </CardText>
          </Card>
          <StreetList streets={streets} />s
        </SwipeableViews>
      </div>
    );
  }
}

City.propTypes = {
  muiTheme: PropTypes.any,
};

export default muiThemeable()(City);
