import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import './DataDictionaryValuesTable.css';

class DataDictionarySynonymsTable extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      show: false
    };
  }

  toggleTableHandler = (event) => {
    event.preventDefault();
    let show = this.state.show;
    this.setState({
      show: !show
    });
  };

  componentDidMount() {
    
  }

  render() {

    let pt = this.props.label;
    let highlights = this.props.highlights;

    highlights.forEach(function(hl){
      if(hl.replace(/<b>/g, '').replace(/<\/b>/g, '') === pt){
        pt = hl;
      }
    });

    if(!this.state.show){
      return (
        <div>
          <div className="pt-row">
            <div className="pt-data" dangerouslySetInnerHTML={{ __html: pt }}></div>
            <div className="pt-button">
              <div className="pt-toggle-icon" role="button" aria-label={this.state.show ? 'collapse' : 'expand'} tabIndex="0" onClick={this.toggleTableHandler}>
                {this.state.show
                  ? <FontAwesomeIcon icon={faMinus}/>
                  : <FontAwesomeIcon icon={faPlus}/>
                }
              </div>
            </div>
          </div>
        </div>
      );
    }

    this.props.syns.forEach(function(syn){
      highlights.forEach(function(hl){
        if(hl.replace(/<b>/g, '').replace(/<\/b>/g, '') === syn.n){
          syn.n = hl;
        }
      });
    });

    const tb = this.props.syns.map((syn, index) => {
      return (
        <tr key={index}>
          <td className="data-dictionary-property-table__data" dangerouslySetInnerHTML={{ __html: syn.n }}>
          </td>
          <td className="data-dictionary-property-table__data">
            {syn.src}
          </td>
          <td className="data-dictionary-property-table__data">
            {syn.t}
          </td>
        </tr>
      );
    });
    return (
      <div>
        <div className="pt-row">
          <div className="pt-data" dangerouslySetInnerHTML={{ __html: pt }}></div>
          <div className="pt-button">
            <a href="/#" onClick={this.toggleTableHandler}>
                {this.state.show
                  ? <FontAwesomeIcon icon={faMinus}/>
                  : <FontAwesomeIcon icon={faPlus}/>
                }
              </a>
          </div>
        </div>
        <div className="syns-area">
          <table className="syns-table table table-striped table-bordered table-hover">
            <thead>
              <tr>
                <th>Term</th>
                <th>Source</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {tb}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

DataDictionarySynonymsTable.propTypes = {
  label: PropTypes.string,
  syns: PropTypes.array,
  highlights: PropTypes.array,
};

DataDictionarySynonymsTable.defaultProps = {
  label: "",
  syns: [],
  highlights: [],
};

export default DataDictionarySynonymsTable;
