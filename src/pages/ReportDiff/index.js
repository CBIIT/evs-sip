import React, { useEffect }from 'react';
import styled from 'styled-components';

import ContentDiff from './ContentDiff';

const Page = styled.div`
  background-color: var(--page-bkgd);
  overflow: auto;
  padding-bottom: 18rem;
`;

const PageContainer = styled.div`
  max-width: 75rem;
  margin: 0 auto;
`;

// const PageTitle = styled.h1`
//   font-family: 'Raleway-Medium', sans-serif;
//   font-size: 2.25rem;
//   color: var(--main-title);
//   padding: 3rem 0 1.5rem 0;
// `;

const ReportDiff = () => {
  useEffect(()=> {
    window.scrollTo(0, 0);
  });

  return <Page>
    <PageContainer>
        <ContentDiff/>
    </PageContainer>
  </Page>
}

export default ReportDiff;
