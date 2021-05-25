const elastic = require("../../components/elasticsearch");
const handleError = require("../../components/handleError");
const logger = require("../../components/logger");
const cache = require("../../components/cache");
const config = require("../../config");
const https = require("https");
const fs = require("fs");
const path = require("path");
const shared = require("./shared");
// const git = require('nodegit');
//const Excel = require("exceljs");
const dataFilesPath = path.join(__dirname, "..", "..", "data_files");
var syns = {};

const indexing = (req, res) => {
  let configs = [];
  //config property index
  let config_property = {};
  config_property.index = config.index_p;
  /*
	config_property.body = {
		"settings": {
			"number_of_shards": 10, 
			"max_inner_result_window": 10000,
			"max_result_window": 10000,
			"analysis": {
				"analyzer": {
					"case_insensitive": {
						"tokenizer": "keyword",
						"filter": ["lowercase", "whitespace_remove"]
					},
					"my_standard": {
						"tokenizer": "standard",
						"char_filter": ["my_filter"],
						"filter": ["lowercase","whitespace_remove"]
					},
					"my_ngram": {
						"tokenizer": "ngram_tokenizer",
						"char_filter": ["my_filter"],
						"filter": ["lowercase","whitespace_remove"]
					}
				},
				"char_filter": {
					"my_filter": {
						"type": "mapping",
						"mappings": ["_=>-"]
					}
				},
				"filter": {
					"whitespace_remove": {
						"type": "pattern_replace",
						"pattern": "[_-]",
						"replacement": " "
					}
				},
				"tokenizer": {
					"ngram_tokenizer": {
						"type": "nGram",
						"min_gram": "2",
						"token_chars": ["letter", "digit", "symbol"]
					}
				}
			}
		},
		"mappings": {
			"properties": {
				"id": {
					"type": "keyword"
				},
				"source":{
					"type": "keyword"
				},
				"category": {
					"type": "keyword"
				},
				"node": {
					"type": "keyword"
				},
				"prop": {
					"type": "text",
					"fields": {
						"have": {
							"type": "text",
							"analyzer": "my_standard"
						}
					},
					"analyzer": "case_insensitive"
				},
				"enum":{
					"type": "nested",
					"properties": {
						"n": {
							"type": "text",
							"fields": {
								"have": {
									"type": "text",
									"analyzer": "my_standard"
								}
							},
							"analyzer": "case_insensitive"
						},
						"ncit.s.n": {
							"type": "text",
							"fields": {
								"have": {
									"type": "text",
									"analyzer": "my_standard"
								}
							},
							"analyzer": "case_insensitive"
						},
						"ncit.c": {
							"type": "text",
							"fields": {
								"have": {
									"type": "text",
									"analyzer": "my_standard"
								}
							},
							"analyzer": "case_insensitive"
						},
						"icdo":{
							"properties": {
								"c": {
									"type": "text",
									"analyzer": "case_insensitive"
								},
								"have": {
									"type": "text",
									"analyzer": "my_standard"
								}
							}
						}
					}
				},
				"cde.id": {
					"type": "text",
					"analyzer": "case_insensitive"
				}
			}
		}
	};
	*/
  config_property.body = {
    settings: {
      number_of_shards: 10,
      max_inner_result_window: 10000,
      max_result_window: 10000,
      analysis: {
        analyzer: {
          case_insensitive: {
            tokenizer: "keyword",
            filter: ["lowercase", "whitespace_remove"],
          },
          my_standard: {
            tokenizer: "standard",
            char_filter: ["my_filter"],
            filter: ["lowercase", "whitespace_remove"],
          },
          my_whitespace: {
            tokenizer: "whitespace",
            char_filter: ["my_filter"],
            filter: ["lowercase", "whitespace_remove"],
          },
        },
        char_filter: {
          my_filter: {
            type: "mapping",
            mappings: ["_=>-"],
          },
        },
        filter: {
          whitespace_remove: {
            type: "pattern_replace",
            pattern: "[_-]",
            replacement: " ",
          },
        },
      },
    },
    mappings: {
      properties: {
        id: {
          type: "keyword",
        },
        source: {
          type: "keyword",
        },
        category: {
          type: "keyword",
        },
        node: {
          type: "keyword",
        },
        prop_desc: {
          type: "text",
          analyzer: "my_whitespace",
        },
        prop: {
          type: "text",
          fields: {
            have: {
              type: "text",
              analyzer: "my_whitespace",
            },
          },
          analyzer: "case_insensitive",
        },
        enum: {
          type: "nested",
          properties: {
            n: {
              type: "text",
              fields: {
                have: {
                  type: "text",
                  analyzer: "my_whitespace",
                },
              },
              analyzer: "case_insensitive",
            },
            "ncit.s.n": {
              type: "text",
              fields: {
                have: {
                  type: "text",
                  analyzer: "my_whitespace",
                },
              },
              analyzer: "case_insensitive",
            },
            "ncit.c": {
              type: "text",
              fields: {
                have: {
                  type: "text",
                  analyzer: "my_whitespace",
                },
              },
              analyzer: "case_insensitive",
            },
            icdo: {
              properties: {
                c: {
                  type: "text",
                  analyzer: "case_insensitive",
                },
                have: {
                  type: "text",
                  analyzer: "my_whitespace",
                },
              },
            },
          },
        },
        "cde.id": {
          type: "text",
          analyzer: "case_insensitive",
        },
      },
    },
  };
  configs.push(config_property);
  //config suggestion index
  let config_suggestion = {};
  config_suggestion.index = config.suggestionName;
  config_suggestion.body = {
    mappings: {
      properties: {
        id: {
          type: "completion",
          max_input_length: 100,
          analyzer: "standard",
          search_analyzer: "standard",
          preserve_separators: false,
        },
      },
    },
  };
  configs.push(config_suggestion);
  elastic.createIndexes(configs, (result) => {
    if (result.acknowledged === undefined) {
      return handleError.error(res, result);
    }
    elastic.bulkIndex((data) => {
      if (data.property_indexed === undefined) {
        return handleError.error(res, data);
      }
      return res.status(200).json(data);
    });
  });
};

