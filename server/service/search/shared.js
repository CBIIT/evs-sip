const cache = require("../../components/cache");
const config = require("../../config");
const fs = require("fs");
const path = require("path");
const yaml = require("yamljs");
const _ = require("lodash");
const $RefParser = require("@apidevtools/json-schema-ref-parser");

const folderPath = path.join(
  __dirname,
  "..",
  "..",
  "data_files",
  "GDC",
  "model"
);
const dataFilesPath = path.join(__dirname, "..", "..", "data_files");
const dataFilesDir = path.join(__dirname, "..", "..", "data_files", "GDC");

const generateHighlightInnerHits = () => {
  let highlight = {
    pre_tags: ["<b>"],
    post_tags: ["</b>"],
    fields: {
      "enum.n.have": { number_of_fragments: 0 },
      "enum.n": { number_of_fragments: 0 },
      "enum.ncit.c.have": { number_of_fragments: 0 },
      "enum.ncit.c": { number_of_fragments: 0 },
      "enum.ncit.s.n.have": { number_of_fragments: 0 },
      "enum.ncit.s.n": { number_of_fragments: 0 },
      "enum.icdo.have": { number_of_fragments: 0 },
      "enum.icdo.c": { number_of_fragments: 0 },
    },
  };
  return highlight;
};

const generateHighlight = () => {
  let highlight = {
    pre_tags: ["<b>"],
    post_tags: ["</b>"],
    fields: {
      "prop.have": { number_of_fragments: 0 },
      prop: { number_of_fragments: 0 },
      prop_desc: { number_of_fragments: 0 },
      "cde.id": { number_of_fragments: 0 },
      //"id": {"number_of_fragments": 0}
    },
  };
  return highlight;
};

