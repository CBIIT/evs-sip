import React from 'react';
import styled from 'styled-components';
import ReduxSearchBox from './SearchBox';
import ReduxMainTabsController from './MainTabsController';
//import LoadingAnimation from '../../components/LoadingAnimation';

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
  return <Page>
    <PageTitle>Search EVS-SIP</PageTitle>
    <ReduxSearchBox />
    <ReduxMainTabsController/>
  </Page>;
}

export default Search;