const suggestion = (req, res) => {
  let term = req.query.keyword;
  let suggest = {
    term_suggest: {
      prefix: term,
      completion: {
        field: "id",
        size: config.suggestion_size,
      },
    },
  };
  elastic.suggest(config.suggestionName, suggest, (result) => {
    if (result.suggest === undefined) {
      return handleError.error(res, result);
    }
    let dt = result.suggest.term_suggest;
    let data = [];
    dt[0].options.forEach((opt) => {
      data.push(opt._source);
    });
    res.json(data);
  });
};

const searchP = (req, res) => {
  //let keyword = req.query.keyword.trim().replace(/\+/g, "\\+").replace(/-/g, "\\-").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
  let keyword = req.query.keyword.trim();

  let option = {};
  if (req.query.options) {
    option.match =
      req.query.options.indexOf("exact") !== -1 ? "exact" : "partial";
    option.syn = req.query.options.indexOf("syn") !== -1 ? true : false;
    option.desc = req.query.options.indexOf("desc") !== -1 ? true : false;
    option.sources = req.query.sources ? req.query.sources.split(",") : [];
  } else {
    option = {
      match: "partial",
      syn: false,
      desc: false,
    };
    option.sources = [];
  }
  if (keyword.trim() === "") {
    res.json([]);
  } else {
    let query = shared.generateQuery(keyword, option);
    let highlight = shared.generateHighlight();
    elastic.query(config.index_p, query, "enum", highlight, (result) => {
      if (result.hits === undefined) {
        res.json({ total: 0, returnList: [], timedOut: true });
        //return handleError.error(res, result);
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
        res.json({
          total: total,
          returnList: data,
          timedOut: false,
          info: pcdc_project_fullName,
        });
      }
    });
  }
};

const getGDCData = (req, res) => {
  let uid = req.query.id;
  let query = {};
  query.terms = {};
  query.terms.id = [];
  query.terms.id.push(uid);
  elastic.query(config.index_p, query, "", null, (result) => {
    if (result.hits === undefined) {
      return handleError.error(res, result);
    }
    let data = result.hits.hits;
    res.json(data);
  });
};

