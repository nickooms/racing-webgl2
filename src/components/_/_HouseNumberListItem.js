import React from 'react';
import PropTypes from 'prop-types';
import { TableRow, TableRowColumn } from 'material-ui/Table';
import muiThemeable from 'material-ui/styles/muiThemeable';
import './../index.css';

const HouseNumberListItem = ({ id, number, selected }) => (
  <TableRow selected={selected}>
    <TableRowColumn>{id}</TableRowColumn>
    <TableRowColumn>{number}</TableRowColumn>
  </TableRow>
);

HouseNumberListItem.propTypes = {
  id: PropTypes.number.isRequired,
  number: PropTypes.string.isRequired,
  selected: PropTypes.bool.isRequired,
};

export default muiThemeable()(HouseNumberListItem);
