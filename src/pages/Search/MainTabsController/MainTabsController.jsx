import styles from './MainTabsController.module.css'
import { Tab, Row, Col, Nav, Container, Alert } from 'react-bootstrap'
import TabsController from '../TabsController/TabsController';
import GraphTabsController from '../GraphTabsController/GraphTabsController';
import SingleTabsController from '../SingleTabsController/SingleTabsController';
// import { useSelector } from 'react-redux'


const MainTabsController = (props) => {
  // const error = useSelector((state) => state.search.error)
  // const result = useSelector((state) => state.search.result)
  // const searchTerm = useSelector((state) => state.search.searchTerm)

  if (Object.keys(props.result).length !== 0 && props.result.returnList !== undefined && props.result.returnList.length !== 0) {
    return (
      <div className={styles.result}>
        <Tab.Container id="main-tabs-controller" defaultActiveKey="cross" transition={false}>
          <Container>
            <Row className="clearfix">
              <Col className={styles['nav-tabs-text-col']} sm={12}>
                <h2 className={styles['nav-tabs-text']}>
                  Search Results for <span className={styles['nav-tabs-span']}>{props.keyword}</span> in:
                </h2>
                {props.result.total !== undefined && props.result.total >= 50 && (
                  <div className={styles['alert-content']}>
                    <Alert variant="warning">
                      <Alert.Heading>Warning!</Alert.Heading>
                      <p>Your Search term was too general - not all results are displayed.</p>
                      <hr />
                      <p className="mb-0">Please modify your search to narrow the results.</p>
                    </Alert>
                  </div>
                )}
              </Col>
              <Col className={styles['nav-tabs-col']} sm={12}>
                <Nav className={styles['nav-tabs']} variant="tabs">
                  <Nav.Item className={styles['nav-item']}>
                    <Nav.Link as="button" className={styles['nav-link']} eventKey="cross">
                      Cross Source View
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item className={styles['nav-item']}>
                    <Nav.Link as="button" className={styles['nav-link']} eventKey="single">
                      Single Source View
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item className={styles['nav-item']}>
                    <Nav.Link as="button" className={styles['nav-link']} eventKey="graph">
                      Graphical View
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Col>
              <Col sm={12}>
                <Tab.Content className={styles['tab-content']}>
                  <Tab.Pane unmountOnExit={false} eventKey="cross">
                    <TabsController source={props.result.returnList} />
                  </Tab.Pane>
                  <Tab.Pane unmountOnExit={true} eventKey="single">
                    <SingleTabsController source={props.result.returnList} info={props.result.info} />
                  </Tab.Pane>
                  <Tab.Pane unmountOnExit={true} eventKey="graph">
                    <GraphTabsController keyword={props.keyword} source={props.result.returnList} />
                  </Tab.Pane>
                </Tab.Content>
              </Col>
            </Row>
          </Container>
        </Tab.Container>
      </div>
    )
  } else if (Object.keys(props.result).length !== 0 && props.result.returnList !== undefined && props.result.returnList.length === 0) {
    return (
      <div>
        <Container>
          <Row className="clearfix">
            <Col className={styles['nav-tabs-text-col']} sm={12}>
              <div className={styles.indicator}>
                <h2>
                  Sorry, no results found for keyword: <span>{props.keyword}</span>
                </h2>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    )
  } else if (Object.keys(props.result).length !== 0 && props.result.timedOut !== undefined && props.result.timedOut === true) {
    return (
      <div>
        <Container>
          <Row className="clearfix">
            <Col className={styles['nav-tabs-text-col']} sm={12}>
              <h2 className={styles['nav-tabs-text']}>
                Search Results for <span className={styles['nav-tabs-span']}>{props.keyword}</span> in:
              </h2>
              <div className={styles['alert-content']}>
                <Alert variant="danger">
                  <Alert.Heading>Error!</Alert.Heading>
                  <p>
                    Your Search term was too general and has timed out. Please modify your search to narrow the results.
                  </p>
                </Alert>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    )
  } else if (Object.keys(props.result).length === 0 && props.errors !== undefined && props.errors === true) {
    return (
      <div>
        <Container>
          <Row className="clearfix">
            <Col className={styles['nav-tabs-text-col']} sm={12}>
              <div className={`${styles.indicator} ${styles['indicator-error']}`}>
                <h2>Please, enter a valid keyword!.</h2>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    )
  } else {
    return <div></div>
  }
}

export default MainTabsController
