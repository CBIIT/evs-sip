import React from 'react';
import styled from 'styled-components';
import { Tab, Row, Col, Nav } from 'react-bootstrap';
import TableDiff from './TableDiff';
import PaginationController from './PaginationController';

const TabNavsCol = styled(Col)`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
`;

const NavLinkStyled = styled(Nav.Link)`
  font-family: 'Lato-Regular', sans-serif;
  font-size: 1.125rem;
  text-align: center;
  color: #042A68;
  padding: 0.7rem 2rem;
  width: 10rem;
  inline-size: 10rem; 
  background-color: #EBEBEB;
  padding: .7rem 2rem;
  margin-right: 10px;

  &&.active {
    color: #fff;
    background-color: #535F74;
    padding: 0.7rem 2rem;
  }
`;

const NavStyled = styled(Nav)`
  border-bottom: none;

  && ${NavLinkStyled} {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
`;

const TabsController = (props) => {
  return (
    <>
      <Tab.Container 
        id="tabs-controller" 
        defaultActiveKey="all"
        activeKey={props.type}
        onSelect={props.selectTab}>
          <Row className="clearfix">
            <TabNavsCol sm={12}>
              <NavStyled variant="tabs">
                <Nav.Item>
                  <NavLinkStyled eventKey="all">All</NavLinkStyled>
                </Nav.Item>
                <Nav.Item>
                  <NavLinkStyled eventKey="unmapped">Unmapped</NavLinkStyled>
                </Nav.Item>
                <Nav.Item>
                  <NavLinkStyled eventKey="mapped">Mapped</NavLinkStyled>
                </Nav.Item>
                <Nav.Item>
                  <NavLinkStyled eventKey="conflict">Conflict</NavLinkStyled>
                </Nav.Item>
              </NavStyled>
            </TabNavsCol>
            <Col sm={12}>
              <Tab.Content transition="false" style={{"fontSize": "1rem", "border": "1px solid #535F74", "borderRadius": "5px", "padding": "5px 5px 0px 5px"}}>
                <Tab.Pane unmountOnExit={true} eventKey="all">
                  <TableDiff result={props.result} tabKey='all' search={props.search} setSearch={props.setSearch} searchSubmit={props.searchSubmit} downloadResult={props.downloadResult}/>
                </Tab.Pane>
                <Tab.Pane unmountOnExit={true} eventKey="unmapped">
                  <TableDiff result={props.result} tabKey='unmapped' search={props.search} setSearch={props.setSearch} searchSubmit={props.searchSubmit} downloadResult={props.downloadResult}/>
                </Tab.Pane>
                <Tab.Pane unmountOnExit={true} eventKey="mapped">
                  <TableDiff result={props.result} tabKey='mapped' search={props.search} setSearch={props.setSearch} searchSubmit={props.searchSubmit} downloadResult={props.downloadResult}/>
                </Tab.Pane>
                <Tab.Pane unmountOnExit={true} eventKey="conflict">
                  <TableDiff result={props.result} tabKey='conflict' search={props.search} setSearch={props.setSearch} searchSubmit={props.searchSubmit} downloadResult={props.downloadResult}/>
                </Tab.Pane>
                {props.result.length !== 0 && 
                  <PaginationController pageClick={props.pageClick} type={props.type} pageSizeChange={props.pageSizeChange} currentPage={props.currentPage} pageSize={props.pageSize} pageCount={props.pageCount} total={props.total}/>
                }
              </Tab.Content>
            </Col>
          </Row>
      </Tab.Container>
    </>
  );
};

export default TabsController;