const generateQuery = (keyword, option) => {
  let query = {};
  query.bool = {};
  query.bool.must = [];
  //check if need to filter out sources
  if (option.sources.length > 0) {
    let m = {};
    m.bool = {};
    m.bool.should = [];
    option.sources.forEach((source) => {
      let tmp = {};
      tmp.term = {};
      tmp.term.source = source;
      m.bool.should.push(tmp);
    });
    query.bool.must.push(m);
  }
  let clause = {};
  clause.bool = {};
  clause.bool.should = [];
  //adding double escaping
  if (option.match === "exact") {
    // Perform exact search
    //The reserved characters in elasticsearch are: + - = && || > < ! ( ) { } [ ] ^ " ~ * ? : \ /
    let exact_keyword = keyword
      .replace(/\//g, "\\/")
      .replace(/\+/g, "\\+")
      .replace(/-/g, "\\-")
      .replace(/\(/g, "\\(")
      .replace(/\)/g, "\\)");
    let m = {};
    m.query_string = {};
    m.query_string.query = exact_keyword;
    m.query_string.fields = [];
    m.query_string.fields.push("cde.id");
    m.query_string.fields.push("prop");
    clause.bool.should.push(m);

    if (option.desc) {
      m = {};
      m.match_phrase_prefix = {};
      m.match_phrase_prefix["prop_desc"] = {};
      m.match_phrase_prefix["prop_desc"].query = keyword;
      m.match_phrase_prefix["prop_desc"].analyzer = "my_whitespace";
      clause.bool.should.push(m);
    }

    m = {};
    m.nested = {};
    m.nested.path = "enum";
    m.nested.query = {};
    m.nested.query.query_string = {};
    m.nested.query.query_string.fields = [];

    if (option.syn) {
      m.nested.query.query_string.fields.push("enum.ncit.s.n");
    }
    m.nested.query.query_string.fields.push("enum.ncit.c");
    m.nested.query.query_string.fields.push("enum.n");
    m.nested.query.query_string.fields.push("enum.icdo.c");
    m.nested.query.query_string.query = exact_keyword;

    m.nested.inner_hits = {};
    m.nested.inner_hits.from = 0;
    m.nested.inner_hits.size = 10000;
    m.nested.inner_hits.highlight = generateHighlightInnerHits();
    clause.bool.should.push(m);
  } else {
    /*
  else{
    let m = {};
    m.match_phrase_prefix = {};
    m.match_phrase_prefix["prop.have"] = keyword;
    clause.bool.should.push(m);

    m = {};
    m.match_phrase_prefix = {};
    m.match_phrase_prefix["cde.id"] = keyword;
    clause.bool.should.push(m);

    if (option.desc) {
      m = {};
      m.match_phrase_prefix = {};
      m.match_phrase_prefix["prop_desc"] = keyword;
      clause.bool.should.push(m);
    }

    m = {};
    m.nested = {};
    m.nested.path = "enum"
    m.nested.query = {};
    m.nested.query.bool = {};
    m.nested.query.bool.should = [];

    let n = {};
    if (option.syn) {
      n = {};
      n.match_phrase_prefix = {};
      n.match_phrase_prefix["enum.ncit.s.n.have"] = keyword;
      m.nested.query.bool.should.push(n);
    }
    n = {};
    n.match_phrase_prefix = {};
    n.match_phrase_prefix["enum.ncit.c.have"] = keyword;
    m.nested.query.bool.should.push(n);
    
    n = {};
    n.match_phrase_prefix = {};
    n.match_phrase_prefix["enum.n.have"] = keyword;
    m.nested.query.bool.should.push(n);

    n = {};
    n.match_phrase_prefix = {};
    n.match_phrase_prefix["enum.icdo.have"] = {};
    n.match_phrase_prefix["enum.icdo.have"].query = keyword;
    n.match_phrase_prefix["enum.icdo.have"].analyzer = "my_standard";
    m.nested.query.bool.should.push(n);

    m.nested.inner_hits = {};
    m.nested.inner_hits.from = 0;
    m.nested.inner_hits.size = 10000;
    m.nested.inner_hits.highlight = generateHighlightInnerHits();
    clause.bool.should.push(m);
  }
  */
    let m = {};
    m.match_phrase_prefix = {};
    m.match_phrase_prefix["prop.have"] = {};
    m.match_phrase_prefix["prop.have"].query = keyword;
    m.match_phrase_prefix["prop.have"].analyzer = "my_whitespace";
    clause.bool.should.push(m);

    m = {};
    m.match_phrase_prefix = {};
    m.match_phrase_prefix["cde.id"] = keyword;
    clause.bool.should.push(m);

    if (option.desc) {
      m = {};
      m.match_phrase_prefix = {};
      m.match_phrase_prefix["prop_desc"] = {};
      m.match_phrase_prefix["prop_desc"].query = keyword;
      m.match_phrase_prefix["prop_desc"].analyzer = "my_whitespace";
      clause.bool.should.push(m);
    }

    m = {};
    m.nested = {};
    m.nested.path = "enum";
    m.nested.query = {};
    m.nested.query.bool = {};
    m.nested.query.bool.should = [];

    let n = {};
    if (option.syn) {
      n = {};
      n.match_phrase_prefix = {};
      n.match_phrase_prefix["enum.ncit.s.n.have"] = {};
      n.match_phrase_prefix["enum.ncit.s.n.have"].query = keyword;
      n.match_phrase_prefix["enum.ncit.s.n.have"].analyzer = "my_whitespace";
      m.nested.query.bool.should.push(n);
    }
    n = {};
    n.match_phrase_prefix = {};
    n.match_phrase_prefix["enum.ncit.c.have"] = {};
    n.match_phrase_prefix["enum.ncit.c.have"].query = keyword;
    n.match_phrase_prefix["enum.ncit.c.have"].analyzer = "my_whitespace";
    m.nested.query.bool.should.push(n);

    n = {};
    n.match_phrase_prefix = {};

    n.match_phrase_prefix["enum.n.have"] = {};
    n.match_phrase_prefix["enum.n.have"].query = keyword;
    n.match_phrase_prefix["enum.n.have"].analyzer = "my_whitespace";
    m.nested.query.bool.should.push(n);

    n = {};
    n.match_phrase_prefix = {};
    n.match_phrase_prefix["enum.icdo.have"] = {};
    n.match_phrase_prefix["enum.icdo.have"].query = keyword;
    n.match_phrase_prefix["enum.icdo.have"].analyzer = "my_whitespace";
    m.nested.query.bool.should.push(n);

    m.nested.inner_hits = {};
    m.nested.inner_hits.from = 0;
    m.nested.inner_hits.size = 10000;
    m.nested.inner_hits.highlight = generateHighlightInnerHits();
    clause.bool.should.push(m);
  }
  query.bool.must.push(clause);

  return query;
};

const preProcess = (searchable_nodes, data) => {
  // Remove deprecated properties and nodes
  for (let key in data) {
    if (searchable_nodes.indexOf(key) === -1) {
      delete data[key];
    } else if (searchable_nodes.indexOf(key) !== -1 && data[key].deprecated) {
      let deprecated_p = data[key].deprecated;
      deprecated_p.forEach(function (d_p) {
        delete data[key].properties[d_p];
      });
    }
  }
  // get data from $ref: "analyte.yaml#/properties/analyte_type"
  for (let key1 in data) {
    if (data[key1].properties) {
      let p = data[key1].properties;
      for (let key in p) {
        if (key !== "$ref") {
          let ref = Array.isArray(p[key].$ref) ? p[key].$ref[0] : p[key].$ref;
          if (
            ref &&
            ref.indexOf("_terms.yaml") === -1 &&
            ref.indexOf("_definitions.yaml") === -1
          ) {
            let node = ref.split("#/")[0].replace(".yaml", "");
            let remaining = ref.split("#/")[1];
            let type = remaining.split("/")[0];
            let prop = remaining.split("/")[1];
            if (data[node] && data[node][type] && data[node][type][prop]) {
              p[key] = data[node][type][prop];
            }
          }
        }
      }
    }
  }

  // remove deprecated_enum from enums
  for (let key1 in data) {
    if (data[key1].properties) {
      let p = data[key1].properties;
      for (let key in p) {
        if (p[key].deprecated_enum && p[key].enum) {
          p[key].new_enum = _.differenceWith(
            p[key].enum,
            p[key].deprecated_enum,
            _.isEqual
          );
          console.log(p[key].new_enum);
        }
      }
    }
  }

  // get all terms definition
  let term_definition = yaml.load(folderPath + "/_terms.yaml");

  // get $ref for Property
  for (let key1 in data) {
    if (data[key1].properties) {
      let p = data[key1].properties;
      for (let key in p) {
        let property_data = p[key];
        if (property_data.$ref) {
          let ref = Array.isArray(property_data.$ref)
            ? property_data.$ref[0]
            : property_data.$ref;
          if (ref.indexOf("_terms.yaml") !== -1) {
            if (ref.indexOf("#/") !== -1) {
              // let file_name = ref.split('#/')[0];
              let ref_property = ref.split("#/")[1];
              let prop = ref_property.split("/")[0];
              // let term_definition = yaml.load(folderPath + '/' + file_name);
              if (term_definition[prop]) {
                property_data.relation =
                  term_definition[prop].common !== undefined
                    ? term_definition[prop].common
                    : term_definition[prop];
              }
            }
          }
        }
      }
    }
  }
  return data;
};

const readNCItDetails = () => {
  let content = fs.readFileSync(dataFilesDir + "/ncit_details.js").toString();
  content = content.replace(/}{/g, ",");
  return JSON.parse(content);
};

const readGDCValues = () => {
  let content = fs.readFileSync(dataFilesDir + "/gdc_values.js").toString();
  return JSON.parse(content);
};

const readCDEData = () => {
  let content = fs.readFileSync(dataFilesDir + "/cdeData.js").toString();
  content = content.replace(/}{/g, ",");
  return JSON.parse(content);
};

const readCTDCMapping = () => {
  let content = fs
    .readFileSync(dataFilesPath + "/CTDC/CTDC_Mappings.json")
    .toString();
  content = content.replace(/}{/g, ",");
  return JSON.parse(content);
};

const readICDCMapping = () => {
  let content = fs
    .readFileSync(dataFilesPath + "/ICDC/ICDC_Mappings.json")
    .toString();
  content = content.replace(/}{/g, ",");
  return JSON.parse(content);
};

const readPCDCMapping = () => {
  let content = fs
    .readFileSync(dataFilesPath + "/PCDC/pcdc-model-all.json")
    .toString();
  return JSON.parse(content);
};

const readPCDCProjects = () => {
  let content = fs
    .readFileSync(dataFilesPath + "/PCDC/pcdc-projects.json")
    .toString();
  return JSON.parse(content);
};

const getICDOMapping = () => {
  let data = readGDCValues();
  let result = {};
  for (let key in data) {
    let obj = data[key];
    obj.forEach((item) => {
      if (item.i_c != "") {
        if (!(item.i_c in result)) {
          result[item.i_c] = {};
          result[item.i_c].syn = {};
        }
        let ss = item.i_c_s;

        if (Array.isArray(ss)) {
          ss.forEach((s) => {
            let tmp = s.trim();
            if (tmp in result[item.i_c].syn) {
              result[item.i_c].syn[tmp] =
                item.term_type == ""
                  ? result[item.i_c].syn[tmp]
                  : item.term_type;
            } else {
              result[item.i_c].syn[tmp] = item.term_type;
            }
          });
        } else {
          if (ss != "") {
            let tmp = ss.trim();
            if (tmp in result[item.i_c].syn) {
              result[item.i_c].syn[tmp] =
                item.term_type == ""
                  ? result[item.i_c].syn[tmp]
                  : item.term_type;
            } else {
              result[item.i_c].syn[tmp] = item.term_type;
            }
          }
        }
      }
    });
  }
  return result;
};

const getParentICDO = () => {
  let data = readGDCValues();
  let result = [];
  for (let key in data) {
    let obj = data[key];
    obj.forEach((item) => {
      if (item.term_type && item.term_type == "HT") {
        let icdo = item.i_c;
        if (result.indexOf(icdo) == -1) {
          result.push(icdo);
        }
      }
    });
  }
  return result;
};

const generateICDOHaveWords = (code) => {
  let ts = [];

  if (code.indexOf("C") >= 0) {
    // ICD-O-3 code with C
    // check if it's a range in level 2
    if (code.indexOf("-") >= 0) {
      let r = code.split("-");
      let start = parseInt(r[0].substr(1));
      let end = parseInt(r[1].substr(1));
      for (let i = start; i <= end; i++) {
        if (i < 10) {
          ts.push("C0" + i);
        } else {
          ts.push("C" + i);
        }
      }
    } else if (code.indexOf(".") >= 0) {
      // check if it has '/' in the code
      let idx = code.indexOf(".");
      let l2 = code.substr(0, idx);
      let l3 = code;
      ts.push(l2);
      ts.push(l3);
    } else {
      ts.push(code);
    }
  } else {
    // regular ICD-O-3 code
    // check if it's a range in level 2
    if (code.indexOf("-") >= 0) {
      let r = code.split("-");
      let start = parseInt(r[0]);
      let end = parseInt(r[1]);
      for (let i = start; i <= end; i++) {
        ts.push(i);
      }
    } else if (code.indexOf("/") >= 0) {
      // check if it has '/' in the code
      let idx = code.indexOf("/");
      let l3 = code.substr(0, idx);
      let l4 = code;
      let l2 = l3.substr(0, l3.length - 1);
      ts.push(l2);
      ts.push(l3);
      ts.push(l4);
    } else {
      ts.push(code);
    }
  }

  return ts;
};

const findObjectWithRef = (obj, updateFn, root_key = "", level = 0) => {
  // iterate over the properties
  for (var propertyName in obj) {
    if (level === 0) root_key = propertyName;

    if (propertyName === "$ref") {
      obj["$ref"] = updateFn(obj["$ref"], root_key);
    }

    // any object that is not a simple value
    if (obj[propertyName] !== null && typeof obj[propertyName] === "object") {
      // recurse into the object and write back the result to the object graph
      obj[propertyName] = findObjectWithRef(
        obj[propertyName],
        updateFn,
        root_key,
        level + 1
      );
    }
  }

  return obj;
};

const excludeSystemProperties = (node) => {
  const properties =
    node.properties &&
    Object.keys(node.properties)
      .filter((key) =>
        node.systemProperties ? !node.systemProperties.includes(key) : true
      )
      .reduce((acc, key) => {
        acc[key] = node.properties[key];
        return acc;
      }, {});
  return properties;
};

const generateGDCData = async function (schema) {
  console.log("Start...");
  let dict = {};
  for (let [key, value] of Object.entries(schema)) {
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
  }

  //console.log(dict);

  // Recursivly fix references
  dict = findObjectWithRef(dict, (refObj, rootKey) => {
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
  dict["case"].category = "case";

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
    let deprecated_enum = [];

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
      obj.properties = excludeSystemProperties(obj);
    }

    delete obj.systemProperties;

    filtered[key] = newDict[key];
    return filtered;
  }, {});

  return result;
};

