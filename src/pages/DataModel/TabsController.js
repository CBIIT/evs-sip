import React from 'react';
import styled from 'styled-components';
import { Tab, Row, Col, Nav, Container } from 'react-bootstrap';
import GDCModel from './GDCModel';
import CTDCModel from './CTDCModel';
import ICDCModel from './ICDCModel';
import PCDCModel from './PCDCModel';

const TabNavsCol = styled(Col)`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const NavSpan = styled.span`
  width: 12rem;
  inline-size: 12rem;
`;

const NavLinkStyled = styled(Nav.Link)`
  position: relative;
  font-family: 'Raleway-Medium', sans-serif;
  font-size: 1rem;
  text-align: center;
  color: #286070;
  background-color: transparent;
  padding: 0.2rem 3rem .2rem 2rem;
  text-transform: uppercase;
  height: 5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 0;
  border-color: transparent !important;

  &&.active {
    font-family: 'Raleway-Bold', sans-serif;
    color: #009ECC;
    font-size: 1.125rem;
    text-transform: uppercase;
    background-color: transparent;
    padding: 0.2rem 3rem .2rem 2rem;
  }

  &&.active > ${NavSpan} {
    width: 14rem;
    inline-size: 14rem;
  }

  &&.active::after {
    background-color: #fff;
  }

  &&::after {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: -1;
    outline: 1px solid transparent;
    background-color: #C1E8F6;
    box-shadow: 0px 0px 1.5rem #bbb;
    content: '';
    -webkit-transform: perspective(5px) rotateX(0.93deg) translateZ(-1px);
    transform: perspective(5px) rotateX(0.93deg) translateZ(-1px);
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
  }

`;

const NavStyled = styled(Nav)`
  flex-direction: row-reverse;
  margin-left: -4rem;
`;

const NavItemStyled = styled(Nav.Item)`
  width: 20rem;
  margin-right: -3.25rem;
  &:last-child {
    width: 18rem;
  }
`;

const TabsController = (props) => {

  const selectHandler = (k) => {
    props.setDataModel(k);
  }

  return (
    <div>
      <Tab.Container id="tabs-controller" defaultActiveKey="gdc"  activeKey={props.dataModel} onSelect={selectHandler}>
        <Container>
          <Row className="clearfix">
            <TabNavsCol sm={12}>
              <NavStyled variant="tabs">
              <NavItemStyled>
                  <NavLinkStyled eventKey="pcdc">
                    <NavSpan>Pediatric Cancer <br/>Data Commons</NavSpan>
                  </NavLinkStyled>
                </NavItemStyled>
              <NavItemStyled>
                  <NavLinkStyled eventKey="icdc">
                    <NavSpan>Integrated Canine <br/>Data Commons</NavSpan>
                  </NavLinkStyled>
                </NavItemStyled>
                <NavItemStyled>
                  <NavLinkStyled eventKey="ctdc">
                    <NavSpan>Clinical Trial <br/>Data Commons</NavSpan>
                  </NavLinkStyled>
                </NavItemStyled>
                <NavItemStyled>
                  <NavLinkStyled eventKey="gdc">
                    <NavSpan>Genomic <br/>Data Commons</NavSpan>
                  </NavLinkStyled>
                </NavItemStyled>
              </NavStyled>
            </TabNavsCol>
            <Col sm={12}>
              <Tab.Content transition="false">
                <Tab.Pane unmountOnExit={true} eventKey="gdc">
                  <GDCModel/>
                </Tab.Pane>
                <Tab.Pane unmountOnExit={true} eventKey="ctdc">
                  <CTDCModel/>
                </Tab.Pane>
                <Tab.Pane unmountOnExit={true} eventKey="icdc">
                  <ICDCModel/>
                </Tab.Pane>
                <Tab.Pane unmountOnExit={true} eventKey="pcdc">
                  <PCDCModel/>
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Container>
      </Tab.Container>
    </div>
  );
};

export default TabsController;
