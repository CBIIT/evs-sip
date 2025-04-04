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
// const Excel = require("exceljs");
const export_excel = require('node-excel-export');
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
            //filter: ["lowercase", "whitespace_remove"],
            filter: ["lowercase"],
          },
          my_standard: {
            tokenizer: "standard",
            char_filter: ["my_filter"],
            filter: ["lowercase", "whitespace_remove"],
          },
          my_whitespace: {
            tokenizer: "whitespace",
            //char_filter: ["my_filter"],
            //filter: ["lowercase", "whitespace_remove"],
            filter: ["lowercase"],
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
        "id": {
					"type": "keyword"
				},
				"source":{
					"type": "keyword"
				},
				"category": {
					"type": "keyword"
				},
				"node":{
					"type": "nested",
					"properties": {
						"n": {
							"type": "text",
							"fields": {
								"have": {
									"type": "text",
									"analyzer": "my_whitespace"
								}
							},
							"analyzer": "case_insensitive"
						},
						"d": {
							"type": "text",
							"analyzer": "my_whitespace"
						},
						"ncit.c": {
							"type": "text",
							"fields": {
								"have": {
									"type": "text",
									"analyzer": "my_whitespace"
								}
							},
							"analyzer": "case_insensitive"
						},
						"ncit.s.n": {
							"type": "text",
							"fields": {
								"have": {
									"type": "text",
									"analyzer": "my_whitespace"
								}
							},
							"analyzer": "case_insensitive"
						}
					}
				},
				"prop":{
					"type": "nested",
					"properties": {
						"n": {
							"type": "text",
							"fields": {
								"have": {
									"type": "text",
									"analyzer": "my_whitespace"
								}
							},
							"analyzer": "case_insensitive"
						},
						"d": {
							"type": "text",
							"analyzer": "my_whitespace"
						},
						"ncit.c": {
							"type": "text",
							"fields": {
								"have": {
									"type": "text",
									"analyzer": "my_whitespace"
								}
							},
							"analyzer": "case_insensitive"
						},
						"ncit.s.n": {
							"type": "text",
							"fields": {
								"have": {
									"type": "text",
									"analyzer": "my_whitespace"
								}
							},
							"analyzer": "case_insensitive"
						},
						"cde":{
							"properties": {
								"c": {
									"type": "text",
									"analyzer": "case_insensitive"
								}
							}
						}
					}
				},
				"enum":{
					"type": "nested",
					"properties": {
						"n": {
							"type": "text",
							"fields": {
								"have": {
									"type": "text",
									"analyzer": "my_whitespace"
								}
							},
							"analyzer": "case_insensitive"
						},
						"ncit.s.n": {
							"type": "text",
							"fields": {
								"have": {
									"type": "text",
									"analyzer": "my_whitespace"
								}
							},
							"analyzer": "case_insensitive"
						},
						"ncit.c": {
							"type": "text",
							"fields": {
								"have": {
									"type": "text",
									"analyzer": "my_whitespace"
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
									"analyzer": "my_whitespace"
								}
							}
						}
					}
				}
			}
		}
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
  if(req.query.options){
    option.match = req.query.options.indexOf("exact") !== -1 ? "exact" : "partial";
    option.syn = req.query.options.indexOf('syn') !== -1 ? true : false;
    option.n_syn = req.query.options.indexOf('n_syn') !== -1 ? true : false;
    option.p_syn = req.query.options.indexOf('p_syn') !== -1 ? true : false;
    option.desc = req.query.options.indexOf('desc') !== -1 ? true : false;
    option.sources = req.query.sources? req.query.sources.split(',') : [];
  }
  else{
    option = {
      match: "partial",
      syn: false,
      n_syn: false,
      p_syn: false,
      desc: false
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
  let project = (req.query.project !== undefined && req.query.project !== '') ? req.query.project : 'AML';
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
                  (data.name + "@#$" + data.termType + "@#$" + data.source)
                    .trim()
                    .toLowerCase()
                ) !== -1
              )
                return;
              let obj = {};
              obj.termName = data.name;
              obj.termGroup = data.termType;
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
                (data.name + "@#$" + data.termType + "@#$" + data.source)
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

