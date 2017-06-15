import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, CardTitle, CardText } from 'material-ui/Card';
import muiThemeable from 'material-ui/styles/muiThemeable';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import { Link } from 'react-router';
import FlatButton from 'material-ui/FlatButton';

class StreetCard extends Component {
  openCity = () => ({})

  render() {
    const { street, city, muiTheme: { palette } } = this.props;
    if (!street) return null;
    return (
      <Card style={{ margin: 40, width: 400 }} zDepth={2} initiallyExpanded>
        <CardTitle
          actAsExpander
          showExpandableButton
          title={street && street.label}
          style={{ backgroundColor: palette.accent2Color }}
        />
        <CardText expandable style={{ padding: 0 }}>
          <List>
            <ListItem primaryText="ID" rightAvatar={<strong><br />{street && street.id}</strong>} />
            <Divider />
            <ListItem primaryText="Name" rightAvatar={<strong><br />{street && street.name}</strong>} />
            <Divider />
            <ListItem
              primaryText="City"
              rightAvatar={city && city.name && city.id &&
                <FlatButton
                  label={<Link
                    to={`/city/${city.id}`}
                    style={{ color: palette.alternateTextColor, backgroundColor: palette.primary1Color, textDecoration: 'none' }}
                  >{city.name}</Link>}
                  style={{ color: palette.alternateTextColor, backgroundColor: palette.primary1Color, textDecoration: 'none' }}
                  onTouchTap={this.openCity}
                />
              }
            />
            <Divider />
          </List>
        </CardText>
      </Card>
    );
  }
}

StreetCard.defaultProps = {
  street: null,
  city: null,
  muiTheme: { palette: {} },
};

StreetCard.propTypes = {
  street: PropTypes.shape({}),
  city: PropTypes.shape({}),
  muiTheme: PropTypes.shape({}),
};

export default muiThemeable()(StreetCard);
