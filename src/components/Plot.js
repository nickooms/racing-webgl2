import React, { Component } from 'react';
import PropTypes from 'prop-types';
import fetch from 'isomorphic-fetch';
import muiThemeable from 'material-ui/styles/muiThemeable';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import { Card, CardTitle, CardMedia } from 'material-ui/Card';
import DrawerList from './DrawerList';
import PlotSVG from './PlotSVG';

const URL = 'http://localhost:8080/plot';

class Plot extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      id: props.params.plotId,
      open: false,
      plot: null,
    };
  }

  componentDidMount() {
    this.load(this.state.id);
  }

  handleToggle = () => this.setState({ open: !this.state.open });

  handleClose = () => this.setState({ open: false });

  handleRequestChange = open => this.setState({ open });

  get id() {
    return this.state.plot.id;
  }

  async load(id) {
    const response = await fetch(`${URL}/${id}`);
    const plot = await response.json();
    this.setState({ plot });
  }

  render() {
    const { handleClose, handleToggle, handleRequestChange } = this;
    const { open, plot } = this.state;
    return (
      <div>
        <Drawer docked={false} open={open} onRequestChange={handleRequestChange} width={200}>
          <DrawerList handleClose={handleClose} />
        </Drawer>
        <AppBar zDepth={0} title="Plot" onLeftIconButtonTouchTap={handleToggle} />
        <Card style={{ margin: 40 }} zDepth={2} initiallyExpanded>
          <CardMedia overlay={<CardTitle title="Plot" subtitle={plot && plot.id} />}>
            <PlotSVG plot={plot} />
          </CardMedia>
        </Card>
      </div>
    );
  }
}

Plot.defaultProps = {
  params: { plotId: null },
};

Plot.propTypes = {
  params: PropTypes.shape({
    plotId: PropTypes.number,
  }),
};

export default muiThemeable()(Plot);
