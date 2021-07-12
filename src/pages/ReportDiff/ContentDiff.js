import React, { useState } from 'react';
import styled from 'styled-components';
import { Button } from 'react-bootstrap';
import { compareAllWithGDCDictionary, exportCompareResult, exportAllCompareResult } from '../../api';

import LoadingAnimation from '../../components/LoadingAnimation';
import FormDiff from './FormDiff';
import TabController from './TabController';

const ContentBox =  styled.div`
  padding: 2.5rem;
  margin: 2.5rem 0;
  background-color: var(--white-bkgd);
`;

const ContentBoxTitle = styled.h1`
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

const TitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const ContentDiff = () => {
  let [loadingState, setLoadingState] = useState(false);
  let [loadedDataStage, setLoadedDataStage] = useState(false);
  let [resultState, setResultState] = useState([]);
  let [typeState, setTypeState] = useState('all');
  let [pageSizeState, setPageSizeState] = useState(25);
  let [totalState, setTotalState] = useState(0);
  let [pageCountState, setPageCountState] = useState(0);
  let [searchState, setSearchState] = useState({
    all: '',
    unmapped: '',
    mapped: '',
    conflict: ''
  });
  let [pageState, setPageState] = useState({
    all: 1,
    unmapped: 1,
    mapped: 1,
    conflict: 1
  });

  const reportTrigger = () => {
    setLoadingState(true);
    compareAllWithGDCDictionary()
    .then(result => {
      setLoadingState(false);
      setLoadedDataStage(true);
      setResultState(result.data);
      setPageSizeState(result.pageInfo.pageSize);
      setTotalState(result.pageInfo.total);
      setPageCountState(result.pageInfo.total / result.pageInfo.pageSize);
      setTypeState('all');
      setSearchState({
        all: '',
        unmapped: '',
        mapped: '',
        conflict: ''
      });
      setPageState({
        all: result.pageInfo.page,
        unmapped: 1,
        mapped: 1,
        conflict: 1
      });
    });
  };

  const handleSelectTab = (type) => {
    compareAllWithGDCDictionary(type, pageState[type], pageSizeState, searchState[type])
    .then(result => {
      setResultState(result.data);
      setTypeState(type);
      pageState[type] = result.pageInfo.page 
      setPageState(pageState);
      setPageSizeState(result.pageInfo.pageSize);
      setPageCountState(result.pageInfo.total / result.pageInfo.pageSize);
    });
  };

  const handleDownloadResult = () => {
    exportCompareResult(typeState, searchState[typeState])
    .then(result => {
      let a = document.createElement("a");
      document.body.appendChild(a);
      a.style = "display: none";
      let url = window.URL.createObjectURL(result);
      a.href = url;
      a.download = "report_"+ typeState +".xlsx";
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    });
  };

  const handleDowloadAllResults = () => {
    //alert('Download Full Report');
    exportAllCompareResult()
    .then(result => {
      let a = document.createElement("a");
      document.body.appendChild(a);
      a.style = "display: none";
      let url = window.URL.createObjectURL(result);
      a.href = url;
      a.download = "full_report.xlsx";
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    });
  };

  const handlePageClick = (data) => {
    const page = data.selected + 1;
    compareAllWithGDCDictionary(typeState, page, pageSizeState, searchState[typeState])
    .then(result => {
      setResultState(result.data);
      pageState[typeState] = result.pageInfo.page 
      setPageState(pageState);
    });
  }

  const handlepageSizeChange = (event) => {
    const pageSize = event.target.value;
    compareAllWithGDCDictionary(typeState, 1, pageSize, searchState[typeState])
    .then(result => {
      setResultState(result.data);
      setPageState({
        all: 1,
        unmapped: 1,
        mapped: 1,
        conflict: 1
      });
      setPageSizeState(result.pageInfo.pageSize);
      setPageCountState(result.pageInfo.total / result.pageInfo.pageSize);
    });
  }

  const handleSearchSubmit = event => {
    event.preventDefault();
    const keyword = searchState[typeState].trim().replace(/\s{2,}/g, ' ').toLowerCase();
    compareAllWithGDCDictionary(typeState, 1, pageSizeState, keyword)
    .then(result => {
      setResultState(result.data);
      pageState[typeState] = 1
      setPageState(pageState);
      setPageCountState(result.pageInfo.total / result.pageInfo.pageSize);
    });
  }

  return <ContentBox>
    <ContentBoxTitle>Report Differences</ContentBoxTitle>
    <ContentBoxText>
      <p>The Report Differences is a tool to compare the mapped NCIt codes of selected Compare Type (Node/Property/Value) between the official GDC Dictionary and Data Commons. Currently, only preset options are supported.</p>
      <p>The results have four tabs, "All", "Unmapped", "Mapped", and "Conflict".</p>
      <ul>
        <li>"All" tab includes all values from specified GDC Dictionary and data source. </li>
        <li>"Mapped" tab includes all values with NCIt code mappings from data source.</li>
        <li>"Unmapped" tab includes all values without NCIt code mappings from data source.</li>
        <li>"Conflict" tab includes all values with different NCIt code mappings from specified GDC Dictionary and data source.</li>
      </ul>
      <p>The results could be downloaded in xls format for all tabs, or from each tab.</p>
      <FormDiff reportTrigger={reportTrigger}/>
      {loadedDataStage &&
        <>
          <TitleContainer>
            <h2>Result</h2>
            <Button variant="secondary" onClick={handleDowloadAllResults}>Download All Results</Button>
          </TitleContainer>
          <TabController 
            selectTab={handleSelectTab} 
            type={typeState} 
            result={resultState}
            pageClick={handlePageClick} 
            pageSizeChange={handlepageSizeChange} 
            currentPage={pageState}
            pageSize={pageSizeState} 
            pageCount={pageCountState} 
            total={totalState}
            search={searchState}
            setSearch={setSearchState}
            searchSubmit={handleSearchSubmit}
            downloadResult={handleDownloadResult}
          />
        </>
      }
    </ContentBoxText>
    {loadingState && <LoadingAnimation/>}
  </ContentBox>
}

export default ContentDiff;
