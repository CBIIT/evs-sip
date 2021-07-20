import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import styled from 'styled-components';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";


// components
import Header from './components/Header';
import NavigationBar from './components/NavigationBar';
import Footer from './components/Footer';
import Layout from './components/Layout';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Search from './pages/Search';
import DataModel from './pages/DataModel';
import ReportDiff from './pages/ReportDiff';
import NotFound from './pages/NotFound';


const MainContainer = styled.div`
  position: relative;
  min-height: 100vh;
`

function App() {
  return (
      <Router basename={'/evssip'}>
        <MainContainer>
          <Header/>
          <NavigationBar/>
          <Layout>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/search" component={Search} />
              <Route path="/datamodel" component={DataModel} />
              <Route path="/about" component={About} />
              <Route path="/reportdiff" component={ReportDiff} />
              <Route component={NotFound} />
            </Switch>
          </Layout>
          <Footer/>
        </MainContainer>
      </Router>
  );
}

export default App;
