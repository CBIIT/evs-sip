import { connect } from 'react-redux';
import Search from './Search'

import {
  setKeyword,
  setResult,
  setError,
  setDataSources,
  setIsLoading,
  setIsSearching
} from '../../Search/actions';

const ReduxSearch = (() => {
  const mapStateToProps = state => ({
    keyword: state.ddsearch.keyword,
    dataSources : state.ddsearch.dataSources
  });

  const mapDispatchToProps = dispatch => ({
    setKeyword: keyword => dispatch(setKeyword(keyword)),
    setResult: result => dispatch(setResult(result)),
    setError: error => dispatch(setError(error)),
    setDataSources: dataSources => dispatch(setDataSources(dataSources)),
    setIsLoading: isLoading => dispatch(setIsLoading(isLoading)),
    setIsSearching: isSearching => dispatch(setIsSearching(isSearching)),
  });

  return connect(mapStateToProps, mapDispatchToProps)(Search);
})();

export default ReduxSearch;
