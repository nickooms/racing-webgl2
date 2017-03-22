import React, { Component } from 'react';
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import muiThemeable from 'material-ui/styles/muiThemeable';

class HouseNumbers extends Component {
  render() {
    const { houseNumbers, muiTheme } = this.props;
    return (
      <List style={{ backgroundColor: muiTheme.palette.canvasColor }}>
        <Subheader style={{ color: muiTheme.palette.accent1Color }}>HouseNumbers [{houseNumbers.length}]</Subheader>
        {
          houseNumbers && houseNumbers.map(({ id, number }, index) => (
            <ListItem key={index} primaryText={number} style={{ color: muiTheme.palette.textColor }}/>
          ))
        }
      </List>
    );
  }
}

export default muiThemeable()(HouseNumbers);
