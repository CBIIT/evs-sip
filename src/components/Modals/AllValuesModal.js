import React, {useState} from 'react';
import styled from 'styled-components';
import ReactPaginate from 'react-paginate';
import { Button, Modal, Table, Row, Col, Collapse, Badge, InputGroup, FormControl} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus , faSearch } from '@fortawesome/free-solid-svg-icons';
import { searchFilter } from '../../shared';
import { apiGetGDCDataById } from '../../api';

const ModalBodyStyled = styled(Modal.Body)`
  min-height: 40rem;
  display: flex;
  align-content: space-between;
  flex-wrap: wrap;
`;

const ColRight = styled(Col)`
  text-align: right;
`;

const TableContainer = styled.div`
  width: 100%;
  padding: 12px;
`;

const MainTableContainer = styled.div`
  width: 100%;
`;

const MainTable = styled(Table)`
  && > thead {
    background-color: #535F74;
    color: white;
    text-align: center;
  }

  && > thead th {
    border: 1px solid #535F74;
  }
`;

const TableStyled = styled(Table)`
  margin-bottom: 0;
`;

const BadgeStyled = styled(Badge)`
  margin-left: 1rem;
  font-size: 100%;
`;

const ModalStyled = styled(Modal)`
  && .modal-dialog {
    max-width: 75rem;
  }
`;

const RowStyled = styled(Row)`
  min-width: 25rem;
  margin-right: -0.75rem;
  margin-left: -0.75rem;
`;

const ButtonStyled = styled(Button)`
  padding: 0 .75rem;
`;

const PaginationContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const InputGroupStyled = styled(InputGroup)`
  max-width: 23rem;
  padding-left: 2rem;
`;

const Indicator = styled.div`
  width: 100%;
  padding: 3rem 0;
  text-align: center;
  font-size: 1.2rem;
`;

// const IndicatorContent = styled.div`
//   text-align: center;
//   font-size: 1.2rem;
// `;

