import React from 'react';
import PropTypes from 'prop-types';
import DataDictionaryValuesTableBody from './DataDictionaryValuesTableBody';
import DataDictionaryValuesTableBodyMatched from './DataDictionaryValuesTableBodyMatched';
import './DataDictionaryValuesTable.css';

class DataDictionaryValuesTable extends React.Component {

  render() {
    if (!this.props.open) return (<React.Fragment />);

    if(this.props.type === 'all'){
      return (
        <tr className="values-row">
          <td colSpan="5" className="data-dictionary-property-table__data">
            <div className="data-dictionary-node__property">
              <span className="data-dictionary-node__property-close" onClick={() => this.props.closeTab(this.props.property)}>Close tab<i class="g3-icon g3-icon--cross data-dictionary-node__property-close-icon"></i></span>
              <DataDictionaryValuesTableBody 
                source={this.props.source}
                category={this.props.category}
                node={this.props.node}
                property={this.props.property}
              />
            </div>
          </td>
        </tr>
      );
    }
    else{
      return (
        <tr className="values-row">
          <td colSpan="5" className="data-dictionary-property-table__data">
            <div className="data-dictionary-node__property">
              <span className="data-dictionary-node__property-close" onClick={() => this.props.closeTab(this.props.property)}>Close tab<i class="g3-icon g3-icon--cross data-dictionary-node__property-close-icon"></i></span>
              <DataDictionaryValuesTableBodyMatched  
                source={this.props.source}
                category={this.props.category}
                node={this.props.node}
                property={this.props.property}
                hits={this.props.hits}
              />
            </div>
          </td>
        </tr>
      );
    }
  }
}

DataDictionaryValuesTable.propTypes = {
  open: PropTypes.bool,
  hits: PropTypes.array,
  source: PropTypes.string,
  category: PropTypes.string,
  node: PropTypes.string,
  property: PropTypes.string,
  hasValues: PropTypes.bool,
  type: PropTypes.string,
  closeTab: PropTypes.func,
};

DataDictionaryValuesTable.defaultProps = {
  open: false,
  hits: [],
  source: "",
  category: "",
  node: "",
  property: "",
  hasValues: false,
  type: "all",
  closeTab: () => {},
};

export default DataDictionaryValuesTable;