import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { apiSearchAll } from '../../api';
import SearchBox from './SearchBox';
import MainTabsController from './MainTabsController';
import LoadingAnimation from '../../components/LoadingAnimation';

const Page = styled.div`
  background-color: var(--white);
  padding-bottom: 18rem;
`;

const PageTitle = styled.h1`
  font-size: 0;
  width: 1px;
  height: 1px;
  display: inline-block;
  overflow: hidden;
  position: absolute!important;
  border: 0!important;
  padding: 0!important;
  margin: 0!important;
  clip: rect(1px,1px,1px,1px);
`;

const Search = (props) => {
  let [keywordState, setKeywordState] = useState(props.location.state !== undefined && props.location.state.keyword !== undefined ? props.location.state.keyword : '');
  let [resultState, setResultState] = useState({});
  let [loadingState, setLoadingState] = useState(false);
  let [errorState, setErrorState] = useState(false);

  let [selectDataSource, setSelectDataSource] = useState(
    props.location.state !== undefined &&
    props.location.state.dataSource !== undefined ? 
    props.location.state.dataSource 
    : {    
      ctdc: false,
      gdc: false,
      icdc: false,
      pcdc: false
    }
  );

  const searchHandler = (keyword, match, options, sources) => {
    let keywordCase = keyword.trim();
    setKeywordState(keywordCase);
    setLoadingState(true);

    if (keywordCase === '') {
      setErrorState(true);
      setResultState({});
      setLoadingState(false);
      return;
    }

    apiSearchAll(keyword, match, options, sources)
      .then(result => {
        setResultState(result);
        setLoadingState(false);
        setErrorState(false);
      });
  };

  useEffect(() => {
    if(props.location.state !== undefined && props.location.state.keyword !== undefined){
      setKeywordState(props.location.state.keyword);
      searchHandler(props.location.state.keyword,
      'partial',
      {
        desc: false,
        syns: false
      },
      props.location.state.dataSource);
    }
  },[props.location.state]);

  return <Page>
        <PageTitle>Search EVS-SIP</PageTitle>
        <SearchBox searchTrigger={searchHandler} keyword={keywordState} errors={errorState} selectSource={selectDataSource} setSelectSource={setSelectDataSource} />
        <MainTabsController keyword={keywordState} result={resultState} errors={errorState} />
        {loadingState && <LoadingAnimation/>}
    </Page>;
}

export default Search;
