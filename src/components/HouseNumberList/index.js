import React, { PropTypes } from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow } from 'material-ui/Table';
import HouseNumberListItem from '../HouseNumberListItem';
import './../index.css';

injectTapEventPlugin();

const houseNumberListItems = houseNumbers =>
  houseNumbers && houseNumbers.map(({ id, number }, index) => (
    <HouseNumberListItem key={id} selected={index === 0} {...{ id, number }} />
  ));

const HouseNumberList = ({ houseNumbers }) => (
  <Table selectable multiSelectable allRowsSelected>
    <TableHeader adjustForCheckbox={true} displaySelectAll={true} enableSelectAll={true}>
      <TableRow>
        <TableHeaderColumn>ID</TableHeaderColumn>
        <TableHeaderColumn>Number</TableHeaderColumn>
      </TableRow>
    </TableHeader>
    <TableBody displayRowCheckbox showRowHover>
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
