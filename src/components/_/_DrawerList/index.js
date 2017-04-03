import React, { PropTypes } from 'react';
import { ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import { Link } from 'react-router';
import SelectableList from '../SelectableList';

const DrawerList = ({ handleClose, value }) => (
  <SelectableList defaultValue={1}>
    <Subheader>Geospatial Objects</Subheader>
    <ListItem
      value={1}
      primaryText="Cities"
      onTouchTap={handleClose}
      initiallyOpen={[1, 2].includes(value)}
      nestedItems={[
        <ListItem
          value={2}
          primaryText={<Link to="/city/23">City</Link>}
          onTouchTap={handleClose}
        />,
      ]}
    />
    <ListItem
      value={3}
      primaryText="Streets"
      onTouchTap={handleClose}
      initiallyOpen={[3, 4].includes(value)}
      nestedItems={[
        <ListItem value={4} primaryText="Street" onTouchTap={handleClose} />,
      ]}
    />
    <ListItem
      value={5}
      primaryText="House Numbers"
      onTouchTap={handleClose}
      initiallyOpen={[5, 6].includes(value)}
      nestedItems={[
        <ListItem value={6} primaryText="House Number" onTouchTap={handleClose} />,
      ]}
    />
  </SelectableList>
);

DrawerList.defaultProps = {
  value: 1,
  handleClose: () => {},
};

DrawerList.propTypes = {
  value: PropTypes.number,
  handleClose: PropTypes.func,
};

export default DrawerList;
