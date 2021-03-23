import { combineReducers } from 'redux';

import ddgraph from './components/GraphicalView/DataDictionary/reducers';
import submission from './components/GraphicalView/reducers';

const initialState = { 
  keyword: '',
  match: 'partial',
  options: {
    desc: false,
    syns: false
  },
  dataSources : {
    ctdc: false,
    gdc: false,
    icdc: false,
    pcdc: false
  },
  result: {},
  searchTerm: '',
  error: false,
  isLoading: false,
  isSerching: false,
};

const ddsearch = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_KEYWORD': 
      return { 
        ...state,
        keyword: action.keyword,
      }
    case 'SET_RESULT':
      return {
        ...state,
        result: action.result,
      }
    case 'SET_ERROR':
      return {
        ...state,
        error: action.error,
      }
    case 'SET_MATCH_OPTIONS': 
     return { 
       ...state,
       match: action.match,
      }
    case 'SET_OPTIONS_SEARCH': 
      return { 
        ...state,
        options: action.options,
      }
    case 'SET_DATA_SOURCES': 
      return { 
        ...state,
        dataSources: action.dataSources,
      }
    case 'SET_SEARCH_TERM': 
      return { 
        ...state,
        searchTerm: action.searchTerm,
      }
    case 'IS_LOADING': 
      return { 
        ...state,
        isLoading: action.isLoading,
      }
    case 'IS_SERCHING': 
      return { 
        ...state,
        isSearching: action.isSearching,
      }
    default:
      return state;
  }
}

const reducers = combineReducers({
    ddsearch,
    ddgraph,
    submission
});

export default reducers;
