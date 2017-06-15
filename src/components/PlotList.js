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

const PlotList = (props) => {
  const {
    plots,
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
        title="Plots"
        style={{ backgroundColor }}
      />
      <CardText expandable style={{ padding: 0 }}>
        <List>
          {plots && plots.map(({ id, favorite }) => (
            <Link key={id} to={`/plot/${id.replace('/', '_')}`} style={styles.link}>
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

PlotList.defaultProps = {
  plots: [],
  style: {},
  muiTheme: {},
};

PlotList.propTypes = {
  plots: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      favorite: PropTypes.bool,
    }),
  ),
  style: PropTypes.shape({}),
  muiTheme: PropTypes.shape({}),
};

export default muiThemeable()(PlotList);
