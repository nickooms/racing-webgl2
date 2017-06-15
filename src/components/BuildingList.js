import React from 'react';
import PropTypes from 'prop-types';
import muiThemeable from 'material-ui/styles/muiThemeable';
import { Card, CardTitle, CardText } from 'material-ui/Card';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import { Link } from 'react-router';
import { Star, StarBorder } from './Star';
import styles from './styles';
import './index.css';

const BuildingList = (props) => {
  const {
    buildings,
    style,
    muiTheme: {
      palette: {
        accent1Color: hoverColor,
        accent2Color: backgroundColor,
        accent3Color: color,
      },
    },
  } = props;
  return (
    <Card style={Object.assign(style, styles.card)} zDepth={2} initiallyExpanded>
      <CardTitle
        actAsExpander
        showExpandableButton
        title="Buildings"
        style={{ backgroundColor }}
      />
      <CardText expandable style={{ padding: 0 }}>
        <List>
          {buildings && buildings.map(({ id, favorite }) => (
            <Link key={id} to={`/building/${id}`} style={styles.link}>
              <ListItem
                primaryText={id}
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
};

BuildingList.defaultProps = {
  buildings: [],
  style: {},
  muiTheme: {},
};

BuildingList.propTypes = {
  buildings: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      favorite: PropTypes.bool,
    }),
  ),
  style: PropTypes.shape({}),
  muiTheme: PropTypes.shape({}),
};

export default muiThemeable()(BuildingList);