const listNCItSynonyms = (req, res) => {
  let unloaded_ncits = [] //create a personal array of ncit code to update manual
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
    "New_Mapping.xlsx"
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
        entry.term_type = "";
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

const compareAllWithGDCDictionary = async function(req, res){
	const params = req.query;
	const searchText = params.searchText ? params.searchText : "";
	const type = params.type ? params.type : "all";
	const page = parseInt(params.page ? params.page : 1);
	const pageSize = parseInt(params.pageSize ? params.pageSize : 25);
	const from = page > 1 ? (page - 1) * pageSize : 0;
	const limit = pageSize;
	
	let result = {};
	result.pageInfo = {};
	result.pageInfo.page = page;
	result.pageInfo.pageSize = pageSize;
	if(type == "all"){
		let mappings = await shared.getCompareResult(searchText, from , limit);
		result.data = mappings.data;
		result.pageInfo.total = mappings.total;
		res.json(result);
	}
	else if(type == "unmapped"){
		let mappings = await shared.getCompareResult_unmapped(searchText, from , limit);
		result.data = mappings.data;
		result.pageInfo.total = mappings.total;
		res.json(result);
	}
	else if(type == "mapped"){
		let mappings = await shared.getCompareResult_mapped(searchText, from , limit);
		result.data = mappings.data;
		result.pageInfo.total = mappings.total;
		res.json(result);
	}
	else if(type == "conflict"){
		//conflict
		let mappings = await shared.getCompareResult_conflict(searchText, from , limit);
		result.data = mappings.data;
		result.pageInfo.total = mappings.total;
		res.json(result);
	}
	else{
		let mappings = await shared.getCompareResult(searchText, from , limit);
		result.data = mappings.data;
		result.pageInfo.total = mappings.total;
		res.json(result); 
	}
}

const exportCompareResult = async function(req, res){
	const params = req.query;
	const searchText = params.searchText ? params.searchText : "";
	const type = params.type ? params.type : "all";


	let result = {};
	if(type == "all"){
		let mappings = await shared.getCompareResult(searchText, 0 , -1);
		result.data = mappings.data;
	}
	else if(type == "unmapped"){
		let mappings = await shared.getCompareResult_unmapped(searchText, 0 , -1);
		result.data = mappings.data;
	}
	else if(type == "mapped"){
		let mappings = await shared.getCompareResult_mapped(searchText, 0 , -1);
		result.data = mappings.data;
	}
	else if(type == "conflict"){
		//conflict
		let mappings = await shared.getCompareResult_conflict(searchText, 0 , -1);
		result.data = mappings.data;
	}
	else{
		let mappings = await shared.getCompareResult(searchText, 0 , -1);
		result.data = mappings.data;
	}

	// You can define styles as json object
	const styles = {
		cellBlue_header: {
			fill: {
				fgColor: {
					rgb: '00008bff'
				}
			},
			font:{
				sz: 14,
				bold: true
			}
		},
		cellBlue: {
			fill: {
				fgColor: {
					rgb: '00008bff'
				}
			}
		}
	};
	
	//Array of objects representing heading rows (very top)
	const heading = [
		[{value: '', style: styles.cellBlue_header},{value: '', style: styles.cellBlue_header},{value: '', style: styles.cellBlue_header},{value: 'GDC Dictionary', style: styles.cellBlue_header},{value: 'GDC Dictionary', style: styles.cellBlue_header}, {value: 'Mapped GDC Values', style: styles.cellBlue_header}, {value: 'Mapped GDC Values', style: styles.cellBlue_header}]
	];
	
	//Here you specify the export structure
	const specification = {
		c: { // <- the key should match the actual data key
			displayName: 'Category', // <- Here you specify the column header
			headerStyle: styles.cellBlue, // <- Header style
			width: 220 // <- width in pixels
		},
		n: {
			displayName: 'Node',
			headerStyle: styles.cellBlue,
			width: 220 // <- width in chars (when the number is passed as string)
		},
		p: {
			displayName: 'Property',
			headerStyle: styles.cellBlue,
			width: 220 // <- width in pixels
		},
		v_1: {
			displayName: 'Value',
			headerStyle: styles.cellBlue,
			width: 220 // <- width in pixels
		},
		n_1: {
			displayName: 'NCIt Code',
			headerStyle: styles.cellBlue,
			width: 220 // <- width in pixels
		},
		v_2: {
			displayName: 'Value',
			headerStyle: styles.cellBlue,
			width: 220 // <- width in pixels
		},
		n_2: {
			displayName: 'NCIt Code',
			headerStyle: styles.cellBlue,
			width: 220 // <- width in pixels
		}
	}
	
	// Define an array of merges. 1-1 = A:1
	// The merges are independent of the data.
	// A merge will overwrite all data _not_ in the top-left cell.
	const merges = [
		{ start: { row: 1, column: 4 }, end: { row: 1, column: 5 } },
		{ start: { row: 1, column: 6 }, end: { row: 1, column: 7 } }
	];
	
	// Create the excel report.
	// This function will return Buffer
	const report = export_excel.buildExport(
	[ // <- Notice that this is an array. Pass multiple sheets to create multi sheet report
		{
		name: 'Report', // <- Specify sheet name (optional)
		heading: heading, // <- Raw heading array (optional)
		merges: merges, // <- Merge cell ranges
		specification: specification, // <- Report specification
		data: result.data // <-- Report data
		}
	]
	);
	
	// You can then return this straight
	res.attachment('report.xlsx'); // This is sails.js specific (in general you need to set headers)
	res.send(report);
}

const exportAllCompareResult = async function(req, res){
	const searchText = "";

	let result = {};
	let all_mappings = await shared.getCompareResult(searchText, 0 , -1);
	result.all_data = all_mappings.data;
	let unmapped_mappings = await shared.getCompareResult_unmapped(searchText, 0 , -1);
	result.unmapped_data = unmapped_mappings.data;
	let mapped_mappings = await shared.getCompareResult_mapped(searchText, 0 , -1);
	result.mapped_data = mapped_mappings.data;
	let conflict_mappings = await shared.getCompareResult_conflict(searchText, 0 , -1);
	result.conflict_data = conflict_mappings.data;

	// You can define styles as json object
	const styles = {
		cellBlue_header: {
			fill: {
				fgColor: {
					rgb: '00008bff'
				}
			},
			font:{
				sz: 14,
				bold: true
			}
		},
		cellBlue: {
			fill: {
				fgColor: {
					rgb: '00008bff'
				}
			}
		}
	};
	
	//Array of objects representing heading rows (very top)
	const heading = [
		[{value: '', style: styles.cellBlue_header},{value: '', style: styles.cellBlue_header},{value: '', style: styles.cellBlue_header},{value: 'GDC Dictionary', style: styles.cellBlue_header},{value: 'GDC Dictionary', style: styles.cellBlue_header}, {value: 'Mapped GDC Values', style: styles.cellBlue_header}, {value: 'Mapped GDC Values', style: styles.cellBlue_header}]
	];
	
	//Here you specify the export structure
	const specification = {
		c: { // <- the key should match the actual data key
			displayName: 'Category', // <- Here you specify the column header
			headerStyle: styles.cellBlue, // <- Header style
			width: 220 // <- width in pixels
		},
		n: {
			displayName: 'Node',
			headerStyle: styles.cellBlue,
			width: 220 // <- width in chars (when the number is passed as string)
		},
		p: {
			displayName: 'Property',
			headerStyle: styles.cellBlue,
			width: 220 // <- width in pixels
		},
		v_1: {
			displayName: 'Value',
			headerStyle: styles.cellBlue,
			width: 220 // <- width in pixels
		},
		n_1: {
			displayName: 'NCIt Code',
			headerStyle: styles.cellBlue,
			width: 220 // <- width in pixels
		},
		v_2: {
			displayName: 'Value',
			headerStyle: styles.cellBlue,
			width: 220 // <- width in pixels
		},
		n_2: {
			displayName: 'NCIt Code',
			headerStyle: styles.cellBlue,
			width: 220 // <- width in pixels
		}
	}
	
	// Define an array of merges. 1-1 = A:1
	// The merges are independent of the data.
	// A merge will overwrite all data _not_ in the top-left cell.
	const merges = [
		{ start: { row: 1, column: 4 }, end: { row: 1, column: 5 } },
		{ start: { row: 1, column: 6 }, end: { row: 1, column: 7 } }
	];
	
	// Create the excel report.
	// This function will return Buffer
	const report = export_excel.buildExport(
	[ // <- Notice that this is an array. Pass multiple sheets to create multi sheet report
		{
		name: 'All', // <- Specify sheet name (optional)
		heading: heading, // <- Raw heading array (optional)
		merges: merges, // <- Merge cell ranges
		specification: specification, // <- Report specification
		data: result.all_data // <-- Report data
		},
		{
		name: 'Unmapped', // <- Specify sheet name (optional)
		heading: heading, // <- Raw heading array (optional)
		merges: merges, // <- Merge cell ranges
		specification: specification, // <- Report specification
		data: result.unmapped_data // <-- Report data
		},
		{
		name: 'Mapped', // <- Specify sheet name (optional)
		heading: heading, // <- Raw heading array (optional)
		merges: merges, // <- Merge cell ranges
		specification: specification, // <- Report specification
		data: result.mapped_data // <-- Report data
		},
		{
		name: 'Conflict', // <- Specify sheet name (optional)
		heading: heading, // <- Raw heading array (optional)
		merges: merges, // <- Merge cell ranges
		specification: specification, // <- Report specification
		data: result.conflict_data // <-- Report data
		}
	]
	);
	
	// You can then return this straight
	res.attachment('report.xlsx'); // This is sails.js specific (in general you need to set headers)
	res.send(report);
}

const generateGDCPropertiesReport = async function(req, res) {
  const dataset = [];
  let GDCDict = await shared.getGDCDictionaryByVersion("2.5.0");
  let prop_mapping = shared.readGDCProps();
  
  for(let node in GDCDict){
    let entry = GDCDict[node];
    if(entry.properties){
      let prop_dict = entry.properties;
      for(let prop in prop_dict){
        let tmp = {};
        let uid = entry.category + "." + node + "." + prop;
        tmp.category = entry.category;
        tmp.node = node;
        tmp.property = prop;
        let dict = prop_dict[prop];
        tmp.ncit = prop_mapping[uid] !== undefined ? prop_mapping[uid] : '';
        tmp.cdeid = dict.termDef && dict.termDef.source && dict.termDef.source === "caDSR" ? (dict.termDef.cde_id) : "";
        dataset.push(tmp);
      }
    } 
  }

  // You can define styles as json object
  const styles = {
    cellPink: {
      fill: {
        fgColor: {
          rgb: '1F497D'
        }
      },
      font:{
        color: {
          rgb: 'FFFFFF'
        }
      }
    }
  };
    
  //Array of objects representing heading rows (very top)
  const heading = [
  ];
    
  //Here you specify the export structure
  const specification = {
    category: { // <- the key should match the actual data key
      displayName: 'Category', // <- Here you specify the column header
      headerStyle: styles.cellPink, // <- Header style
      width: 220 // <- width in pixels
    },
    node: {
      displayName: 'Node',
      headerStyle: styles.cellPink,
      width: 220 // <- width in chars (when the number is passed as string)
    },
    property: {
      displayName: 'Property',
      headerStyle: styles.cellPink,
      width: 220 // <- width in pixels
    },
    ncit: {
      displayName: 'NCIt Code',
      headerStyle: styles.cellPink,
      width: 220 // <- width in pixels
    },
    cdeid: {
      displayName: 'CDE ID',
      headerStyle: styles.cellPink,
      width: 220 // <- width in pixels
    }
  }
    
  // Define an array of merges. 1-1 = A:1
  // The merges are independent of the data.
  // A merge will overwrite all data _not_ in the top-left cell.
  const merges = [];
  
  // Create the excel report.
  // This function will return Buffer
  const report = export_excel.buildExport(
  [ // <- Notice that this is an array. Pass multiple sheets to create multi sheet report
    {
    name: 'Report', // <- Specify sheet name (optional)
    heading: heading, // <- Raw heading array (optional)
    merges: merges, // <- Merge cell ranges
    specification: specification, // <- Report specification
    data: dataset // <-- Report data
    }
  ]
  );
  
  // You can then return this straight
  res.attachment('GDC_Properties_Data_Mapping.xlsx'); // This is sails.js specific (in general you need to set headers)
  res.send(report);
}


const generateGDCValuesReport = async function(req, res) {
  const dataset = [];
  let GDCDict = await shared.getGDCDictionaryByVersion("2.5.0");
  let gdc_values = shared.readGDCValues();
  let syns = shared.readNCItDetails();

  for(let node in GDCDict){
    let entry = GDCDict[node];
    if(entry.properties){
      let prop_dict = entry.properties;
      for(let prop in prop_dict){
        let uid = entry.category + "." + node + "." + prop;
        let prop_enum = prop_dict[prop] !== undefined && prop_dict[prop].enum !== undefined && prop_dict[prop].enum.length > 0 ? prop_dict[prop].enum : [];
        prop_enum = prop_dict[prop] !== undefined && prop_dict[prop].items !== undefined && prop_dict[prop].items.enum !== undefined && prop_dict[prop].items.enum.length > 0 ? prop_dict[prop].items.enum : prop_enum;

        let mappings = gdc_values[uid] !== undefined ? gdc_values[uid] : [];
        let deprecated_enum = prop_dict[prop] !== undefined && prop_dict[prop].deprecated_enum !== undefined && prop_dict[prop].deprecated_enum.length > 0 ? prop_dict[prop].deprecated_enum : [];

        for(let value of prop_enum){
          let tmp = {};
          tmp.category = entry.category;
          tmp.node = node;
          tmp.property = prop;
          tmp.value = value;
          tmp.ncit = [];
          tmp.icdo3 = '';
          tmp.icdoS = [];
          tmp.ncitPV = [];

          if (deprecated_enum.includes(value)) {
            continue;
          }

          let map = mappings.find(({ nm }) => nm === value);
          if(map !== undefined){
            tmp.ncit = Array.isArray(map.n_c) ? map.n_c.join('|') : '';
            tmp.icdo3 = map.i_c;
            tmp.icdoS = Array.isArray(map.i_c_s) ? map.i_c_s.join('|') : ''
            for(let code of map.n_c){
              tmp.ncitPV.push(syns[code] !== undefined ? syns[code].label : '');
            }
            tmp.ncitPV = Array.isArray(tmp.ncitPV) ? tmp.ncitPV.join('|') : '';
          }

          dataset.push(tmp);
        }
      }
    }
  }

  // You can define styles as json object
  const styles = {
    cellPink: {
      fill: {
        fgColor: {
          rgb: '1F497D'
        }
      },
      font:{
        color: {
          rgb: 'FFFFFF'
        }
      }
    }
  };
    
  //Array of objects representing heading rows (very top)
  const heading = [
  ];
  
  //Here you specify the export structure
  const specification = {
    category: { // <- the key should match the actual data key
      displayName: 'Category', // <- Here you specify the column header
      headerStyle: styles.cellPink, // <- Header style
      width: 220 // <- width in pixels
    },
    node: {
      displayName: 'Node',
      headerStyle: styles.cellPink,
      width: 220 // <- width in chars (when the number is passed as string)
    },
    property: {
      displayName: 'Property',
      headerStyle: styles.cellPink,
      width: 220 // <- width in pixels
    },
    value: {
      displayName: 'GDC Values',
      headerStyle: styles.cellPink,
      width: 220 // <- width in pixels
    },
    ncit: {
      displayName: 'NCIt Code',
      headerStyle: styles.cellPink,
      width: 220 // <- width in pixels
    },
    ncitPV: {
      displayName: 'NCIt PV',
      headerStyle: styles.cellPink,
      width: 220 // <- width in pixels
    },
    icdo3: {
      displayName: 'ICDO3 Code',
      headerStyle: styles.cellPink,
      width: 220 // <- width in pixels
    },
    icdoS: {
      displayName: 'ICDO3 String',
      headerStyle: styles.cellPink,
      width: 220 // <- width in pixels
    }
  }
  
  // Define an array of merges. 1-1 = A:1
  // The merges are independent of the data.
  // A merge will overwrite all data _not_ in the top-left cell.
  const merges = [];
  
  // Create the excel report.
  // This function will return Buffer
  const report = export_excel.buildExport(
  [ // <- Notice that this is an array. Pass multiple sheets to create multi sheet report
    {
    name: 'Report', // <- Specify sheet name (optional)
    heading: heading, // <- Raw heading array (optional)
    merges: merges, // <- Merge cell ranges
    specification: specification, // <- Report specification
    data: dataset // <-- Report data
    }
  ]
  );
  
  // You can then return this straight
  res.attachment('GDC_Values_Data_Mapping.xlsx'); // This is sails.js specific (in general you need to set headers)
  res.send(report);
}

// const generateCompareValues = async function(req, res) {
//   try {
// 	const datasetnew = {};
//   const datasetold = {};
//   const dataset = [];
// 	// let output_file_path = path.join(__dirname, '..', '..', 'data_files', 'GDC', 'gdc_values_updated.js');
	
//   let GDCDict = await shared.getGDCDictionaryByVersion("3.1.0");
//   let GDCDictOld = await shared.getGDCDictionaryByVersion("3.0.0");
//   let prop_mapping = shared.readGDCProps();
//   let values_mapping = shared.readGDCValues();
	
// 	for(let node in GDCDict){
// 		let entry = GDCDict[node];
// 		if(entry.properties){
// 			let prop_dict = entry.properties;
// 			for(let prop in prop_dict){
// 				let tmp = {};
// 				tmp.category = entry.category;
// 				tmp.node = node;
// 				tmp.property = prop;
//         if(prop_dict[prop].enum){

//           let uid = entry.category + "." + node + "." + prop;
//           let tmp_enum = values_mapping[uid] !== undefined ? values_mapping[uid] : [];

//             prop_dict[prop].enum.forEach(item => {
//                 let found = tmp_enum.find(element => element['nm'] === item);
//                 if (!found) {
//                     tmp_enum.push({'nm': item, 'n_c': [], 'i_c': '','i_c_s': '', 'term_type': '' });
//                 } 
//             });

//           tmp.enum = tmp_enum

//           datasetnew[uid] = tmp;
//         }
// 			}
// 		} 
// 	}

//   for(let node in GDCDictOld){
// 		let entry = GDCDictOld[node];
// 		if(entry.properties){
// 			let prop_dict = entry.properties;
// 			for(let prop in prop_dict){
// 				let tmp = {};
// 				tmp.category = entry.category;
// 				tmp.node = node;
// 				tmp.property = prop;
        
//         if(prop_dict[prop].enum){

//           let uid = entry.category + "." + node + "." + prop;
//           let tmp_enum = values_mapping[uid] !== undefined ? values_mapping[uid] : [];

//           prop_dict[prop].enum.forEach(item => {

//             let found = tmp_enum.find(element => element['nm'] === item);
//             if (!found) {
//                 tmp_enum.push({'nm': item, 'n_c': [], 'i_c': '','i_c_s': '', 'term_type': '' });
//             } 
//         });

//           tmp.enum = tmp_enum

//           datasetold[uid] = tmp;
//         }
// 			}
// 		} 
// 	}

//   for(let key in datasetnew){
//     if (!datasetold[key]) {
//       datasetnew[key].newprop = datasetnew[key].property;
//       datasetnew[key].oldprop = 'no match';
//       dataset.push(datasetnew[key])
//     }else if (datasetnew[key] && datasetold[key]) {
//       datasetnew[key].newprop = datasetnew[key].property;
//       datasetnew[key].oldprop = datasetold[key].property;
//       dataset.push(datasetnew[key])
//     }
//   }
//   for(let key in datasetold){
//     if (!datasetnew[key]) {
//       datasetold[key].newprop = 'no match';
//       datasetold[key].oldprop = datasetold[key].property;
//       dataset.push(datasetold[key])
//     }
//   }

//   // You can define styles as json object
// 	const styles = {
//     cellPink: {
//       fill: {
//       fgColor: {
//         rgb: 'FF00FF00'
//       }
//       }
//     }
//     };
    
//     //Array of objects representing heading rows (very top)
//     const heading = [
//     ];
    
//     //Here you specify the export structure
//     const specification = {
//       category: { // <- the key should match the actual data key
//         displayName: 'Category', // <- Here you specify the column header
//         headerStyle: styles.cellPink, // <- Header style
//         width: 220 // <- width in pixels
//       },
//       node: {
//         displayName: 'Node',
//         headerStyle: styles.cellPink,
//         width: 220 // <- width in chars (when the number is passed as string)
//       },
//       oldprop: {
//         displayName: 'Old GDC Property',
//         headerStyle: styles.cellPink,
//         width: 220 // <- width in pixels  
//       },
//       newprop: {
//         displayName: 'New GDC Property',
//         headerStyle: styles.cellPink,
//         width: 220 // <- width in pixels
//       },
//       ncit: {
//         displayName: 'NCIt Code',
//         headerStyle: styles.cellPink,
//         width: 220 // <- width in pixels
//       }
//     }
    
//     // Define an array of merges. 1-1 = A:1
//     // The merges are independent of the data.
//     // A merge will overwrite all data _not_ in the top-left cell.
//     const merges = [];
    
//     // Create the excel report.
//     // This function will return Buffer
//     const report = export_excel.buildExport(
//     [ // <- Notice that this is an array. Pass multiple sheets to create multi sheet report
//       {
//       name: 'Report', // <- Specify sheet name (optional)
//       heading: heading, // <- Raw heading array (optional)
//       merges: merges, // <- Merge cell ranges
//       specification: specification, // <- Report specification
//       data: dataset // <-- Report data
//       }
//     ]
//     );
    
//     // You can then return this straight
//     res.attachment('report.xlsx'); // This is sails.js specific (in general you need to set headers)
//     res.send(report);
//   }
//   catch(e) {
//     console.log(e)
//   }
// }


const generateCompareProperties = async function(req, res) {
  try {
	const datasetnew = {};
  const datasetold = {};
  const dataset = [];
	// let output_file_path = path.join(__dirname, '..', '..', 'data_files', 'GDC', 'gdc_values_updated.js');
	
  let GDCDict = await shared.getGDCDictionaryByVersion("3.3.0");
  let GDCDictOld = await shared.getGDCDictionaryByVersion("3.1.0");
  let prop_mapping = shared.readGDCProps();
	
	for(let node in GDCDict){
		let entry = GDCDict[node];
		if(entry.properties){
			let prop_dict = entry.properties;
			for(let prop in prop_dict){
				let tmp = {};
				tmp.category = entry.category;
				tmp.node = node;
				tmp.property = prop;
				let dict = prop_dict[prop];
        let uid = entry.category + "." + node + "." + prop;
        tmp.ncit = prop_mapping[uid] !== undefined ? prop_mapping[uid] : '';
        datasetnew[uid] = tmp;
			}
		} 
	}

  for(let node in GDCDictOld){
		let entry = GDCDictOld[node];
		if(entry.properties){
			let prop_dict = entry.properties;
			for(let prop in prop_dict){
				let tmp = {};
				tmp.category = entry.category;
				tmp.node = node;
				tmp.property = prop;
				// let dict = prop_dict[prop];
        let uid = entry.category + "." + node + "." + prop;
        tmp.ncit = prop_mapping[uid] !== undefined ? prop_mapping[uid] : '';
        datasetold[uid] = tmp;
			}
		} 
	}

  for(let key in datasetnew){
    if (!datasetold[key]) {
      datasetnew[key].newprop = datasetnew[key].property;
      datasetnew[key].oldprop = 'no match';
      dataset.push(datasetnew[key])
    }else if (datasetnew[key] && datasetold[key]) {
      datasetnew[key].newprop = datasetnew[key].property;
      datasetnew[key].oldprop = datasetold[key].property;
      dataset.push(datasetnew[key])
    }
  }
  for(let key in datasetold){
    if (!datasetnew[key]) {
      datasetold[key].newprop = 'no match';
      datasetold[key].oldprop = datasetold[key].property;
      dataset.push(datasetold[key])
    }
  }

  // You can define styles as json object
	const styles = {
    cellPink: {
      fill: {
      fgColor: {
        rgb: 'FF00FF00'
      }
      }
    }
    };
    
    //Array of objects representing heading rows (very top)
    const heading = [
    ];
    
    //Here you specify the export structure
    const specification = {
      category: { // <- the key should match the actual data key
        displayName: 'Category', // <- Here you specify the column header
        headerStyle: styles.cellPink, // <- Header style
        width: 220 // <- width in pixels
      },
      node: {
        displayName: 'Node',
        headerStyle: styles.cellPink,
        width: 220 // <- width in chars (when the number is passed as string)
      },
      oldprop: {
        displayName: 'Old GDC Property',
        headerStyle: styles.cellPink,
        width: 220 // <- width in pixels  
      },
      newprop: {
        displayName: 'New GDC Property',
        headerStyle: styles.cellPink,
        width: 220 // <- width in pixels
      },
      ncit: {
        displayName: 'NCIt Code',
        headerStyle: styles.cellPink,
        width: 220 // <- width in pixels
      }
    }
    
    // Define an array of merges. 1-1 = A:1
    // The merges are independent of the data.
    // A merge will overwrite all data _not_ in the top-left cell.
    const merges = [];
    
    // Create the excel report.
    // This function will return Buffer
    const report = export_excel.buildExport(
    [ // <- Notice that this is an array. Pass multiple sheets to create multi sheet report
      {
      name: 'Report', // <- Specify sheet name (optional)
      heading: heading, // <- Raw heading array (optional)
      merges: merges, // <- Merge cell ranges
      specification: specification, // <- Report specification
      data: dataset // <-- Report data
      }
    ]
    );
    
    // You can then return this straight
    res.attachment('prop_diff_report.xlsx'); // This is sails.js specific (in general you need to set headers)
    res.send(report);
  }
  catch(e) {
    console.log(e)
  }
}

const generateCompareNodes = async function(req, res) {
  const dataset = [];
	let output_file_path = path.join(__dirname, '..', '..', 'data_files', 'GDC', 'gdc_values_updated.js');
	
  let GDCDict = {}
  let GDCDictOld = {}

  try {
    GDCDict = await shared.getGDCDictionaryByVersion("3.1.0");
    GDCDictOld = await shared.getGDCDictionaryByVersion("3.0.0");
  } catch(e) {
    console.log(e)
  }

  let node_mapping = shared.readGDCNodes();
	
	for(let node in GDCDict){
    if (!GDCDictOld[node]) {
      let tmp = {};
      tmp.category = GDCDict[node].category;
      tmp.node = node;
      tmp.oldnode = 'no match';
      let uid = GDCDict[node].category + "." + node;
      tmp.ncit = node_mapping[uid] !== undefined ? node_mapping[uid] : '';
      dataset.push(tmp);
    } else if (GDCDict[node] && GDCDictOld[node]) {
      let tmp = {};
      tmp.category = GDCDict[node].category;
      tmp.node = node;
      tmp.oldnode = node;
      let uid = GDCDict[node].category + "." + node;
      tmp.ncit = node_mapping[uid] !== undefined ? node_mapping[uid] : '';
      dataset.push(tmp);
    }
	}

  for(let node in GDCDictOld){
    if (!GDCDict[node]) {
      let tmp = {};
      tmp.category = GDCDictOld[node].category;
      tmp.node = 'no match';
      tmp.oldnode = node;
      let uid = GDCDictOld[node].category + "." + node;
      tmp.ncit = node_mapping[uid] !== undefined ? node_mapping[uid] : '';
      dataset.push(tmp);
    }
	}

  // You can define styles as json object
	const styles = {
    cellPink: {
      fill: {
      fgColor: {
        rgb: 'FF00FF00'
      }
      }
    }
    };
    
    //Array of objects representing heading rows (very top)
    const heading = [
    ];
    
    //Here you specify the export structure
    const specification = {
      category: { // <- the key should match the actual data key
        displayName: 'Category', // <- Here you specify the column header
        headerStyle: styles.cellPink, // <- Header style
        width: 220 // <- width in pixels
      },
      oldnode: {
        displayName: 'Old GDC Node',
        headerStyle: styles.cellPink,
        width: 220 // <- width in chars (when the number is passed as string)
      },
      node: {
        displayName: 'New GDC Node',
        headerStyle: styles.cellPink,
        width: 220 // <- width in pixels  
      },
      ncit: {
        displayName: 'NCIt Code',
        headerStyle: styles.cellPink,
        width: 220 // <- width in pixels
      }
    }
    
    // Define an array of merges. 1-1 = A:1
    // The merges are independent of the data.
    // A merge will overwrite all data _not_ in the top-left cell.
    const merges = [];
    
    // Create the excel report.
    // This function will return Buffer
    const report = export_excel.buildExport(
    [ // <- Notice that this is an array. Pass multiple sheets to create multi sheet report
      {
      name: 'Report', // <- Specify sheet name (optional)
      heading: heading, // <- Raw heading array (optional)
      merges: merges, // <- Merge cell ranges
      specification: specification, // <- Report specification
      data: dataset // <-- Report data
      }
    ]
    );
    
    // You can then return this straight
    res.attachment('node_diff_report.xlsx'); // This is sails.js specific (in general you need to set headers)
    res.send(report);
}


const updateGDCPropertyMappings = async function(req, res) {
  /*
  let file_path = path.join(
    __dirname,
    "..",
    "..",
    "data_files",
    "GDC",
    "GDC_Property.xlsx"
  );

  let output_file_path = path.join(__dirname, '..', '..', 'data_files', 'GDC', 'gdc_props_updated.js');
  
  const workbook = new Excel.Workbook();
  await workbook.xlsx.readFile(file_path.replace(/\\/g, "/"));
  let worksheet = workbook.worksheets[0];

  let prop_mapping = {};

  let prop_mapping_count = 0;
  let prop_mapped_count = 0;
  let prop_unmapped_count = 0;

  worksheet.eachRow(function (row, rowNumber) {
    let item = row.values;
    if (rowNumber > 1) {
      let property = item[6] == undefined || item[6] == null ? "" : item[6];
      let ncit = item[3] == undefined || item[3] == null ? "" : item[3];
      if(property != ""){
        if(property.indexOf(" || ") > -1){
          property.split(" || ").forEach((p) => {
            prop_mapping[p.trim()] = ncit;
            prop_mapping_count++;
          })
        }
        else{
          prop_mapping[property] = ncit;
          prop_mapping_count ++;
        }
      }
      
    }
  });
  
  const mapped_props = [];
	const dataset = {};
  const dataoutput = [];
	let GDCDict = await shared.getGDCDictionaryByVersion("2.5.0");
	
	for(let node in GDCDict){
		let entry = GDCDict[node];
		if(entry.properties){
			let prop_dict = entry.properties;
			for(let prop in prop_dict){
				let tmp = {};
				tmp.category = entry.category;
				tmp.node = node;
				tmp.property = prop;
        tmp.desc = prop_dict[prop].description;
        
        if(prop in prop_mapping){
          //console.log("Found mapping: <", prop, node, category, ">");
          let p_id = tmp.category + "."+ tmp.node + "." + prop;
          if(mapped_props.indexOf(prop) == -1){
            mapped_props.push(prop);
          }
          dataset[p_id] = prop_mapping[prop];
          tmp.ncit = prop_mapping[prop];
          prop_mapped_count++;
        }
        else{
          //console.log("don't have mapping for <", prop, node, category, ">");
          tmp.ncit = "";
          prop_unmapped_count++;
        }

        dataoutput.push(tmp);

			}
		} 
	}

  console.log(prop_mapping_count, prop_mapped_count, prop_unmapped_count);

  fs.writeFileSync(output_file_path, JSON.stringify(dataset), (err) => {
    if (err) return logger.error(err);
  });

  // You can define styles as json object
	const styles = {
    cellPink: {
      fill: {
      fgColor: {
        rgb: 'FF00FF00'
      }
      }
    }
    };
    
    //Array of objects representing heading rows (very top)
    const heading = [
    ];
    
    //Here you specify the export structure
    const specification = {
      category: { // <- the key should match the actual data key
        displayName: 'Category', // <- Here you specify the column header
        headerStyle: styles.cellPink, // <- Header style
        width: 220 // <- width in pixels
      },
      node: {
        displayName: 'Node',
        headerStyle: styles.cellPink,
        width: 220 // <- width in chars (when the number is passed as string)
      },
      property: {
        displayName: 'Property',
        headerStyle: styles.cellPink,
        width: 220 // <- width in pixels
      },
      desc: {
        displayName: 'Property Description',
        headerStyle: styles.cellPink,
        width: 220 // <- width in pixels
      },
      ncit: {
        displayName: 'NCIt Code',
        headerStyle: styles.cellPink,
        width: 220 // <- width in pixels
      }
    }
    
    // Define an array of merges. 1-1 = A:1
    // The merges are independent of the data.
    // A merge will overwrite all data _not_ in the top-left cell.
    const merges = [];
    
    // Create the excel report.
    // This function will return Buffer
    const report = export_excel.buildExport(
    [ // <- Notice that this is an array. Pass multiple sheets to create multi sheet report
      {
      name: 'Report', // <- Specify sheet name (optional)
      heading: heading, // <- Raw heading array (optional)
      merges: merges, // <- Merge cell ranges
      specification: specification, // <- Report specification
      data: dataoutput // <-- Report data
      }
    ]
    );
    
    // You can then return this straight
    res.attachment('report.xlsx'); // This is sails.js specific (in general you need to set headers)
    res.send(report);
    */
}

const addGDCDataMappings = async (req, res) => {
  /*
  let file_path = path.join(
    __dirname,
    "..",
    "..",
    "data_files",
    "GDC",
    "GDC_Value.xlsx"
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

  let prop_mapping = {};
  let value_mapping = {};

  worksheet.eachRow(function (row, rowNumber) {
    let item = row.values;
    if (rowNumber > 1) {
      let category = "";
      let node = "";
      let property = item[4] == undefined || item[4] == null ? "" : item[4].trim();
      let property_ncit = item[3] == undefined || item[3] == null ? "" : item[3].trim();
      let value = item[2] == undefined || item[2] == null ? "" : item[2].trim();
      let ncit = item[1] == undefined || item[1] == null ? "" : item[1].trim();

      if (property.indexOf("||") > -1) {
        let ps = property.split("||");
        let p_ncits = property_ncit.split("||");
        ps.forEach((p, idx) => {
          prop_mapping[p.trim()] = p_ncits[idx].trim();
        });
      }
      else{
        prop_mapping[property.trim()] = property_ncit.trim();
      }

      if(value.indexOf("||") > -1){
        let values = value.split("||");
        values.forEach((v, idx) => {
          let entry = v.split("|");
          let v_id = entry[1].trim() + "." + entry[0].trim();
          if(!(v_id in value_mapping)){
            value_mapping[v_id] = [];
          }
          if(value_mapping[v_id].indexOf(ncit) == -1){
            value_mapping[v_id].push(ncit);
          }
        });
      }
      else{
        let entry = value.split("|");
        let v_id = entry[1].trim() + "." + entry[0].trim();
        if(!(v_id in value_mapping)){
          value_mapping[v_id] = [];
        }
        if(value_mapping[v_id].indexOf(ncit) == -1){
          value_mapping[v_id].push(ncit);
        }
      }

    }
  });

  let prop2Node = {};

  const dataset = {};
  let GDCDict = await shared.getGDCDictionaryByVersion("2.3.0");
  let cache = [];
  let mappings_to_validate = [];
  let count = 0;
  
	for(let node in GDCDict){
		let entry = GDCDict[node];
		if(entry.properties){
			let prop_dict = entry.properties;
			for(let prop in prop_dict){
				let tmp = {};
				tmp.category = entry.category;
				tmp.node = node;
				tmp.property = prop;
        tmp.desc = prop_dict[prop].description;

        tmp.enum = prop_dict[prop].enum;

        if(prop in prop_mapping){
          
          if(tmp.enum && tmp.enum.length > 0){
            tmp.enum.forEach((em) => {
              let value_id = prop + "." + em;
              if(value_id in value_mapping){
                if(cache.indexOf(value_id) > -1){
                  count ++;
                }
                else{
                  cache.push(value_id);
                }
                mappings_to_validate.push({
                  p_id: tmp.category + "." + tmp.node + "." + tmp.property,
                  v: em,
                  ncit: value_mapping[value_id]
                });
              }
            });
          }
          
        }
			}
		} 
	}

  mappings_to_validate.forEach((mtv, idx) => {
      let value = mtv.v;
      let ncit = mtv.ncit;
      let p_id = mtv.p_id;
      let found = false;
          
      if (!(p_id in current_mappings)) {
        current_mappings[p_id] = [];
      }
      current_mappings[p_id].forEach((value_entry) => {
        if (value_entry.nm == value.trim()) {
          found = true;
          if (ncit != "") {
            value_entry.n_c = ncit;
          }
          
        }
      });

      if(!found){
        let entry = {};
        entry.nm = value;
        entry.n_c = ncit;
        entry.i_c = "";
        entry.i_c_s = "";
        entry.term_type = "";
        current_mappings[p_id].push(entry);
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
  //handle value mappings

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
  listNCItSynonyms,
	preloadGDCDataMappings,
  updateGDCDataMappings,
  preloadPCDCDataMappings,
	compareAllWithGDCDictionary,
	exportCompareResult,
	exportAllCompareResult,
	generateGDCPropertiesReport,
  generateGDCValuesReport,
  // generateCompareValues,
  generateCompareProperties,
  generateCompareNodes,
  updateGDCPropertyMappings,
  addGDCDataMappings
};
