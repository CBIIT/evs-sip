const elastic = require("../../components/elasticsearch");
const logger = require("../../components/logger");
const cache = require("../../components/cache");
const config = require("../../config");
const fs = require("fs");
const path = require("path");
const shared = require("../search/shared");
const xmlBuilder = require("../tools/xmlBuilder");
const yaml = require("yamljs");
const $RefParser = require("@apidevtools/json-schema-ref-parser");
const Property = require('./../../lib/Property');
const DataConnection = require('./../../lib/DataConnection/DataConnection')
const folderPath = path.join(
  __dirname,
  "..",
  "..",
  "data_files",
  "GDC",
  "model"
);
const dataFilesPath = path.join(__dirname, "..", "..", "data_files");

const searchP = (req, res, formatFlag) => {
  //let keyword = req.query.keyword.trim().replace(/\+/g, "\\+").replace(/-/g, "\\-").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
  if (req.query.keyword) {
    let keyword = req.query.keyword.trim();
    let sources = req.query.sources ? req.query.sources.replace(/\ /g, "").replace(/\"/g, "").replace(/\'/g, "").trim().split(',') : [];

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
const getGraphicalGDCDictionary = async function (node, prop) {
  const dataConnection = new DataConnection('multiYaml');
  const results = await dataConnection.retriever.get({
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

const getGraphicalICDCDictionary = function (node, prop ) {
  let result = cache.getValue("icdc_dict_api");
  if (result == undefined || node !== '') {
    let jsonData = {};
    var mpJson = yaml.load(dataFilesPath + "/ICDC/icdc-model-props.yml");
    jsonData.mpData = mpJson;
    var mJson = yaml.load(dataFilesPath + "/ICDC/icdc-model.yml");
    jsonData.mData = mJson;
    result = generateICDCorCTDCData(jsonData, 'ICDC', node, prop);
    if (node === '') cache.setValue("icdc_dict_api", result, config.item_ttl);
  }
  if (result.length === 0) {
    return { status: 400, message: " No data found. " };
  }
  return { status: 200, results: result };
};

const getGraphicalCTDCDictionary = function (node, prop )  {
  let result = cache.getValue("ctdc_dict_api");
  if (result == undefined || node !== '') {
    let jsonData = {};
    var mpJson = yaml.load(
      dataFilesPath + "/CTDC/ctdc_model_properties_file.yaml"
    );
    jsonData.mpData = mpJson;
    var mJson = yaml.load(dataFilesPath + "/CTDC/ctdc_model_file.yaml");
    jsonData.mData = mJson;
    result = generateICDCorCTDCData(jsonData, 'CTDC', node, prop);
    /*
        for(let node in result){
          result[node].category = "clinical";
        }
        */
    if (node === '') cache.setValue("ctdc_dict_api", result, config.item_ttl);
  }
  if (result.length === 0) {
    return { status: 400, message: " No data found. " };
  }
  return { status: 200, results: result };
}

const processGDCDictionaryEnumData = (prop) => {
  const enums = prop.enum;
  const enumsDef = prop.enumDef;
  let result = enums ? enums.map((value) => {
    let tmp = {};
    tmp.n = value.replace(/(?:\r\n|\r|\n)/g, ' ');
    if (enumsDef && enumsDef[tmp.n] && enumsDef[tmp.n].termDef) {
      let term = enumsDef[tmp.n].termDef;
      if (term.source == "NCIt" && term.term_id && term.term_id !== "") {
        tmp.gdc_ncit = term.term_id;
      }
      else {
        tmp.gdc_ncit = "";
      }
    }
    else {
      tmp.gdc_ncit = "";
    }
    tmp.n = tmp.n.replace(/\s+/g, ' ');
    return tmp;
  }) : [];
  return result;
};

/**
 * Retrieves data specified by project, node, and property
 *
 * @param {string} project The PCDC project to filter by
 * @param {string} node The node to filter by
 * @param {string} prop The property to filter by
 * @returns {object} A map of values
 */
const getGraphicalPCDCDictionary = (project = null, node, prop) => {
  // Initialize results
  const project_result = {
    status: 200,
    results: [],
  };
  let result;

  // Read from cache
  if (project) {
    result = cache.getValue(`public_pcdc_dict_${project}`);
  } else {
    result = cache.getValue("public_pcdc_dict");
  }

  if (true || result === undefined) {
    let jsonData = shared.readPCDCMapping();
    result = generatePCDCData(jsonData, {});
    //result = generatePCDCData(jsonData, {Relationships: {}});
    cache.setValue("public_pcdc_dict", result, config.item_ttl);
  }

  // Obtain nodes from specified project
  for (const proj in result) {
    const isCorrectProject = proj.toLowerCase() === project?.toLowerCase();
    const projData = result[proj];
    let desiredNodes;

    if (project !== null && !isCorrectProject) {
      continue;
    }

    desiredNodes = getPcdcNodes(projData, node, prop);
    project_result.results = project_result.results.concat(desiredNodes);
  }
  let nodes = Object.keys(project_result);
  
  //create fake relationship for graphical display purpose
  nodes.forEach((n, i) => {
    if (i - 4 >= 0) {
      let linkItem = {};
      linkItem["name"] = nodes[i - 4];
      linkItem["backref"] = n;
      linkItem["label"] = "of_pcdc";
      linkItem["target_type"] = nodes[i - 4];
      linkItem["required"] = false;

      project_result[n].links.push(linkItem);
    }
  });

  // Cache the results
  if (project) {
    cache.setValue(`public_pcdc_dict_${project}`, project_result, config.item_ttl);
  } else {
    cache.setValue("public_pcdc_dict", project_result, config.item_ttl);
  }

  // Handle empty results
  if (project_result.results.length === 0 ) {
    return {
      status: 400,
      message: " No data found. ",
    };
  }

  return project_result;
};

/**
 * Retrieves specified nodes
 *
 * @param {object} nodes A mapping of nodes to consider
 * @param {string} desiredNode The name of the node to retrieve
 * @param {string} desiredProp The name of the property to retrieve
 * @returns {object[]} The target nodes
 */
const getPcdcNodes = (nodes, desiredNode, desiredProp) => {
  const desiredNodes = [];

  // Gather desired nodes into an array
  for (const nodeName in nodes) {
    const node = nodes[nodeName];
    const isCorrectNode = node.node_name?.toLowerCase() === desiredNode?.toLowerCase();

    // Include the node if specified, or include it if no node is specified
    if (!desiredNode || isCorrectNode) {
      const formattedNode = collapsePcdcNode(node, desiredProp);

      if (formattedNode) {
        desiredNodes.push(formattedNode);
      }
    }
  }

  return desiredNodes;
}

/**
 * Replaces a node's list of properties with a single property's fields
 * 
 * @param {object} node The node to collapse
 * @param {string} desiredProp The name of the only prop the node should have
 * @returns {object|null} The collapsed node, or null
 */
const collapsePcdcNode = (node, desiredProp) => {
  const formattedNode = {
    model: node.model,
    category: node.category,
    node_name: node.node_name,
  };

  // Don't do anything if no property is specified
  if (!desiredProp) {
    return node;
  }

  // Find the property in the node
  for (const prop of node.properties) {
    const propName = prop.property_name;
    const doesPropMatch = propName.toLowerCase() === desiredProp.toLowerCase();

    // Skip if no match
    if (!doesPropMatch) {
      continue;
    }

    // Save property fields to the node
    for (const field in prop) {
      formattedNode[field] = prop[field];
    }

    return formattedNode;
  }

  // You only get here if the property wasn't found
  return null;
}

const generateICDCorCTDCData = (dc, model, node, prop) => {
  const dataList = [];
  const dcMData = dc.mData;
  const dcMPData = dc.mpData;

  // Build each node
  Object.entries(dcMData.Nodes).forEach(([dcMDataNodeName, dcMDataNode]) => {
    const doesNodeNameMatch = dcMDataNodeName.toLowerCase() === (node.toLowerCase());
    const isPropEmpty = !prop || prop === '';
    const isNodeNameEmpty = !node || node === '';

    if (!isPropEmpty && !isNodeNameEmpty && doesNodeNameMatch) {
      if (dcMDataNode.Props === null) {
        return dataList;
      }

      // Set node's properties
      dcMDataNode.Props.forEach((nodeP) => {
        if (nodeP.toLowerCase() !== prop.toLowerCase()) {
          return;
        }

        Object.entries(dcMPData.PropDefinitions).forEach(([propertyName, propDef]) => {
          let propertiesItem;

          // Skip properties that don't match the current property
          if (propertyName !== nodeP) {
            return;
          }

          propertiesItem = {
            model: model,
            node_name: dcMDataNodeName,
            property_name: nodeP,
            property_description: propDef.Desc,
            type: propDef.Type.constructor === Array ? 'enum' :  propDef.Type,
          };
          const property = new Property({
            description: propDef.Desc,
            name: nodeP,
          });

          if ('Category' in dcMDataNode) {
            propertiesItem.category = dcMDataNode.Category;
          } else if ('Tags' in dcMDataNode) {
              propertiesItem.category = dcMDataNode.Tags.Category;
          } else {
            propertiesItem.category = 'Undefined';
          }
          
          if (!!propDef.Type && propDef.Type.constructor === Array) {
            propertiesItem.values = propDef.Type.sort();
          }

          dataList.push(propertiesItem);
        });
      });

      return dataList;
    } else if (isNodeNameEmpty || doesNodeNameMatch) {
      const item = {
        model: model,
        node_name: dcMDataNodeName,
      };

      if ('Category' in dcMDataNode) {
        item.category = dcMDataNode.Category;
      } else if ('Tags' in dcMDataNode) {
        item.category = dcMDataNode.Tags.Category;
      } else {
        item.category = 'Undefined';
      }

      const link = [];
      const properties = []; // convert to [] from {}
      const pRequired = [];

      // Set node's properties
      if (dcMDataNode.Props != null) {
        dcMDataNode.Props.forEach((nodeP) => {
          const propertiesItem = {
            property_name: nodeP,
          };

          if (dcMPData.PropDefinitions.hasOwnProperty(nodeP)) {
            const propDef = dcMPData.PropDefinitions[nodeP];

            propertiesItem.property_description = propDef.Desc;
            propertiesItem.type = (propDef.Type.constructor === Array) ? 'enum' :  propDef.Type;

            if(!!propDef.Type && propDef.Type.constructor === Array) {
              propertiesItem.values = propDef.Type.sort();
            }

            if (propDef.Req === true) {
              pRequired.push(nodeP);
            }
          }

          properties.push(propertiesItem);
        });

        item.properties = properties;
        item.required = pRequired.sort();
      } else {
        item.properties = [];
      }

      // Set node's relationships
      Object.entries(dcMData.Relationships).forEach(([propertyName, dcMDataRelationship]) => {
        const linkItem = {
          relationship_type: propertyName,
          multiplicity: dcMDataRelationship.Mul,
        };
        const nodeList = dcMDataRelationship.Ends.reduce((nodeList, end) => {
          const backref = end.Src;
          const name = end.Dst;

          // Skip relationships that don't involve the current node
          if (!(backref === dcMDataNodeName || name === dcMDataNodeName)) {
            return nodeList;
          }

          // Add this relationship to the running list of source-destination pairs
          return [
            ...nodeList,
            {
              source: backref,
              destination: name,
            },
          ];
        }, []);

        linkItem.relationship_entity = nodeList;

        if (nodeList.length > 0) {
          link.push(linkItem);
        }
      });

      item.relationship = link.sort();
      dataList.push(item);
    }
  });

  return dataList;
};

const generatePCDCData = (pcdc_data, filter) => {
  let dataList = {};

  for (let project in pcdc_data) {
    dataList[project] = {};
    let dc = pcdc_data[project];
    for (let [key, value] of Object.entries(dc)) {
      //console.log(key);
      //console.log(value.Category);
      const item = {};
      // item['$schema'] = 'http://json-schema.org/draft-06/schema#';
      // item['title'] = shared.convert2Title(key);
      item['model'] = 'PCDC';
      if ('Category' in value) {
        item['category'] = project;
      } else {
        item['category'] = project;
      }
      item['node_name'] = key;

      // item['program'] = '*';
      // item['project'] = '*';
      // item['additionalProperties'] = false;
      // item['submittable'] = true;
      // item['constraints'] = null;
      //item['links']=[];

      // item['type'] = 'object';
      // const link = [];
      const properties = [];
      const pRequired = [];

      if (value.properties.length > 0) {
        for (var i = 0; i < value.properties.length; i++) {
          //console.log(icdcMData.Nodes[key].Props[i]);
          const nodeP = value.properties[i];
          const propertiesItem = {};
          propertiesItem['property_name'] = nodeP.p_name;
          propertiesItem['property_description'] = nodeP.p_desc;
          propertiesItem['type'] = nodeP.p_type;
          // propertiesItem['src'] = value.n_PT;

          properties.push(propertiesItem);

          // Store permissible values as an array of value names
          propertiesItem['values'] = nodeP.values.map(v => v.v_name);
        }

        item['properties'] = properties;
        item['required'] = pRequired;
      } else {
        item['properties'] = [];
      }

      item['relationship'] = [];

      // item['links'] = link;

      dataList[project][key] = item;
    }
  }

  return dataList;
};

const processGDCResult = (result, node, prop) => {
  const dataList = [];

  // No results
  if (result.length <= 0) {
    return dataList;
  }

  result.forEach((r) => {
    // Skip nodes that we didn't ask for
    if (node && r.id.toLowerCase() !== node.toLowerCase()) {
      return;
    }

    let item = {
      model: 'GDC',
      category: r.category,
      node_name: r.id,
      node_description: r.description,
    };

    if (prop && prop !== '') {
      if (r.properties) {
        Object.entries(r.properties).forEach(([propertyName, property]) => {
          // Skip properties that we didn't ask for
          if (propertyName.toLowerCase() !== prop.toLowerCase()) {
            return;
          }

          const p = new Property({
            name: propertyName,
            ...property,
          });

          item = {
            ...item,
            ...p.json,
          };

          dataList.push(item);
        });
      }
    } else {
      let propList =[];
      if (r.properties) {
        Object.entries(r.properties).forEach(([propertyName, property]) => {
          const p = new Property({
            name: propertyName,
            ...property,
          });

          propList.push(p.json);
        });
      }
      item['properties'] = propList;
      item["required"] = r.required;     
      item["relationship"] = r.links;

      dataList.push(item);
    }
  });

  return dataList;
};

module.exports = {
  searchP,
  getGraphicalICDCDictionary,
  getGraphicalCTDCDictionary,
  getGraphicalPCDCDictionary,
  getGraphicalGDCDictionary,
};
