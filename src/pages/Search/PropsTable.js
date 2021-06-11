import React, { useState } from 'react';
import styled from 'styled-components';
import { Container, Row, Col, Table, Collapse} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { getHighlightObj } from '../../shared';

import AllValuesModal from '../../components/Modals/AllValuesModal';
import ToCompareModal from '../../components/Modals/ToCompareModal';

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
  max-height: 39rem;
`;

const TableRow = styled(Row)`
  height: auto;
  flex-basis: auto;
  flex-grow: 1;
`;

const TableCol = styled(Col)`
  text-align: left;
  padding-top: 12px;
  padding-bottom: 12px;
  line-height: 1.428571;
`;

const TableColLeft = styled(TableCol)`
  border-bottom: 1px solid #BBC5CD;
`;

const TableColRight = styled(Col)`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  border-left: 1px solid #BBC5CD;
`;

const TableColFlex = styled(Col)`
  display: flex;
`;

const TableRowProps = styled(Row)`
  height: 100%;
  flex-basis: auto;
  flex-grow: 1;
  border-bottom: 1px solid #BBC5CD;
`;

const TableColProps = styled(TableCol)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const TableUl = styled.ul`
  padding-left: 15px;
  list-style: none;
`;

const TableLi = styled.li`
  position: relative;
  word-wrap: break-word;
`;

const TableStyled = styled(Table)`
  margin-bottom: 0;
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

const DivCenter = styled.div`
  text-align: center;
  padding: 1rem 0;
`;

const CodeSpan = styled.span`
  color: #475162;
  font-size: 1.25rem;
  font-weight: bold;
`;

const ColRight = styled(Col)`
  text-align: right;
`;

