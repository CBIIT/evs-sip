import React from 'react';
import styled from 'styled-components';
import { Container, Row, Col} from 'react-bootstrap';

import bkgd from '../../assets/img/graph-bkgd.jpg';
import graphImg from '../../assets/img/graph-diagram.png';

const GraphSection = styled.section`
  height: 38rem;
`;

const GraphicBackgroundWrap = styled.div`
  max-width: 100%;
  margin: 0 auto;
  position: relative;
`;

const GraphicBackground = styled.div`
  display: flex;
  align-items: stretch;
  height: 38rem;
  width: 100%;
  position: absolute;
`;

const GraphicBkgdLeft = styled.div`
  background: url(${bkgd}) no-repeat center;
  background-size: cover;
  background-color: #042A68;
  width: 66.666667%;
`;

const GraphicBkgdRight = styled.div`
  background-color: var(--graphic-blue);
  width: 33.333333%;
`;

const ContainerStyled = styled(Container)`
  max-width: 80rem;
  height: 100%;
  position: relative;
`;

const RowStyled = styled(Row)`
  height: 100%;
`;

const DiagramContainer = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const DiagramImg = styled.img`
  max-width: 95%;
`;

const GraphTitleContainer = styled.div`
  background-color: var(--graphic-blue);
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const GraphTitle = styled.h2`
  font-family: 'Raleway-Medium', sans-serif;
  width: 22rem;
  inline-size: 22rem;
  font-size: 1.875rem;
  color: #fff;
  margin-bottom: 0.5rem;
  font-weight: 500;
  line-height: 1.2;
`;

const GraphParagraph = styled.p`
  font-family: 'Inter', sans-serif;
  width: 22rem;
  inline-size: 22rem;
  font-size: 1.0625rem;
  color: #b9fee6;
  margin-top: 1.5rem;
`;

const Graph = () => {
  return <GraphSection>
    <GraphicBackgroundWrap>
      <GraphicBackground>
        <GraphicBkgdLeft/>
        <GraphicBkgdRight/>
      </GraphicBackground>
    </GraphicBackgroundWrap>
    <ContainerStyled>
      <RowStyled>
        <Col xs={7}>
          <DiagramContainer>
            <DiagramImg alt="Graphic Background" src={graphImg}/>
          </DiagramContainer>
        </Col>
        <Col xs={5}>
          <GraphTitleContainer>
            <GraphTitle>
              The EVS Semantic Integration Platform supports standardization of vocabulary for the NCI Cancer Research Data Commons (CRDC) and beyond.
            </GraphTitle>
            <GraphParagraph>
              The EVS-SIP provides programmatic semantic tools to facilitate querying, downloading and submitting data and metadata.
            </GraphParagraph>
          </GraphTitleContainer>
        </Col>
      </RowStyled>
    </ContainerStyled>
  </GraphSection>;
}

export default Graph;
