import React, { PropTypes } from 'react';
import muiThemeable from 'material-ui/styles/muiThemeable';
// import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow } from 'material-ui/Table';
import { Link } from 'react-router';
import { List, ListItem } from 'material-ui/List';
import { Card, CardTitle, CardText } from 'material-ui/Card';
import Divider from 'material-ui/Divider';
// import ActionGrade from 'material-ui/svg-icons/action/grade';
// import StreetListItem from '../StreetListItem';
import './../index.css';

/* const streetListItems = streets =>
  streets && streets.map(({ id, name, label }) => (
    <StreetListItem key={id} {...{ id, name, label }} />
  ));*/
const Starred = ({ color }) => (
  <svg
    viewBox="0 0 24 24"
    style={{
      display: 'block',
      color,
      fill: color,
      height: 24,
      width: 24,
      userSelect: 'none',
      transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
      position: 'absolute',
      top: 0,
      margin: 12,
      right: 4,
    }}
  >
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);

// secondaryText={`[${id}]`}
const StreetList = ({ city = { name: 'Stabroek' }, streets, muiTheme: {
    palette: { accent1Color, accent2Color, primary1Color },
  } }) => (
    <Card style={{ margin: 40, width: 400 }} zDepth={2} initiallyExpanded>
      <CardTitle
        actAsExpander
        showExpandableButton
        title={`Streets [${city.name}]`}
        style={{ backgroundColor: accent2Color }}
      />
      <CardText expandable style={{ padding: 0 }}>
        <List>
          {streets && streets.map(({ id, name }) => (
            <Link to={`/street/${id}`} style={{ textDecoration: 'none' }}>
              <ListItem primaryText={name} rightIcon={<Starred onTouchTap={() => StreetList.starred()} color={accent2Color} />} />
              <Divider />
            </Link>
          ))}
        </List>
      </CardText>
    </Card>
  );

/* const StreetList = ({ streets }) => (
  <Table>
    <TableHeader displaySelectAll={false}>
      <TableRow>
        <TableHeaderColumn>ID</TableHeaderColumn>
        <TableHeaderColumn>Name</TableHeaderColumn>
        <TableHeaderColumn>Label</TableHeaderColumn>
      </TableRow>
    </TableHeader>
    <TableBody displayRowCheckbox={false} showRowHover>
      {streetListItems(streets)}
    </TableBody>
  </Table>
);*/
StreetList.starred = () => {
  // sthis.starred = !this.starred;
};

StreetList.defaultProps = {
  streets: [],
};

StreetList.propTypes = {
  streets: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ),
};

export default muiThemeable()(StreetList);
