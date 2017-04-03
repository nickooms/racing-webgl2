import React, { PropTypes } from 'react';
import { TableRow, TableRowColumn } from 'material-ui/Table';
import muiThemeable from 'material-ui/styles/muiThemeable';
import { Link } from 'react-router';
import './index.css';

const StreetListItem = ({ id, name, label, selected, muiTheme: {
    palette: { alternateTextColor, primary1Color, textColor },
  } }) => {
  const link = {
    color: textColor,
    // backgroundColor: primary1Color,
    textDecoration: 'none',
  };
  return (
    <TableRow selected={selected}>
      {[id, name, label].map(col => (
        <TableRowColumn>
          <Link style={link} to={`/street/${id}`}>{col}</Link>
        </TableRowColumn>),
      )}
    </TableRow>
  );
};

StreetListItem.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  selected: PropTypes.bool.isRequired,
};

export default muiThemeable()(StreetListItem);
