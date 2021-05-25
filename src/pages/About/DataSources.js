import React from 'react';
import styled from 'styled-components';
import { Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAsterisk } from '@fortawesome/free-solid-svg-icons';

const ContentBox =  styled.div`
  padding: 2.5rem;
  margin-bottom: 2.5rem;
  background-color: var(--white-bkgd);
`;

const ContentBoxTitle = styled.h2`
  font-family: 'Raleway-Bold', sans-serif;
  font-size: 1.5rem;
  color: var(--sub-title);
  text-transform: uppercase;

  &&::after {
    content: "";
    border: 1px solid var(--black);
    margin-top: 1rem;
    margin-bottom: 1rem;
    display: block;
    max-width: 24rem;
  }
`;

const ContentBoxText = styled.div`
  margin-top: 2rem;
  max-width: 34rem;

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

const ContentBoxTextFullWidth = styled(ContentBoxText)`
  max-width: 100%; 
`;

const ContentBoxTable = styled(Table)`
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  text-align: center;
  margin-bottom: 0;

  && thead th {
    background-color: var(--table-th);
    color: #fff;
    font-weight: bold;
    text-transform: uppercase;
    font-size: 0.8125rem;
    border: none;
    padding: 8px;
  }

  && th,
  && td {
    border: none;
    vertical-align: middle;
  }
`;

const ContentThTitle = styled.h3`
  font-size: 0.9375rem;
  width: 13rem;
  inline-size: 13rem;
  text-align: left;
  margin: 0 auto;
  text-transform: uppercase;
  font-weight: bold;
  line-height: 1.5em;
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

const DataSources = () => {
  return <ContentBox>
    <ContentBoxTitle>Integrated Data Sources</ContentBoxTitle>
    <ContentBoxTextFullWidth>
      <ContentBoxTable striped>
        <thead>
          <tr>
            <th>Data source</th>
            <th>URL</th>
            <th>Inception Date</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><ContentThTitle>Integrated Canine<br/>Data Commons</ContentThTitle></td>
            <td><a title="Integrated Canine Data Commons" href="https://caninecommons.cancer.gov" target="_blank" rel="noopener noreferrer">https://caninecommons.cancer.gov</a></td>
            <td>November 2020</td>
          </tr>
          <tr>
          <td><ContentThTitle>Genomic Data Commons</ContentThTitle></td>
            <td><a title="Genomic Data Commons" href="https://gdc.cancer.gov/" target="_blank" rel="noopener noreferrer">https://gdc.cancer.gov/</a></td>
            <td>November 2020</td>
          </tr>
          <tr>
          <td><ContentThTitle>Clinical Trials<br/>Data Commons</ContentThTitle></td>
            <td><a title="Clinical Trials Data Commons" href="https://trialcommons.cancer.gov/" target="_blank" rel="noopener noreferrer">https://trialcommons.cancer.gov</a><FontAwesomeIconStyled icon={faAsterisk}/></td>
            <td>November 2020</td>
          </tr>
          <tr>
          <td><ContentThTitle>Pediatric Cancer<br/>Data Commons</ContentThTitle></td>
            <td><a title="Clinical Trials Data Commons" href="https://commons.cri.uchicago.edu/" target="_blank" rel="noopener noreferrer">https://commons.cri.uchicago.edu/</a></td>
            <td>November 2020</td>
          </tr>
        </tbody>
      </ContentBoxTable>
      <ConstextBoxIndicator>
        <FontAwesomeIconStyled icon={faAsterisk}/><span>Accessible within NIH Firewall</span>
      </ConstextBoxIndicator>
    </ContentBoxTextFullWidth>
  </ContentBox>
}

export default DataSources;
