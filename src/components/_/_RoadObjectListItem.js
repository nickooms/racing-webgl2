import React, { PropTypes } from 'react';
import { TableRow, TableRowColumn } from 'material-ui/Table';
import muiThemeable from 'material-ui/styles/muiThemeable';
import './index.css';

const RoadObjectListItem = ({ id, selected }) => (
  <TableRow selected={selected}>
    <TableRowColumn>{id}</TableRowColumn>
  </TableRow>
);

RoadObjectListItem.propTypes = {
  id: PropTypes.number.isRequired,
  selected: PropTypes.bool.isRequired,
};

export default muiThemeable()(RoadObjectListItem);