const convert2Title = (name) => {
  let tmp = name.split("_");
  let result = [];
  tmp.forEach((term) => {
    let char = term.charAt(0);
    result.push(char.toUpperCase() + term.substring(1));
  });
  return result.join(" ");
};

const convert2Key = (name) => {
  let tmp = name.split(" ");
  let result = [];
  tmp.forEach((term) => {
    let char = term.charAt(0);
    result.push(char.toLowerCase() + term.substring(1));
  });
  return result.join("_");
};

const generateICDCorCTDCData = (dc) => {
  const dcMData = dc.mData;
  const dcMPData = dc.mpData;

  const dataList = {};

  for (let [key, value] of Object.entries(dcMData.Nodes)) {
    //console.log(key);
    //console.log(value.Category);
    const item = {};
    item["$schema"] = "http://json-schema.org/draft-06/schema#";
    item["id"] = key;
    item["title"] = convert2Title(key);
    if ("Category" in value) {
      item["category"] = value.Category;
    } else {
      item["category"] = "Undefined";
    }

    item["program"] = "*";
    item["project"] = "*";
    item["additionalProperties"] = false;
    item["submittable"] = true;
    item["constraints"] = null;
    //item["links"]=[];

    item["type"] = "object";
    const link = [];
    const properties = {};
    const pRequired = [];

    if (dcMData.Nodes[key].Props != null) {
      for (var i = 0; i < dcMData.Nodes[key].Props.length; i++) {
        //console.log(icdcMData.Nodes[key].Props[i]);
        const nodeP = dcMData.Nodes[key].Props[i];
        const propertiesItem = {};
        for (var propertyName in dcMPData.PropDefinitions) {
          if (propertyName == nodeP) {
            propertiesItem["description"] =
              dcMPData.PropDefinitions[propertyName].Desc;
            propertiesItem["type"] =
              dcMPData.PropDefinitions[propertyName].Type;
            propertiesItem["src"] = dcMPData.PropDefinitions[propertyName].Src;

            if (dcMPData.PropDefinitions[propertyName].Req == true) {
              pRequired.push(nodeP);
            }
          }
        }
        properties[nodeP] = propertiesItem;
      }

      item["properties"] = properties;
      item["required"] = pRequired;
    } else {
      item["properties"] = {};
    }

    for (var propertyName in dcMData.Relationships) {
      const linkItem = {};
      //console.log(propertyName);
      //console.log(icdcMData.Relationships[propertyName]);
      //console.log(icdcMData.Relationships[propertyName].Ends);
      const label = propertyName;
      const multiplicity = dcMData.Relationships[propertyName].Mul;
      const required = false;
      for (
        var i = 0;
        i < dcMData.Relationships[propertyName].Ends.length;
        i++
      ) {
        if (dcMData.Relationships[propertyName].Ends[i].Src == key) {
          const backref = dcMData.Relationships[propertyName].Ends[i].Src;
          const name = dcMData.Relationships[propertyName].Ends[i].Dst;
          const target = dcMData.Relationships[propertyName].Ends[i].Dst;

          linkItem["name"] = name;
          linkItem["backref"] = backref;
          linkItem["label"] = label;
          linkItem["target_type"] = target;
          linkItem["required"] = required;

          link.push(linkItem);
        }
      }
    }

    //console.log(link);
    item["links"] = link;

    dataList[key] = item;
  }

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
      item["$schema"] = "http://json-schema.org/draft-06/schema#";
      item["id"] = key;
      item["title"] = convert2Title(key);
      if ("Category" in value) {
        item["category"] = project;
      } else {
        item["category"] = project;
      }

      item["program"] = "*";
      item["project"] = "*";
      item["additionalProperties"] = false;
      item["submittable"] = true;
      item["constraints"] = null;
      //item["links"]=[];

      item["type"] = "object";
      const link = [];
      const properties = {};
      const pRequired = [];

      if (value.properties.length > 0) {
        for (var i = 0; i < value.properties.length; i++) {
          //console.log(icdcMData.Nodes[key].Props[i]);
          const nodeP = value.properties[i];
          const propertiesItem = {};
          propertiesItem["description"] = nodeP.p_desc;
          propertiesItem["type"] = nodeP.p_type;
          propertiesItem["src"] = value.n_PT;

          properties[nodeP.p_name] = propertiesItem;
        }

        item["properties"] = properties;
        item["required"] = pRequired;
      } else {
        item["properties"] = {};
      }

      item["links"] = link;

      dataList[project][key] = item;
    }
  }
  return dataList;
};

