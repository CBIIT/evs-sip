import React, { useState } from 'react';
import styled from 'styled-components';
import { apiSuggest } from '../../api';
import { InputGroup, FormControl, Form, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import SuggestBox from './SuggestBox';
// import GDCValues from './dialogs/GDCValues';

const SearchBar = styled.div`
  width: 60%;
  min-width: 690px;
  margin: 0 auto;
`;

const SearchOptions = styled.div`
  width: 60%;
  min-width: 690px;
  margin: 0 auto;
  padding: 1.5em 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ecf0f1;
`;

const SearchButton = styled(Button)`
  background-color: #6a7676;
  border-color: #6a7676;
  padding: 8px 45px;
  font-size: 17px;
  color: #fff;
`;

const FormGroupStyled = styled(Form.Group)`
  margin-top: 10px;
  margin-bottom: 10px;
`;

const CheckboxSpan = styled.span`
  position: relative;
  display: block;
  border: 1px solid #dce4ec;
  background-color: #fff;
  border-radius: .25em;
  width: 2em;
  height: 2em;
  float: left;
  margin-right: .5em;
`;

const CheckboxIcon = styled(FontAwesomeIcon)`
  position: absolute;
  font-size: .9em;
  line-height: 0;
  top: 50%;
  left: 26%;
`;

const CheckboxStyled = styled(Form.Check)`
  input[type=checkbox]:checked + ${CheckboxSpan} {
    background-color: #6a7676;
    border-color: #6a7676;
  }

  input[type=checkbox]:focus + ${CheckboxSpan} {
    box-shadow: 0 0 4px 2px #c2c2c2;
    outline: thin dotted;
    outline: 5px auto -webkit-focus-ring-color;
    outline-offset: -2px;
  }

  input[type=checkbox] + ${CheckboxSpan} > ${CheckboxIcon}{
    opacity: 0;
  }

  input[type=checkbox]:checked + ${CheckboxSpan} > ${CheckboxIcon}{
    opacity: 1;
    color: #fff;
  }
`;

const ExternalLink = styled.a`
  margin-left: 2em;
`;

const SearchBox = (props) => {
  let [suggestState, setSuggestState] = useState([]);
  let [searchState, setSearchState] = useState('');
  let [selectIndexState, setSelectIndexState] = useState(-1);
  let [optionsState, setOptionsState] = useState({
    match: false,
    desc: false,
    syns: false
  });

  const suggestClickHandler = (id, event) => {
    setSearchState(id);
    setSuggestState([]);
    props.searchTrigger(id, optionsState);
  };

  const suggestKeyPressHandler = event => {
    if (event.keyCode === 13 && suggestState.length !== 0) {
      setSearchState(suggestState[selectIndexState].id);
      setSuggestState([]);
      props.searchTrigger(suggestState[selectIndexState].id);
    }
    if (event.keyCode === 38 || event.keyCode === 40) {
      let index = selectIndexState;
      index += event.keyCode === 40 ? 1 : -1;
      if (index >= suggestState.length) {
        index = 0;
      }
      if (index < 0) {
        index = suggestState.length - 1;
      }
      setSelectIndexState(index);
    }
  };

  const cleanSuggestHandler = () => {
    setSuggestState([]);
    setSelectIndexState(-1);
  };

  const suggestHandler = event => {
    setSearchState(event.target.value);
    apiSuggest(event.target.value).then(result => setSuggestState(result));
  };

  const checkedToggleHandler = event => {
    setOptionsState({
      ...optionsState,
      [event.target.id]: event.target.checked
    });
  };

  return (
    <div>
      <SearchBar>
        <InputGroup>
          <FormControl
            type="text"
            value={searchState}
            onChange={suggestHandler}
            onKeyDown={suggestKeyPressHandler}
          />
          <InputGroup.Append>
            <SearchButton onClick={() => props.searchTrigger(searchState, optionsState)}>
              Search
            </SearchButton>
          </InputGroup.Append>
        </InputGroup>
        <SuggestBox
          suggest={suggestState}
          suggestClick={suggestClickHandler}
          suggestSelected={selectIndexState}
          cleanSuggest={cleanSuggestHandler}
        />
      </SearchBar>
      <SearchOptions>
        <FormGroupStyled>
          <Form.Check inline type="checkbox" id="match" label="Exact match" value={optionsState.match} onChange={checkedToggleHandler}/>
          <Form.Check inline type="checkbox" id="desc" label="Property description" value={optionsState.desc} onChange={checkedToggleHandler}/>
          <Form.Check inline type="checkbox" id="syns" label="Synonyms" value={optionsState.syns} onChange={checkedToggleHandler}/>
          {/* <CheckboxStyled id="match" label="Check"  inline value={optionsState.match} onChange={checkedToggleHandler}>
            <CheckboxSpan>
              <CheckboxIcon icon={faCheck}/>
            </CheckboxSpan>
            Exact match
          </CheckboxStyled>
          <CheckboxStyled id="desc" inline value={optionsState.desc} onChange={checkedToggleHandler}>
            <CheckboxSpan>
              <CheckboxIcon icon={faCheck}/>
            </CheckboxSpan>
            Property description
          </CheckboxStyled>
          <CheckboxStyled id="syns" inline value={optionsState.syns} onChange={checkedToggleHandler}>
            <CheckboxSpan>
              <CheckboxIcon icon={faCheck}/>
            </CheckboxSpan>
            Synonyms
          </CheckboxStyled> */}
        </FormGroupStyled>
        <div>
          <ExternalLink href="https://ncit.nci.nih.gov/" target="_blank" rel="noreferrer">
            Search in NCIt
          </ExternalLink>
          <ExternalLink href="https://ncit.nci.nih.gov/" target="_blank" rel="noreferrer">
            Search in NCIt
          </ExternalLink>
        </div>
      </SearchOptions>
    </div>
  );
};

export default SearchBox;
