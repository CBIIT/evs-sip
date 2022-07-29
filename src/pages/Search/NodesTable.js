import React, { useState } from 'react';
import styled from 'styled-components';
import { Container, Row, Col, Table, Collapse} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { getHighlightObj } from '../../shared';

const ContainerStyled = styled(Container)`
  font-size: 1rem;
  padding-left: 12px;
  padding-right: 12px;
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

const TableStyled = styled(Table)`
  margin-bottom: 0;
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

const NodesTable = (props) => {
  let items = JSON.parse(JSON.stringify(props.nodes));
  let nodes = [];

  items.forEach(item => {
    let node = item.inner_hits.node;

    if (node.hits.hits.length !== 0) {
      let nodeHits = node.hits.hits;

      nodeHits.forEach((hits) => {
        if((nodes.findIndex(n => n.source === item._source.source && n.category === item._source.category && n.node.n.replace(/<b>/g, '').replace(/<\/b>/g, '') === item._source.node.n)) !== -1) return;

        let hl = hits.highlight;

        let highlightNode = ('node.n' in hl) || ('node.n.have' in hl) ? hl['node.n'] || hl['node.n.have'] : undefined;
        let highlightNodeObj = getHighlightObj(highlightNode);

        let highlightDesc = ('node.d' in hl) || ('node.d.have' in hl) ? hl['node.d'] || hl['node.d.have'] : undefined;
        let highlightDescObj = getHighlightObj(highlightDesc);

        let highlightNC = ('nodes.ncit.c' in hl) || ('nodes.ncit.c.have' in hl) ? hl['nodes.ncit.c'] || hl['nodes.ncit.c.have'] : undefined;
        let highlightNCObj = getHighlightObj(highlightNC);

        let highlightSyn = ('nodes.ncit.s.n' in hl) || ('nodes.ncit.s.n.have' in hl) ? hl['nodes.ncit.s.n'] || hl['nodes.ncit.s.n.have'] : undefined;
        let highlightSynObj = getHighlightObj(highlightSyn);

        let nodeObj = {};
        nodeObj.category = item._source.category;
        nodeObj.node = item._source.node;
        nodeObj.id = item._source.id;
        nodeObj.source = item._source.source;
        nodeObj.property = item._source.prop;
        nodeObj.type = item._source.type;
        nodeObj.node.n = highlightNodeObj[item._source.node.n] ? highlightNodeObj[item._source.node.n] : item._source.node.n;
        nodeObj.node.d = highlightDescObj[item._source.node.d] ? highlightDescObj[item._source.node.d] : item._source.node.d;
        
        nodeObj.ncit = hits._source.ncit ? hits._source.ncit : undefined;

        if (nodeObj.ncit !== undefined && nodeObj.ncit !== 0) {
          nodeObj.ncit.forEach((ncit, i) => {
            nodeObj.ncit[i].c = highlightNCObj[ncit.c] ? highlightNCObj[ncit.c] : ncit.c;

            if (ncit.s !== undefined && ncit.s !== 0) {
              ncit.s.forEach((s, j) => {
                nodeObj.ncit[i].s[j].n = highlightSynObj[s.n] ? highlightSynObj[s.n] : s.n;
              })
            }
          });
        }

        nodes.push(nodeObj);

      });
    }
  });

  let mappingObj = {};
  nodes.forEach((prop) => {
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

  let crossNodes = [];

  Object.entries(mappingObj).forEach((entry)=> {
    let ctdcNodes = [];
    let gdcNodes = [];
    let icdcNodes = [];
    let pcdcNodes = [];

    if(entry[1] !== undefined && entry[1].length !== 0){
      entry[1].forEach(prop => {
        if(prop.source !== undefined && prop.source === 'ctdc'){
          ctdcNodes.push(prop);
        }
        if(prop.source !== undefined && prop.source === 'gdc'){
          gdcNodes.push(prop);
        }
        if(prop.source !== undefined && prop.source === 'icdc'){
          icdcNodes.push(prop);
        }
        if(prop.source !== undefined && prop.source === 'pcdc'){
          pcdcNodes.push(prop);
        }
      });
    }

    crossNodes.push({
      code: entry[0] !== 'no-mapping' ? entry[0]: 'No NCIt Mapping',
      ref: 'NCIt',
      nodes: {
        ctdc: ctdcNodes,
        gdc: gdcNodes,
        icdc: icdcNodes,
        pcdc: pcdcNodes
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
          </TableCol>
          <TableColRight data-class="TableColRight" xs={9}>
            <TableRow data-class="TableRowProps">
              <TableColProps data-class="TableCol" xs={12}>
                <Row>
                  <Col xs={10}>
                    <a href="/#" dangerouslySetInnerHTML={{ __html: props.item.node.n}} onClick={ToggleTableHandler}></a>
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
                  <div data-class="ncit-node-container">
                    {props.item.node.d !== undefined && props.item.node.d !== '' &&
                      <Row>
                        <TableCol data-class="TableCol" xs={12}>
                          <DescCollapse desc={props.item.node.d}/>
                        </TableCol>
                      </Row>
                    }
                    {props.item.node.ncit !== undefined &&
                      <NcitProps ncit={props.item.node.ncit}/>
                    }
                  </div>
                </Collapse>
              </TableColProps>
            </TableRow>
          </TableColRight>
        </TableRow>
      </TableColFlex>
    )
  };

  const NodesItemsContainer = (props) => {
    return(
      <Row key={props.index}>
        <TableColLeft data-class="TableColLeft" xs={2}>
          <DivCenter>
            <CodeSpan>{props.cross.code}<br/>({props.cross.ref})</CodeSpan>
          </DivCenter>
        </TableColLeft>
        <TableColRight data-class="TableColRight" xs={10}>
          {props.cross.nodes.gdc.length !== 0 &&
            <TableRow>
              <TableColLeft data-class="TableColLeft" xs={2}>
                <DivCenter>Genomic Data Commons</DivCenter>
              </TableColLeft>
              <TableColRight data-class="TableColRight" xs={10}>
                {props.cross.nodes.gdc.map((node, index) =>
                  <TableRowProps data-class="TableRowValues" key={index}>
                    <PropsItems item={node}/>
                  </TableRowProps>
                )}
              </TableColRight>
            </TableRow>
          }
          {props.cross.nodes.ctdc.length !== 0 &&
            <TableRow>
              <TableColLeft data-class="TableColLeft" xs={2}>
                <DivCenter>Clinical Trials Data Commons</DivCenter>
              </TableColLeft>
              <TableColRight data-class="TableColRight" xs={10}>
                {props.cross.nodes.ctdc.map((node, index) =>
                  <TableRowProps data-class="TableRowValues" key={index}>
                    <PropsItems item={node}/>
                  </TableRowProps>
                )}
              </TableColRight>
            </TableRow>
          }
          {props.cross.nodes.icdc.length !== 0 &&
            <TableRow>
              <TableColLeft data-class="TableColLeft" xs={2}>
                <DivCenter>Integrated Canine Data Commons</DivCenter>
              </TableColLeft>
              <TableColRight data-class="TableColRight" xs={10}>
                {props.cross.nodes.icdc.map((node, index) =>
                  <TableRowProps data-class="TableRowValues" key={index}>
                    <PropsItems item={node}/>
                  </TableRowProps>
                )}
              </TableColRight>
            </TableRow>
          }
          {props.cross.nodes.pcdc.length !== 0 &&
            <TableRow>
              <TableColLeft data-class="TableColLeft" xs={2}>
                <DivCenter>Pediatric Cancer Data Commons</DivCenter>
              </TableColLeft>
              <TableColRight data-class="TableColRight" xs={10}>
                {props.cross.nodes.pcdc.map((node, index) =>
                  <TableRowProps data-class="TableRowValues" key={index}>
                    <PropsItems item={node}/>
                  </TableRowProps>
                )}
              </TableColRight>
            </TableRow>
          }
        </TableColRight>
      </Row>
    )
  };


  if (crossNodes.length !== 0) {
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
                <TableTh>Category</TableTh>
              </Col>
              <Col xs={8}>
                <TableTh>Matched Nodes</TableTh>
              </Col>
            </Row>
          </Col>
        </TableThead>
        <TableBody>
          <Col xs={12}>
            {crossNodes.map((cross, index) => 
              <NodesItemsContainer cross={cross} key={index} />
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

export default NodesTable;