const AllValuesModal = (props) => {
  const [show, setShow] = useState(false);
  const [data, setData] = useState([]);
  const [items, setItems] = useState([]);
  //const [keyword, setKeyword] = useState('');

  const handleClose = () => setShow(false);
  const handleShow = () => {
    apiGetGDCDataById(props.idterm).then(result => {
      setData(result);
      if (result !== [] && result[0]._source.enum !== undefined) {
        setItems(result[0]._source.enum);
      }
    }).then(() => {
      setShow(true);
    });
  };


  const handleSearchChange = (event) => {
    let keyword = event.target.value.trim().replace(/\s{2,}/g, ' ').toLowerCase();

    if (keyword.length >= 3 && data !== [] && data[0]._source.enum !== undefined) {
      let newItem = searchFilter(data[0]._source.enum, keyword);
      setItems(newItem);
    } else {
      setItems(data[0]._source.enum);
    }
  };

  const TableSynonyms = (props) => {
    if (props.synonyms !== undefined) {
      return props.synonyms.map((item, index) =>
        <tr key={index}>
          <td dangerouslySetInnerHTML={{ __html: item.n }}></td>
          <td>{item.src}</td>
          <td>{item.t}</td>
        </tr>
      );
    }
    return (null);
  };

  const TableICDOSyn = (props) => {
    if (props.synonyms !== undefined) {
      return props.synonyms.map((item, index) =>
        <tr key={index}>
          <td dangerouslySetInnerHTML={{ __html: item.n }}></td>
          <td>{item.t}</td>
        </tr>
      );
    }
    return (null);
  };

  const TableNCIt = (props) => {

    let [isToggleOn, setIsToggleOn] = useState(false);

    const ToggleTableHandler = event => {
      event.preventDefault();
      setIsToggleOn(!isToggleOn);
    };
    return (
      <>
        <RowStyled>
          <Col xs={10} dangerouslySetInnerHTML={{ __html: props.ncit.l }}></Col>
          <ColRight xs={2}>
            <a href="/#" aria-label={isToggleOn === true ? 'collapse' : 'expand'} onClick={ToggleTableHandler}>
              {isToggleOn === true
                ? <FontAwesomeIcon icon={faMinus}/>
                : <FontAwesomeIcon icon={faPlus}/>
              }
            </a>
          </ColRight>
        </RowStyled>
        <Collapse in={isToggleOn} mountOnEnter={true}>
          <TableContainer>
            <TableStyled striped bordered condensed="true" hover>
              <thead>
                <tr>
                  <th>Term</th>
                  <th>Source</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                <TableSynonyms synonyms={props.ncit.s}/>
              </tbody>
            </TableStyled>
          </TableContainer>
        </Collapse>
      </>
    );
  };

  const TableICDO3 = (props) => {

    let [isToggleOn, setIsToggleOn] = useState(false);

    const ToggleTableHandler = event => {
      event.preventDefault();
      setIsToggleOn(!isToggleOn);
    };
    return (
      <>
        <RowStyled>
          <Col xs={10}>
            <span dangerouslySetInnerHTML={{ __html: props.icdo.c }}></span> 
          </Col>
          <ColRight xs={2}>
            <a href="/#" aria-label={isToggleOn === true ? 'collapse' : 'expand'} onClick={ToggleTableHandler}>
              {isToggleOn === true
                ? <FontAwesomeIcon icon={faMinus}/>
                : <FontAwesomeIcon icon={faPlus}/>
              }
            </a>
          </ColRight>
        </RowStyled>
        <Collapse in={isToggleOn} mountOnEnter={true}>
          <TableContainer>
            <TableStyled striped bordered condensed="true" hover>
              <thead>
                <tr>
                  <th>Term</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                <TableICDOSyn synonyms={props.icdo.s}/>
              </tbody>
            </TableStyled>
          </TableContainer>
        </Collapse>
      </>
    );
  };

  const TableEnums = (props) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(15);

    const handlePageClick = (data) => {
      setCurrentPage(data.selected + 1);
    }

    if (props.items !== undefined && props.items !== []) {

      // Logic for displaying current items
      const indexOfLastItem = currentPage * itemsPerPage;
      const indexOfFirstItem = indexOfLastItem - itemsPerPage;
      const currentItems = props.items.slice(indexOfFirstItem, indexOfLastItem);
      const pageCount = Math.ceil(props.items.length / itemsPerPage);


      // render table with items
      const renderItems = currentItems.map((e, index) => {
        if(e.ncit !== undefined && e.ncit.length !== 0) {
          return e.ncit.map((nc, i) => {
            if(i === 0) {
              return (
                <tr key={index}>
                  <td rowSpan={e.ncit.length} dangerouslySetInnerHTML={{ __html: e.n }}></td>
                  <td rowSpan={e.ncit.length}>
                    {e.icdo !== undefined &&
                      <TableICDO3 icdo={e.icdo} />
                    }
                  </td>
                  <td>
                    <a href={"https://ncit.nci.nih.gov/ncitbrowser/pages/concept_details.jsf?dictionary=NCI_Thesaurus&code=" + nc.c} rel="noopener noreferrer" target="_blank" dangerouslySetInnerHTML={{ __html: nc.c }}></a>
                  </td>
                  <td>
                    <TableNCIt ncit={nc}/>
                  </td>
                </tr>
              );
            } else {
              return (
                <tr key={index}>
                  <td>
                    <a href={"https://ncit.nci.nih.gov/ncitbrowser/pages/concept_details.jsf?dictionary=NCI_Thesaurus&code=" + nc.c} rel="noopener noreferrer" target="_blank" dangerouslySetInnerHTML={{ __html: nc.c }}></a>
                  </td>
                  <td>
                    <TableNCIt ncit={nc}/>
                  </td>
                </tr>
              );
            }  
          });
        } else {
          return (<tr key={index}>
            <td dangerouslySetInnerHTML={{ __html: e.n }}></td>
            <td>
              {e.icdo !== undefined &&
                <TableICDO3 icdo={e.icdo} />
              }
            </td>
            <td></td>
            <td></td>
          </tr>)
        }
      });

      return (
      <>
        <MainTableContainer>
          <MainTable bordered condensed="true">
            <thead>
              <tr>
                <th>Values</th>
                <th>ICD-O-3 Code</th>
                <th>Mapped NCIt Code</th>
                <th>NCIt Preferred Term</th>
              </tr>
            </thead>
            <tbody>
              {renderItems}
            </tbody>
          </MainTable>
        </MainTableContainer>
        <PaginationContainer>
          <ReactPaginate
            previousLabel={'«'}
            prevClassName={'page-item'}
            previousLinkClassName={'page-link'}
            nextLabel={'»'}
            nextClassName={'page-item'}
            nextLinkClassName={'page-link'}
            breakLabel={'...'}
            breakClassName={'page-item break-me'}
            breakLinkClassName={'page-link'}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageClick}
            containerClassName={'pagination'}
            pageClassName={'page-item'}
            pageLinkClassName={'page-link'}
            subContainerClassName={'pages pagination'}
            activeClassName={'active'}
          />
        </PaginationContainer>
      </>
      )
    }
    return (null);
  };


  const TitleModal = (props) => {
    if (props.data !== [] && props.data[0]._source.prop !== undefined) {
      return(<>Values from {props.data[0]._source.prop.n}</>);
    }
    return (null);
  }


  const TotalLabel = (props) => {
    if (props.data !== [] && props.data[0]._source.enum !== undefined) {
      return(
        <BadgeStyled variant="primary">{props.data[0]._source.enum.length}</BadgeStyled>
      );
    }
    return (null);
  }

  return (
    <>
      <ButtonStyled variant="link" onClick={handleShow}>
        See All Values
      </ButtonStyled>

      <ModalStyled
        show={show} 
        onHide={handleClose}
        aria-labelledby="all-values-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title id="all-values-modal">
            <TitleModal data={data}/>
            <TotalLabel data={data}/>  
          </Modal.Title>
          <InputGroupStyled>
            <InputGroup.Prepend>
              <InputGroup.Text id="search-values-input">
                <FontAwesomeIcon icon={faSearch}/>
              </InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              placeholder="Type at least 3 characters"
              aria-label="Search"
              aria-describedby="Search"
              onChange={handleSearchChange}
            />
          </InputGroupStyled>
        </Modal.Header>
        <ModalBodyStyled>
          {(items !== [] && items.length !== 0) ? (
            <TableEnums items={items}/>
          ) : (
            <Indicator>Sorry, no results found.</Indicator>
          )}
        </ModalBodyStyled>
      </ModalStyled>
    </>
  );
}


export default AllValuesModal;
