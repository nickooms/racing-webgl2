import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
// import Header from '../components/Header';
// import Button from '../components/Button';
import * as colors from 'material-ui/styles/colors';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
// import muiThemeable from 'material-ui/styles/muiThemeable';
import AppBar from '../components/AppBar';
// console.log("colors", colors);
const colorList = Object.keys(colors);
const color = colors[colorList[parseInt(Math.random() * colorList.length, 10)]];
console.log(darkBaseTheme);
console.log(color);

const muiTheme = getMuiTheme({
  palette: {
    accent2Color: color,
    textColor: color,
  },
  appBar: {
    height: 50,
  },
  button: Object.assign({}, darkBaseTheme.button),
});
console.log(muiTheme);

const App = ({ children }) => (
  <MuiThemeProvider muiTheme={muiTheme}>
    {/* <Header>
      <p>Welcome {name}</p>
      <Button>Change</Button>
    </Header>*/}
    <main>
      <AppBar title="My AppBar" />
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
