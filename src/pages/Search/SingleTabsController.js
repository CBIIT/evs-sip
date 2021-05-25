import React from 'react';
import styled from 'styled-components';
import { Tab, Row, Col, Nav, Container } from 'react-bootstrap';
import GDCValuesTable from './GDCValuesTable';
import CTDCValuesTable from './CTDCValuesTable';
import ICDCValuesTable from './ICDCValuesTable';
import PCDCValuesTable from './PCDCValuesTable';

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
  padding: 0.6rem 2rem;
  width: 10rem;
  inline-size: 10rem;

  &&.active {
    color: #fff;
    text-transform: uppercase;
    background-color: #535F74;
    padding: 0.7rem 2rem;
    margin: auto;
  }
`;

const NavStyled = styled(Nav)`
  border-bottom: none;

  && ${NavLinkStyled} {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    border-right: 1px solid #042A68;
  }

  && ${NavLinkStyled}.active {
    border: none;
  }
`;

const SingleTabsController = (props) => {
  return (
    <div>
      <Tab.Container id="graph-tabs-controller" defaultActiveKey="gdc">
        <Container>
          <Row className="clearfix">
            <TabNavsCol sm={12}>
              <NavStyled variant="tabs">
                <Nav.Item>
                  <NavLinkStyled eventKey="gdc">GDC</NavLinkStyled>
                </Nav.Item>
                <Nav.Item>
                  <NavLinkStyled eventKey="ctdc">CTDC</NavLinkStyled>
                </Nav.Item>
                <Nav.Item>
                  <NavLinkStyled eventKey="icdc">ICDC</NavLinkStyled>
                </Nav.Item>
                <Nav.Item>
                  <NavLinkStyled eventKey="pcdc">PCDC</NavLinkStyled>
                </Nav.Item>
              </NavStyled>
            </TabNavsCol>
            <Col sm={12}>
              <Tab.Content transition="false">
                <Tab.Pane unmountOnExit={true} eventKey="gdc">
                  <GDCValuesTable values={props.source}/>
                </Tab.Pane>
                <Tab.Pane unmountOnExit={true} eventKey="ctdc">
                  <CTDCValuesTable values={props.source}/>
                </Tab.Pane>
                <Tab.Pane unmountOnExit={true} eventKey="icdc">
                  <ICDCValuesTable values={props.source}/>
                </Tab.Pane>
                <Tab.Pane unmountOnExit={true} eventKey="pcdc">
                  <PCDCValuesTable values={props.source} info={props.info}/>
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Container>
      </Tab.Container>
    </div>
  );
};

export default SingleTabsController;
