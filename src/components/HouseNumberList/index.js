import React, { PropTypes } from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow } from 'material-ui/Table';
import HouseNumberListItem from '../HouseNumberListItem';
import './../index.css';

injectTapEventPlugin();

const HouseNumberList = ({ houseNumbers }) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHeaderColumn>ID</TableHeaderColumn>
        <TableHeaderColumn>Number</TableHeaderColumn>
      </TableRow>
    </TableHeader>
    <TableBody>
      {houseNumbers && houseNumbers.map(({ id, number }) => (
        <HouseNumberListItem key={id} {...{ id, number }} />
      ))}
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
