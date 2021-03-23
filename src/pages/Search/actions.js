export const setKeyword = keyword => ({
  type: 'SET_KEYWORD',
  keyword: keyword
});

export const setResult = result => ({
  type: 'SET_RESULT',
  result: result
});

export const setError = error => ({
  type: 'SET_ERROR',
  error: error
});

export const setMatchOptions = match => ({
  type: 'SET_MATCH_OPTIONS',
  match: match
});

export const setOptionsSearch = options => ({
  type: 'SET_OPTIONS_SEARCH',
  options: options
});

export const setDataSources = dataSources => ({
  type: 'SET_DATA_SOURCES',
  dataSources: dataSources
});

export const setSearchTerm = searchTerm => ({
  type: 'SET_SEARCH_TERM',
  searchTerm: searchTerm
});

export const setIsLoading = isLoading => ({
  type: 'IS_LOADING',
  isLoading: isLoading
});

export const setIsSearching = isSearching => ({
  type: 'IS_SERCHING',
  isSearching: isSearching
});