const getGraphicalGDCDictionary = async function (req, res) {
  let jsonData = await shared.getGraphicalGDCDictionary();
  res.json(jsonData);
};

const getGraphicalICDCDictionary = (req, res) => {
  let jsonData = shared.getGraphicalICDCDictionary();
  res.json(jsonData);
};

const getGraphicalCTDCDictionary = (req, res) => {
  let jsonData = shared.getGraphicalCTDCDictionary();
  res.json(jsonData);
};

const getGraphicalPCDCDictionary = (req, res) => {
  let project = req.query.project == "" ? "AML" : req.query.project;
  let jsonData = shared.getGraphicalPCDCDictionary(project);
  res.json(jsonData);
};

const getValuesForGraphicalView = async function (req, res) {
  let uid = req.query.id;
  let result = cache.getValue("values:" + uid);
  if (result == undefined) {
    let query = {};
    query.terms = {};
    query.terms.id = [];
    query.terms.id.push(uid);
    elastic.query(config.index_p, query, "", null, (data) => {
      if (data.hits === undefined) {
        return handleError.error(res, data);
      }
      let rs = data.hits.hits;
      result = [];
      if (rs.length > 0 && rs[0]._source.enum) {
        result = rs[0]._source.enum;
      }
      cache.setValue("values:" + uid, result, config.item_ttl);
      res.json(result);
    });
  } else {
    res.json(result);
  }
};

const synchronziedLoadSynonmysfromNCIT_old = (ncitids, idx, next) => {
  if (idx >= ncitids.length) {
    return;
  }
  https
    .get(config.NCIt_url[4] + ncitids[idx], (rsp) => {
      let html = "";
      rsp.on("data", (dt) => {
        html += dt;
      });
      rsp.on("end", () => {
        if (html.trim() !== "") {
          let d = JSON.parse(html);
          if (d.synonyms !== undefined) {
            let tmp = {};
            tmp[ncitids[idx]] = {};
            tmp[ncitids[idx]].label = d.label;
            tmp[ncitids[idx]].code = d.code;
            tmp[ncitids[idx]].definitions = d.definitions;
            tmp[ncitids[idx]].synonyms = [];
            let checker_arr = [];
            d.synonyms.forEach((data) => {
              if (
                checker_arr.indexOf(
                  (
                    data.termName +
                    "@#$" +
                    data.termGroup +
                    "@#$" +
                    data.termSource
                  )
                    .trim()
                    .toLowerCase()
                ) !== -1
              )
                return;
              let obj = {};
              obj.termName = data.termName;
              obj.termGroup = data.termGroup;
              obj.termSource = data.termSource;
              //only keep NCI synonyms
              if (obj.termSource == "NCI") {
                if (obj.termGroup == "PT") {
                  tmp[ncitids[idx]].synonyms.unshift(obj);
                } else {
                  tmp[ncitids[idx]].synonyms.push(obj);
                }
              }
              checker_arr.push(
                (
                  data.termName +
                  "@#$" +
                  data.termGroup +
                  "@#$" +
                  data.termSource
                )
                  .trim()
                  .toLowerCase()
              );
            });
            /*
            if (d.additionalProperties !== undefined) {
              tmp[ncitids[idx]].additionalProperties = [];
              d.additionalProperties.forEach((data) => {
                let obj = {};
                obj.name = data.name;
                obj.value = data.value;
                tmp[ncitids[idx]].additionalProperties.push(obj);
              });
            }
            */
            //let str = {};
            //str[ncitids[idx]] = syns;
            fs.appendFile(
              dataFilesPath + "/GDC/ncit_details.js",
              JSON.stringify(tmp),
              (err) => {
                if (err) return logger.error(err);
              }
            );
          } else {
            logger.debug("!!!!!!!!!!!! no synonyms for " + ncitids[idx]);
          }
        }
        //syns[ncitids[idx]] = syn;
        idx++;
        synchronziedLoadSynonmysfromNCIT_old(ncitids, idx, next);
        if (ncitids.length == idx) {
          return next("Success");
        } else {
          return next(
            "NCIT finished number: " +
              idx +
              " of " +
              ncitids.length +
              " : " +
              ncitids[idx] +
              "!\n"
          );
        }
      });
    })
    .on("error", (e) => {
      logger.debug(e);
    });
};

