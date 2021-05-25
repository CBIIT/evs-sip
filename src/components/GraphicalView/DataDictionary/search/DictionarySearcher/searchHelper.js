import Fuse from "fuse.js";
import {
  parseDictionaryNodes,
  getPropertyDescription,
  getType,
} from "../../utils";

export const ZERO_RESULT_FOUND_MSG =
  "0 results found. Please try another keyword.";

/**
 * Prepare search items for Fuse.io library
 * @params [Object] dictionary
 * @returns [Object] search data
 */
export const prepareSearchData = (dictionary) => {
  const searchData = parseDictionaryNodes(dictionary).map((node) => {
    const properties = Object.keys(node.properties).map((propertyKey) => {
      let type = getType(node.properties[propertyKey]);
      if (type === "UNDEFINED") type = undefined;
      const propertyDescription = getPropertyDescription(
        node.properties[propertyKey]
      );
      return {
        name: propertyKey,
        description: propertyDescription,
        type,
      };
    });
    return {
      id: node.id,
      title: node.title,
      description: node.description,
      properties,
    };
  });
  return searchData;
};

export const ERR_KEYWORD_TOO_SHORT = "Keyword too short, try longer keyword.";
export const ERR_KEYWORD_TOO_LONG = "Keyword too long (more than 32).";

/**
 * Call Fuse search and returns search result
 * @params [Object] searchData - see prepareSearchData returns
 * @params [string] keyword
 * @returns [SearchResultItemShape[]] (see ../../utils).
 */
export const searchKeyword = (searchData, keyword) => {
  if (!keyword || keyword.length < 2) {
    return {
      result: [],
      errorMsg: ERR_KEYWORD_TOO_SHORT,
    };
  }
  // 32 is length limitation of Fuse search library
  if (keyword.length > 32) {
    return {
      result: [],
      errorMsg: ERR_KEYWORD_TOO_LONG,
    };
  }
  const halfLength = Math.round(keyword.length / 2);
  const minMatchCharLength = Math.min(Math.max(halfLength, 10), keyword.length);
  const options = {
    keys: [
      "title",
      "description",
      "properties.name",
      "properties.description",
      "properties.type",
    ],
    includeMatches: true,
    threshold: 0.3,
    shouldSort: true,
    includeScore: true,
    minMatchCharLength,
  };
  const handler = new Fuse(searchData, options);
  const result = handler
    .search(keyword)
    .map((resItem) => {
      // A bug in Fuse sometimes returns wrong indices that end < start
      const matches = resItem.matches.filter(
        (matchItem) => matchItem.indices[0][1] >= matchItem.indices[0][0]
      );
      return {
        ...resItem,
        matches,
      };
    })
    .map((resItem) => {
      // filter out matches that is too shorter than keyword
      const matches = resItem.matches.filter((matchItem) => {
        const matchLen = matchItem.indices[0][1] - matchItem.indices[0][0] + 1;
        return matchLen >= halfLength;
      });
      return {
        ...resItem,
        matches,
      };
    })
    .filter((resItem) => resItem.matches.length > 0);
  const errorMsg = result && result.length > 0 ? "" : ZERO_RESULT_FOUND_MSG;
  return {
    result,
    errorMsg,
  };
};

/**
 * Filter out and reorgnize search result
 * @params [string] graph type
 * @params [Object] searchData - see elasticsearch search API returns
 * @returns [SearchResultItemShape[]] (see ../../utils).
 */
export const getSearchResult = (graphType, searchData, project_filter) => {
  let result = {};
  if (graphType === "pcdc" && project_filter === undefined) {
    project_filter = "AML";
  }
  if (searchData.length > 0) {
    searchData.forEach((entry) => {
      let dt = entry._source;

      if (project_filter && dt.category !== project_filter) {
        return;
      }
      if (dt.source === graphType) {
        if (!(dt.node in result)) {
          result[dt.node] = {};
          result[dt.node].props = {};
        }
        result[dt.node].props[dt.prop] = {};
        if (entry.highlight) {
          result[dt.node].props[dt.prop].title = entry.highlight["prop.have"]
            ? entry.highlight["prop.have"][0]
            : dt.prop;
          result[dt.node].props[dt.prop].desc = entry.highlight["prop_desc"]
            ? entry.highlight["prop_desc"][0]
            : dt.prop_desc;
          if (entry.highlight["cde.id"]) {
            let icdo = entry.highlight["cde.id"][0];
            result[dt.node].props[dt.prop].desc = result[dt.node].props[
              dt.prop
            ].desc.replace(
              icdo.replace(/<b>/g, "").replace(/<\/b>/g, ""),
              icdo
            );
          }
        } else {
          result[dt.node].props[dt.prop].title = dt.prop;
          result[dt.node].props[dt.prop].desc = dt.prop_desc;
        }

        result[dt.node].props[dt.prop].type = dt.type;
        result[dt.node].props[dt.prop].enum = dt.enum ? dt.enum : [];
        result[dt.node].props[dt.prop].hits = entry.inner_hits.enum.hits.hits;
      }
    });
  }
  return result;
};

/**
 * Prepare summary information for graphical display
 * @params elasticsearch result
 * @returns [Object] summary
 */
export const getSearchSummary = (result) => {
  const matchedNodeIDsInProperties = Object.keys(result);
  const generalMatchedNodeIDs = Object.keys(result);

  const matchedNodeIDsInNameAndDescription = [];
  let matchedNodeNameAndDescriptionsCount = 0;
  return {
    matchedNodeNameAndDescriptionsCount,
    matchedNodeIDsInNameAndDescription,
    matchedNodeIDsInProperties,
    generalMatchedNodeIDs,
  };
};
