import React from 'react';
import ReactPaginate from 'react-paginate';
import styled from 'styled-components';

const PaginationContainer = styled.div`
  margin: auto;

  &&>ul {
    margin: 0;
  }
`;

const PaginationController = (props) => {
  return (
    <PaginationContainer>
      {props.pageCount > 1 && 
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
      />
      }
    </PaginationContainer>
    );
};

export default PaginationController;
