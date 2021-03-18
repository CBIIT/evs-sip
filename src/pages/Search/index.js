import { connect } from 'react-redux';
import Search from './Search'

const ReduxSearch = (() => {
  const mapStateToProps = state => ({
    keyword: '',
    results: {},
  });

  const mapDispatchToProps = dispatch => ({
    // setIsSearching: isSearching => dispatch(setIsSearching(isSearching)),
    // onSearchResultUpdated: (result, summary) => dispatch(setSearchResult(result, summary)),
    // onSearchHistoryItemCreated: searchHistoryItem =>
    //   dispatch(addSearchHistoryItem(searchHistoryItem)),
    // onSearchResultCleared: () => dispatch(clearSearchResult()),
    // onSaveCurrentSearchKeyword: keyword => dispatch(saveCurrentSearchKeyword(keyword)),
    // onStartSearching: () => dispatch(resetGraphHighlight()),
  });

  return connect(mapStateToProps, mapDispatchToProps)(Search);
})();

export default ReduxSearch;
