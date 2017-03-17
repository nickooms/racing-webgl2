import React, { Component } from 'react';
import { List, ListItem } from 'material-ui/List';
import muiThemeable from 'material-ui/styles/muiThemeable';
import * as allColors from 'material-ui/styles/colors';

class Colors extends Component {
  render() {
    const { colors, muiTheme } = this.props;
    return (
      <List style={{ backgroundColor: muiTheme.palette.canvasColor }}>
        {
          colors && colors.map((color, index) => (
            <ListItem key={index} primaryText={color.substr(0, 1).toUpperCase() + color.slice(1)} style={{ backgroundColor: allColors[`${colors[index]}600`] }}/>
          ))
        }
      </List>
    );
  }
}

export default muiThemeable()(Colors);
