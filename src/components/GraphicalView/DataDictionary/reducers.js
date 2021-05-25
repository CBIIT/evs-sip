import {
  getSearchHistoryItems,
  clearSearchHistoryItems,
  addSearchHistoryItems,
} from "./utils";

const ddgraphInitialState = {
  isGraphView: true,
  layoutInitialized: false,
  nodes: [],
  edges: [],
  graphBoundingBox: [],
  legendItems: [],
  hoveringNode: null,
  highlightingNode: null,
  relatedNodeIDs: [],
  secondHighlightingNodeID: null,
  dataModelStructure: null,
  overlayPropertyHidden: true,
  canvasBoundingRect: { top: 0, left: 0 },
  needReset: false,
  tableExpandNodeID: null,
  searchHistoryItems: getSearchHistoryItems(),
  graphNodesSVGElements: null,
  currentSearchKeyword: "",
  searchResult: [],
  matchedNodeIDs: [],
  matchedNodeIDsInProperties: [],
  matchedNodeIDsInNameAndDescription: [],
  isSearchMode: false,
  isSearching: false,
  highlightingMatchedNodeID: null,
  highlightingMatchedNodeOpened: false,
  currentProject: "",
};

const ddgraphsInitialState = {};
ddgraphsInitialState.gdc = ddgraphInitialState;
ddgraphsInitialState.icdc = ddgraphInitialState;
ddgraphsInitialState.ctdc = ddgraphInitialState;
ddgraphsInitialState.pcdc = ddgraphInitialState;
ddgraphsInitialState.gdc_readonly = ddgraphInitialState;
ddgraphsInitialState.icdc_readonly = ddgraphInitialState;
ddgraphsInitialState.ctdc_readonly = ddgraphInitialState;
ddgraphsInitialState.pcdc_readonly = ddgraphInitialState;

const generateState = (state, graphType, toUpdate) => {
  switch (graphType) {
    case "icdc": {
      return {
        ...state,
        icdc: { ...state.icdc, ...toUpdate },
      };
    }
    case "ctdc": {
      return {
        ...state,
        ctdc: { ...state.ctdc, ...toUpdate },
      };
    }
    case "pcdc": {
      return {
        ...state,
        pcdc: { ...state.pcdc, ...toUpdate },
      };
    }
    case "gdc_readonly": {
      return {
        ...state,
        gdc_readonly: { ...state.gdc_readonly, ...toUpdate },
      };
    }
    case "icdc_readonly": {
      return {
        ...state,
        icdc_readonly: { ...state.icdc_readonly, ...toUpdate },
      };
    }
    case "ctdc_readonly": {
      return {
        ...state,
        ctdc_readonly: { ...state.ctdc_readonly, ...toUpdate },
      };
    }
    case "pcdc_readonly": {
      return {
        ...state,
        pcdc_readonly: { ...state.pcdc_readonly, ...toUpdate },
      };
    }
    default:
      return {
        ...state,
        gdc: { ...state.gdc, ...toUpdate },
      };
  }
};

