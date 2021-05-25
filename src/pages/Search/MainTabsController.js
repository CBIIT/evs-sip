import React from 'react';
import styled from 'styled-components';
import { Tab, Row, Col, Nav, Container, Alert } from 'react-bootstrap';
import TabsController from './TabsController';
import GraphTabsController from './GraphTabsController';
import SingleTabsController from './SingleTabsController';

const Result = styled.div`
  border-radius: 5px;
  background-color: var(--white);
  padding: 2rem 0;
`;

const TabNavsCol = styled(Col)`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TabNavTextCol= styled(Col)`
  margin-bottom: 2rem;
`;

const TabNavText = styled.h2`
  font-family: 'Raleway-Medium', sans-serif;
  font-size: 1.875rem;
  color: #042A68;
  max-width: 100%;
  text-align: center;
  margin: auto 0;
`;

const TabNavSpan = styled.span`
  font-family: 'Raleway-ExtraBold', sans-serif;
  border-bottom: 0.375rem solid #397DED;
`;

const TabContentStyled = styled(Tab.Content)`
  background-color: #DDEAFF;
  border: 2px solid #397DED;
  border-radius: 2rem;
  padding: 1rem;
`;

const NavItemStyled = styled(Nav.Item)`
  position: relative;
  display: block;
  float: left;
`;

const NavLinkStyled = styled(Nav.Link)`
  font-family: 'Raleway-Medium', sans-serif;
  font-size: 1.125rem;
  color: #042A68;
  width: 18rem;
  text-transform: uppercase;
  background-color: #EBEBEB;
  padding: .7rem 1rem;
  text-align: center;
  margin: 0 0.0625rem;

  &&.active {
    font-family: 'Raleway-Bold',sans-serif;
    font-size: 1.3125rem;
    background-color: #DDEAFF;
    color: #042A68;
    padding: 1rem 1.5rem;
  }
`;

const NavStyled = styled(Nav)`
border-bottom: none;

&& ${NavLinkStyled} {
  border: 0.5rem solid var(--white);
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

&& ${NavLinkStyled}.active {
  border-top: 2px solid #397DED;
  border-left: 2px solid #397DED;
  border-right: 2px solid #397DED;
  border-bottom: 0;
  position: relative;
  bottom: -1px;
  z-index: 10;
  padding-bottom: 1.1rem;
}
`;

const AlertContainer = styled.div`
  margin-top: 2rem;
`;

const Indicator = styled.div`
  && > h2 {
    font-family: 'Raleway-Medium',sans-serif;
    font-size: 1.563rem;
    background-color: #fff;
    padding: 3em 0;
    color: ${props => props.variant === 'error' ? '#bf063b' : '#042A68'};
    max-width: 100%;
    text-align: center;
  }

  && > h2 > span {
    font-family: 'Raleway-ExtraBold',sans-serif;
    border-bottom: 0.25rem solid #397DED;
  }
 `;

const MainTabsController = (props) => {
  if (Object.keys(props.result).length !== 0 && props.result.returnList !== undefined && props.result.returnList.length !== 0) {
    return (
      <Result>
        <Tab.Container id="main-tabs-controller" defaultActiveKey="cross">
          <Container>
            <Row className="clearfix">
              <TabNavTextCol sm={12}>
                <TabNavText>Search Results for <TabNavSpan>{props.keyword}</TabNavSpan> in:</TabNavText>
                {(props.result.total !== undefined && props.result.total >= 50) && 
                  <AlertContainer>
                  <Alert variant="warning">
                    <Alert.Heading>Warning!</Alert.Heading>
                    <p>
                      Your Search term was too general - not all results are displayed.
                    </p>
                    <hr />
                    <p className="mb-0">
                      Please modify your search to narrow the results.
                    </p>
                  </Alert>
                </AlertContainer>
                }
              </TabNavTextCol>
              <TabNavsCol sm={12}>
                <NavStyled variant="tabs">
                  <NavItemStyled>
                    <NavLinkStyled eventKey="cross">Cross Source View</NavLinkStyled>
                  </NavItemStyled>
                  <NavItemStyled>
                    <NavLinkStyled eventKey="single">Single Source View</NavLinkStyled>
                  </NavItemStyled>
                  <NavItemStyled>
                    <NavLinkStyled eventKey="graph">Graphical View</NavLinkStyled>
                  </NavItemStyled>
                </NavStyled>
              </TabNavsCol>
              <Col sm={12}>
                <TabContentStyled transition="false">
                  <Tab.Pane unmountOnExit={false} eventKey="cross">
                    <TabsController source={props.result.returnList}/>
                  </Tab.Pane>
                  <Tab.Pane unmountOnExit={true} eventKey="single">
                    <SingleTabsController source={props.result.returnList} info={props.result.info}/>
                  </Tab.Pane>
                  <Tab.Pane unmountOnExit={true} eventKey="graph">
                    <GraphTabsController keyword={props.keyword} source={props.result.returnList}/>
                  </Tab.Pane>
                </TabContentStyled>
              </Col>
            </Row>
          </Container>
        </Tab.Container>
      </Result>
    );
  }
  else if (Object.keys(props.result).length !== 0 && props.result.returnList !== undefined && props.result.returnList.length === 0) {
    return(
      <Result>
          <Container>
            <Row className="clearfix">
              <TabNavTextCol sm={12}>
                <Indicator>
                  <h2>
                    Sorry, no results found for keyword: <span>{props.keyword}</span>
                  </h2>
                </Indicator>
              </TabNavTextCol>
            </Row>
          </Container>
      </Result>
    )
  }
  else if (Object.keys(props.result).length !== 0 && props.result.timedOut !== undefined && props.result.timedOut === true) {
    return(
      <Result>
          <Container>
            <Row className="clearfix">
              <TabNavTextCol sm={12}>
                <TabNavText>Search Results for <TabNavSpan>{props.keyword}</TabNavSpan> in:</TabNavText>
                  <AlertContainer>
                  <Alert variant="danger">
                    <Alert.Heading>Error!</Alert.Heading>
                    <p>
                      Your Search term was too general and has timed out. Please modify your search to narrow the results.
                    </p>
                  </Alert>
                </AlertContainer>
              </TabNavTextCol>
            </Row>
          </Container>
      </Result>
    )
  }
  else if (Object.keys(props.result).length === 0 && props.errors !== undefined && props.errors === true) {
    return(
      <Result>
          <Container>
            <Row className="clearfix">
              <TabNavTextCol sm={12}>
                <Indicator variant="error">
                  <h2>
                    Please, enter a valid keyword!.
                  </h2>
                </Indicator>
              </TabNavTextCol>
            </Row>
          </Container>
      </Result>
    )
  }
  else{
    return(<div></div>);
  }
};

export default MainTabsController;
