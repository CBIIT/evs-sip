const fs = require('fs');
const DataRetriever = require('./DataRetriever');
const Property = require('./../../lib/Property');

/**
 * DataRetreiver subclass for JSON files
 *
 * @property {object} _source The details of the data source
 * @property {string} #dict The name of the dictionary; used for caching
 * @property {string} #path The path to the JSON model file
 */
const JsonDataRetriever = class extends DataRetriever {
  #dict;
  #path;

  /**
   * Constructor
   * 
   * @param {object} _source The details of the data source
   */
  constructor(source) {
    super(source);

    this.#dict = source.dict;
    this.#path = source.path;
  }

  /**
   * Retrieves data
   * 
   * @param {object} filters A mapping of filters
   * 
   * @returns object[]
   */
  retrieve = async (filters) => {
    const category = filters.category;
    const node = filters.node;
    const prop = filters.prop;
    const results = [];
    let jsonData = JSON.parse(fs.readFileSync(this.#path).toString());
    let data = this._generateData(jsonData, {});

    // Obtain nodes from specified project
    for (const cat in data) {
      const isCorrectCategory = cat.toLowerCase() === category?.toLowerCase();
      const projData = data[cat];
      let desiredNodes;

      // Skip if category is specified and doesn't match current category
      if (category !== null && !isCorrectCategory) {
        continue;
      }

      desiredNodes = this._getNodes(projData, node, prop);
      results.push(...desiredNodes);
    }
    console.log(results);

    return results;
  }

  _generateData = (data, filter) => {
    let dataList = {};

    for (let project in data) {
      dataList[project] = {};
      let dc = data[project];
      for (let [key, value] of Object.entries(dc)) {
        const item = {};
        item['model'] = this.#dict;
        if ('Category' in value) {
          item['category'] = project;
        } else {
          item['category'] = project;
        }
        item['node_name'] = key;

        const properties = [];
        const pRequired = [];

        if (value.properties.length > 0) {
          for (var i = 0; i < value.properties.length; i++) {
            const nodeP = value.properties[i];
            const propertiesItem = {};
            const property = new Property({
              description: nodeP.p_desc,
              enum: nodeP.values,
              name: nodeP.p_name,
              type: nodeP.p_type,
            });
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

  /**
   * Retrieves specified nodes
   *
   * @param {object} nodes A mapping of nodes to consider
   * @param {string} desiredNode The name of the node to retrieve
   * @param {string} desiredProp The name of the property to retrieve
   * @returns {object[]} The target nodes
   */
  _getNodes = (nodes, desiredNode, desiredProp) => {
    const desiredNodes = [];

    // Gather desired nodes into an array
    for (const nodeName in nodes) {
      const node = nodes[nodeName];
      const isCorrectNode = node.node_name?.toLowerCase() === desiredNode?.toLowerCase();

      // Include the node if specified, or include it if no node is specified
      if (!desiredNode || isCorrectNode) {
        const formattedNode = this._collapseNode(node, desiredProp);

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
  _collapseNode = (node, desiredProp) => {
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
};

module.exports = JsonDataRetriever;
