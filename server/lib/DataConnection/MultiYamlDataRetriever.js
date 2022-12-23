const DataRetriever = require('./DataRetriever');
const cache = require("../../components/cache");
const config = require("../../config");
const Property = require('./../../lib/Property');
const fs = require("fs");
const $RefParser = require("@apidevtools/json-schema-ref-parser");
const yaml = require("yamljs");

/**
 * DataRetreiver subclass for multiple YAML files
 *
 * @property {object} _source The details of the data source
 * @property {string} #path The directory containing all of the YAML files
 */
const MultiYamlDataRetriever = class extends DataRetriever {
  #path;

  /**
   * Constructor
   * 
   * @param {object} _source The details of the data source
   */
  constructor(source) {
    super(source);

    this.#path = source.path;
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

    let result = cache.getValue("gdc_dict_api");
    if (result === undefined || node !== '') {
      console.log(
        "Start to generate GDC Dictionary Data and load to local cache."
      );
      let jsonData = {};
      var termsJson = yaml.load(this.#path + "/_terms.yaml");
      jsonData["_terms.yaml"] = termsJson;
      var defJson = yaml.load(this.#path + "/_definitions.yaml");
      jsonData["_definitions.yaml"] = defJson;
      var termsEnumJson = yaml.load(this.#path + "/_terms_enum.yaml");
      jsonData["_terms_enum.yaml"] = termsEnumJson;
      // let bulkBody = [];

      fs.readdirSync(this.#path).forEach((file) => {
        if(!node || node ==='' || file.toLowerCase().includes(node.toLowerCase())){
        let fileJson = yaml.load(this.#path + "/" + file);
        // Do not include annotation.yaml, metaschema.yaml
        // Only include node in the gdc_searchable_nodes
        // Do not include node in category "TBD" and "data"
        /*
              if (file.indexOf('_') !== 0 && file !== 'annotation.yaml' && file !== 'metaschema.yaml'  
                && gdc_searchable_nodes.indexOf(fileJson.id) !== -1 && fileJson.category !== 'TBD' && fileJson.category !== 'data') {
                jsonData[file] = fileJson;
              }
              */
        if (
          file.indexOf("_") !== 0 &&
          file !== "annotation.yaml" &&
          file !== "metaschema.yaml" &&
          fileJson.category !== "TBD" &&
          fileJson.category !== "data"
        ) {
          jsonData[file] = fileJson;
        }
      }
      });
      result = await this._generateGDCData(jsonData);
      console.log("Cached:");
      console.log(Object.keys(result).length);
      if(node === '') cache.setValue("gdc_dict_api", result, config.item_ttl);
    }
    delete result._terms;
    delete result._terms_enum;
    delete result._definitions;

    return this._processGDCResult(result, node, prop);
  }


  _generateGDCData = async (schema) => {
    console.log("Start...");
    let dict = {};

    Object.entries(schema).forEach(([key, value]) => {
      delete value["$schema"];
      delete value["namespace"];
      delete value["project"];
      delete value["program"];
      delete value["submittable"];
      delete value["downloadable"];
      delete value["previous_version_downloadable"];
      delete value["validators"];
      delete value["uniqueKeys"];
      if (value["properties"]) {
        delete value["properties"]["$ref"];
      }

      dict[key.slice(0, -5)] = value;
    });

    // Recursivly fix references
    dict = this._findObjectWithRef(dict, (refObj, rootKey) => {
      // This halts for sub objects./...

      let tmp = "";

      if (Array.isArray(refObj)) {
        tmp = refObj[0];
      } else {
        tmp = refObj;
      }

      if (tmp.includes(".yaml")) {
        // ABS_FIX
        // "$ref": "_definitions.yaml#/ubiquitous_properties",
        // ->
        // "$ref": "#/_definitions/ubiquitous_properties",

        tmp = "#/" + tmp.replace(".yaml#", "");
        // console.log("ABS FIX -- " + rootKey + ": " + refObj);
      } else {
        // REL FIX
        // "$ref": "#/state"
        // ->
        // "$ref": "#/{_definitions aka root key}/state"

        tmp = "#/" + rootKey + "/" + tmp.replace("#/", "");
        //console.log("REL FIX -- " + rootKey + ": " + refObj);
      }

      return tmp;
    });

    dict["_terms"]["file_format"] = { description: "wut" };
    //dict["case"].category = "case";

    console.log("End...");

    let newDict = await $RefParser.dereference(dict, {
      continueOnError: false, // Don't throw on the first error
      dereference: {
        circular: true, // Don't allow circular $refs
      },
    });

    console.log("End of Dereference...");

    const result = Object.keys(newDict).reduce(function (filtered, key) {
      let obj = newDict[key];
      let deprecated_properties = obj.deprecated ? obj.deprecated : [];
      //let deprecated_enum = [];

      if (obj.properties) {
        deprecated_properties.forEach((d_p) => {
          delete obj.properties[d_p];
        });
        delete obj["deprecated"];
        for (let p in obj.properties) {
          if (obj.properties[p].anyOf) {
            //remove any reference properties
            delete obj.properties[p];
          }
          /*
          else{
            if (obj.properties[p].deprecated_enum) {
              obj.properties[p].enum = _.differenceWith(obj.properties[p].enum, obj.properties[p].deprecated_enum, _.isEqual);
              console.log(obj.properties[p].enum);
            }
            delete obj.properties[p].deprecated_enum;
          }
          */
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


  _processGDCResult = (result, node, prop) => {
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


  _findObjectWithRef = (obj, updateFn, root_key = "", level = 0) => {
    // iterate over the properties
    for (var propertyName in obj) {
      if (level === 0) root_key = propertyName;

      if (propertyName === "$ref") {
        obj["$ref"] = updateFn(obj["$ref"], root_key);
      }

      // any object that is not a simple value
      if (obj[propertyName] !== null && typeof obj[propertyName] === "object") {
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