const ddgraph = (state = ddgraphsInitialState, action) => {
  switch (action.type) {
    case "TOGGLE_GRAPH_TABLE_VIEW": {
      let toUpdate = {
        isGraphView: action.isGraphView,
        overlayPropertyHidden: true,
      };

      return generateState(state, action.graphType, toUpdate);
    }
    case "GRAPH_LAYOUT_CALCULATED": {
      let toUpdate = {
        nodes: action.nodes,
        edges: action.edges,
        graphBoundingBox: action.graphBoundingBox,
        layoutInitialized: true,
      };

      return generateState(state, action.graphType, toUpdate);
    }
    case "GRAPH_LEGEND_CALCULATED": {
      let toUpdate = {
        legendItems: action.legendItems,
      };

      return generateState(state, action.graphType, toUpdate);
    }
    case "GRAPH_UPDATE_HOVERING_NODE": {
      const newHoveringNode = state[action.graphType].nodes.find(
        (n) => n.id === action.nodeID
      );
      let toUpdate = {
        hoveringNode: newHoveringNode,
      };

      return generateState(state, action.graphType, toUpdate);
    }
    case "GRAPH_UPDATE_CANVAS_BOUNDING_RECT": {
      let toUpdate = {
        canvasBoundingRect: action.canvasBoundingRect,
      };

      return generateState(state, action.graphType, toUpdate);
    }
    case "GRAPH_UPDATE_RELATED_HIGHLIGHTING_NODE": {
      let toUpdate = {
        relatedNodeIDs: action.relatedNodeIDs,
      };

      return generateState(state, action.graphType, toUpdate);
    }
    case "GRAPH_UPDATE_SECOND_HIGHLIGHTING_NODE_CANDIDATES": {
      let toUpdate = {
        secondHighlightingNodeCandidateIDs:
          action.secondHighlightingNodeCandidateIDs,
      };

      return generateState(state, action.graphType, toUpdate);
    }
    case "GRAPH_UPDATE_PATH_RELATED_TO_SECOND_HIGHLIGHTING_NODE": {
      let toUpdate = {
        pathRelatedToSecondHighlightingNode:
          action.pathRelatedToSecondHighlightingNode,
      };

      return generateState(state, action.graphType, toUpdate);
    }
    case "GRAPH_UPDATE_DATA_MODEL_STRUCTURE": {
      let toUpdate = {
        dataModelStructure: action.dataModelStructure,
        dataModelStructureRelatedNodeIDs:
          action.dataModelStructureRelatedNodeIDs,
        dataModelStructureAllRoutesBetween: action.routesBetweenStartEndNodes,
      };

      return generateState(state, action.graphType, toUpdate);
    }
    case "GRAPH_SET_OVERLAY_PROPERTY_TABLE_HIDDEN": {
      let toUpdate = {
        overlayPropertyHidden: action.isHidden,
      };

      return generateState(state, action.graphType, toUpdate);
    }
    case "GRAPH_CANVAS_RESET_REQUIRED": {
      let toUpdate = {
        needReset: action.needReset,
      };

      return generateState(state, action.graphType, toUpdate);
    }
    case "GRAPH_RESET_HIGHLIGHT": {
      let toUpdate = {
        highlightingNode: null,
        secondHighlightingNodeID: null,
        tableExpandNodeID: null,
      };

      return generateState(state, action.graphType, toUpdate);
    }
    case "GRAPH_CLICK_NODE": {
      if (state[action.graphType].isSearchMode) {
        // clicking node in search mode opens property table
        let toUpdate = {
          highlightingMatchedNodeID: action.nodeID,
          highlightingMatchedNodeOpened: false,
          overlayPropertyHidden: false,
        };

        return generateState(state, action.graphType, toUpdate);
      }
      let newHighlightingNode = null;
      let newSecondHighlightingNodeID = null;
      if (action.nodeID) {
        // if no node is selected, select this node as highlight node
        if (!state[action.graphType].highlightingNode) {
          newHighlightingNode = state[action.graphType].nodes.find(
            (n) => n.id === action.nodeID
          );
        } else if (state[action.graphType].highlightingNode) {
          newHighlightingNode = state[action.graphType].highlightingNode;

          // if is clicking the same node
          if (state[action.graphType].highlightingNode.id === action.nodeID) {
            // if no second node is selected, regard this as cancel selecting
            if (!state[action.graphType].secondHighlightingNodeID) {
              newHighlightingNode = null;
            }
          } else if (
            state[action.graphType].secondHighlightingNodeCandidateIDs.length >
              1 &&
            state[action.graphType].secondHighlightingNodeCandidateIDs.includes(
              action.nodeID
            )
          ) {
            // regard as canceling selecting second highlight node
            if (
              state[action.graphType].secondHighlightingNodeID === action.nodeID
            ) {
              newSecondHighlightingNodeID = null;
            } else {
              // select this as second highlight node
              newSecondHighlightingNodeID = action.nodeID;
            }
          }
        }
      }
      const newTableExpandNodeID = newHighlightingNode
        ? newHighlightingNode.id
        : null;
      let toUpdate_1 = {
        highlightingNode: newHighlightingNode,
        secondHighlightingNodeID: newSecondHighlightingNodeID,
        tableExpandNodeID: newTableExpandNodeID,
      };

      return generateState(state, action.graphType, toUpdate_1);
    }
    case "GRAPH_CLICK_BLANK_SPACE": {
      let newHighlightingNode = state[action.graphType].highlightingNode;
      let newSecondHighlightingNodeID =
        state[action.graphType].secondHighlightingNodeID;
      let newTableExpandNodeID = state[action.graphType].tableExpandNodeID;
      if (state[action.graphType].highlightingNode) {
        if (state[action.graphType].secondHighlightingNodeID) {
          newSecondHighlightingNodeID = null;
        } else {
          newHighlightingNode = null;
          newTableExpandNodeID = null;
        }
      }
      let toUpdate = {
        highlightingNode: newHighlightingNode,
        secondHighlightingNodeID: newSecondHighlightingNodeID,
        tableExpandNodeID: newTableExpandNodeID,
      };

      return generateState(state, action.graphType, toUpdate);
    }
    case "TABLE_EXPAND_NODE": {
      let newHighlightingNode = null;
      if (action.nodeID) {
        newHighlightingNode = state[action.graphType].nodes.find(
          (n) => n.id === action.nodeID
        );
      }

      let toUpdate = {
        tableExpandNodeID: action.nodeID,
        highlightingNode: newHighlightingNode,
        secondHighlightingNodeID: null,
      };

      return generateState(state, action.graphType, toUpdate);
    }
    case "SEARCH_SET_IS_SEARCHING_STATUS": {
      let toUpdate = {
        isSearching: action.isSearching,
      };

      return generateState(state, action.graphType, toUpdate);
    }
    case "SEARCH_RESULT_UPDATED": {
      let toUpdate = {
        searchResult: action.searchResult,
        matchedNodeIDs: action.searchResultSummary.generalMatchedNodeIDs,
        matchedNodeIDsInNameAndDescription:
          action.searchResultSummary.matchedNodeIDsInNameAndDescription,
        matchedNodeIDsInProperties:
          action.searchResultSummary.matchedNodeIDsInProperties,
        isGraphView: true,
        isSearchMode: true,
        highlightingMatchedNodeID: null,
        highlightingMatchedNodeOpened: false,
        highlightingNode: null,
        secondHighlightingNodeID: null,
        tableExpandNodeID: null,
      };

      return generateState(state, action.graphType, toUpdate);
    }
    case "SEARCH_CLEAR_HISTORY": {
      let toUpdate = {
        searchHistoryItems: clearSearchHistoryItems(),
      };

      return generateState(state, action.graphType, toUpdate);
    }
    case "SEARCH_HISTORY_ITEM_CREATED": {
      let toUpdate = {
        searchHistoryItems: addSearchHistoryItems(action.searchHistoryItem),
      };

      return generateState(state, action.graphType, toUpdate);
    }
    case "GRAPH_NODES_SVG_ELEMENTS_UPDATED": {
      let toUpdate = {
        graphNodesSVGElements: action.graphNodesSVGElements,
      };

      return generateState(state, action.graphType, toUpdate);
    }
    case "SEARCH_RESULT_CLEARED": {
      let toUpdate = {
        searchResult: [],
        matchedNodeIDs: [],
        currentSearchKeyword: "",
        isSearchMode: false,
        highlightingMatchedNodeID: null,
        highlightingMatchedNodeOpened: false,
      };

      return generateState(state, action.graphType, toUpdate);
    }
    case "SEARCH_SAVE_CURRENT_KEYWORD": {
      let toUpdate = {
        currentSearchKeyword: action.keyword,
      };

      return generateState(state, action.graphType, toUpdate);
    }
    case "GRAPH_MATCHED_NODE_OPENED": {
      let toUpdate = {
        highlightingMatchedNodeOpened: action.opened,
      };

      return generateState(state, action.graphType, toUpdate);
    }
    case "GRAPH_SAVE_CURRENT_PROJECT": {
      let toUpdate = {
        currentProject: action.currentProject,
      };

      return generateState(state, action.graphType, toUpdate);
    }
    default:
      return state;
  }
};

export default ddgraph;
