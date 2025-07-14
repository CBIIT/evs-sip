import styles from './GraphTabsController.module.css'
import { Tab, Row, Col, Nav, Container } from 'react-bootstrap'
import GraphicalView from '../../../components/GraphicalView'

const GraphTabsController = (props) => {
  return (
    <div>
      <Tab.Container id="graph-tabs-controller" defaultActiveKey="gdc">
        <Container>
          <Row className="clearfix">
            <Col sm={12}>
              <div className={styles['nav-container']}>
                <Nav className={styles['nav-tabs']} variant="tabs">
                  <Nav.Item>
                    <Nav.Link as="button" className={styles['nav-link']} eventKey="gdc">
                      GDC
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link as="button" className={styles['nav-link']} eventKey="ctdc">
                      CTDC
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link as="button" className={styles['nav-link']} eventKey="icdc">
                      ICDC
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link as="button" className={styles['nav-link']} eventKey="pcdc">
                      PCDC
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </div>
            </Col>
            <Col sm={12}>
              <Tab.Content transition="false" style={{ fontSize: '1rem' }}>
                <Tab.Pane unmountOnExit={true} eventKey="gdc">
                  <GraphicalView type="gdc" keyword={props.keyword} source={props.source} />
                </Tab.Pane>
                <Tab.Pane unmountOnExit={true} eventKey="ctdc">
                  <GraphicalView type="ctdc" keyword={props.keyword} source={props.source} />
                </Tab.Pane>
                <Tab.Pane unmountOnExit={true} eventKey="icdc">
                  <GraphicalView type="icdc" keyword={props.keyword} source={props.source} />
                </Tab.Pane>
                <Tab.Pane unmountOnExit={true} eventKey="pcdc">
                  <GraphicalView type="pcdc" keyword={props.keyword} source={props.source} />
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Container>
      </Tab.Container>
    </div>
  )
}

export default GraphTabsController
