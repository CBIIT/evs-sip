import { connect } from "react-redux";
import {
  initiateGraph,
  setSearchResult,
  saveCurrentProject,
} from "../../action.js";
import Legend from "./Legend";

const ReduxLegend = (() => {
  const mapStateToProps = (state, ownProps) => ({
    items: state.ddgraph[ownProps.graphType].legendItems,
    currentProject: state.ddgraph[ownProps.graphType].currentProject,
    graphType: ownProps.graphType,
    source: ownProps.source,
  });

  const mapDispatchToProps = (dispatch, ownProps) => ({
    onInitiateGraph: (dictionary) =>
      dispatch(initiateGraph(ownProps.graphType, dictionary)),
    onSearchResultUpdated: (result, summary) =>
      dispatch(setSearchResult(ownProps.graphType, result, summary)),
    onCurrentProjectUpdated: (currentProject) =>
      dispatch(saveCurrentProject(ownProps.graphType, currentProject)),
  });

  return connect(mapStateToProps, mapDispatchToProps)(Legend);
})();

export default ReduxLegend;
