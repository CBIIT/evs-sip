import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import styled from 'styled-components';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

// components
import Header from './components/Header';
import NavigationBar from './components/NavigationBar';
import Footer from './components/Footer';
import Layout from './components/Layout';
import SiteAlert from './components/SiteAlert/SiteAlert';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import APIDocs from './pages/APIDocs';
import Search from './pages/Search';
import DataModel from './pages/DataModel';
import ReportDiff from './pages/ReportDiff';
import NotFound from './pages/NotFound';


const MainContainer = styled.div`
  position: relative;
  min-height: 100vh;
`;

function App() {
  return (
    <Router basename={"/evssip"}>
      <MainContainer>
        <SiteAlert
          variant="info"
          info="The EVS website hosts biomedical terminologies that NCI does not own or control. Some of these sources may contain gender-related terminology that does not comply with Executive Order 14168."
        />
        <Header />
        <NavigationBar />
        <Layout>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/search" component={Search} />
            <Route path="/datamodel" component={DataModel} />
            <Route path="/apidocs" component={APIDocs} />
            <Route path="/about" component={About} />
            <Route path="/reportdiff" component={ReportDiff} />
            <Route component={NotFound} />
          </Switch>
        </Layout>
        <Footer />
      </MainContainer>
    </Router>
  );
}

export default App;
