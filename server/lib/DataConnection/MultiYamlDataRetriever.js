const DataRetriever = require('./DataRetriever');
const Node = require('./../../lib/Node');
const Property = require('./../../lib/Property');
const fs = require('fs');
const $RefParser = require('@apidevtools/json-schema-ref-parser');
const yaml = require('yamljs');

/**
 * DataRetreiver subclass for multiple YAML files
 *
 * @property {object} _source The details of the data source
 * @property {string} #path The directory containing all of the YAML files
 */
const MultiYamlDataRetriever = class extends DataRetriever {
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
    const node = filters.node;
    const prop = filters.prop;
    let results;

    let jsonData = {};
    var termsJson = yaml.load(this.#path + '/_terms.yaml');
    jsonData['_terms.yaml'] = termsJson;
    var defJson = yaml.load(this.#path + '/_definitions.yaml');
    jsonData['_definitions.yaml'] = defJson;
    var termsEnumJson = yaml.load(this.#path + '/_terms_enum.yaml');
    jsonData['_terms_enum.yaml'] = termsEnumJson;

    fs.readdirSync(this.#path).forEach((file) => {
      if(!node || node ==='' || file.toLowerCase().includes(node.toLowerCase())){
      let fileJson = yaml.load(this.#path + "/" + file);
      if (
        file.indexOf('_') !== 0 &&
        file !== 'annotation.yaml' &&
        file !== 'metaschema.yaml' &&
        fileJson.category !== 'TBD' &&
        fileJson.category !== 'data'
      ) {
        jsonData[file] = fileJson;
      }
    }
    });
    results = await this._generateData(jsonData);

    delete results._terms;
    delete results._terms_enum;
    delete results._definitions;

    return this._processResult(results, node, prop);
  };

  _generateData = async (schema) => {
    let dict = {};

    Object.entries(schema).forEach(([key, value]) => {
      delete value['$schema'];
      delete value['namespace'];
      delete value['project'];
      delete value['program'];
      delete value['submittable'];
      delete value['downloadable'];
      delete value['previous_version_downloadable'];
      delete value['validators'];
      delete value['uniqueKeys'];
      if (value['properties']) {
        delete value['properties']['$ref'];
      }

      dict[key.slice(0, -5)] = value;
    });

    // Recursivly fix references
    dict = this._findObjectWithRef(dict, (refObj, rootKey) => {
      // This halts for sub objects./...

      let tmp = '';

      if (Array.isArray(refObj)) {
        tmp = refObj[0];
      } else {
        tmp = refObj;
      }

      if (tmp.includes('.yaml')) {
        tmp = '#/' + tmp.replace('.yaml#', '');
      } else {
        tmp = '#/' + rootKey + '/' + tmp.replace('#/', '');
      }

      return tmp;
    });

    dict['_terms']['file_format'] = { description: 'wut' };

    let newDict = await $RefParser.dereference(dict, {
      continueOnError: false, // Don't throw on the first error
      dereference: {
        circular: true, // Don't allow circular $refs
      },
    });

    console.log('End of Dereference...');

    const result = Object.keys(newDict).reduce(function (filtered, key) {
      let obj = newDict[key];
      let deprecated_properties = obj.deprecated ? obj.deprecated : [];

      if (obj.properties) {
        deprecated_properties.forEach((d_p) => {
          delete obj.properties[d_p];
        });
        delete obj['deprecated'];
        for (let p in obj.properties) {
          if (obj.properties[p].anyOf) {
            //remove any reference properties
            delete obj.properties[p];
          }
        }

        // from _excludeSystemProperties()
        obj.properties = obj.properties && Object.keys(obj.properties)
          .filter((key) =>
            obj.systemProperties ? !obj.systemProperties.includes(key) : true
          ).reduce((acc, key) => {
            acc[key] = obj.properties[key];
            return acc;
          }, {});
      }

      delete obj.systemProperties;

      if (!['_terms','_terms_enum','_definitions'].includes(key)) {
        filtered.push(newDict[key]);
      }

      return filtered;
    }, []);

    return result;
  };

  _processResult = (result, node, prop) => {
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
        model: this.#dict,
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
        item['required'] = r.required;     
        item['relationship'] = r.links;

        dataList.push(item);
      }
    });

    return dataList;
  };


  _findObjectWithRef = (obj, updateFn, root_key = '', level = 0) => {
    // iterate over the properties
    for (var propertyName in obj) {
      if (level === 0) root_key = propertyName;

      if (propertyName === '$ref') {
        obj['$ref'] = updateFn(obj['$ref'], root_key);
      }

      // any object that is not a simple value
      if (obj[propertyName] !== null && typeof obj[propertyName] === 'object') {
        // recurse into the object and write back the result to the object graph
        obj[propertyName] = this._findObjectWithRef(
          obj[propertyName],
          updateFn,
          root_key,
          level + 1
        );
      }
    }

    return obj;
  };
};

module.exports = MultiYamlDataRetriever;
