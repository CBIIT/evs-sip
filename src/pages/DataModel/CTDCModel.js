import React from 'react';
import styled from 'styled-components';
import GraphicalView from '../../components/GraphicalView';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAsterisk } from '@fortawesome/free-solid-svg-icons';

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

const FontAwesomeIconStyled = styled(FontAwesomeIcon)`
  font-size: 0.5rem;
  height: 1rem;
  margin: 0 0.3rem;
`;

const ConstextBoxIndicator = styled.div`
  font-size: 0.875rem;
  margin-top: 0.25rem;
  text-align: right;
`;

const CTDCModel = () => {
  return (
    <ContentBoxAbout>
      <ContentBoxText>
        <h2>Graph Representation of the CTDC Data Model</h2>
        <p>
          The CTDC data model is a representation of how all the constituent data are arranged relative to each other.
          Given the number of studies, the range of study types and the multiple data types that the CTDC needs to
          support, the data model will need to adapt to the needs of the science. The data model is not static and is
          expected to change as new needs are identified. The data dictionary can be found here (Github) XYS and is
          available here.
        </p>
        <p>
          The graphic below represents the current CTDC data model consisting of data nodes, node properties, and
          relationships (edges). It provides a comprehensive mapping of the system data, part of which may be viewed in
          the application interface and UI. In other words, additional nodes and properties are available for inspection
          and querying beyond those presented on the front-end.
        </p>
        <p>
          Additionally, the CTDC Data Model serves as a template for similar initiatives and data structures, including
          graph-based database schemas. The model will continue to evolve as data needs are further discerned.
        </p>
        <p>
          The source of CTDC data model can be found on Github at:{' '}
          <a
            title="Clinical Trial Data Commons Data Model on GitHub"
            target="_blank"
            href="https://github.com/CBIIT/ctdc-model"
            rel="noopener noreferrer"
          >
            https://github.com/CBIIT/ctdc-model
          </a>
          .
        </p>
        <p>
          The entire CTDC data model can be queried via API:{' '}
          <a
            title="Clinical Trial Data Commons Data Model API"
            target="_blank"
            href="https://trialcommons.cancer.gov/v1/graphql/"
            rel="noopener noreferrer"
          >
            https://trialcommons.cancer.gov/v1/graphql/
          </a>
          .
          <FontAwesomeIconStyled icon={faAsterisk} />
        </p>
        <ConstextBoxIndicator>
          <FontAwesomeIconStyled icon={faAsterisk} />
          <span>Accessible within NIH Firewall</span>
        </ConstextBoxIndicator>
      </ContentBoxText>
      <ContentBoxHr />
      <ContentBoxTitle>The CTDC Data Model</ContentBoxTitle>
      <GraphContent>
        <GraphicalView type="ctdc_readonly" />
      </GraphContent>
    </ContentBoxAbout>
  )
}

export default CTDCModel;
