import React, { useState } from 'react';
import styled from 'styled-components';
import { Container, Row, Col, Table, Tab, Nav, Collapse} from 'react-bootstrap';
import LazyLoad from 'react-lazyload';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faAngleUp, faAngleDown, faSpinner} from '@fortawesome/free-solid-svg-icons';
import { getHighlightObj, sortAlphabetically, sortSynonyms, browserDetection } from '../../shared';

const ContainerStyled = styled(Container)`
  font-size: 1rem;
  padding-left: 15px;
  padding-right: 15px;
  background-color: var(--white-bkgd);
  border-radius: 1rem;
  height: 45rem;
  border: 2px solid #535F74;
  overflow: hidden;
`;

const TableThead = styled(Row)`
  background: #535F74;
  display: flex;
  align-items: center;
  border-radius: 0.8rem 0.8rem 0 0;
`;

const TableTh = styled.div`
  font-family: 'Lato-Bold', sans-serif;
  font-size: 1rem;
  text-align: center;
  color: var(--white);
  padding-top: 0.625rem;
  padding-bottom: 0.625rem;
`;

const TableBody = styled(Row)`
  overflow-y: auto;
  max-height: 42rem;
`;

const TableRow = styled(Row)`
  border-bottom: 1px solid #BBC5CD;
  display: flex;
  align-items: stretch;
`;

const TableRowValue = styled(TableRow)`
  border-bottom: 1px solid #ecf0f1;
`;

const TableCol = styled(Col)`
  text-align: left;
  padding-top: 12px;
  padding-bottom: 12px;
  line-height: 1.428571;
`;

const TableUl = styled.ul`
  padding-left: 15px;
  list-style: none;
`;

const TableLi = styled.li`
  position: relative;
  word-wrap: break-word;
`;

const SpanIcon = styled.span`
  left: -0.9rem;
  top: 0.2rem;
  position: absolute;
  width: 1rem;
  line-height: inherit;
  color: var(--checkbox-green);
  transform: rotate(45deg);
`;

const TableValues = styled(Col)`
  border-left: 1px solid #BBC5CD;
`;

const ColRight = styled(Col)`
  text-align: right;
`;


const Indicator = styled.div`
  position: relative;
  padding-bottom: 36%;
`;

const IndicatorContent = styled.div`
  width: 60%;
  min-width: 550px;
  text-align: center;
  margin: auto;
  padding: 1em 0;
  background-color: #fff;
  color: #535a60;
  font-size: 1.2em;
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  transform: translateY(-50%);
`;

const RowCenter = styled(Row)`
    height: 180px;
    align-content: center;
    justify-content: center;
    color: #888;
`;


