import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
// import Header from '../components/Header';
// import Button from '../components/Button';
// import * as colors from 'material-ui/styles/colors';
import darkBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
// import muiThemeable from 'material-ui/styles/muiThemeable';
// import AppBar from '../components/AppBar';
// console.log("colors", colors);
// const colorList = Object.keys(colors);
// const color = colors[colorList[parseInt(Math.random() * colorList.length, 10)]];
// console.log(darkBaseTheme);
// console.log(color);
// const Citrus = [0xff6600, 0xc13b00, 0x5e6d70, 0x424e4f, 0x1b1d1d];
// const DragonflySun = [0x261822, 0x40152a, 0x731630, 0xcc1e2c, 0xff5434];
const muiTheme = getMuiTheme({
  palette: {
    accent1Color: darkBaseTheme.palette.accent1Color,
    accent2Color: darkBaseTheme.palette.accent2Color,
    accent3Color: darkBaseTheme.palette.accent3Color,
    textColor: darkBaseTheme.palette.textColor,
    canvasColor: darkBaseTheme.palette.canvasColor,
    primary1Color: darkBaseTheme.palette.primary1Color,
    primary2Color: darkBaseTheme.palette.primary2Color,
    primary3Color: darkBaseTheme.palette.primary3Color,
    borderColor: darkBaseTheme.palette.borderColor,
    alternateTextColor: darkBaseTheme.palette.alternateTextColor,
    secondaryTextColor: darkBaseTheme.palette.secondaryTextColor,
    disabledColor: darkBaseTheme.palette.disabledColor,
  },
  card: {
    titleColor: darkBaseTheme.palette.primary1Color,
  },
  // button: Object.assign({}, darkBaseTheme.button),
});
muiTheme.toolbar.backgroundColor = muiTheme.appBar.color;

const App = ({ children }) => (
  <MuiThemeProvider muiTheme={muiTheme}>
    {/* <Header>
      <p>Welcome {name}</p>
      <Button>Change</Button>
    </Header>*/}
    <main>
      {children}
    </main>
  </MuiThemeProvider>
);

App.propTypes = {
  children: PropTypes.node,
};

App.defaultProps = {
  children: null,
};

const onChange = () => dispatch => dispatch({ type: 'CHANGE' });

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onChange: dispatch(onChange()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
