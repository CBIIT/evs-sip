import React from 'react';
import styled from 'styled-components';
import { Tab, Row, Col, Nav, Container } from 'react-bootstrap';
import CrossValuesTable from './CrossValuesTable';
import PropsTable from './PropsTable';
import NodesTable from './NodesTable';

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
  padding: .6rem 2rem;
  width: 14rem;
  inline-size: 14rem;

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

const TabsController = (props) => {
  return (
    <div>
      <Tab.Container id="tabs-controller" defaultActiveKey="values">
        <Container>
          <Row className="clearfix">
            <TabNavsCol sm={12}>
              <NavStyled variant="tabs">
                <Nav.Item>
                  <NavLinkStyled eventKey="values">Values</NavLinkStyled>
                </Nav.Item>
                <Nav.Item>
                  <NavLinkStyled eventKey="properties">Properties</NavLinkStyled>
                </Nav.Item>
                <Nav.Item>
                  <NavLinkStyled eventKey="nodes">Nodes</NavLinkStyled>
                </Nav.Item>
              </NavStyled>
            </TabNavsCol>
            <Col sm={12}>
              <Tab.Content transition="false">
                <Tab.Pane unmountOnExit={false} eventKey="values">
                  <CrossValuesTable values={props.source} />
                </Tab.Pane>
                <Tab.Pane unmountOnExit={true} eventKey="properties">
                  <PropsTable properties={props.source}/>
                </Tab.Pane>
                <Tab.Pane unmountOnExit={true} eventKey="nodes">
                  <NodesTable nodes={props.source}/>
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