const getGraphicalGDCDictionary = async function () {
  let result = cache.getValue("gdc_dict");
  if (result == undefined) {
    console.log(
      "Start to generate GDC Dictionary Data and load to local cache."
    );
    let jsonData = {};
    var termsJson = yaml.load(folderPath + "/_terms.yaml");
    jsonData["_terms.yaml"] = termsJson;
    var defJson = yaml.load(folderPath + "/_definitions.yaml");
    jsonData["_definitions.yaml"] = defJson;
    // let bulkBody = [];
    fs.readdirSync(folderPath).forEach((file) => {
      let fileJson = yaml.load(folderPath + "/" + file);
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
    });
    result = await generateGDCData(jsonData);
    console.log("Cached:");
    console.log(Object.keys(result).length);
    cache.setValue("gdc_dict", result, config.item_ttl);
  }

  return result;
};

const getGraphicalICDCDictionary = () => {
  let result = cache.getValue("icdc_dict");
  if (result == undefined) {
    let jsonData = {};
    var mpJson = yaml.load(dataFilesPath + "/ICDC/icdc-model-props.yml");
    jsonData.mpData = mpJson;
    var mJson = yaml.load(dataFilesPath + "/ICDC/icdc-model.yml");
    jsonData.mData = mJson;
    result = generateICDCorCTDCData(jsonData);
    cache.setValue("icdc_dict", result, config.item_ttl);
  }
  return result;
};