const synchronziedLoadSynonmysfromNCIT = (ncitids, idx, next) => {
  if (idx >= ncitids.length) {
    return;
  }
  https
    .get(config.NCIt_url[6] + ncitids[idx], (rsp) => {
      let html = "";
      rsp.on("data", (dt) => {
        html += dt;
      });
      rsp.on("end", () => {
        if (html.trim() !== "") {
          let d = JSON.parse(html);
          if (d.synonyms !== undefined) {
            let tmp = {};
            tmp[ncitids[idx]] = {};
            tmp[ncitids[idx]].label = d.name;
            tmp[ncitids[idx]].code = d.code;
            tmp[ncitids[idx]].definitions = d.definitions;
            tmp[ncitids[idx]].synonyms = [];
            let checker_arr = [];
            d.synonyms.forEach((data) => {
              if (
                checker_arr.indexOf(
                  (data.name + "@#$" + data.termGroup + "@#$" + data.source)
                    .trim()
                    .toLowerCase()
                ) !== -1
              )
                return;
              let obj = {};
              obj.termName = data.name;
              obj.termGroup = data.termGroup;
              obj.termSource = data.source;
              //only keep NCI synonyms
              if (obj.termSource == "NCI") {
                if (obj.termGroup == "PT") {
                  tmp[ncitids[idx]].synonyms.unshift(obj);
                } else {
                  tmp[ncitids[idx]].synonyms.push(obj);
                }
              }
              checker_arr.push(
                (data.name + "@#$" + data.termGroup + "@#$" + data.source)
                  .trim()
                  .toLowerCase()
              );
            });
            /*
            if (d.additionalProperties !== undefined) {
              tmp[ncitids[idx]].additionalProperties = [];
              d.additionalProperties.forEach((data) => {
                let obj = {};
                obj.name = data.name;
                obj.value = data.value;
                tmp[ncitids[idx]].additionalProperties.push(obj);
              });
            }
            */
            //let str = {};
            //str[ncitids[idx]] = syns;
            fs.appendFile(
              dataFilesPath + "/GDC/ncit_details.js",
              JSON.stringify(tmp),
              (err) => {
                if (err) return logger.error(err);
              }
            );
          } else {
            logger.debug("!!!!!!!!!!!! no synonyms for " + ncitids[idx]);
          }
        }
        //syns[ncitids[idx]] = syn;
        idx++;
        synchronziedLoadSynonmysfromNCIT(ncitids, idx, next);
        if (ncitids.length == idx) {
          return next("Success");
        } else {
          return next(
            "NCIT finished number: " +
              idx +
              " of " +
              ncitids.length +
              " : " +
              ncitids[idx] +
              "!\n"
          );
        }
      });
    })
    .on("error", (e) => {
      logger.debug(e);
    });
};

const preloadNCItSynonyms_old = (req, res) => {
  let unloaded_ncits = cache.getValue("unloaded_ncits");
  if (unloaded_ncits && unloaded_ncits.length > 0) {
    synchronziedLoadSynonmysfromNCIT_old(unloaded_ncits, 0, (data) => {
      if (data === "Success") {
        unloaded_ncits = [];
        res.end("Success!!");
      } else {
        res.write(data);
      }
    });
  } else {
    res.end("Success with no data processed!!");
  }
};

const preloadNCItSynonyms = (req, res) => {
  let unloaded_ncits = cache.getValue("unloaded_ncits");
  if (unloaded_ncits && unloaded_ncits.length > 0) {
    synchronziedLoadSynonmysfromNCIT(unloaded_ncits, 0, (data) => {
      if (data === "Success") {
        unloaded_ncits = [];
        res.end("Success!!");
      } else {
        res.write(data);
      }
    });
  } else {
    res.end("Success with no data processed!!");
  }
};

