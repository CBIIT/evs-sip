import React from 'react';
import styled from 'styled-components';
import ReactPaginate from 'react-paginate';
import { Form } from 'react-bootstrap';

const PaginationContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
`;

const PageInfo = styled.div`
  display: flex;
  justify-content: space-around;
`;

const PaginationController = (props) => {
  return (<PaginationContainer>
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
      pageCount={props.pageCount}
      marginPagesDisplayed={2}
      pageRangeDisplayed={5}
      onPageChange={props.pageClick}
      containerClassName={'pagination'}
      pageClassName={'page-item'}
      pageLinkClassName={'page-link'}
      subContainerClassName={'pages pagination'}
      activeClassName={'active'}
      forcePage={props.currentPage[props.type] - 1}
    />
    <PageInfo>
      <Form.Label style={{padding: '.375rem .75rem'}}>Page Size:</Form.Label>
      <Form.Control style={{width: '12rem'}} as="select" value={props.pageSize} onChange={props.pageSizeChange}>
        <option value="10">10</option>
        <option value="15">20</option>
        <option value="25">25</option>
        <option value="50">50</option>
        <option value="100">100</option>
      </Form.Control>
    </PageInfo>
    
  </PaginationContainer>);
}

export default PaginationController;
