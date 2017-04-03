import React, { PropTypes } from 'react';
import muiThemeable from 'material-ui/styles/muiThemeable';
import { Card, CardTitle, CardText } from 'material-ui/Card';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import { Link } from 'react-router';
import { Star, StarBorder } from './Star';
import styles from './styles';
import './index.css';

/* const styles = {
  card: {
    margin: 40,
    width: 400,
  },
  link: {
    textDecoration: 'none',
  },
  icon: {
    marginRight: 24,
  },
};*/

const HouseNumberList = ({
  houseNumbers,
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
      title="House Numbers"
      style={{ backgroundColor }}
    />
    <CardText expandable style={{ padding: 0 }}>
      <List>
        {houseNumbers && houseNumbers.map(({ id, number, favorite }) => (
          <Link key={id} to={`/housenumber/${id}`} style={styles.link}>
            <ListItem
              primaryText={number}
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

HouseNumberList.defaultProps = {
  houseNumbers: [],
  muiTheme: {},
};

HouseNumberList.propTypes = {
  houseNumbers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      number: PropTypes.string.isRequired,
      favorite: PropTypes.bool,
    }),
  ),
  muiTheme: PropTypes.shape({}),
};

export default muiThemeable()(HouseNumberList);
