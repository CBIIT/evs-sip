import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { apiSuggest } from '../../api';
import { InputGroup, Form, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faArrowRight, faTimes} from '@fortawesome/free-solid-svg-icons'
import SuggestBox from './SuggestBox';
// import GDCValues from './dialogs/GDCValues';

const SearchBoxContainer = styled.div`
  padding: 4rem 0;
  background-color: var(--gray-bkgd);
`;

const SearchBarContainer = styled.div`
  max-width: 80rem;
  margin: 0 auto;
`;

const SearchBar = styled.div`
  width: 48rem;
  margin: 0 auto;
`;

const SearchFormControl = styled(Form.Control)`
  width: 100% !important;
  border-radius: 0;
  background-color: transparent;
  border: 1px solid transparent;
  border-bottom: 3px solid #397DED;
  font-size: 1.875rem;
  font-family: 'Raleway-Light', sans-serif;

  &&:focus {
    border-color: transparent;
    background-color: transparent;
    box-shadow: none;
    border-bottom: 3px solid #397DED;
  }

  &&::placeholder {
    color: #3A9CF7;
  }
`;

const SearchButton = styled(Button)`
  position: absolute;
  right: 0rem;
  bottom: 0;
  top: 0;
  margin: auto;
  z-index: 3;
  background-color: #A1A0A0;
  border-radius: 2rem !important;
  color: var(--white);
  font-size: 1.25rem; 
  width: 5rem;
  height: 2rem;
  padding: .2rem .75rem;
  border-color: transparent;

  &&:hover,
  &&:focus {
    background-color: #397ded;
    color: var(--white);
    box-shadow: none;
  }
`;

const SearchButtonIcon = styled(FontAwesomeIcon)`
  font-size: 1.25rem;
  vertical-align: 0;
`;

const SearchOptionsContainer = styled.div`
  padding: 1.5rem;
`;

const SearchAllOptions = styled.div`
  width: 45rem;
  margin: 0 auto;
  padding: 2rem 0;

  && ${SearchOptionsContainer}:not(:last-child) {
    border-bottom: 1px solid #898989;
  }
`;

const SearchOptions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const SearchOptionsLabel = styled.label`
  font-family: 'Lato-Regular',sans-serif;
  color: #1162E9;
  font-size: 0.875rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
`;

const FormGroupStyled = styled(Form.Group)`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0;
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
  top: 25%;
  left: 25%;
`;

const CheckboxLabel = styled.label`
  font-family: 'Lato-Regular', sans-serif;
  position: relative;
  font-size: 0.875rem;
  color: #1C1C1C;
  inline-size: 11rem;
  font-weight: bold;
  margin-bottom: 0;
  cursor: pointer;
`;

// const CheckboxLabelSpace = styled(CheckboxLabel)`
//   inline-size: 11rem;
// `;

const SpanNormal = styled.span`
  font-weight: normal;
`; 

const CheckboxInput = styled.input`
  margin: 0!important;
  position: absolute!important;
  top: 0.5rem;
  left: 0.35rem;

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

const SelectBtn = styled(Button)`
  font-family: 'Lato-Regular', sans-serif;
  border: 1px solid #154C5E;
  background-color: #F5F5F5;
  border-radius: 2em;
  text-transform: uppercase;
  inline-size: 6rem;
  font-size: 0.625rem;
  color: #154C5E;
  padding: 0.25rem 0.75rem;

  &&:hover,
  &&:focus {
    background-color: #F5F5F5;
    border: 1px solid #154C5E;
    color: #154C5E;
  }
`;

const DeleteBtn = styled.a`
  position: absolute;
  right: 6rem;
  top: 0.9rem;
  z-index: 100;
  font-size: 1.375rem;
  color: #5376ac;
  display: none;
