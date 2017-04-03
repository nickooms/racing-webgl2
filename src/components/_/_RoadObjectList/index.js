import React, { PropTypes } from 'react';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow } from 'material-ui/Table';
import RoadObjectListItem from '../RoadObjectListItem';
import './../index.css';

const roadObjectListItems = roadObjects =>
  roadObjects && roadObjects.map(({ id }) => (
    <RoadObjectListItem key={id} {...{ id }} />
  ));

const RoadObjectList = ({ roadObjects }) => (
  <Table>
    <TableHeader displaySelectAll={false}>
      <TableRow>
        <TableHeaderColumn>ID</TableHeaderColumn>
      </TableRow>
    </TableHeader>
    <TableBody displayRowCheckbox={false} showRowHover>
      {roadObjectListItems(roadObjects)}
    </TableBody>
  </Table>
);

RoadObjectList.defaultProps = {
  roadObjects: [],
};

RoadObjectList.propTypes = {
  roadObjects: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
    }),
  ),
};

export default RoadObjectList;
