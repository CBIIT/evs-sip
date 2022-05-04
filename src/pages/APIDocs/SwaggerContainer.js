import React from 'react';
import styled from 'styled-components';

import SwaggerUI from "swagger-ui-react"
import "swagger-ui-react/swagger-ui.css"

const ContentBox =  styled.div`
  padding: 1rem 0;
  margin: 2.5rem 0;
  background-color: var(--white-bkgd);

  & h1, h2, h3, h4 {
    line-height: initial;
  } 
`;

const SwaggerContainer = () => {
  let home_url = process.env.REACT_APP_HOME_URL || process.env.PUBLIC_URL;
  return <ContentBox>
      <SwaggerUI url={home_url + 'api/swaggerjson/'}/>
  </ContentBox>
}

export default SwaggerContainer;
