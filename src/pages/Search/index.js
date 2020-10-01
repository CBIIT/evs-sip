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
  let [sourceState, setSourceState] = useState([]);
  let [loadingState, setLoadingState] = useState(false);

  const searchHandler = (keyword, options, sources) => {
    setKeywordState(keyword);
    setLoadingState(true);
    apiSearchAll(keyword, options, sources)
      .then(result => {
        setSourceState(result);
        setLoadingState(false);
      });
  };

  useEffect(() => {
    if(props.location.state !== undefined && props.location.state.keyword !== undefined){
      setKeywordState(props.location.state.keyword);
      searchHandler(props.location.state.keyword, 
      {
        match: false,
        desc: false,
        syns: false
      },
      props.location.state.dataSource);
    }
  },[props.location.state]);

  return <Page>
        <PageTitle>Search EVS-SIP</PageTitle>
        <SearchBox searchTrigger={searchHandler} keyword={keywordState}/>
        <MainTabsController keyword={keywordState} source={sourceState} />
        {loadingState && <LoadingAnimation/>}
    </Page>;
}

export default Search;
