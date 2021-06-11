import React from 'react';
import PropTypes from 'prop-types';
import {
  getPropertyNameFragment,
  getPropertyDescriptionFragment,
} from '../../highlightHelper';
import Button from 'react-bootstrap/Button';
import DataDictionaryValuesTable from '../DataDictionaryValuesTable/.';
import './DataDictionaryPropertyTable.css';

class DataDictionaryPropertyTable extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      row_opened: {}
    };
  }

  componentDidMount() {
    let row_opened = {};
    Object.keys(this.props.properties).forEach(function(prop){
      row_opened[prop] = false;
    });
    this.setState({
      row_opened: row_opened
    });
  }
  
  closeTab = (prop) => {
    let row_opened = Object.assign({}, this.state.row_opened);
    row_opened[prop] = false;
    this.setState({row_opened});
  }

  openOrCloseValuesTable = (e, prop, hasValues) => {
    e.preventDefault();
    if(!hasValues){
      return;
    }
    let row_opened = Object.assign({}, this.state.row_opened);
    row_opened[prop] = !row_opened[prop];
    this.setState({row_opened});
  }
  

  render() {
    const borderModifier = this.props.hasBorder ? ''
      : 'data-dictionary-property-table--without-border';
    const propertyKeysList = this.props.hideIsRequired ? Object.keys(this.props.properties)
      : Object.keys(this.props.properties)
        .sort((k1, k2) => {
          const required1 = this.props.requiredProperties.includes(k1);
          const required2 = this.props.requiredProperties.includes(k2);
          if (required1) return -1;
          if (required2) return 1;
          return 0;
        });
    const needHighlightSearchResult = this.props.onlyShowMatchedProperties
      || this.props.needHighlightSearchResult;

    const matchedPropertiesSummary = needHighlightSearchResult
      ? this.props.matchedResult[this.props.nodeID]: {};

    const original_source = this.props.source.replace("_readonly","");
    const properties = matchedPropertiesSummary.props;
    const spanClassName = 'data-dictionary-property-table__span';
    

    return (
      <div className={`data-dictionary-property-table ${borderModifier}`}>
        <table className='data-dictionary-property-table__table'>
          <thead className='data-dictionary-property-table__head head-top-line'>
            <tr>
              <th
                className='data-dictionary-property-table__data sticky-table__head 
                data-dictionary-property-table__data--property'
              >
                Property
              </th>
              <th
                className='data-dictionary-property-table__data sticky-table__head type-col-width 
                data-dictionary-property-table__data--type'
              >
                Type
              </th>
              {
                !this.props.hideIsRequired && (
                  <th
                    className='data-dictionary-property-table__data sticky-table__head required-col-width 
                    data-dictionary-property-table__data--required'
                  >
                    Required
                  </th>
                )
              }
              <th
                className='data-dictionary-property-table__data sticky-table__head 
                data-dictionary-property-table__data--description'
              >
                Description
              </th>
              <th
                className='data-dictionary-property-table__data sticky-table__head 
                data-dictionary-property-table__data--term'
              >
                
              </th>
            </tr>
          </thead>
          <tbody>
            {
              this.props.onlyShowMatchedProperties? (
                
                Object.keys(properties).map((pKey) => {
                  let propertyNameFragment = [];
                  propertyNameFragment.push(
                    (
                      <div
                        key={pKey}
                        className={spanClassName} 
                        dangerouslySetInnerHTML={{__html: properties[pKey].title}}
                      >
                      </div>
                    ),
                  );

                  //let hasValues = properties[pKey].enum.length > 0;
                  let hasValues = properties[pKey].type === "enum";

                  let type = properties[pKey].type;

                  let propertyDescriptionFragment = [];
                  propertyDescriptionFragment.push(
                    (
                      <div
                        key={pKey}
                        className={spanClassName} 
                        dangerouslySetInnerHTML={{__html: properties[pKey].desc}}
                      >
                      </div>
                    ),
                  );

                  const isRequired = this.props.requiredProperties.includes(pKey);
                  
                  return (
                    <React.Fragment>
                      <tr key={pKey} className="data-dictionary-property-table__row" onClick={(e) => this.openOrCloseValuesTable(e, pKey, hasValues)}>
                        <td className='data-dictionary-property-table__data'>
                          {propertyNameFragment}
                        </td>
                        <td className='data-dictionary-property-table__data type-col-width'>
                        <p>{type}</p>
                        </td>
                        {
                          !this.props.hideIsRequired && (
                            <td className='data-dictionary-property-table__data'>
                              { isRequired ? (
                                <span className='data-dictionary-property-table__required'>
                                  <i className='g3-icon g3-icon--star data-dictionary-property-table__required-icon' />Required
                                </span>
                              ) : (
                                <span>No</span>
                              )
                              }
                            </td>
                          )
                        }
                        <td className='data-dictionary-property-table__data'>
                          {propertyDescriptionFragment}
                        </td>
                        <td className='data-dictionary-property-table__data' style={{textAlign: "center"}}>
                          {
                            hasValues ? (
                              <a href="/#" onClick={(e) => this.openOrCloseValuesTable(e, pKey)} >
                                {properties[pKey].hits.length + (properties[pKey].hits.length < 2 ? ' Value Matched' :' Values Matched')}
                              </a>
                              
                            ) : ""
                          }
                        </td>
                      </tr>
                      <DataDictionaryValuesTable
                       open={this.state.row_opened[pKey]} 
                       source={this.props.source}
                       category={this.props.category}
                       node={this.props.nodeID}
                       hits={properties[pKey].hits}
                       property={pKey}
                       hasValues={hasValues}
                       type="matched"
                       closeTab={this.closeTab}
                      />
                    </React.Fragment>
                  );

                })
              ): (
                propertyKeysList.map((propertyKey) => {
                  const property = this.props.properties[propertyKey];
                  let hasValues = false;
                  let nameMatch = null;
                  let descriptionMatch = null;
                  
                  if(original_source === 'gdc'){
                    hasValues = property.enum && property.enum.length > 0;
                  }
                  else if(original_source === 'ctdc' || original_source === 'icdc'){
                    hasValues = property.type && Array.isArray(property.type);
                  }
                  else if(original_source === 'pcdc'){
                    hasValues = property.type === "enum";
                  }
                  else{
                    hasValues = false;
                  }

                  let type='';

                  const propertyNameFragment = getPropertyNameFragment(
                    propertyKey,
                    nameMatch,
                    'data-dictionary-property-table__span',
                  );

                  if('type' in property){
                    try{
                      if(Array.isArray(property.type)){
                        type = "enum";
                      }
                      else if(typeof property.type === 'object'){
                        type = 'object';
                      }
                      else{
                        type = property.type;
                      }
                    }catch(err){}
                    
                  }
                  else{
                    if(property.enum && property.enum.length > 0){
                      type = 'enum';
                    }
                    else{
                      type = "";
                    }
                  }
                 
                  const propertyDescriptionFragment = getPropertyDescriptionFragment(
                    property,
                    descriptionMatch,
                    'data-dictionary-property-table__span',
                  );
                  const isRequired = this.props.requiredProperties.includes(propertyKey);
                  return (
                    <React.Fragment>
                      <tr key={propertyKey} className="data-dictionary-property-table__row" onClick={(e) => this.openOrCloseValuesTable(e, propertyKey, hasValues)}>
                        <td className='data-dictionary-property-table__data'>
                          {propertyNameFragment}
                        </td>
                        <td className='data-dictionary-property-table__data type-col-width'>
                        <p>{JSON.stringify(type)}</p>
                        </td>
                        {
                          !this.props.hideIsRequired && (
                            <td className='data-dictionary-property-table__data'>
                              { isRequired ? (
                                <span className='data-dictionary-property-table__required'>
                                  <i className='g3-icon g3-icon--star data-dictionary-property-table__required-icon' />Required
                                </span>
                              ) : (
                                <span>No</span>
                              )
                              }
                            </td>
                          )
                        }
                        <td className='data-dictionary-property-table__data'>
                        <p>{propertyDescriptionFragment}</p>
                        </td>
                        <td className='data-dictionary-property-table__data'>
                          {
                            hasValues ? (
                              <Button
                                className='data-dictionary-property-table__button'
                                onClick={(e) => this.openOrCloseValuesTable(e, propertyKey)}
                                type='button'
                              >
                              All Values
                              </Button>
                            ) : ""
                          }
                        </td>
                      </tr>
                      <DataDictionaryValuesTable 
                       open={this.state.row_opened[propertyKey]} 
                       source={this.props.source}
                       category={this.props.category}
                       node={this.props.nodeID}
                       property={propertyKey}
                       hasValues={hasValues}
                       type="all"
                       closeTab={this.closeTab}
                      />
                    </React.Fragment>
                  );
                })
              )
            }
          </tbody>
        </table>
      </div>
    );
  }
}

DataDictionaryPropertyTable.propTypes = {
  properties: PropTypes.object.isRequired,
  requiredProperties: PropTypes.array,
  hasBorder: PropTypes.bool,
  needHighlightSearchResult: PropTypes.bool,
  matchedResult: PropTypes.object,
  toggleValuesBox: PropTypes.func,
  toggleMatchedValuesBox: PropTypes.func,
  nodeID: PropTypes.string,
  category: PropTypes.string,
  source: PropTypes.string,
  hideIsRequired: PropTypes.bool,
  onlyShowMatchedProperties: PropTypes.bool,
};

DataDictionaryPropertyTable.defaultProps = {
  requiredProperties: [],
  hasBorder: true,
  needHighlightSearchResult: false,
  matchedResult: {},
  toggleValuesBox: () => {},
  toggleMatchedValuesBox: () => {},
  nodeID: "",
  category: "",
  source: "",
  hideIsRequired: false,
  onlyShowMatchedProperties: false,
};

export default DataDictionaryPropertyTable;
