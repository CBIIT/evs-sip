import React from 'react';
import PropTypes from 'prop-types';
import ReduxGraphCalculator from '../GraphCalculator/.';
import ReduxLegend from '../Legend/.';
import ReduxCanvas from '../Canvas/.';
import ReduxGraphDrawer from '../GraphDrawer/.';
import ReduxNodeTooltip from '../NodeTooltip/.';
import ReduxNodePopup from '../NodePopup/.';
import ReduxOverlayPropertyTable from '../OverlayPropertyTable/.';
import ReduxActionLayer from '../ActionLayer/.';

class DataDictionaryGraph extends React.Component {
  render() {
    return (
      <React.Fragment>
        <ReduxGraphCalculator graphType={this.props.graphType}/>
        <ReduxLegend graphType={this.props.graphType}/>
        <ReduxCanvas graphType={this.props.graphType}>
          <ReduxGraphDrawer graphType={this.props.graphType}/>
        </ReduxCanvas>
        <ReduxNodeTooltip graphType={this.props.graphType}/>
        <ReduxNodePopup graphType={this.props.graphType}/>
        <ReduxOverlayPropertyTable graphType={this.props.graphType}/>
        <ReduxActionLayer onClearSearchResult={this.props.onClearSearchResult} graphType={this.props.graphType}/>
      </React.Fragment>
    );
  }
}

DataDictionaryGraph.propTypes = {
  onClearSearchResult: PropTypes.func,
};

DataDictionaryGraph.defaultProps = {
  onClearSearchResult: () => {},
};

export default DataDictionaryGraph;