import React from 'react';
import PropTypes from 'prop-types';
import './ActionLayer.css';

/**
* A layer over the graph.
* Put action buttons here.
*/
class ActionLayer extends React.Component {
  handleClearSearch = () => {
    this.props.onClearSearchResult();
  }

  render() {
    const found_match = Object.keys(this.props.matchedResult).length === 0 && this.props.graphType.indexOf('readonly') === -1;
    return (
      <div className={found_match ? 'action-layer__empty' : 'action-layer'}>
        {found_match? "Sorry, no results found." : ""}
      </div>
    );
  }
}

ActionLayer.propTypes = {
  isSearchMode: PropTypes.bool,
  onClearSearchResult: PropTypes.func,
};

ActionLayer.defaultProps = {
  isSearchMode: false,
  onClearSearchResult: () => {},
};

export default ActionLayer;