const GDCValuesTable = (props) => {
  let items = JSON.parse(JSON.stringify(props.values));
  let values = [];

  items.forEach((data) => {
    if(data._source.source !== 'gdc') return;
    let enums = data.inner_hits.enum;
    if (enums.hits.hits.length !== 0) { // If the searched term is cde id.
      let enumHits = enums.hits.hits;
      let obj = {};
      obj.category = data._source.category;
      obj.node = data._source.node;
      obj.property = data._source.prop;
      obj.id = data._source.id;
      obj.cdeId = data._source.cde ? data._source.cde.id : undefined;
      obj.cdeUrl = data._source.cde ? data._source.cde.url : undefined;
      obj.vs = [];
      let highlightCdeId = data.highlight !== undefined && ('cde.id' in data.highlight) ? data.highlight['cde.id'] : undefined;
      // if (highlightCdeId !== undefined) {
      //   if (data._source.enum !== undefined) obj.vs = getAllValues(data);
      // }
      enumHits.forEach(hits => {
        let highlight = hits.highlight;

        let highlightValue = ('enum.n' in highlight) || ('enum.n.have' in highlight) ? highlight['enum.n'] || highlight['enum.n.have'] : undefined;
        let highlightValueObj = getHighlightObj(highlightValue);

        let highlightSyn = ('enum.ncit.s.n' in highlight) || ('enum.ncit.s.n.have' in highlight) ? highlight['enum.ncit.s.n'] || highlight['enum.ncit.s.n.have'] : undefined;
        let highlightSynObj = getHighlightObj(highlightSyn);

        let highlightNC = ('enum.ncit.c' in highlight) || ('enum.ncit.c.have' in highlight) ? highlight['enum.ncit.c'] || highlight['enum.ncit.c.have'] : undefined;
        let highlightNCObj = getHighlightObj(highlightNC);

        let highlightIC = ('enum.icdo.c' in highlight) || ('enum.icdo.have' in highlight) ? highlight['enum.icdo.c'] || highlight['enum.icdo.have'] : undefined;
        let highlightICObj = getHighlightObj(highlightIC);

        if (highlightCdeId === undefined) {
          let valueObj = {};
          let source = hits._source;
          valueObj.n = highlightValueObj[source.n] !== undefined ? highlightValueObj[source.n] : source.n;
          valueObj.src_n = source.n;
          //valueObj.drug = source.drug;
          if (source.ncit !== undefined) {
            source.ncit.forEach(data => {
              let newSyn = [];
              let preferredTerm;
              data.s.forEach(s => {
                if (s.src !== 'NCI') return;
                let synObj = {};
                synObj.termName = highlightSynObj[s.n] ? highlightSynObj[s.n] : s.n;
                synObj.termSource = s.src;
                synObj.termGroup = s.t;
                if (s.t === 'PT' && preferredTerm === undefined) {
                  preferredTerm = s.n;
                }
                newSyn.push(synObj);
              });
              data.n_c = highlightNCObj[data.c] ? highlightNCObj[data.c] : data.c;
              data.id = (obj.property + '-' + valueObj.src_n + '-' + data.n_c).replace(/[^a-zA-Z0-9-]+/gi, '');
              data.pt = preferredTerm;
              data.s = sortSynonyms(newSyn);
              if (data.def !== undefined &&
                data.def.length !== 0 &&
                data.def.find((defs) => defs.defSource === 'NCI') !== undefined) {
                data.def = data.def.find((defs) => defs.defSource === 'NCI').description;
              } else {
                data.def = undefined;
              }
              if (data.ap !== undefined && data.ap.length !== 0) {
                data.ap = data.ap.filter((aps) => {
                  return aps.name === 'CAS_Registry' || aps.name === 'FDA_UNII_Code' || aps.name === 'NSC_Code';
                });
              }
              else{
                data.ap = undefined;
              }
            });
            valueObj.n_syn = source.ncit;
          }
          valueObj.i_c = {};
          valueObj.i_c.c = source.icdo ? highlightICObj[source.icdo.c] ? highlightICObj[source.icdo.c] : source.icdo.c : undefined;
          valueObj.i_c.id = source.icdo ? (obj.property + '-' + valueObj.src_n + '-' + source.icdo.c).replace(/[^a-zA-Z0-9-]+/gi, '') : undefined;
          if (source.icdo && source.icdo.s !== undefined) {
            valueObj.ic_enum = source.icdo.s;
            // source.ic_enum.forEach(ic => {
            //   if (ic.term_type === '*') termTypeNotAssigned = true;
            // });
          }
          obj.vs.push(valueObj);
        }
      });
      obj.vs = sortAlphabetically(obj.vs);
      // valuesCount += obj.vs.length;
      values.push(obj);
    }
  });

  const PlaceholderComponent = () => {
    return (<Col sm={12}>
        <RowCenter>
          <FontAwesomeIcon icon={faSpinner} spin size="2x"/>
        </RowCenter>
      </Col>);
  }

  const TableSynonyms = (props) => {
    if (props.synonyms !== undefined) {
      return props.synonyms.map((item, index) =>
        <tr key={index}>
          <td dangerouslySetInnerHTML={{ __html: item.termName }}></td>
          <td>{item.termSource}</td>
          <td>{item.termGroup}</td>
        </tr>
      );
    }
    return (null);
  };

  const TableICDO3Syns = (props) => {
    if (props.synonyms !== undefined) {
      return props.synonyms.map((item, index) =>
        <tr key={index}>
          <td>{item.n}</td>
          <td>(ICD-O-3)</td>
          <td>{item.t}</td>
        </tr>
      );
    }
    return (null);
  };

  const NcitValue = (props) => {
    if (props.synonym !== undefined) {
      return (
        <div className="ncit-value-container">
          <Row>
            <TableCol xs={12}>
              <b>NCI Thesaurus Code: </b>
              <a href={"https://ncit.nci.nih.gov/ncitbrowser/pages/concept_details.jsf?dictionary=NCI_Thesaurus&code=" + props.synonym.n_c.replace(/<b>/g, '').replace(/<\/b>/g, '')} rel="noopener noreferrer" target="_blank" dangerouslySetInnerHTML={{ __html: props.synonym.n_c }}></a>
            </TableCol>
          </Row>
          <Row>
            <TableCol xs={12}>
              <Table striped bordered condensed="true" hover>
                <thead>
                  <tr>
                    <th>Term</th>
                    <th>Source</th>
                    <th>Type</th>
                  </tr>
                </thead>
                <tbody>
                  <TableSynonyms synonyms={props.synonym.s}/>
                </tbody>
              </Table>
            </TableCol>
          </Row>
        </div>
      );
    }
    return (null);
  };

  const NcitValues = (props) => {
    if (props.ncit !== undefined) {
      return props.ncit.map((item, index) =>
        <div key={index} className="ncit-value-container">
          <Row>
            <TableCol xs={12}>
              <b>NCI Thesaurus Code: </b>
              <a href={"https://ncit.nci.nih.gov/ncitbrowser/pages/concept_details.jsf?dictionary=NCI_Thesaurus&code=" + item.n_c.replace(/<b>/g, '').replace(/<\/b>/g, '')} rel="noopener noreferrer" target="_blank" dangerouslySetInnerHTML={{ __html: item.n_c }}></a>
            </TableCol>
          </Row>
          <Row>
            <TableCol xs={12}>
              <Table striped bordered condensed="true" hover>
                <thead>
                  <tr>
                    <th>Term</th>
                    <th>Source</th>
                    <th>Type</th>
                  </tr>
                </thead>
                <tbody>
                  <TableSynonyms synonyms={item.s}/>
                </tbody>
              </Table>
            </TableCol>
          </Row>
        </div>
      );
    }
    return (null);
  };

  const TabsContent = (props) => {
    if (props.ncit !== undefined || props.icemun !== undefined) {
      return (
        <Tab.Container id="tabs-controller" defaultActiveKey={ props.icemun !== undefined ? props.ic.id : props.ncit[0].id}>
          <Row className="clearfix">
            <Col sm={12}>
              <Nav variant="tabs">
                {props.icemun !== undefined &&
                  <Nav.Item>
                    <Nav.Link eventKey={props.ic.id} dangerouslySetInnerHTML={{ __html: props.ic.c + ' (ICD-O-3)' }}></Nav.Link>
                  </Nav.Item>
                }
                {props.ncit !== undefined &&
                  props.ncit.map((syn, index) =>
                    <Nav.Item>
                      <Nav.Link key={index} eventKey={syn.id} dangerouslySetInnerHTML={{ __html: syn.n_c + ' (NCIt)' }}></Nav.Link>
                    </Nav.Item>
                  )
                }
              </Nav>
            </Col>
            <Col sm={12}>
              <Tab.Content transition="false">
                {props.icemun !== undefined &&
                  <Tab.Pane eventKey={props.ic.id}>
                    <ICDO3Value ic={props.ic} icemun={props.icemun} />
                  </Tab.Pane>
                }
                {props.ncit !== undefined &&
                  props.ncit.map((syn, index) =>
                    <Tab.Pane key={index} eventKey={syn.id}>
                      <NcitValue synonym={syn} />
                    </Tab.Pane>
                  )
                }
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      );
    }
    return (null);
  };

  const ICDO3Value = (props) => {
    if (props.icemun !== undefined) {
      return (
        <div className="icdo3-value-container">
          <Row>
            <TableCol xs={12} dangerouslySetInnerHTML={{ __html: props.ic.c + ' (ICD-O-3)' }}></TableCol>
          </Row>
          <Row>
            <TableCol xs={12}>
              <Table striped bordered condensed="true" hover>
                <thead>
                  <tr>
                    <th>Term</th>
                    <th>Source</th>
                    <th>Type</th>
                  </tr>
                </thead>
                <tbody>
                  <TableICDO3Syns synonyms={props.icemun}/>
                </tbody>
              </Table>
            </TableCol>
          </Row>
        </div>
      );
    }
    return (null);
  };

  const TableValue = (props) => {
    let [isToggleOn, setIsToggleOn] = useState(false);

    const ToggleTableHandler = event => {
      event.preventDefault();
      setIsToggleOn(!isToggleOn);
    };

    return (
      <TableCol xs={12}>
        <Row>
          <Col xs={10}>
            {((props.nsyn !== undefined && props.nsyn.length !== 0) || props.icemun !== undefined) 
              ? <a href="/#" dangerouslySetInnerHTML={{ __html: props.name }} onClick={ToggleTableHandler}></a>
              : <span dangerouslySetInnerHTML={{ __html: props.name }}></span>
            }
          </Col>
          <ColRight xs={2}>
            {((props.nsyn !== undefined && props.nsyn.length !== 0) || props.icemun !== undefined) &&
              <a href="/#" aria-label={isToggleOn === true ? 'collapse' : 'expand'} onClick={ToggleTableHandler}>
                {isToggleOn === true
                  ? <FontAwesomeIcon icon={faMinus}/>
                  : <FontAwesomeIcon icon={faPlus}/>
                }
              </a>
            }
          </ColRight>
        </Row>
        {((props.nsyn !== undefined && props.nsyn.length !== 0) || props.icemun !== undefined) &&
          <Collapse in={isToggleOn} mountOnEnter={true}>
            <div className="ncit-values">
              {(props.nsyn !== undefined && props.nsyn.length === 1 && props.icemun === undefined) &&
                <NcitValues ncit={props.nsyn} />
              }
              {((props.nsyn !== undefined && props.icemun !== undefined) || (props.nsyn !== undefined && props.nsyn.length > 1)) &&
                <TabsContent ncit={props.nsyn} ic={props.ic} icemun={props.icemun} />
              }
              {(props.nsyn === undefined && props.icemun !== undefined) &&
                <ICDO3Value ic={props.ic} icemun={props.icemun} />
              }
            </div>
          </Collapse>
        }
      </TableCol>
    );
  };

  const ValueItem = (props) => {
    let [isToggleOn, setIsToggleOn] = useState(false);

    const ToggleTableHandler = event => {
      event.preventDefault();
      setIsToggleOn(!isToggleOn);
    };

    return(
      <TableRow key={props.index}>
        <TableCol xs={3}>
          {props.item.category}
          <TableUl>
            <TableLi><SpanIcon><FontAwesomeIcon icon={faAngleDown}/></SpanIcon>{props.item.node.n}
              <TableUl>
                <TableLi><SpanIcon><FontAwesomeIcon icon={faAngleDown}/></SpanIcon>{props.item.property.n}</TableLi>
              </TableUl>
            </TableLi>
          </TableUl>
        </TableCol>

        <TableValues xs={9}>
          <div>
            {props.item.vs.slice(0,5).map((value, index) => {
              return(
                <TableRowValue data-class="TableRowValue" key={index}>
                  <TableValue name={value.n} ic={value.i_c} icemun={value.ic_enum} nsyn={value.n_syn}/>
                </TableRowValue>
              )
            })}
            {props.item.vs.length > 5 && 
            <Collapse in={isToggleOn} mountOnEnter={true}>
              <div>
                {props.item.vs.map((value, index) => {
                  if (index >= 5) {
                    return(
                      <TableRowValue data-class="TableRowValue" key={index}>
                        <TableValue name={value.n} ic={value.i_c} icemun={value.ic_enum} nsyn={value.n_syn}/>
                      </TableRowValue>
                    )
                  }
                  return null;
                })}
              </div>
            </Collapse>
            }
          </div>
          {props.item.vs.length > 5 && 
            <TableRowValue data-class="TableRowValue">
              <TableCol data-class="TableCol" xs={12}>
              {isToggleOn === false ? (
                <a href="/#" aria-label="Show More" aria-expanded="false" data-hidden={props.item.vs.length - 5} onClick={ToggleTableHandler}>
                  <FontAwesomeIcon icon={faAngleDown}/> Show More ({props.item.vs.length - 5})
                </a>
              ) : (
                <a href="/#" aria-label="Show Less" aria-expanded="true" data-hidden={props.item.vs.length - 5} onClick={ToggleTableHandler}>
                  <FontAwesomeIcon icon={faAngleUp}/> Show Less
                </a>
              )}
              </TableCol>
            </TableRowValue>
          }
        </TableValues>
      </TableRow>
    );
  }

  const LazyLoadContainer = (props) => {
    return (
      <LazyLoad height={180} once overflow={true} offset={200} key={props.index} placeholder={<PlaceholderComponent />} classNamePrefix="lazyload-gdc">
        {props.children}
      </LazyLoad>
    );
  }

  if (values.length !== 0) {
    return (
    <ContainerStyled>
      <TableThead>
        <Col xs={3}>
          <TableTh>Category / Node / Property</TableTh>
        </Col>
        <Col xs={9}>
          <TableTh>Matched GDC Values</TableTh>
        </Col>
      </TableThead>
      <TableBody>
        {(values.length < 6 || browserDetection.isEdge)
          ? 
          <Col xs={12}>
            {values.map((item, index) => 
              <ValueItem item={item} key={index} />
            )}
          </Col>
          :
          <Col xs={12}>
            {values.map((item, index) => 
              <LazyLoadContainer key={index}>
                <ValueItem item={item} key={index}/>
              </LazyLoadContainer>
            )}
          </Col>
        }
      </TableBody>
    </ContainerStyled>
    );
  } else {
    return (
      <ContainerStyled>
        <Indicator>
          <IndicatorContent>
            Sorry, no results found.
          </IndicatorContent>
        </Indicator>
      </ContainerStyled>
    );
  }
};

export default GDCValuesTable;
