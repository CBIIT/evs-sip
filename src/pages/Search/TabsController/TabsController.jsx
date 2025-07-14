import styles from './TabsController.module.css'
import { Tab, Row, Col, Nav, Container } from 'react-bootstrap'
import CrossValuesTable from '../CrossValuesTable';
import PropsTable from '../PropsTable'
import NodesTable from '../NodesTable'

const TabsController = (props) => {
  return (
    <div>
      <Tab.Container id="tabs-controller" defaultActiveKey="values">
        <Container>
          <Row className="clearfix">
            <Col sm={12}>
              <div className={styles['nav-container']}>
                <Nav className={styles['nav-tabs']} variant="tabs">
                  <Nav.Item>
                    <Nav.Link as="button" className={styles['nav-link']} eventKey="values">
                      Values
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link as="button" className={styles['nav-link']} eventKey="properties">
                      Properties
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link as="button" className={styles['nav-link']} eventKey="nodes">
                      Nodes
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </div>
            </Col>
            <Col sm={12}>
              <Tab.Content transition="false">
                <Tab.Pane unmountOnExit={false} eventKey="values">
                  <CrossValuesTable values={props.source} />
                </Tab.Pane>
                <Tab.Pane unmountOnExit={true} eventKey="properties">
                  <PropsTable properties={props.source} />
                </Tab.Pane>
                <Tab.Pane unmountOnExit={true} eventKey="nodes">
                  <NodesTable nodes={props.source} />
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Container>
      </Tab.Container>
    </div>
  )
}

export default TabsController
