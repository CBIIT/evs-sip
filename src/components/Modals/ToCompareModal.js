import React, {useState, useRef} from 'react';
import styled from 'styled-components';
import { Button, Modal, Container, Row, Col, Collapse, Table, Form} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faCheck, faDownload} from '@fortawesome/free-solid-svg-icons';
import { sortAlphabetically} from '../../shared';
import { apiGetGDCDataById } from '../../api';

import PaginationController from './PaginationController';

const ModalBodyStyled = styled(Modal.Body)`
  padding: 0;
`;

const ButtonStyled = styled(Button)`
  padding: 0 .75rem;
`;

const ModalStyled = styled(Modal)`
  && .modal-dialog {
    max-width: 75rem;
  }
`;

const TableContainer = styled.div`
  width: 100%;
  padding: 12px;
`;

const TableThead = styled(Row)`
  background: #535F74;
`;

const TableTh = styled.div`
  font-family: 'Lato-Bold', sans-serif;
  font-size: 1rem;
  text-align: center;
  color: var(--white);
  padding-top: 0.625rem;
  padding-bottom: 0.625rem;
`;

const ColStyled = styled(Col)`
  padding-right: 0;
  padding-left: 0;
`;

const ColBackgroundStyled = styled(ColStyled)`
  background: #535F74;
`;

const TableStyled = styled(Table)`
  margin-bottom: 0;
`;

const TableOverFlow = styled(Table)`
  width: calc(100% - 2px);

  &&>thead>tr>th{
    padding: 0;
  }

  &&>tbody>tr>td{
    min-width: 10rem;
  }
`;

const TableThTitle = styled.div`
  margin-top: -2.75rem;
  position: absolute;
  padding: 0.625rem 0.75rem;
  font-family: 'Lato-Bold',sans-serif;
  font-size: 1rem;
  color: var(--white);
`;

const CodeValue = styled.div`
  padding-top: 0.5rem;
`;

const TableContainerOverFlow = styled.div`
  background-color: #fff;
  margin-top: 2.75rem;
  width: 100%;
  height: 35rem;
  overflow: auto;
  display: block;
`;

const CompareFormContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1rem 0;
`;

const CompareFormLeft = styled.div`
  width: 47%;
  height: 35rem;
`;

const CompareFormDivider = styled.div`
  width: 1rem;
  height: 35rem;
  margin-right: 1rem;
  border-right: 1px dashed #bbb;
`;

const CompareFormRight = styled.div`
  width: 47%;
  height: 35rem;
  overflow: auto;
  border: 1px solid #a9a9a9;
  display: inline-block;
  padding: .2em;
`;

const TextareaStyled = styled.textarea`
  width: 100%;
  height: 100%;
  padding: .2em 0.9375rem;
`;

const RowStyled = styled(Row)`
  padding: 0.3125rem 0;
  border-bottom: 1px solid #dee2e6;
`;

const RowRight = styled(Row)`
  min-width: 25rem;
`;

const ColRight = styled(Col)`
  text-align: right;
`;

const Indicator = styled.div`
  width: 100%;
  padding: 3rem 0;
  text-align: center;
  font-size: 1.2rem;
`;
const OptionsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  width: 55rem;
`;

const FormGroupStyled = styled(Form.Group)`
  margin-left: 2rem;
  margin-bottom: 0;
  padding: 0.3rem 0;
`;

const CheckboxSpan = styled.span`
  position: relative;
  display: block;
  border: 1px solid #dce4ec;
  background-color: #fff;
  border-radius: .25rem;
  width: 1.5rem;
  height: 1.5rem;
  float: left;
  margin-right: .5rem;
`;

const CheckboxIcon = styled(FontAwesomeIcon)`
  position: absolute;
  font-size: .7rem;
  line-height: 0;
  top: 0.3125rem;
  left: 0.375rem;
`;

