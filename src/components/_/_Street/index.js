import React, { Component, PropTypes } from 'react';
import fetch from 'isomorphic-fetch';
import muiThemeable from 'material-ui/styles/muiThemeable';
import AppBar from 'material-ui/AppBar';
import { Tabs, Tab } from 'material-ui/Tabs';
import Drawer from 'material-ui/Drawer';
import Paper from 'material-ui/Paper';
import { Card, CardTitle, CardText } from 'material-ui/Card';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import FlatButton from 'material-ui/FlatButton';
import SwipeableViews from 'react-swipeable-views';
import { Link } from 'react-router';
import HouseNumberList from '../HouseNumberList';
import RoadObjectList from '../RoadObjectList';
import DrawerList from '../DrawerList';
// import { withRouter } from 'react-router';

const URL = 'http://localhost:8080/street';
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
  },
  text: {
    marginLeft: 20,
    height: 48,
  },
  card: {
    flex: 1,
  },
};

class Street extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      open: false,
      slideIndex: STREET,
      street: null,
      houseNumbers: null,
      roadObjects: null,
      city: null,
    };
  }

  componentDidMount() {
    this.load(7338);
    // this.loadCity();
  }

  handleChange = value => this.setState({ slideIndex: value });

  handleToggle = () => this.setState({ open: !this.state.open });

  handleClose = () => this.setState({ open: false });

  handleRequestChange = open => this.setState({ open });

  get id() {
    return this.state.street.id;
  }

  async load(id) {
    const response = await fetch(`${URL}/${id}`);
    const street = await response.json();
    this.setState({ street });
    await this.loadCity();
  }

  loadHouseNumbers = async () => {
    const response = await fetch(`${URL}/${this.id}/housenumbers`);
    const houseNumbers = await response.json();
    this.setState({ houseNumbers });
  };

  loadRoadObjects = async () => {
    const response = await fetch(`${URL}/${this.id}/roadobjects`);
    const roadObjects = await response.json();
    this.setState({ roadObjects });
  };

  loadCity = async () => {
    const response = await fetch(`${URL}/${this.id}/city`);
    const city = await response.json();
    this.setState({ city });
  };

  openCity = () => {
    console.log(this.state.city);
    // this.props.router.location.replace(`/city/${this.state.city.id}`);
  }

  render() {
    const { handleClose, handleToggle, handleChange, handleRequestChange } = this;
    const { open, slideIndex, street, houseNumbers, roadObjects, city } = this.state;
    const { paper, bar } = styles;
    const { muiTheme: {
      palette: { alternateTextColor, primary1Color, accent2Color },
    } } = this.props;
    const flatButton = {
      color: alternateTextColor,
      backgroundColor: primary1Color,
      textDecoration: 'none',
    };
    const cardTitle = { backgroundColor: accent2Color };
    return (
      <div>
        <Drawer docked={false} open={open} onRequestChange={handleRequestChange} width={200}>
          <DrawerList handleClose={handleClose} />
        </Drawer>
        <AppBar style={bar} zDepth={0} title="Street" onLeftIconButtonTouchTap={handleToggle} />
        <Tabs onChange={handleChange} value={slideIndex}>
          <Tab value={STREET} label="Street" />
          <Tab value={HOUSE_NUMBERS} label="House Numbers" onActive={this.loadHouseNumbers} />
          <Tab value={ROAD_OBJECTS} label="Road Objects" onActive={this.loadRoadObjects} />
        </Tabs>
        <SwipeableViews index={slideIndex} onChangeIndex={handleChange}>
          <Card style={{ margin: 40, width: 400 }} zDepth={2} initiallyExpanded>
            <CardTitle
              actAsExpander
              showExpandableButton
              title={street && street.label}
              style={cardTitle}
            />
            <CardText expandable>
              <List>
                <ListItem primaryText="ID" rightAvatar={<strong><br />{street && street.id}</strong>} />
                <Divider />
                <ListItem primaryText="Name" rightAvatar={<strong><br />{street && street.name}</strong>} />
                <Divider />
                <ListItem
                  primaryText="City"
                  rightAvatar={city && city.name && city.id &&
                    <FlatButton label={<Link to={`/city/${city.id}`} style={flatButton}>{city.name}</Link>} style={flatButton} onTouchTap={this.openCity} />
                  }
                />
                <Divider />
              </List>
            </CardText>
          </Card>
          <Paper style={paper}>
            <HouseNumberList houseNumbers={houseNumbers} />
          </Paper>
          <Paper style={paper}>
            <RoadObjectList roadObjects={roadObjects} />
          </Paper>
        </SwipeableViews>
      </div>
    );
  }
}

Street.propTypes = {
  muiTheme: PropTypes.any,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default muiThemeable()(Street);
