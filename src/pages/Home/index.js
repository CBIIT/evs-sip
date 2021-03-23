import React, { useEffect } from 'react';
import styled from 'styled-components';
import Search from './Search';
import Graph from './Graph';
import Tools from './Tools'

const Page = styled.div`
  background-color: var(--white);
  padding-bottom: 18rem;
`;

const Home = () => {
  useEffect(()=> {
    window.scrollTo(0, 0);
  });

  return <Page>
    <Search/>
    <Graph/>
    <Tools/>
  </Page>;
}

export default Home;
