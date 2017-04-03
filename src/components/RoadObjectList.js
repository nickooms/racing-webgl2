import React, { PropTypes } from 'react';
import muiThemeable from 'material-ui/styles/muiThemeable';
import { Card, CardTitle, CardText } from 'material-ui/Card';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import { Link } from 'react-router';
import { Star, StarBorder } from './Star';
import styles from './styles';
import './index.css';

const RoadObjectList = ({
  roadObjects,
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
      title="Road Objects"
      style={{ backgroundColor }}
    />
    <CardText expandable style={{ padding: 0 }}>
      <List>
        {roadObjects && roadObjects.map(({ id, favorite }) => (
          <Link key={id} to={`/roadobject/${id}`} style={styles.link}>
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

RoadObjectList.defaultProps = {
  roadObjects: [],
  muiTheme: {},
};

RoadObjectList.propTypes = {
  roadObjects: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      favorite: PropTypes.bool,
    }),
  ),
  muiTheme: PropTypes.shape({}),
};

export default muiThemeable()(RoadObjectList);
