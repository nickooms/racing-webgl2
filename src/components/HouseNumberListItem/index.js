import React, { PropTypes } from 'react';
import { TableRow, TableRowColumn } from 'material-ui/Table';
import muiThemeable from 'material-ui/styles/muiThemeable';
import './../index.css';

const HouseNumberListItem = ({ id, number }) => (
  <TableRow>
    <TableRowColumn>{id}</TableRowColumn>
    <TableRowColumn>{number}</TableRowColumn>
  </TableRow>
);

HouseNumberListItem.propTypes = {
  id: PropTypes.number.isRequired,
  number: PropTypes.string.isRequired,
};

export default muiThemeable()(HouseNumberListItem);
