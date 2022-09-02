import React from 'react';
import PropTypes from 'prop-types';
import { capitalizeFirstLetter } from '../../../utils';
import { ListGroup} from 'react-bootstrap';
import { getCategoryIconSVG, getCategoryColor } from '../../NodeCategories/helper';
import { apiGetPCDCDictionary  } from '../../../../../api';
import { getSearchResult, getSearchSummary} from '../../search/DictionarySearcher/searchHelper'; 
import './Legend.css';

class Legend extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true
    };
  }

  toggleLegend = () => {
    this.setState(state => ({
      show: !state.show,
    }));
  }

  componentDidMount() {
    if(this.props.currentProject !== ""){
      this.switchProject(this.props.currentProject);
    }
    
  }

  switchProject = async (project) => {
    if(this.props.graphType.indexOf("pcdc") === 0){
      const dict = await apiGetPCDCDictionary(project);
      this.props.onInitiateGraph(dict);

      if(this.props.graphType === "pcdc"){
        const result = getSearchResult(this.props.graphType , this.props.source, project);
        if (!result || result.length === 0) {
          this.props.onSearchResultUpdated([], []);
          return;
        }
        const summary = getSearchSummary(result);
        this.props.onSearchResultUpdated(result, summary);
      }
      
      this.props.onCurrentProjectUpdated(project);
    }
  }

  render() {
    let legend_content = "";
    if(this.props.graphType.indexOf("pcdc") === 0){

      const current_project = this.props.currentProject === "" ? "AML" : this.props.currentProject;
      legend_content = ["AML", "EWS", "GCT", "ALL", "HL", "OS"].map((project, i) => {
        const itemColor = getCategoryColor(project.toLowerCase());
        const IconSvg = getCategoryIconSVG(project.toLowerCase());
        const active = current_project === project;
        return (
          <ListGroup.Item onClick={() => this.switchProject(project)} active={active}>
            <div
              key={project}
              className='data-dictionary-graph-legend__item body'
            >
              <span className='data-dictionary-graph-legend__circle-wrapper'>
                {
                  IconSvg ? <IconSvg fill={itemColor}/> : (
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
  currentProject: PropTypes.string,
  onInitiateGraph: PropTypes.func,
  onSearchResultUpdated: PropTypes.func,
  onCurrentProjectUpdated: PropTypes.func,
  graphType: PropTypes.string,
  source: PropTypes.object,
};

Legend.defaultProps = {
  items: [],
  currentProject: "",
  onInitiateGraph: () => {},
  onSearchResultUpdated: () => {},
  onCurrentProjectUpdated: () => {},
  graphType: "gdc",
  source: [],
};

export default Legend;