const CheckboxLabel = styled.label`
  font-family: 'Lato-Bold', sans-serif;
  position: relative;
  font-size: 0.875rem;
  color: #1C1C1C;
  margin-left: 1rem;
  margin-bottom: 0;
  cursor: pointer;
`;

const CheckboxInput = styled.input`
  margin: 0!important;
  position: absolute!important;
  top: 0.5rem;
  left: 0.35rem;

  &&:checked+${CheckboxSpan} {
    background-color: var(--checkbox-green);
    border-color: var(--checkbox-green);
  }
  
  &&+${CheckboxSpan}>${CheckboxIcon}{
    opacity: 0;
  }
  
  &&:checked+${CheckboxSpan}>${CheckboxIcon} {
    opacity: 1;
    color: var(--white);
  }

  &&:focus+${CheckboxSpan} {
    border: 1px solid #042A68;
    box-shadow: 0 0 0 0.2rem rgba(38,143,255,.5);
  }
`;


const ToCompareModal = (props) => {
  const [show, setShow] = useState(false);
  const [items, setItems] = useState([]);

  const handleClose = () => {
    setShow(false);
  };

  const handleShow = () => {
    apiGetGDCDataById(props.idterm).then(result => {
      // setData(result);
      if (result !== [] && result[0]._source.enum !== undefined) {
        setItems(result[0]._source.enum);
      }
    }).then(() => {
      setShow(true);
    });
  };

  const ModalContainer = (props) => {
    //const [userValues, setUserValues] = useState('');
    const [resultReport, setResultReport] = useState([]);
    const [resultPagination, setResultPagination] = useState([]);
    const [pageCountStage, setPageCountStage] = useState(0);
    const [showReport, setShowReport] =  useState(false);
    let [optionsState, setOptionsState] =  useState({
        partial: true,
        syns: false,
        unmatched: false
    });

    const userValuesRef = useRef(null);

    const handleCompare = () => {
      if(showReport === false) setShowReport(true);
      const valueRef = userValuesRef.current.value;
      //setUserValues(valueRef)
      const results = compareGDCvalues(valueRef, props.items, optionsState);
      setResultReport(results);
      if(results.length !== 0){
        setPageCountStage(results.length / 12);
        setResultPagination(results.slice(0,11));
      }
    }
  
    const handleButtonBack = () => {
      if(showReport === true) setShowReport(false);
      setResultReport([]);
    }

    const checkedToggleHandler = event => {
      setOptionsState({
        ...optionsState,
        [event.target.name]: event.target.checked
      });
    };
  
    const compareGDCvalues = (fromV, toV, option) => {
      let fromVArray = fromV.split(/\n/);
      toV = JSON.parse(JSON.stringify(toV));
      let vLowercase = [];
      let vMatched = [];
      toV.forEach(function (v) {
        vLowercase.push(v.n.trim().toLowerCase());
      });
    
      let items = [];
      fromVArray.forEach(function (v) {
        let caseSensitiveV = v.trim().replace(/\s{2,}/g, ' ');
        v = v.trim().toLowerCase().replace(/\s{2,}/g, ' ');
        let tmp = v;
        if (tmp === '') {
          return;
        }
        let text = [];
        if (option.partial === false) { // If exact match is checked
          let checkerName = [];
          let idx = vLowercase.indexOf(tmp);
          if (idx >= 0) {
            toV[idx].match = caseSensitiveV;
            text.push(toV[idx]);
            checkerName.push(toV[idx].n);
            vMatched.push(idx);
          }
          if (option.syns === true) {
            toV.forEach((em, i) => {
              if (em.icdo !== undefined && em.icdo.s !== undefined) {
                em.icdo.s.forEach(s => {
                  if (s.n.trim().toLowerCase() === tmp && checkerName.indexOf(toV[i].n) === -1) {
                    toV[i].match = caseSensitiveV;
                    text.push(toV[i]);
                    checkerName.push(toV[i].n);
                    vMatched.push(i);
                  }
                });
              }
              if (em.ncit !== undefined) {
                em.ncit.forEach(n => {
                  if (n.s === undefined) return;
                    n.s.forEach(s => {
                      if (s.n.trim().toLowerCase() === tmp && checkerName.indexOf(toV[i].n) === -1) {
                        toV[i].match = caseSensitiveV;
                        text.push(toV[i]);
                        checkerName.push(toV[i].n);
                        vMatched.push(i);
                      }
                    });
                });
              }
            });
            }
          } else { // If it's partial match
            let checkerName = [];
            vLowercase.forEach((vTmp, index) => {
              let idx = vTmp.indexOf(tmp);
              if (idx >= 0 && checkerName.indexOf(toV[index].n) === -1) {
                toV[index].match = caseSensitiveV;
                text.push(toV[index]);
                checkerName.push(toV[index].n);
                vMatched.push(index);
              }
              if (option.syns === true) {
                toV.forEach((em, i) => {
                  if (em.icdo !== undefined && em.icdo.s !== undefined) {
                    em.icdo.s.forEach(s => {
                      if (s.n.trim().toLowerCase().indexOf(tmp) >= 0  && checkerName.indexOf(toV[i].n) === -1) {
                        toV[i].match = caseSensitiveV;
                        text.push(toV[i]);
                        checkerName.push(toV[i].n);
                        vMatched.push(i);
                      }
                    });
                  }
                  if (em.ncit !== undefined) {
                    em.ncit.forEach(n => {
                        if (n.s === undefined) return;
                        n.s.forEach(s => {
                          if (s.n.trim().toLowerCase().indexOf(tmp) >= 0  && checkerName.indexOf(toV[i].n) === -1) {
                            toV[i].match = caseSensitiveV;
                            text.push(toV[i]);
                            checkerName.push(toV[i].n);
                            vMatched.push(i);
                          }
                        });
                    });
                  }
                });
            }
          });
        }
        if (text.length > 0) {
          text = sortAlphabetically(text);
          if (text.length > 1) {
            text = text.map(t => {
              t.rowspan = text.length;
              return t;
            });
          }
        }
        if (text.length === 0) text.push({ n: '', n_c: '', match: caseSensitiveV, s: []});
        items = items.concat(JSON.parse(JSON.stringify(text)));
      });
    
      items = option.unmatched ? items.concat(toV.filter((v, i) => !vMatched.includes(i))) : items;
      return items;
    };

    const handlePageClick = (data) => {
      const position = data.selected * 12;
      if (resultReport.length !== 0) {
        setResultPagination(resultReport.slice(position, position + 11));
      };
    };

    const downloadCompareCVS = (items) => {
      let csv = 'User Defined Values, Matched GDC Values, ICDO3 code, NCIt code, NCIT Synonyms,\n';
      items.forEach((item, index) => {
        let newLine = true;
        let match = item.match;
        if (item.match !== undefined && index !== 0 && items[index - 1].match === items[index].match) match = '';
        if (item.match === undefined) match = '--';
        csv += '"' + match + '","' + item.n + '",';
        csv += item.icdo !== undefined ? '"' + item.icdo.c + '",' : '"",';
        // if (item.icdo !== undefined && item.icdo.s !== undefined && item.icdo.s.length !== 0) {
        //   item.icdo.s.forEach((s, i) => {
        //     csv += i === 0 ? '"","' + s.n + '",' : '"' + s.n + '",';
        //   });
        // }

        if (item.ncit && item.ncit.length !== 0) {
          item.ncit.forEach((nc, tmpIndex) => {
            if (nc.s.length !== 0) {
              //csv += tmpIndex === 0 ? '\n"","","","' + nc.c + '",' : '"","","","' + nc.c + '",';
              csv += tmpIndex === 0 ? '"' + nc.c + '",' : '"","","","' + nc.c + '",';
              nc.s.forEach(s => {
                csv += '"' + s.n + '",';
              });
              csv += '\n';
              newLine = false;
            }
          });
        }
        if (newLine === true) {
          csv += '\n';
        }
      });

      let csvData = new Blob([csv], { type: 'data:text/csv;charset=utf-8,' });
      let csvUrl = URL.createObjectURL(csvData);
      let link = document.createElement('a');
      link.href = csvUrl;
      link.target = '_blank';
      link.download = 'Compare_Values_GDC.csv';
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
  
    const TableSynonyms = (props) => {
      if (props.synonyms !== undefined) {
        let match = props.match !== undefined ? props.match.replace(/[^0-9a-zA-Z-&:,. \\)\\(\\*\\/=<+]+/g, '').replace(/\(/g, '\\(').replace(/\)/g, '\\)').replace(/\*/g, '\\*').replace(/\//g, '\\/').replace(/\+/g, '\\+') : '\\(?!.*\\)';
        let regKey = new RegExp(match, 'ig');
        return props.synonyms.map((item, index) => {
          let SynMatch = props.match !== undefined ? props.match.toLowerCase() : props.match;
          let SynName = optionsState['partial'] === true && optionsState['syns'] === true ? item.n.replace(regKey, '<b>$&</b>') : optionsState['partial'] === false && item.n.toLowerCase() === SynMatch  ? `<b>${item.n}</b>` : item.n; 
          return(
            <tr key={index}>
              <td dangerouslySetInnerHTML={{ __html: SynName }}></td>
              <td>{item.src}</td>
              <td>{item.t}</td>
            </tr>
          );
        });
      }
      return (null);
    };
  
    const TableNCIt = (props) => {
    
      let [isToggleOn, setIsToggleOn] = useState(false);
  
      const ToggleTableHandler = event => {
        event.preventDefault();
        setIsToggleOn(!isToggleOn);
      };
      let match = props.match !== undefined ? props.match.replace(/[^0-9a-zA-Z-&:,. \\)\\(\\*\\/=<+]+/g, '').replace(/\(/g, '\\(').replace(/\)/g, '\\)').replace(/\*/g, '\\*').replace(/\//g, '\\/').replace(/\+/g, '\\+') : '\\(?!.*\\)';
      let regKey = new RegExp(match, 'ig');
      let ncitMatch = props.match !== undefined ? props.match.toLowerCase() : props.match;
      let ncitName = optionsState['partial'] === true ? props.name.replace(regKey, '<b>$&</b>') : props.name.toLowerCase() === ncitMatch ? `<b>${props.name}</b>` : props.name;
      return (
        <>
          <RowRight>
            <Col xs={10} dangerouslySetInnerHTML={{ __html: ncitName }}></Col>
            <ColRight xs={2}>
            {((props.ncit !== undefined && props.ncit.length !== 0) || props.icdo !== undefined) &&
              <a href="/#" aria-label={isToggleOn === true ? 'collapse' : 'expand'} onClick={ToggleTableHandler}>
                {isToggleOn === true
                  ? <FontAwesomeIcon icon={faMinus}/>
                  : <FontAwesomeIcon icon={faPlus}/>
                }
              </a>
            }
            </ColRight>
          </RowRight>
          {((props.ncit !== undefined && props.ncit.length !== 0) || props.icdo !== undefined) &&
            <Collapse in={isToggleOn} mountOnEnter={true}>
              <div>
                {props.icdo !== undefined &&
                  <Row>
                    <Col xs={2}>
                      <CodeValue>{props.icdo.c}</CodeValue>
                    </Col>
                    <Col xs={10}>
                    <TableContainer>
                      <TableStyled striped bordered>
                        <thead>
                          <tr>
                            <th>Term</th>
                            <th>Source</th>
                            <th>Type</th>
                          </tr>
                        </thead>
                        <tbody>
                          <TableSynonyms synonyms={props.icdo.s}  match={props.match}/>
                        </tbody>
                      </TableStyled>
                    </TableContainer>
                    </Col>
                  </Row>
                }
                {props.ncit !== undefined && props.ncit.length !== 0 &&
                  <>
                    {props.ncit.map((ncit, index) => 
                      <Row key={index}>
                        <Col xs={2}>
                          <CodeValue>{ncit.c}</CodeValue>
                        </Col>
                        <Col xs={10}>
                        <TableContainer>
                          <TableStyled striped bordered>
                            <thead>
                              <tr>
                                <th>Term</th>
                                <th>Source</th>
                                <th>Type</th>
                              </tr>
                            </thead>
                            <tbody>
                              <TableSynonyms synonyms={ncit.s} match={props.match}/>
                            </tbody>
                          </TableStyled>
                        </TableContainer>
                        </Col>
                      </Row>
                    )}
                  </>
                }
              </div>
            </Collapse>
          }
        </>
      );
    };
  
    const TableEnum = (props) => {
      let [isToggleOn, setIsToggleOn] = useState(false);

      const ToggleTableHandler = event => {
        event.preventDefault();
        setIsToggleOn(!isToggleOn);
      };

      if (props.item !== undefined) {
        return(
          <>
            <RowStyled>
              <Col xs={10}>{props.item.n}</Col>
              <ColRight xs={2}>
                {((props.item.ncit !== undefined && props.item.ncit.length !== 0) || props.item.icdo !== undefined) &&
                  <a href="/#" aria-label={isToggleOn === true ? 'collapse' : 'expand'} onClick={ToggleTableHandler}>
                    {isToggleOn === true
                      ? <FontAwesomeIcon icon={faMinus}/>
                      : <FontAwesomeIcon icon={faPlus}/>
                    }
                  </a>
                }
              </ColRight>
            </RowStyled>
              {((props.item.ncit !== undefined && props.item.ncit.length !== 0) || props.item.icdo !== undefined) &&
                <Collapse in={isToggleOn} mountOnEnter={true}>
                  <div>
                    {props.item.icdo !== undefined &&
                      <Row>
                        <Col xs={2}>
                          <CodeValue>{props.item.icdo.c}</CodeValue>
                        </Col>
                        <Col xs={10}>
                        <TableContainer>
                          <TableStyled striped bordered size="sm">
                            <thead>
                              <tr>
                                <th>Term</th>
                                <th>Source</th>
                                <th>Type</th>
                              </tr>
                            </thead>
                            <tbody>
                              <TableSynonyms synonyms={props.item.icdo.s}/>
                            </tbody>
                          </TableStyled>
                        </TableContainer>
                        </Col>
                      </Row>
                    }
                    {props.item.ncit !== undefined && props.item.ncit.length !== 0 &&
                      <>
                        {props.item.ncit.map((ncit, index) => 
                          <Row key={index}>
                            <Col xs={2}>
                              <CodeValue>{ncit.c}</CodeValue>
                            </Col>
                            <Col xs={10}>
                            <TableContainer>
                              <TableStyled striped bordered size="sm">
                                <thead>
                                  <tr>
                                    <th>Term</th>
                                    <th>Source</th>
                                    <th>Type</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <TableSynonyms synonyms={ncit.s}/>
                                </tbody>
                              </TableStyled>
                            </TableContainer>
                            </Col>
                          </Row>
                        )}
                      </>
                    }
                  </div>
                </Collapse>
              }
          </>
        );
      }
      return (null);
    };

    return (
      <>
        <Modal.Header closeButton>
        <Modal.Title id="to-compare-modal">Compare Your Values</Modal.Title>
        <OptionsHeader>
          <FormGroupStyled>
            <CheckboxLabel>
              <CheckboxInput name="partial" type="checkbox" checked={optionsState['partial']}  onClick={checkedToggleHandler}/>
              <CheckboxSpan>
                <CheckboxIcon icon={faCheck}/>
              </CheckboxSpan>
              Partial match
            </CheckboxLabel>
            <CheckboxLabel>
              <CheckboxInput name="syns" type="checkbox" checked={optionsState['syns']} onClick={checkedToggleHandler}/>
              <CheckboxSpan>
                <CheckboxIcon icon={faCheck}/>
              </CheckboxSpan>
              Synonyms
            </CheckboxLabel>
            <CheckboxLabel>
              <CheckboxInput name="unmatched" type="checkbox" checked={optionsState['unmatched']} onClick={checkedToggleHandler}/>
              <CheckboxSpan>
                <CheckboxIcon icon={faCheck}/>
              </CheckboxSpan>
              Show Unmatched Values
            </CheckboxLabel>
          </FormGroupStyled>
          {showReport === true && <Button onClick={() => downloadCompareCVS(resultReport)}><FontAwesomeIcon icon={faDownload}/> Dowload Result</Button>}
        </OptionsHeader>
      </Modal.Header>
      <ModalBodyStyled>
        <Container>
          {showReport === false ?
            <>
              <TableThead>
                <Col xs={6}>
                  <TableTh>User Defined Values</TableTh>
                </Col>
                <Col xs={6}>
                  <TableTh>Matched Values</TableTh>
                </Col>
              </TableThead>
              <Row>
                <Col xs={12}>
                  <CompareFormContainer>
                    <CompareFormLeft>
                      <TextareaStyled rows="10" cols="20" placeholder="Input values line by line" autocomplete="off" ref={userValuesRef}></TextareaStyled>
                    </CompareFormLeft>
                    <CompareFormDivider/>
                    <CompareFormRight>
                      <Container>
                        {(items !== undefined && items !== []) &&
                          <>
                            {items.map((item, index) => 
                              <TableEnum key={index} item={item}/>
                            )}
                          </>
                        }
                      </Container>
                    </CompareFormRight>
                  </CompareFormContainer>
                </Col>
              </Row>
            </>
          :
            <Row>
              <ColBackgroundStyled xs={12}>
                <TableContainerOverFlow>
                  {resultReport.length !== 0 ?
                  <TableOverFlow bordered>
                    <thead>
                      <tr>
                        <th><TableThTitle>User Defined Values</TableThTitle></th>
                        <th><TableThTitle>Matched Values</TableThTitle></th>
                      </tr>
                    </thead>
                    <tbody>
                      {resultPagination.map((item, index) => {
                        return (
                        <tr key={index}>
                          {(item.match !== undefined && item.rowspan !== undefined && index !== 0 && item.match !== resultPagination[index - 1].match) &&
                            <td rowSpan={item.rowspan}>{item.match}</td>
                          } 
                          {(item.match !== undefined && item.rowspan !== undefined && index === 0) &&
                            <td rowSpan={item.rowspan}>{item.match}</td>
                          }
                          {(item.match !== undefined && item.rowspan === undefined) &&
                            <td>{item.match}</td>
                          }
                          {item.match === undefined &&
                            <td>--</td>
                          }
                          <td>
                            <TableNCIt name={item.n} ncit={item.ncit} icdo={item.icdo} match={item.match}/>
                          </td>
                        </tr>)
                      })}
                    </tbody>
                  </TableOverFlow>
                  :
                  <Indicator>Sorry, no results found.</Indicator>
                  }
                </TableContainerOverFlow>
              </ColBackgroundStyled>
            </Row>
          }
        </Container>
      </ModalBodyStyled>
      <Modal.Footer>
      {showReport === false ?
        <>
          <Button variant="secondary" onClick={handleClose}>Close</Button>
          <Button variant="primary"onClick={handleCompare}>Compare</Button>
        </>
        :
        <>
          <PaginationController pageCount={pageCountStage} pageClick={handlePageClick}/>
          <Button variant="secondary" onClick={handleButtonBack}>Back</Button>
        </>
      }
      </Modal.Footer>
    </>
    );
  }

  return (
    <>
      <ButtonStyled variant="link" onClick={handleShow}>
        Compare with User List
      </ButtonStyled>

      <ModalStyled
        size="lg"
        show={show} 
        onHide={handleClose} 
        aria-labelledby="to-compare-modal"
      >
        <ModalContainer items={items}/>
      </ModalStyled>
    </>
  );
}


export default ToCompareModal;
