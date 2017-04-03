import React, { PropTypes } from 'react';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow } from 'material-ui/Table';
import HouseNumberListItem from '../HouseNumberListItem';
import './../index.css';

const houseNumberListItems = houseNumbers =>
  houseNumbers && houseNumbers.map(({ id, number }) => (
    <HouseNumberListItem key={id} {...{ id, number }} />
  ));

const HouseNumberList = ({ houseNumbers }) => (
  <Table>
    <TableHeader displaySelectAll={false}>
      <TableRow>
        <TableHeaderColumn>ID</TableHeaderColumn>
        <TableHeaderColumn>Number</TableHeaderColumn>
      </TableRow>
    </TableHeader>
    <TableBody displayRowCheckbox={false} showRowHover>
      {houseNumberListItems(houseNumbers)}
    </TableBody>
  </Table>
);

HouseNumberList.defaultProps = {
  houseNumbers: [],
};

HouseNumberList.propTypes = {
  houseNumbers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      number: PropTypes.string.isRequired,
    }),
  ),
};

export default HouseNumberList;
