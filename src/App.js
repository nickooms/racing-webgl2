import React, { Component } from 'react';
import Street from './Street';
import Colors from './Colors';
import './App.css';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import {fade} from 'material-ui/utils/colorManipulator';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import muiThemeable from 'material-ui/styles/muiThemeable';
import {Tabs, Tab} from 'material-ui/Tabs';
import * as colors from 'material-ui/styles/colors';

const mainColors = Object.keys(colors).filter(color => color.indexOf('600') > 0).map(color => color.replace('600', ''));
const {
  white, grey100, grey300, grey400, grey500, cyan500, darkBlack, fullBlack,
  orangeA200,
  purple500, purple700,
} = colors;
console.log(colors);
import SwipeableViews from 'react-swipeable-views';

console.log("darkBaseTheme", darkBaseTheme);
const muiTheme = getMuiTheme(Object.assign({}, darkBaseTheme, {
  palette: {
    primary1Color: purple500,
    primary2Color: purple700,
    primary3Color: grey400,
    accent1Color: orangeA200,
    accent2Color: grey100,
    accent3Color: grey500,
    canvasColor: white,
    borderColor: grey300,
    disabledColor: fade(darkBlack, 0.3),
    pickerHeaderColor: cyan500,
    clockCircleColor: fade(darkBlack, 0.07),
    shadowColor: fullBlack,
    //textColor: darkBaseTheme.palette.textColor,
    //alternateTextColor: darkBaseTheme.palette.alternateTextColor,
  },
  appBar: {
    height: 50,
  },
}));

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

class App extends Component {
  state = {
    street: { houseNumbers: [] },
    slideIndex: 0,
  };

  handleChange = (value) => {
    this.setState({
      slideIndex: value,
    });
  };

  async componentDidMount() {
    const response = await fetch('http://localhost:8080/street/7336');
    console.log("response", response);
    const street = await response.json();
    console.log(street);
    this.setState({ street });
  }

  render() {
    const { street, slideIndex } = this.state;
    // const { muiTheme } = this.props;
    // console.log("muiTheme.tabs.backgroundColor", muiTheme.palette.accent1Color);
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
          <Tabs onChange={this.handleChange} value={slideIndex}>
            <Tab label="Colors" value={0} />
            <Tab label="Street" value={1} />
            <Tab label="Tab Three" value={2} />
          </Tabs>
          <SwipeableViews index={slideIndex} onChangeIndex={this.handleChange}>
            <div style={styles.slide}>
              <h2 style={styles.headline}>Colors [{mainColors.length}]</h2>
              <Colors { ...{ colors: mainColors } } />
            </div>
            <div style={styles.slide}>
              <Street { ...{ street } } />
            </div>
            <div style={styles.slide}>
              slide n°3
            </div>
          </SwipeableViews>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default muiThemeable()(App);
