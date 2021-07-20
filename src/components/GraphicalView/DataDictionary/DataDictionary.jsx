import React from 'react';
import PropTypes from 'prop-types';
import DataDictionaryGraph from './graph/DataDictionaryGraph/.';
import { apiGetGDCDictionary, apiGetICDCDictionary, apiGetCTDCDictionary, apiGetPCDCDictionary  } from '../../../api';
import { getSearchResult, getSearchSummary} from './search/DictionarySearcher/searchHelper'; 
import './DataDictionary.css';

class DataDictionary extends React.Component {
  constructor(props) {
    super(props);
    this.dictionarySearcherRef = React.createRef();
    this.state = {
      isSearchFinished: false,
    };
  }

  setGraphView = (isGraphView) => {
    this.props.onSetGraphView(isGraphView);
  };

  handleClearSearchResult = () => {
    this.dictionarySearcherRef.current.getWrappedInstance().launchClearSearchFromOutside();
  };

  async componentDidMount() {
    if(this.props.dictionary === null){
      let dict = {};
      if(this.props.graphType === 'gdc'){
        dict = await apiGetGDCDictionary();
      }
      else if(this.props.graphType === 'icdc'){
        dict = await apiGetICDCDictionary();
      }
      else if(this.props.graphType === 'ctdc'){
        dict = await apiGetCTDCDictionary();
      }
      else if(this.props.graphType === 'pcdc'){
        dict = await apiGetPCDCDictionary();
      }
      else if(this.props.graphType === 'gdc_readonly'){
        dict = await apiGetGDCDictionary();
      }
      else if(this.props.graphType === 'icdc_readonly'){
        dict = await apiGetICDCDictionary();
      }
      else if(this.props.graphType === 'ctdc_readonly'){
        dict = await apiGetCTDCDictionary();
      }
      else if(this.props.graphType === 'pcdc_readonly'){
        dict = await apiGetPCDCDictionary();
      }
      else{
        dict = await apiGetGDCDictionary();
      }
      this.props.onInitiateGraph(dict);
    }

    // resume search status after switching back from other pages
    /*
    if (this.props.keyword && this.props.graphType.indexOf('readonly') == -1 ) {
      this.search(this.props.keyword);
    }
    else{
      this.setState({
        isSearchFinished: true,
      });
    }
    */
    this.setState({
      isSearchFinished: true,
    });
  }

  search = (str) => {
    const result = getSearchResult(this.props.graphType , this.props.source);
    if (!result || result.length === 0) {
      this.props.onSearchResultUpdated([], []);
      return;
    }
    const summary = getSearchSummary(result);
    this.props.onSearchResultUpdated(result, summary);
  };

  render() {
    if(this.state.isSearchFinished){
      if(this.props.keyword && this.props.graphType.indexOf('readonly') === -1){
        this.search(this.props.keyword);
      }

      return (
        <div className='data-dictionary'>
          <div
            className='data-dictionary__main'
          >
            <div className='data-dictionary__graph'>
              <DataDictionaryGraph 
                graphType={this.props.graphType} source={this.props.source}
              />
            </div>
          </div>
        </div>
      );
    }
    else{
      return (
        <div className='data-dictionary'>
          <div
            className='data-dictionary__main'
          >
            <div className='data-dictionary__graph graph-loading-info'>
              <div class="lds-ellipsis">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
              
            </div>
          </div>
        </div>
      );
    }
    
  }
}

DataDictionary.propTypes = {
  onSetGraphView: PropTypes.func,
  onInitiateGraph: PropTypes.func,
  onSearchResultUpdated: PropTypes.func,
  isGraphView: PropTypes.bool,
  graphType: PropTypes.string,
  keyword: PropTypes.string,
  source: PropTypes.object,
  dictionary: PropTypes.object,
};

DataDictionary.defaultProps = {
  onSetGraphView: () => {},
  onInitiateGraph: () => {},
  onSearchResultUpdated: () => {},
  isGraphView: false,
  graphType: "gdc",
  keyword: "",
  source: [],
  dictionary: null,
};


export default DataDictionary;
