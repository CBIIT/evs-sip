import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import { apiGetPropertyValues  } from '../../../../../api';
import DataDictionaryValuesTableRows from './DataDictionaryValuesTableRows';
import './DataDictionaryValuesTable.css';

class DataDictionaryValuesTableBodyMatched extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      values: [],
      matched_show_all: false
    };
  }

  switchValuesList = (e) => {
    const matched_show_all = this.state.matched_show_all;
    this.setState({
      matched_show_all : !matched_show_all
    });
  }

  async componentDidMount() {
    let values = [];
    let original_source = this.props.source.replace("_readonly","");
    let rs = await apiGetPropertyValues(this.props.property + "/" + this.props.node + "/" + this.props.category + "/" + original_source);
    rs.forEach(function(item){
      let tmp = {};
      tmp.name = item.n;
      tmp.ncit = item.ncit ? item.ncit : [];
      tmp.syns = [];
      tmp.icdo = "";
      if(item.icdo){
        tmp.icdo = item.icdo.c;
      }
      tmp.matched = false;
      values.push(tmp);
    });

    //consolidate matched values
    this.props.hits.forEach((hit) => {
      let tmp = values[hit._nested.offset];
      tmp.matched = true;
      tmp.matched_fields = hit.highlight;
      if(tmp.matched_fields["enum.n"] || tmp.matched_fields["enum.n.have"]){
        tmp.name = tmp.matched_fields["enum.n"] || tmp.matched_fields["enum.n.have"];
      }
      if(tmp.matched_fields["enum.icdo.c"] || tmp.matched_fields["enum.icdo.have"]){
        tmp.icdo = tmp.matched_fields["enum.icdo.c"] || tmp.matched_fields["enum.icdo.have"][tmp.matched_fields["enum.icdo.have"].length -1];
      }
    });

    this.setState({
      values: values
    });
  }

  render() {
    const vs_html = this.state.values.map((v, index) => {
      let trClassName = "matched-row";
      if(v.matched){
        return (
          <DataDictionaryValuesTableRows trClassName={trClassName} name={v.name} icdo={v.icdo} syns={v.ncit} highlights={v.matched_fields} />
        );
      }
      else{
        trClassName = this.state.matched_show_all ? "display-row" : "hidden-row";
        return (
          <DataDictionaryValuesTableRows trClassName={trClassName} name={v.name} icdo={v.icdo} syns={v.ncit} />
        );
      }
    });
    
    return (
      <React.Fragment>
        <div class="data-dictionary-node__property-summary">
          <span>{this.props.hits.length + (this.props.hits.length < 2 ? ' Value Matched' :' Values Matched')} Out of {this.state.values.length} . </span>
          <Button
            className='data-dictionary-values-table__toggle-button'
            onClick={(e) => this.switchValuesList(e)}
            type='button'
          >
          {this.state.matched_show_all ? "Show Matched Values" : "Show All Values"}
          </Button>
        </div>
        <div class="data-dictionary-property-table ">
          <table class="data-dictionary-property-table__table">
            <thead class="data-dictionary-property-table__head">
              <tr class="data-dictionary-property-table__row">
                <th class="data-dictionary-property-table__data values-column">Values</th>
                <th class="data-dictionary-property-table__data icdo-column">ICD-O-3 Code</th>
                <th class="data-dictionary-property-table__data ncit-column">Mapped NCIt Code</th>
                <th class="data-dictionary-property-table__data syns-column">NCIt Preferred Term</th>
              </tr>
            </thead>
            <tbody>
              {vs_html}
              {this.props.hits.length === 0 && this.state.matched_show_all === false && 
                <tr className='display-row'>
                  <td className="data-dictionary-property-table__data table-row__no_values" colspan="4">No Matched Values</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </React.Fragment>
    );
  }
}

DataDictionaryValuesTableBodyMatched.propTypes = {
  property: PropTypes.string,
  node: PropTypes.string,
  category: PropTypes.string,
  source: PropTypes.string,
  hits: PropTypes.array
};

DataDictionaryValuesTableBodyMatched.defaultProps = {
  property: "",
  node: "",
  category: "",
  source: "",
  hits: []
};

export default DataDictionaryValuesTableBodyMatched;