`;

const SearchBox = (props) => {
  let [suggestState, setSuggestState] = useState([]);
  let [searchState, setSearchState] = useState(props.keyword);
  let [selectIndexState, setSelectIndexState] = useState(-1);
  let [optionsState, setOptionsState] = useState({
    match: false,
    desc: false,
    syns: false
  });

  let [selectDataSource, setSelectDataSource] = useState({
    ctdc: false,
    gdc: false,
    icdc: false
  });

  let [isToggleOnOptions, setIsToggleOnOptions] = useState(false);
  let [isToggleOnSource, setIsToggleOnSource] = useState(false);

  // const ToggleTableHandler = event => {
  //   event.preventDefault();
  //   setIsToggleOn(!isToggleOn);
  // };

  const searchInputRef = useRef();

  const suggestClickHandler = (id, event) => {
    setSearchState(id);
    setSuggestState([]);
    props.searchTrigger(id, optionsState, selectDataSource);
  };

  const suggestKeyPressHandler = event => {
    if (event.keyCode === 13 && selectIndexState === -1) {
      setSearchState(event.target.value);
      setSuggestState([]);
      props.searchTrigger(event.target.value, optionsState, selectDataSource);
    }
    if (event.keyCode === 13 && suggestState.length !== 0 && selectIndexState !== -1) {
      setSearchState(suggestState[selectIndexState].id);
      setSuggestState([]);
      props.searchTrigger(suggestState[selectIndexState].id, optionsState, selectDataSource);
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

  const cleanSearchBar = event => {
    event.preventDefault();
    setSearchState('');
    searchInputRef.current.focus();
  }

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
      [event.target.name]: !event.target.checked
    });
  };

  const selectDataToggleHandler = event => {
    setSelectDataSource({
      ...selectDataSource,
      [event.target.name]: !event.target.checked
    });
  };

  const checkedAllToggleHandler = event => {
    if(isToggleOnOptions === false){
      setOptionsState({
        match: true,
        desc: true,
        syns: true
      });
    } else {
      setOptionsState({
        match: false,
        desc: false,
        syns: false
      });
    }
    setIsToggleOnOptions(!isToggleOnOptions);
  };

  const selectDataAllToggleHandler = event => {
    if(isToggleOnSource === false){
      setSelectDataSource({
        ctdc: true,
        gdc: true,
        icdc: true
      });
    } else {
      setSelectDataSource({
        ctdc: false,
        gdc: false,
        icdc: false
      });
    }
    setIsToggleOnSource(!isToggleOnSource);
  };

  return (
    <SearchBoxContainer>
      <SearchBarContainer>
        <SearchBar>
          <InputGroup>
            <SearchFormControl
              type="text"
              value={searchState}
              onChange={suggestHandler}
              onKeyDown={suggestKeyPressHandler}
              placeholder="Search EVS-SIP"
              aria-label="Search EVS-SIP"
              ref={searchInputRef}
            />
            <DeleteBtn aria-label="Delete" href="/#" onClick={cleanSearchBar} style={searchState.length === 0 ? {} : { display: 'block' }}><FontAwesomeIcon icon={faTimes} /></DeleteBtn>
            <SearchButton aria-label="Search" onClick={() => props.searchTrigger(searchState, optionsState, selectDataSource)}>
              <SearchButtonIcon icon={faArrowRight}/>
            </SearchButton>
          </InputGroup>
          <SuggestBox
            suggest={suggestState}
            suggestClick={suggestClickHandler}
            suggestSelected={selectIndexState}
            cleanSuggest={cleanSuggestHandler}
          />
        </SearchBar>
        <SearchAllOptions>
          <SearchOptionsContainer>
            <SearchOptions>
              <SelectBtn aria-label={isToggleOnOptions === false ? 'Select All' : 'Unselect All'} onClick={checkedAllToggleHandler}>{isToggleOnOptions === false ? 'Select All' : 'Unselect All'}</SelectBtn>
              <FormGroupStyled>
                <CheckboxLabel>
                  <CheckboxInput name="match" type="checkbox" checked={optionsState['match']} onClick={checkedToggleHandler}/>
                  <CheckboxSpan>
                    <CheckboxIcon icon={faCheck}/>
                  </CheckboxSpan>
                  Exact Match
                </CheckboxLabel>
                <CheckboxLabel>
                  <CheckboxInput name="desc" type="checkbox" checked={optionsState['desc']}  onClick={checkedToggleHandler}/>
                  <CheckboxSpan>
                    <CheckboxIcon icon={faCheck}/>
                  </CheckboxSpan>
                  Property Description
                </CheckboxLabel>
                <CheckboxLabel>
                  <CheckboxInput name="syns" type="checkbox" checked={optionsState['syns']} onClick={checkedToggleHandler}/>
                  <CheckboxSpan>
                    <CheckboxIcon icon={faCheck}/>
                  </CheckboxSpan>
                  Synonyms
                </CheckboxLabel>
              </FormGroupStyled>
            </SearchOptions>
          </SearchOptionsContainer>
          <SearchOptionsContainer>
            <SearchOptionsLabel>Choose your Data Source</SearchOptionsLabel>
            <SearchOptions>
              <SelectBtn aria-label={isToggleOnSource === false ? 'Select All' : 'Unselect All'} onClick={selectDataAllToggleHandler}>{isToggleOnSource === false ? 'Select All' : 'Unselect All'}</SelectBtn>
              <FormGroupStyled>
                <CheckboxLabel>
                  <CheckboxInput name="gdc" type="checkbox" checked={selectDataSource['gdc']} onClick={selectDataToggleHandler}/>
                  <CheckboxSpan>
                    <CheckboxIcon icon={faCheck}/>
                  </CheckboxSpan>
                  Genomic Data Commons <SpanNormal>(GDC)</SpanNormal>
                </CheckboxLabel>
                <CheckboxLabel>
                  <CheckboxInput name="ctdc" type="checkbox" checked={selectDataSource['ctdc']} onClick={selectDataToggleHandler}/>
                  <CheckboxSpan>
                    <CheckboxIcon icon={faCheck}/>
                  </CheckboxSpan>
                  Clinical Trial Data Commons <SpanNormal>(CTDC)</SpanNormal>
                </CheckboxLabel>
                <CheckboxLabel>
                  <CheckboxInput name="icdc" type="checkbox" checked={selectDataSource['icdc']} onClick={selectDataToggleHandler}/>
                  <CheckboxSpan>
                    <CheckboxIcon icon={faCheck}/>
                  </CheckboxSpan>
                  Integrated Canine Data Commons <SpanNormal>(ICDC)</SpanNormal>
                </CheckboxLabel>
              </FormGroupStyled>
            </SearchOptions>
          </SearchOptionsContainer>
        </SearchAllOptions>
      </SearchBarContainer>
    </SearchBoxContainer>
  );
};

export default SearchBox;
