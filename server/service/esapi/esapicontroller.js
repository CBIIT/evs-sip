const elastic = require("../../components/elasticsearch");
const logger = require("../../components/logger");
const config = require("../../config");
const path = require("path");
const shared = require("../search/shared");
const xmlBuilder = require("../tools/xmlBuilder");
const DataConnection = require('./../../lib/DataConnection/DataConnection')
const dataFilesPath = path.join(__dirname, "..", "..", "data_files");

const searchP = (req, res, formatFlag) => {
  //let keyword = req.query.keyword.trim().replace(/\+/g, "\\+").replace(/-/g, "\\-").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
  if (req.query.keyword) {
    let keyword = req.query.keyword.trim();
    let sources = req.query.sources ? req.query.sources.replace(/ /g, "").replace(/"/g, "").replace(/'/g, "").trim().split(',') : [];

    let option = {};
    if (req.query.options) {
      option.match = req.query.options.indexOf("exact") !== -1 ? "exact" : "partial";
      option.syn = req.query.options.indexOf('syn') !== -1 ? true : false;
      option.n_syn = req.query.options.indexOf('n_syn') !== -1 ? true : false;
      option.p_syn = req.query.options.indexOf('p_syn') !== -1 ? true : false;
      option.desc = req.query.options.indexOf('desc') !== -1 ? true : false;
      option.sources = sources;
    }
    else {
      option = {
        match: "partial",
        syn: false,
        n_syn: false,
        p_syn: false,
        desc: false
      };
      option.sources = sources;
    }
    if (keyword && keyword.trim() !== "") {
      let query = shared.generateQuery(keyword, option);
      logger.debug("keyword: " + keyword)
      logger.debug("------ query ------  %o ", query)
      let highlight = shared.generateHighlight();
      elastic.query(config.index_p, query, "enum", highlight,(result) => {
        if (result.hits === undefined) {
          res.json({ total: 0, returnList: [], timedOut: true });
          //return writeError.error(res, result);
        } else {
          let total = result.hits.total.value;
          let data = result.hits.hits;
          data.forEach((entry) => {
            delete entry.sort;
            delete entry._index;
            delete entry._score;
            delete entry._type;
            delete entry._id;
          });
          const pcdc_project_fullName = shared.getPCDCProjectsFullName();
          if (formatFlag === 'xml') {
            res.header('Content-Type', 'text/xml').send(xmlBuilder.xmlBuilder.buildObject(({
              total: total,
              returnList: data,
              timedOut: false,
              info: pcdc_project_fullName,
            })));
          } else {
            res.json({
              total: total,
              returnList: data,
              timedOut: false,
              info: pcdc_project_fullName,
            });
          }
        }
      });
    }
  } else {
    if (formatFlag === 'xml') {
      res.header('Content-Type', 'text/xml').status(200).send(xmlBuilder.buildObject({
        Message: 'Empty keyword'
      }));
    } else {
      res.json([]);
    }
  }
};

/**
 * Retrieves GDC data
 *
 * @param {string} node The name of the node to retrieve
 * @param {string} prop The name of the property to retrieve
 * @returns {object} The results retrieved
 */
const getGraphicalGDCDictionary = async (node, prop) => {
  const folderPath = path.join(
    __dirname,
    "..",
    "..",
    "data_files",
    "GDC",
    "model"
  );
  const dataConnection = new DataConnection('multiYaml', {
    path: folderPath,
  });
  const results = await dataConnection.retriever.get({
    dict: 'GDC',
    node,
    prop
  });

  if (results.length === 0 ) {
    return {
      status: 400,
      message: ' No data found. ',
    };
  }

  return {
    status: 200,
    results: results,
  };
};

const getGraphicalICDCDictionary = async (node, prop ) => {
  const dataConnection = new DataConnection('mdf', {
    modelPath: path.join(dataFilesPath, 'ICDC', 'icdc-model.yml'),
    propsPath: path.join(dataFilesPath, 'ICDC', 'icdc-model-props.yml'),
  });
  const results = await dataConnection.retriever.get({
    dict: 'ICDC',
    node,
    prop
  });

  if (results.length === 0 ) {
    return {
      status: 400,
      message: ' No data found. ',
    };
  }

  return {
    status: 200,
    results: results,
  };
};

const getGraphicalCTDCDictionary = async (node, prop ) => {
  const dataConnection = new DataConnection('mdf', {
    modelPath: path.join(dataFilesPath, 'CTDC', 'ctdc_model_file.yaml'),
    propsPath: path.join(dataFilesPath, 'CTDC', 'ctdc_model_properties_file.yaml'),
  });
  const results = await dataConnection.retriever.get({
    dict: 'CTDC',
    node,
    prop
  });

  if (results.length === 0 ) {
    return {
      status: 400,
      message: ' No data found. ',
    };
  }

  return {
    status: 200,
    results: results,
  };
}

/**
 * Retrieves data specified by project, node, and property
 *
 * @param {string} project The PCDC project to filter by
 * @param {string} node The node to filter by
 * @param {string} prop The property to filter by
 * @returns {object} A map of values
 */
const getGraphicalPCDCDictionary = async (project = null, node, prop) => {
  const dataConnection = new DataConnection('json', {
    dict: 'PCDC',
    path: path.join(dataFilesPath, 'PCDC', 'pcdc-model-all.json'),
  });
  const results = await dataConnection.retriever.get({
    category: project,
    node,
    prop
  });

  if (results.length === 0 ) {
    return {
      status: 400,
      message: ' No data found. ',
    };
  }

  return {
    status: 200,
    results: results,
  };
};

module.exports = {
  searchP,
  getGraphicalICDCDictionary,
  getGraphicalCTDCDictionary,
  getGraphicalPCDCDictionary,
  getGraphicalGDCDictionary,
};
