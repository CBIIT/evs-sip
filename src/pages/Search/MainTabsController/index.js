import { connect } from 'react-redux';
import MainTabsController from './MainTabsController'

const ReduxMainTabsController = (() => {
  const mapStateToProps = (state) => ({
    searchTerm: state.ddsearch.searchTerm,
    result: state.ddsearch.result,
    error: state.ddsearch.error,
  });

  return connect(mapStateToProps)(MainTabsController);
})();

export default ReduxMainTabsController;