const getGraphicalCTDCDictionary = () => {
  let result = cache.getValue("ctdc_dict");
  if (result == undefined) {
    let jsonData = {};
    var mpJson = yaml.load(
      dataFilesPath + "/CTDC/ctdc_model_properties_file.yaml"
    );
    jsonData.mpData = mpJson;
    var mJson = yaml.load(dataFilesPath + "/CTDC/ctdc_model_file.yaml");
    jsonData.mData = mJson;
    result = generateICDCorCTDCData(jsonData);
    /*
        for(let node in result){
          result[node].category = "clinical";
        }
        */
    cache.setValue("ctdc_dict", result, config.item_ttl);
  }
  return result;
};

const getGraphicalPCDCDictionary = (project) => {
  let project_result = cache.getValue("pcdc_dict_" + project);
  if (project_result == undefined) {
    let result = cache.getValue("pcdc_dict");
    if (result == undefined) {
      let jsonData = readPCDCMapping();
      result = generatePCDCData(jsonData, {});
      //result = generatePCDCData(jsonData, {Relationships: {}});
      cache.setValue("pcdc_dict", result, config.item_ttl);
    }

    project_result = result[project];
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
    cache.setValue("pcdc_dict_" + project, project_result, config.item_ttl);
  }

  return project_result;
};

const getPCDCProjectsFullName = () => {
  let result = cache.getValue("pcdc_projects");
  if (result == undefined) {
    result = readPCDCProjects();
    cache.setValue("pcdc_projects", result, config.item_ttl);
  }
  return result;
};

module.exports = {
  generateHighlight,
  generateQuery,
  readNCItDetails,
  preProcess,
  readGDCValues,
  readCDEData,
  readCTDCMapping,
  readICDCMapping,
  readPCDCMapping,
  getICDOMapping,
  getParentICDO,
  generateICDOHaveWords,
  getGraphicalGDCDictionary,
  getGraphicalICDCDictionary,
  getGraphicalCTDCDictionary,
  getGraphicalPCDCDictionary,
  convert2Key,
  getPCDCProjectsFullName,
};