const preloadGDCDataMappings = async (req, res) => {
  /*
	let file_path = path.join(__dirname, '..', '..', 'data_files', 'GDC', 'GDC_Data_Mappings.xlsx');
	let output_file_path = path.join(__dirname, '..', '..', 'data_files', 'GDC', 'gdc_values_updated.js');
	console.log(file_path.replace(/\\/g,"/"));
	let mappings = {};
	const workbook = new Excel.Workbook();
	await workbook.xlsx.readFile(file_path.replace(/\\/g,"/"));
	let worksheet = workbook.worksheets[0];
	let rows = worksheet.getRows(0);
	//console.log(rows[0]);
	//console.log(rows[1]);
	//console.log(rows[2]);
	rows.forEach((item, idx) => {
	if(idx > 0){
		console.log(item[2] + ":" + idx);
		let prop = item[0] + '.' + item[1] + '.' + item[2];
		if(! (prop in mappings)){
			mappings[prop] = [];
		}
		//"nm":"Neoplasm, benign","i_c":"8000/0","n_c":"C3677","term_type":"PT"
		if(item[3] != null){
			let tmp = {};
			tmp.nm = item[3];
			if(item[5] == null){
				tmp.n_c = "";
			}
			else{
				tmp.n_c = item[5].split('|');
			}
			tmp.i_c = item[6] == null ? "" : item[6];
			if(item[7] == null){
				tmp.i_c_s = "";
			}
			else{
				tmp.i_c_s = item[7].split('|');
			}
			tmp.term_type = item[8] == null ? "" : item[8];
			mappings[prop].push(tmp);
		}
		
	}
	});

	fs.writeFileSync(output_file_path, JSON.stringify(mappings), err => {
		if (err) return logger.error(err);
	});
	*/
  res.json({ result: "success" });
};

const updateGDCDataMappings = async (req, res) => {
  /*
  let file_path = path.join(
    __dirname,
    "..",
    "..",
    "data_files",
    "GDC",
    "New Mapping.xlsx"
  );
  let output_file_path = path.join(
    __dirname,
    "..",
    "..",
    "data_files",
    "GDC",
    "gdc_values_updated.js"
  );
  let current_mappings = shared.readGDCValues();
  const workbook = new Excel.Workbook();
  await workbook.xlsx.readFile(file_path.replace(/\\/g, "/"));
  let worksheet = workbook.worksheets[0];

  worksheet.eachRow(function (row, rowNumber) {
    let item = row.values;
    if (rowNumber > 1) {
      let category = item[1] == undefined || item[1] == null ? "" : item[1];
      let node = item[2] == undefined || item[2] == null ? "" : item[2];
      let property = item[3] == undefined || item[3] == null ? "" : item[3];
      let value = item[4] == undefined || item[4] == null ? "" : item[4];
      let ncit = item[5] == undefined || item[5] == null ? "" : item[5];
      let icdo = item[7] == undefined || item[7] == null ? "" : item[7];
      let icdo_s = item[8] == undefined || item[8] == null ? "" : item[8];

      let prop_id = category + "." + node + "." + property;

      if (!(prop_id in current_mappings)) {
        current_mappings[prop_id] = [];
      }
      //"nm":"Neoplasm, benign","i_c":"8000/0","n_c":"C3677","term_type":"PT"
      let found = false;
      current_mappings[prop_id].forEach((value_entry) => {
        if (value_entry.nm == value.trim()) {
          found = true;
          if (ncit != "") {
            value_entry.n_c = ncit.split("|");
          }
          if (icdo != "") {
            value_entry.i_c = icdo;
          }
          if (icdo_s != "") {
            value_entry.i_c_s = icdo_s.split("|");
          }
        }
      });

      if (!found) {
        let entry = {};
        entry.nm = value;
        if (ncit == "") {
          entry.n_c = "";
        } else {
          entry.n_c = ncit.split("|");
        }
        if (icdo != "") {
          entry.i_c = icdo;
        } else {
          entry.i_c = "";
        }
        if (icdo_s != "") {
          entry.i_c_s = icdo_s.split("|");
        } else {
          entry.i_c_s = "";
        }
        entry.term_type = "PT";
        current_mappings[prop_id].push(entry);
      }
    }
  });

  fs.writeFileSync(
    output_file_path,
    JSON.stringify(current_mappings),
    (err) => {
      if (err) return logger.error(err);
    }
  );
  */
  res.json({ result: "success" });
};

