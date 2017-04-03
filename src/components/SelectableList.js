import React, { Component, PropTypes } from 'react';
import { List, makeSelectable } from 'material-ui/List';

const TempSelectableList = makeSelectable(List);

function wrapState(ComposedComponent) {
  return class SelectableList extends Component {
    static propTypes = {
      children: PropTypes.node.isRequired,
      defaultValue: PropTypes.number.isRequired,
    };

    componentWillMount() {
      this.setState({ selectedIndex: this.props.defaultValue });
    }

    handleRequestChange = (event, index) => this.setState({ selectedIndex: index });

    render() {
      return (
        <ComposedComponent value={this.state.selectedIndex} onChange={this.handleRequestChange}>
          {this.props.children}
        </ComposedComponent>
      );
    }
  };
}

const SelectableList = wrapState(TempSelectableList);

export default SelectableList;
