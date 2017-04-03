import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { Card, CardTitle, CardText } from 'material-ui/Card';
import muiThemeable from 'material-ui/styles/muiThemeable';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import { Star, StarBorder } from './Star';
import styles from './styles';
import './index.css';

const StreetList = ({
  streets,
  muiTheme: {
    palette: {
      accent1Color: hoverColor,
      accent2Color: backgroundColor,
      accent3Color: color,
    },
  },
}) => (
  <Card style={styles.card} zDepth={2} initiallyExpanded>
    <CardTitle
      actAsExpander
      showExpandableButton
      title="Streets"
      style={{ backgroundColor }}
    />
    <CardText style={{ padding: 0 }} expandable>
      <List>
        {streets && streets.map(({ id, name, favorite }) => (
          <Link key={id} to={`/street/${id}`} style={styles.link}>
            <ListItem
              primaryText={name}
              rightIcon={
                favorite
                  ? <Star style={styles.icon} {...{ color, hoverColor }} />
                  : <StarBorder style={styles.icon} {...{ color, hoverColor }} />
              }
            />
            <Divider />
          </Link>
        ))}
      </List>
    </CardText>
  </Card>
);

StreetList.defaultProps = {
  streets: [],
  muiTheme: {},
};

StreetList.propTypes = {
  streets: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      favorite: PropTypes.bool,
    }),
  ),
  muiTheme: PropTypes.shape({}),
};

export default muiThemeable()(StreetList);
