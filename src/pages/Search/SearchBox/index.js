import { connect } from 'react-redux';
import SearchBox from './SearchBox'

import {
  setKeyword,
  setResult,
  setError,
  setMatchOptions, 
  setOptionsSearch,
  setDataSources,
  setSearchTerm,
  setIsLoading,
  setIsSearching
} from '../actions';

const ReduxSearchBox = (() => {
  const mapStateToProps = state => ({
    keyword: state.ddsearch.keyword,
    result: state.ddsearch.result,
    error: state.ddsearch.error,
    match: state.ddsearch.match,
    options: state.ddsearch.options,
    dataSources: state.ddsearch.dataSources,
    searchTerm: state.ddsearch.searchTerm,
    isLoading: state.ddsearch.isLoading,
    isSearching: state.ddsearch.isSearching,
  });

  const mapDispatchToProps = dispatch => ({
    setKeyword: keyword => dispatch(setKeyword(keyword)),
    setResult: result => dispatch(setResult(result)),
    setError: error => dispatch(setError(error)),
    setMatchOptions: match => dispatch(setMatchOptions(match)),
    setOptionsSearch: options => dispatch(setOptionsSearch(options)),
    setDataSources: dataSources => dispatch(setDataSources(dataSources)),
    setSearchTerm: searchTerm => dispatch(setSearchTerm(searchTerm)),
    setIsLoading: isLoading => dispatch(setIsLoading(isLoading)),
    setIsSearching: isSearching => dispatch(setIsSearching(isSearching)),
  });

  return connect(mapStateToProps, mapDispatchToProps)(SearchBox);
})();

export default ReduxSearchBox;
