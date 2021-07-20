import React from 'react';
import styled from 'styled-components';
import { Form, Button, Table, Col, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';

const SearchContainer = styled.div`
  width: 100%;
  background-color: #535F74;
  border: 1px solid #dee2e6;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 0.4rem 1rem;
`;

const TableContainer = styled.div`
  width: 100%;
`;

const TableUl = styled.ul`
  padding-left: 15px;
  list-style: none;
  margin-bottom: 0;
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

const FormStyled = styled(Form)`
  width: 30rem;
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


const TableDiff = (props) => {
  let groupCount = {};
  let tableData = Object.assign([], props.result);
  tableData.forEach((entry) => {
    entry.id = entry.p + '/' + entry.n + '/' + entry.c;
    if(groupCount[entry.id]){
      groupCount[entry.id]++;
    }
    else{
      groupCount[entry.id] = 1;
    }
  });

  const handleSearchChange = (event) => {
    props.setSearch({
      ...props.search,
      [props.tabKey]: event.target.value
    });
  };

  return <>
    <SearchContainer>
      <FormStyled onSubmit={props.searchSubmit}>
        <Form.Row>
          <Col sm={12}>
            <Form.Label htmlFor="inlineFormInputGroupUsername" srOnly>
              Search By Text
            </Form.Label>
            <InputGroup>
              <Form.Control 
                id="inlineFormInputGroupUsername"
                placeholder="Search By Text" 
                aria-label="Search By Text"  
                aria-describedby="Search By Text"
                value={props.search[props.tabKey]}
                onChange={handleSearchChange}
              />
              <InputGroup.Append>
                <Button type="submit" value="Submit"><FontAwesomeIcon icon={faSearch}/></Button>
              </InputGroup.Append>
            </InputGroup>
          </Col>
        </Form.Row>
      </FormStyled>
      {tableData.length !== 0 &&
        <Button variant="success" onClick={props.downloadResult} className="ml-auto">
          Download Result
        </Button>
      }
    </SearchContainer>
    <TableContainer>
    {tableData.length !== 0 ?
      <Table bordered>
        <thead style={{backgroundColor:"#535F74", color: "white", textAlign: "center"}}>
          <tr>
            <th rowSpan="2" width="10%">Category / Node / Property</th>
            <th colSpan="2" width="30%">GDC Dictionary</th>
            <th colSpan="2" width="30%">Mapped GDC Values</th>
          </tr>
          <tr>
            <th>Value</th>
            <th>NCIt Code</th>
            <th>Value</th>
            <th>NCIt Code</th>
          </tr>
        </thead>
        <tbody>
          {
            tableData.map((item, index) => {
              let rowSpan = 0;
              if(index === 0){
                rowSpan = groupCount[item.id];
              }
              else{
                rowSpan = tableData[index].id === tableData[index -1].id ? 0 : groupCount[item.id];
              }
              if(rowSpan > 0){
                return (
                  <tr key={index}>
                    <td rowSpan={rowSpan}>
                      {item.c}
                      <TableUl>
                        <TableLi><SpanIcon><FontAwesomeIcon icon={faAngleDown}/></SpanIcon>{item.n}
                          <TableUl>
                            <TableLi><SpanIcon><FontAwesomeIcon icon={faAngleDown}/></SpanIcon>{item.p}</TableLi>
                          </TableUl>
                        </TableLi>
                      </TableUl>
                    </td>
                    <td>{item.v_1}</td>
                    <td>{item.n_1}</td>
                    <td>{item.v_2}</td>
                    <td>{item.n_2}</td>
                  </tr>
                );
              }
              else{
                return (
                  <tr key={index}>
                    <td>{item.v_1}</td>
                    <td>{item.n_1}</td>
                    <td>{item.v_2}</td>
                    <td>{item.n_2}</td>
                  </tr>
                );
              }
            })
          }
        </tbody>
      </Table>
    :
      <Indicator>
        <IndicatorContent>
          Sorry, no results found.
        </IndicatorContent>
      </Indicator>
    }
    </TableContainer>
  </>
}

export default TableDiff;
