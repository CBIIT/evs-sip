const DataRetriever = require('./DataRetriever');
const cache = require("../../components/cache");
const config = require("../../config");
const Property = require('./../../lib/Property');
const fs = require("fs");
const path = require("path");
const $RefParser = require("@apidevtools/json-schema-ref-parser");
const yaml = require("yamljs");

/**
 * DataRetreiver subclass for MDF files
 *
 * @property {object} _source The details of the data source
 * @property {string} #dict The name of the dictionary; used for caching
 * @property {string} #path The directory containing all of the YAML files
 */
const MdfDataRetriever = class extends DataRetriever {
  #dict;
  #modelPath;
  #propsPath;

  /**
   * Constructor
   * 
   * @param {object} _source The details of the data source
   */
  constructor(source) {
    super(source);

    this.#dict = source.dict;
    this.#modelPath = source.modelPath;
    this.#propsPath = source.propsPath;
  }

  /**
   * Retrieves data
   * 
   * @param {object} filters A mapping of filters
   * 
   * @returns object[]
   */
  get = async (filters) => {
    const node = filters.node;
    const prop = filters.prop;
    const results = [];

    let result = cache.getValue("icdc_dict_api");
    if (result == undefined || node !== '') {
      let jsonData = {};
      var mpJson = yaml.load(this.#propsPath);
      jsonData.mpData = mpJson;
      var mJson = yaml.load(this.#modelPath);
      jsonData.mData = mJson;
      result = this._generateData(jsonData, 'ICDC', node, prop);
      if (node === '') cache.setValue("icdc_dict_api", result, config.item_ttl);
    }
    if (result.length === 0) {
      return { status: 400, message: " No data found. " };
    }
    return { status: 200, results: result };
  }

  _generateData = (dc, model, node, prop) => {
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
};

module.exports = MdfDataRetriever;