const preloadPCDCDataMappings = async (req, res) => {
  /*
  let file_path = path.join(
    __dirname,
    "..",
    "..",
    "data_files",
    "PCDC",
    "PCDC_Terminology.xlsx"
  );

  let output_file_path = path.join(
    __dirname,
    "..",
    "..",
    "data_files",
    "PCDC",
    "pcdc-model-all_updated.json"
  );
  console.log(file_path.replace(/\\/g, "/"));
  let data = {};
  const workbook = new Excel.Workbook();
  await workbook.xlsx.readFile(file_path.replace(/\\/g, "/"));
  const worksheets = workbook.worksheets;

  for (let i = 0; i < worksheets.length; i++) {
    let worksheet = worksheets[i];
    data[worksheet.name] = {};

    let latest_p = "";
    let latest_p_values = [];
    let count_v = 0,
      count_p = 0;
    let mappings = data[worksheet.name];
    worksheet.eachRow(function (row, rowNumber) {
      let item = row.values;
      if (rowNumber > 1) {
        let node = item[2];
        let length = node.length;
        if (length >= 6 && node.lastIndexOf(" Table") == length - 6) {
          node = node.substring(0, length - 6).trim();
          //console.log(node);
        }
        node = node.replace(/[/-]/g, " ");
        node = shared.convert2Key(node);
        if (!(node in mappings)) {
          mappings[node] = {};
          mappings[node].n_n_code = item[1];
          mappings[node].n_PT = item[2];
          mappings[node].properties = [];
        }
        let props = mappings[node].properties;

        if (item[13] !== undefined && item[13] !== "") {
          //property row
          let prop = {};
          prop.p_name = item[6] == undefined ? "" : item[6].trim();
          prop.p_n_code = item[3] == undefined ? "" : item[3].trim();
          prop.p_desc = item[8] == undefined ? "" : item[8].trim();
          if (item[13] == "code") {
            prop.p_type = "enum";
          } else if (item[13] != "") {
            prop.p_type = item[13];
          } else {
            prop.p_type = "object";
          }
          prop.values = [];
          if (item[13] == "code" && item[11] !== undefined && item[11] != "") {
            latest_p = prop.p_name;
            latest_p_values = item[11].split("||");
            latest_p_values = latest_p_values.map((vs) => {
              return vs.trim();
            });
          }
          count_p++;
          props.push(prop);
        } else {
          //value row
          let has = false;
          props.map((prop) => {
            if (prop.p_name == latest_p) {
              let v = item[6].toString();
              if (latest_p_values.indexOf(v.trim()) > -1) {
                let value = {};
                value.v_name = v;
                value.v_n_code = item[3].trim();
                value.v_PT = "";
                prop.values.push(value);
                count_v++;
                has = true;
              } else {
                console.log(
                  "Warning: This value was not listed in the property column in this excel, please reference to row: ",
                  rowNumber
                );
                let value = {};
                value.v_name = v;
                value.v_n_code = item[3].trim();
                value.v_PT = "";
                prop.values.push(value);
                count_v++;
                has = true;
              }
            }
          });

          if (!has) {
            console.log("Do not find any properties:", rowNumber);
          }
        }
      }
    });
    console.log(count_p, count_v);
  }
  fs.writeFileSync(output_file_path, JSON.stringify(data), (err) => {
    if (err) return logger.error(err);
  });
  */
  res.json({ result: "success" });
};

module.exports = {
  indexing,
  suggestion,
  searchP,
  getGDCData,
  getGraphicalGDCDictionary,
  getGraphicalICDCDictionary,
  getGraphicalCTDCDictionary,
  getGraphicalPCDCDictionary,
  getValuesForGraphicalView,
  preloadNCItSynonyms_old,
  preloadNCItSynonyms,
  preloadGDCDataMappings,
  updateGDCDataMappings,
  preloadPCDCDataMappings,
};