const LinkDesc = styled.a`
  padding-left: 0.5rem;
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

const PropsTable = (props) => {
  let items = JSON.parse(JSON.stringify(props.properties));
  let properties = [];

  items.forEach(item => {
    let prop = item.inner_hits.prop;

    if (prop.hits.hits.length !== 0) {
      let propHits = prop.hits.hits;

      propHits.forEach((hits) => {
        let hl = hits.highlight;

        let highlightProp = ('prop.n' in hl) || ('prop.n.have' in hl) ? hl['prop.n'] || hl['prop.n.have'] : undefined;
        let highlightPropObj = getHighlightObj(highlightProp);

        let highlightDesc = ('prop.d' in hl) || ('prop.d.have' in hl) ? hl['prop.d'] || hl['prop.d.have'] : undefined;
        let highlightDescObj = getHighlightObj(highlightDesc);

        let highlightNC = ('prop.ncit.c' in hl) || ('prop.ncit.c.have' in hl) ? hl['prop.ncit.c'] || hl['prop.ncit.c.have'] : undefined;
        let highlightNCObj = getHighlightObj(highlightNC);

        let highlightSyn = ('prop.ncit.s.n' in hl) || ('prop.ncit.s.n.have' in hl) ? hl['prop.ncit.s.n'] || hl['prop.ncit.s.n.have'] : undefined;
        let highlightSynObj = getHighlightObj(highlightSyn);

        let propObj = {};
        propObj.category = item._source.category;
        propObj.node = item._source.node;
        propObj.id = item._source.id;
        propObj.source = item._source.source;
        propObj.property = item._source.prop;
        propObj.type = item._source.type;
        propObj.property.n = highlightPropObj[item._source.prop.n] ? highlightPropObj[item._source.prop.n] : item._source.prop.n;
        propObj.property.d = highlightDescObj[item._source.prop.d] ? highlightDescObj[item._source.prop.d] : item._source.prop.d;
        
        propObj.ncit = hits._source.ncit ? hits._source.ncit : undefined;

        if (propObj.ncit !== undefined && propObj.ncit !== 0) {
          propObj.ncit.forEach((ncit, i) => {
            propObj.ncit[i].c = highlightNCObj[ncit.c] ? highlightNCObj[ncit.c] : ncit.c;

            if (ncit.s !== undefined && ncit.s !== 0) {
              ncit.s.forEach((s, j) => {
                propObj.ncit[i].s[j].n = highlightSynObj[s.n] ? highlightSynObj[s.n] : s.n;
              })
            }
          });
        }

        properties.push(propObj);

      });
    }
  });

  let mappingObj = {};
  properties.forEach((prop) => {
    if(prop.ncit !== undefined && prop.ncit !== 0){
        prop.ncit.forEach((nt) => {
          if(mappingObj[nt.c] === undefined) {
            mappingObj[nt.c] = [];
            mappingObj[nt.c].push(prop);
          } else {
            mappingObj[nt.c].push(prop);
          }
        })
    }
    else {
      if(mappingObj['no-mapping'] === undefined) {
        mappingObj['no-mapping'] = [];
        mappingObj['no-mapping'].push(prop);
      } else {
        mappingObj['no-mapping'].push(prop);
      }
    }
  });

  let crossProps = [];

  Object.entries(mappingObj).forEach((entry)=> {
    let ctdcProps = [];
    let gdcProps = [];
    let icdcProps = [];
    let pcdcProps = [];

    if(entry[1] !== undefined && entry[1].length !== 0){
      entry[1].forEach(prop => {
        if(prop.source !== undefined && prop.source === 'gdc'){
          gdcProps.push(prop);
        }
        if(prop.source !== undefined && prop.source === 'ctdc'){
          ctdcProps.push(prop);
        }
        if(prop.source !== undefined && prop.source === 'icdc'){
          icdcProps.push(prop);
        }
        if(prop.source !== undefined && prop.source === 'pcdc'){
          pcdcProps.push(prop);
        }
      });
    }

    crossProps.push({
      code: entry[0] !== 'no-mapping' ? entry[0]: 'No NCIt Mapping',
      ref: 'NCIt',
      props: {
        ctdc: ctdcProps,
        gdc: gdcProps,
        icdc: icdcProps,
        pcdc: pcdcProps
      }
    })
  });

  const TableSynonyms = (props) => {
    if (props.synonyms !== undefined) {
      return props.synonyms.map((item, index) =>
        <tr key={index}>
          <td dangerouslySetInnerHTML={{ __html: item.n }}></td>
          <td>{item.src}</td>
          <td>{item.t}</td>
        </tr>
      );
    }
    return (null);
  };

  const NcitProps = (props) => {
    if (props.ncit !== undefined) {
      return props.ncit.map((item, index) =>
        <div key={index} data-class="ncit-value-container">
          <Row>
            <TableCol xs={12}>
              <b>NCI Thesaurus Code: </b>
              <a href={"https://ncit.nci.nih.gov/ncitbrowser/pages/concept_details.jsf?dictionary=NCI_Thesaurus&code=" + item.c.replace(/<b>/g, '').replace(/<\/b>/g, '')} rel="noopener noreferrer" target="_blank" dangerouslySetInnerHTML={{ __html: item.c }}></a>
            </TableCol>
          </Row>
          <Row>
            <TableCol xs={12}>
              <TableStyled striped bordered condensed="true" hover>
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
              </TableStyled>
            </TableCol>
          </Row>
        </div>
      );
    }
    return (null);
  };

  const DescCollapse = (props) => {

    let [isToggleOn, setIsToggleOn] = useState(false);

    const ToggleTableHandler = event => {
      event.preventDefault();
      setIsToggleOn(!isToggleOn);
    };

    return (
      <p>
        <span dangerouslySetInnerHTML={{ __html: '<b>Definition:</b> ' + props.desc.substring(0, 138)}}></span>
        {props.desc.length >= 138 &&
          <>
            <span className={isToggleOn === true ? '' : 'd-none'} dangerouslySetInnerHTML={{ __html: props.desc.substring(138)}}></span>
            <LinkDesc href="/#" aria-label={isToggleOn === true ? 'collapse' : 'expand'} onClick={ToggleTableHandler}>
              {isToggleOn === true ? <span>Less...</span> : <span>More... </span>}
            </LinkDesc>
          </>
        }
      </p>
    );
  };


  const PropsItems = (props) => {
    let [isToggleOn, setIsToggleOn] = useState(false);

    const ToggleTableHandler = event => {
      event.preventDefault();
      setIsToggleOn(!isToggleOn);
    };

    return (
      <TableColFlex data-class="TableColFlex" sx={12}>
        <TableRow>
          <TableCol data-class="TableCol" xs={3}>
            {props.item.category}
            <TableUl>
              <TableLi>
                <SpanIcon><FontAwesomeIcon icon={faAngleDown}/></SpanIcon>{props.item.node.n}
              </TableLi>
            </TableUl>
          </TableCol>
          <TableColRight data-class="TableColRight" xs={9}>
            <TableRow data-class="TableRowProps">
              <TableColProps data-class="TableCol" xs={12}>
                <Row>
                  <Col xs={10}>
                    <a href="/#" dangerouslySetInnerHTML={{ __html: props.item.property.n}} onClick={ToggleTableHandler}></a>
                  </Col>
                  <ColRight xs={2}>
                    <a href="/#" aria-label={isToggleOn === true ? 'collapse' : 'expand'} onClick={ToggleTableHandler}>
                      {isToggleOn === true
                        ? <FontAwesomeIcon icon={faMinus}/>
                        : <FontAwesomeIcon icon={faPlus}/>
                      }
                    </a>
                  </ColRight>
                </Row>
                <Collapse in={isToggleOn} mountOnEnter={true}>
                  <div data-class="ncit-props-container">
                    {(props.item.property.d !== undefined && props.item.property.d !== '') &&
                      <Row>
                        <TableCol data-class="TableCol" xs={12}>
                          <DescCollapse desc={props.item.property.d}/>
                        </TableCol>
                      </Row>
                    }
                    {props.item.property.ncit !== undefined &&
                      <NcitProps ncit={props.item.ncit}/>
                    }
                  </div>
                </Collapse>
                {props.item.type !== undefined && props.item.type === 'enum' &&
                  <Row>
                    <ColRight xs={12}>
                      <AllValuesModal idterm={props.item.id}/>
                      <ToCompareModal idterm={props.item.id}/>
                    </ColRight>
                  </Row>
                }
              </TableColProps>
            </TableRow>
          </TableColRight>
        </TableRow>
      </TableColFlex>
    )
  };

  const PropsItemsContainer = (props) => {
    return(
      <Row key={props.index}>
        <TableColLeft data-class="TableColLeft" xs={2}>
          <DivCenter>
            <CodeSpan dangerouslySetInnerHTML={{ __html: `${props.cross.code}<br/>${props.cross.ref}`}}></CodeSpan>
          </DivCenter>
        </TableColLeft>
        <TableColRight data-class="TableColRight" xs={10}>
          {props.cross.props.gdc.length !== 0 &&
            <TableRow>
              <TableColLeft data-class="TableColLeft" xs={2}>
                <DivCenter>Genomic Data Commons</DivCenter>
              </TableColLeft>
              <TableColRight data-class="TableColRight" xs={10}>
                {props.cross.props.gdc.map((prop, index) =>
                  <TableRowProps data-class="TableRowValues" key={index}>
                    <PropsItems item={prop}/>
                  </TableRowProps>
                )}
              </TableColRight>
            </TableRow>
          }
          {props.cross.props.ctdc.length !== 0 &&
            <TableRow>
              <TableColLeft data-class="TableColLeft" xs={2}>
                <DivCenter>Clinical Trials Data Commons</DivCenter>
              </TableColLeft>
              <TableColRight data-class="TableColRight" xs={10}>
                {props.cross.props.ctdc.map((prop, index) =>
                  <TableRowProps data-class="TableRowValues" key={index}>
                    <PropsItems item={prop}/>
                  </TableRowProps>
                )}
              </TableColRight>
            </TableRow>
          }
          {props.cross.props.icdc.length !== 0 &&
            <TableRow>
              <TableColLeft data-class="TableColLeft" xs={2}>
                <DivCenter>Integrated Canine Data Commons</DivCenter>
              </TableColLeft>
              <TableColRight data-class="TableColRight" xs={10}>
                {props.cross.props.icdc.map((prop, index) =>
                  <TableRowProps data-class="TableRowValues" key={index}>
                    <PropsItems item={prop}/>
                  </TableRowProps>
                )}
              </TableColRight>
            </TableRow>
          }
          {props.cross.props.pcdc.length !== 0 &&
            <TableRow>
              <TableColLeft data-class="TableColLeft" xs={2}>
                <DivCenter>Pediatric Cancer Data Commons</DivCenter>
              </TableColLeft>
              <TableColRight data-class="TableColRight" xs={10}>
                {props.cross.props.pcdc.map((prop, index) =>
                  <TableRowProps data-class="TableRowValues" key={index}>
                    <PropsItems item={prop}/>
                  </TableRowProps>
                )}
              </TableColRight>
            </TableRow>
          }
        </TableColRight>
      </Row>
    )
  };


  if (crossProps.length !== 0) {
    return (
      <ContainerStyled>
        <TableThead>
          <Col xs={2}>
            <TableTh>Terminology Reference</TableTh>
          </Col>
          <Col xs={10}>
            <Row>
              <Col xs={2}>
                <TableTh>Data Sources</TableTh>
              </Col>
              <Col xs={2}>
                <TableTh>Node</TableTh>
              </Col>
              <Col xs={8}>
                <TableTh>Matched Properties</TableTh>
              </Col>
            </Row>
          </Col>
        </TableThead>
        <TableBody>
          <Col xs={12}>
            {crossProps.map((cross, index) => 
              <PropsItemsContainer cross={cross} key={index} />
            )}
          </Col>
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

export default PropsTable;
