import { connect } from "react-redux";
import GraphCalculator from "./GraphCalculator";
import {
  setGraphLayout,
  setGraphLegend,
  setRelatedNodeIDs,
  setSecondHighlightingNodeCandidateIDs,
  setPathRelatedToSecondHighlightingNode,
  setDataModelStructure,
  resetGraphHighlight,
} from "../../action";

const ReduxGraphCalculator = (() => {
  const mapStateToProps = (state, ownProps) => ({
    graphType: ownProps.graphType,
    dictionary: state.submission["dictionary_" + ownProps.graphType],
    countsSearch: state.submission.counts_search,
    linksSearch: state.submission.links_search,
    highlightingNode: state.ddgraph[ownProps.graphType].highlightingNode,
    nodes: state.ddgraph[ownProps.graphType].nodes,
    edges: state.ddgraph[ownProps.graphType].edges,
    secondHighlightingNodeID:
      state.ddgraph[ownProps.graphType].secondHighlightingNodeID,
    layoutInitialized: state.ddgraph[ownProps.graphType].layoutInitialized,
  });

  const mapDispatchToProps = (dispatch, ownProps) => ({
    onGraphLayoutCalculated: (layout) =>
      dispatch(setGraphLayout(ownProps.graphType, layout)),
    onGraphLegendCalculated: (legendItems) =>
      dispatch(setGraphLegend(ownProps.graphType, legendItems)),
    onHighlightRelatedNodesCalculated: (relatedNodeIDs) =>
      dispatch(setRelatedNodeIDs(ownProps.graphType, relatedNodeIDs)),
    onSecondHighlightingNodeCandidateIDsCalculated: (
      secondHighlightingNodeCandidateIDs
    ) =>
      dispatch(
        setSecondHighlightingNodeCandidateIDs(
          ownProps.graphType,
          secondHighlightingNodeCandidateIDs
        )
      ),
    onPathRelatedToSecondHighlightingNodeCalculated: (
      pathRelatedToSecondHighlightingNode
    ) =>
      dispatch(
        setPathRelatedToSecondHighlightingNode(
          ownProps.graphType,
          pathRelatedToSecondHighlightingNode
        )
      ),
    onClearGraphHighlight: () =>
      dispatch(resetGraphHighlight(ownProps.graphType)),
    onDataModelStructureCalculated: (
      dataModelStructure,
      dataModelStructureRelatedNodeIDs,
      routesBetweenStartEndNodes
    ) =>
      dispatch(
        setDataModelStructure(
          ownProps.graphType,
          dataModelStructure,
          dataModelStructureRelatedNodeIDs,
          routesBetweenStartEndNodes
        )
      ),
  });

  return connect(mapStateToProps, mapDispatchToProps)(GraphCalculator);
})();

export default ReduxGraphCalculator;
