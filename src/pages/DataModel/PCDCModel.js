import React from 'react';
import styled from 'styled-components';
import GraphicalView from '../../components/GraphicalView';

const ContentBox =  styled.div`
  padding: 3rem 4rem;
  margin-bottom: 2.5rem;
  background-color: var(--white-bkgd);
`;

const ContentBoxAbout = styled(ContentBox)`
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
`;

const ContentBoxTitle = styled.h2`
  font-family: 'Inter', sans-serif;
  font-size: 1.1875rem;
  font-weight: 500;
  color: #009ECC;
  text-transform: uppercase;
`;

const ContentBoxHr = styled.hr`
  border-top: 1px solid #77B7CD;
  margin-top: 3rem;
  margin-bottom: 3rem;
`;

const ContentBoxText = styled.div`
  margin-bottom: 3rem;

  && > h2 {
    font-family: 'Inter', sans-serif;
    font-size: 1.1875rem;
    font-weight: 500;
    color: #009ECC;
    text-transform: uppercase;
    margin-bottom: 1rem;
  }

  && > p {
    font-size: 1.0625rem;
    font-family: 'Inter', sans-serif;
    color: var(--black);
  }

  && > p:last-child {
    margin-bottom: 0;
  }

  && a {
    color: var(--link);
  }
`;

const GraphContent = styled.div`
  margin: 2rem auto;
`;

const ICDCModel = () => {
  return <ContentBoxAbout>
    <ContentBoxText>
      <h2>Graph Representation of the PCDC Data Model</h2>

      <p>
        The Pediatric Cancer Data Commons (PCDC) works with leaders in pediatric cancers to develop and apply uniform clinical data standards
        and facilitate the collection and linkage of data from many different sources and types. Using technology to address inefficiencies in
        clinical research operations and data aggregation and analysis, PCDC works to ensure that patients, physicians,
        and researchers have the best clinical research tools at their disposal.
      </p>
    </ContentBoxText>
    <ContentBoxHr/>
    <ContentBoxTitle>The PCDC Data Model</ContentBoxTitle>
    <GraphContent>
      <GraphicalView type="pcdc_readonly"/>
    </GraphContent>
  </ContentBoxAbout>
}

export default ICDCModel;
