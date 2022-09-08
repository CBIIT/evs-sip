import React, { useEffect }from 'react';
import styled from 'styled-components';

import SwaggerContainer from './SwaggerContainer';

const Page = styled.div`
  background-color: var(--page-bkgd);
  overflow: auto;
  padding-bottom: 18rem;
`;

const PageContainer = styled.div`
  max-width: 75rem;
  margin: 0 auto;
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

const APIDocs = () => {
  useEffect(()=> {
    window.scrollTo(0, 0);
  });

  return <Page>
    <PageContainer>
      <PageTitle>EVSSIP RESTful API</PageTitle>
      <SwaggerContainer/>
    </PageContainer>
  </Page>
}

export default APIDocs;
