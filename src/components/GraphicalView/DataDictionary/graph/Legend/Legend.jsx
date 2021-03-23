import React from 'react';
import PropTypes from 'prop-types';
import { capitalizeFirstLetter } from '../../../utils';
import { Button, ListGroup} from 'react-bootstrap';
import { getCategoryIconSVG, getCategoryColor } from '../../NodeCategories/helper';
import { apiGetPCDCDictionary  } from '../../../../../api';
import './Legend.css';

class Legend extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true,
      current_project: "AML"
    };
  }

  toggleLegend = () => {
    this.setState(state => ({
      show: !state.show,
    }));
  }

  switchProject = async (project) => {
    if(this.props.graphType.indexOf("pcdc") === 0){
      const dict = await apiGetPCDCDictionary(project);
      this.props.onInitiateGraph(dict);
      this.setState({current_project: project});
    }
  }

  render() {
    let legend_content = "";
    if(this.props.graphType.indexOf("pcdc") === 0){

      
      legend_content = ["AML", "EWS"].map((project, i) => {
        const itemColor = getCategoryColor(project.toLowerCase());
        const IconSvg = getCategoryIconSVG(project.toLowerCase());
        const active = this.state.current_project === project;
        return (
          <ListGroup.Item onClick={() => this.switchProject(project)} active={active}>
            <div
              key={project}
              className='data-dictionary-graph-legend__item body'
            >
              <span className='data-dictionary-graph-legend__circle-wrapper'>
                {
                  IconSvg ? <IconSvg /> : (
                    <span
                      className='data-dictionary-graph-legend__circle'
                      style={{ backgroundColor: itemColor }}
                    />
                  )
                }
              </span>
              <span className='data-dictionary-graph-legend__text'>
                {project.toUpperCase()}
              </span>
            </div>
          </ListGroup.Item>
        );
      });
      legend_content = (<ListGroup defaultActiveKey="#link0">
        {legend_content}
      </ListGroup>);
    }
    else{
      legend_content = this.props.items.map((category) => {
        const itemColor = getCategoryColor(category);
        const IconSvg = getCategoryIconSVG(category);
        return (
          <div
            key={category}
            className='data-dictionary-graph-legend__item body'
          >
            <span className='data-dictionary-graph-legend__circle-wrapper'>
              {
                IconSvg ? <IconSvg /> : (
                  <span
                    className='data-dictionary-graph-legend__circle'
                    style={{ backgroundColor: itemColor }}
                  />
                )
              }
            </span>
            <span className='data-dictionary-graph-legend__text'>{capitalizeFirstLetter(category)}</span>
          </div>
        );
      });
    }
    return (
      <div className={`data-dictionary-graph-legend ${this.state.show ? '' : 'data-dictionary-graph-legend--toggled'}`}>
        {
          this.state.show ?
            (
              <React.Fragment>
                <i
                  className='data-dictionary-graph-legend__close g3-icon g3-icon--cross'
                  onClick={this.toggleLegend}
                  onKeyPress={this.toggleLegend}
                  role='button'
                  title='close' 
                  tabIndex={0}
                />
                {
                  this.props.graphType.indexOf("pcdc") === 0 ? 
                      (
                        <div className='data-dictionary-graph-legend__item body'>
                          <span style={{fontWeight: "bold"}}>Projects</span>
                        </div>
                      )
                      : 
                      (
                        <div className='data-dictionary-graph-legend__item body'>
                          <i className="data-dictionary-graph-legend__icon fas fa-minus"></i>
                          <span className='data-dictionary-graph-legend__text'>Relationships</span>
                        </div>
                      )
                }
                {
                  legend_content
                }
              </React.Fragment>
            )
            : (
              <span
                className='data-dictionary-graph-legend__info'
                onClick={this.toggleLegend}
                onKeyPress={this.toggleLegend}
                role='button'
                title='Show Legend' 
                tabIndex={0}
              >
                <i className="data-dictionary-graph-legend__question-icon fas fa-question"></i>
              </span>
            )
        }
      </div>
    );
  }
}

Legend.propTypes = {
  items: PropTypes.arrayOf(PropTypes.string),
  onInitiateGraph: PropTypes.func,
  graphType: PropTypes.string,
};

Legend.defaultProps = {
  items: [],
  onInitiateGraph: () => {},
  graphType: "gdc"
};

export default Legend;
