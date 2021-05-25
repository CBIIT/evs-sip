export const initiateGraph = (graphType, dictionary) => ({
  type: "RECEIVE_DICTIONARY_" + graphType.toUpperCase(),
  graphType: graphType,
  dictionary: dictionary,
});

export const clickBlankSpace = (graphType) => ({
  type: "GRAPH_CLICK_BLANK_SPACE",
  graphType: graphType,
});

export const setCanvasBoundingRect = (graphType, canvasBoundingRect) => ({
  type: "GRAPH_UPDATE_CANVAS_BOUNDING_RECT",
  graphType: graphType,
  canvasBoundingRect: canvasBoundingRect,
});

export const setSecondHighlightingNodeCandidateIDs = (
  graphType,
  secondHighlightingNodeCandidateIDs
) => ({
  type: "GRAPH_UPDATE_SECOND_HIGHLIGHTING_NODE_CANDIDATES",
  graphType: graphType,
  secondHighlightingNodeCandidateIDs: secondHighlightingNodeCandidateIDs,
});

export const setPathRelatedToSecondHighlightingNode = (
  graphType,
  pathRelatedToSecondHighlightingNode
) => ({
  type: "GRAPH_UPDATE_PATH_RELATED_TO_SECOND_HIGHLIGHTING_NODE",
  graphType: graphType,
  pathRelatedToSecondHighlightingNode: pathRelatedToSecondHighlightingNode,
});

export const setDataModelStructure = (
  graphType,
  dataModelStructure,
  dataModelStructureRelatedNodeIDs,
  routesBetweenStartEndNodes
) => ({
  type: "GRAPH_UPDATE_DATA_MODEL_STRUCTURE",
  graphType: graphType,
  dataModelStructure: dataModelStructure,
  dataModelStructureRelatedNodeIDs: dataModelStructureRelatedNodeIDs,
  routesBetweenStartEndNodes: routesBetweenStartEndNodes,
});

export const setRelatedNodeIDs = (graphType, relatedNodeIDs) => ({
  type: "GRAPH_UPDATE_RELATED_HIGHLIGHTING_NODE",
  graphType: graphType,
  relatedNodeIDs: relatedNodeIDs,
});

export const setGraphLayout = (graphType, layout) => ({
  type: "GRAPH_LAYOUT_CALCULATED",
  graphType: graphType,
  nodes: layout.nodes,
  edges: layout.edges,
  graphBoundingBox: layout.graphBoundingBox,
});

export const setGraphLegend = (graphType, legendItems) => ({
  type: "GRAPH_LEGEND_CALCULATED",
  graphType: graphType,
  legendItems: legendItems,
});

export const hoverNode = (graphType, nodeID) => ({
  type: "GRAPH_UPDATE_HOVERING_NODE",
  graphType: graphType,
  nodeID: nodeID,
});

export const clickNode = (graphType, nodeID) => ({
  type: "GRAPH_CLICK_NODE",
  graphType: graphType,
  nodeID: nodeID,
});

export const resetGraphHighlight = (graphType) => ({
  type: "GRAPH_RESET_HIGHLIGHT",
  graphType: graphType,
});

export const setOverlayPropertyTableHidden = (graphType, isHidden) => ({
  type: "GRAPH_SET_OVERLAY_PROPERTY_TABLE_HIDDEN",
  graphType: graphType,
  isHidden: isHidden,
});

export const setExpandNode = (graphType, nodeID) => ({
  type: "TABLE_EXPAND_NODE",
  graphType: graphType,
  nodeID: nodeID,
});

export const setGraphView = (graphType, isGraphView) => ({
  type: "TOGGLE_GRAPH_TABLE_VIEW",
  graphType: graphType,
  isGraphView: isGraphView,
});

export const setNeedReset = (graphType, needReset) => ({
  type: "GRAPH_CANVAS_RESET_REQUIRED",
  graphType: graphType,
  needReset: needReset,
});

export const setIsSearching = (graphType, isSearching) => ({
  type: "SEARCH_SET_IS_SEARCHING_STATUS",
  graphType: graphType,
  isSearching: isSearching,
});

export const setSearchResult = (
  graphType,
  searchResult,
  searchResultSummary
) => ({
  type: "SEARCH_RESULT_UPDATED",
  graphType: graphType,
  searchResult: searchResult,
  searchResultSummary: searchResultSummary,
});

export const clearSearchHistoryItems = (graphType) => ({
  type: "SEARCH_CLEAR_HISTORY",
  graphType: graphType,
});

export const addSearchHistoryItem = (graphType, searchHistoryItem) => ({
  type: "SEARCH_HISTORY_ITEM_CREATED",
  graphType: graphType,
  searchHistoryItem: searchHistoryItem,
});

export const setGraphNodesSVGElements = (graphType, graphNodesSVGElements) => ({
  type: "GRAPH_NODES_SVG_ELEMENTS_UPDATED",
  graphType: graphType,
  graphNodesSVGElements: graphNodesSVGElements,
});

export const clearSearchResult = (graphType) => ({
  type: "SEARCH_RESULT_CLEARED",
  graphType: graphType,
});

export const saveCurrentSearchKeyword = (graphType, keyword) => ({
  type: "SEARCH_SAVE_CURRENT_KEYWORD",
  graphType: graphType,
  keyword: keyword,
});

export const setHighlightingMatchedNodeOpened = (graphType, opened) => ({
  type: "GRAPH_MATCHED_NODE_OPENED",
  graphType: graphType,
  opened: opened,
});

export const saveCurrentProject = (graphType, currentProject) => ({
  type: "GRAPH_SAVE_CURRENT_PROJECT",
  graphType: graphType,
  currentProject: currentProject,
});
