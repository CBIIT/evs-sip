import React from 'react';
import PropTypes from 'prop-types';
import { getCategoryIconSVG, getCategoryColor } from '../../NodeCategories/helper';
import DataDictionaryPropertyTable from '../../table/DataDictionaryPropertyTable/.';
import './OverlayPropertyTable.css';

class OverlayPropertyTable extends React.Component {

  /**
   * Close the whole overlay property table
   */
  handleClose = () => {
    this.props.onCloseOverlayPropertyTable();
  };

  /**
   * Toggle the property tabl to display all properties
   */
  handleOpenAllProperties = () => {
    this.props.onOpenMatchedProperties();
  };

  /**
   * Toggle the property table to display matched properties only
   */
  handleDisplayOnlyMatchedProperties = () => {
    this.props.onCloseMatchedProperties();
  };

  render() {
    if (!this.props.node || this.props.hidden) return (<React.Fragment />);
    const IconSVG = getCategoryIconSVG(this.props.node.category.toLowerCase());
    const itemColor = getCategoryColor(this.props.node.category.toLowerCase());
    const searchedNodeNotOpened = this.props.isSearchMode && !this.props.isSearchResultNodeOpened;
    const needHighlightSearchResult = this.props.isSearchMode;
    return (
      <div className='overlay-property-table'>
        <div className='overlay-property-table__background' />
        <div className='overlay-property-table__fixed-container'>
          <div className='overlay-property-table__content'>
            <div className='overlay-property-table__header'>
              <div className='overlay-property-table__category'>
                <IconSVG fill={itemColor} className='overlay-property-table__category-icon' />
                <h4 className='overlay-property-table__category-text'>{this.props.node.category} / {this.props.node.id}</h4>
                <span
                  className='overlay-property-table__close'
                  onClick={this.handleClose}
                  onKeyPress={this.handleClose}
                  role='button'
                  tabIndex={0}
                >
                  Close
                  <i className='overlay-property-table__close-icon g3-icon g3-icon--cross g3-icon--sm' />
                </span>
                
              </div>
              
            </div>
            <div className='overlay-property-table__property'>
              <DataDictionaryPropertyTable
                properties={this.props.node.properties}
                requiredProperties={this.props.node.required}
                hasBorder={false}
                onlyShowMatchedProperties={searchedNodeNotOpened}
                needHighlightSearchResult={needHighlightSearchResult}
                hideIsRequired={searchedNodeNotOpened}
                matchedResult={this.props.matchedResult}
                nodeID={this.props.node.id}
                category={this.props.node.category}
                source={this.props.graphType}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

OverlayPropertyTable.propTypes = {
  hidden: PropTypes.bool,
  node: PropTypes.object,
  onCloseOverlayPropertyTable: PropTypes.func,
  isSearchMode: PropTypes.bool,
  matchedResult: PropTypes.object,
  onOpenMatchedProperties: PropTypes.func,
  onCloseMatchedProperties: PropTypes.func,
  isSearchResultNodeOpened: PropTypes.bool,
  graphType: PropTypes.string
};

OverlayPropertyTable.defaultProps = {
  hidden: true,
  node: null,
  onCloseOverlayPropertyTable: () => {},
  isSearchMode: false,
  matchedResult: {},
  onOpenMatchedProperties: () => {},
  onCloseMatchedProperties: () => {},
  isSearchResultNodeOpened: false,
  graphType: ''
};

export default OverlayPropertyTable;
