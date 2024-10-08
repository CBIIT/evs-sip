const fs = require("fs");
const path = require("path");
const yaml = require("yamljs");
const _ = require('lodash');
const Excel = require("exceljs");
// const export_excel = require('node-excel-export');
const logger = require('./components/logger');
//const ICDCdata = require('./dataprocess/ICDCdata');
//const shared = require('./service/search/shared.js');


// const dataFilesDir = path.join(__dirname, "data_files", "GDC");
const dataFilesDir = path.join(__dirname, "data_files");

const readNCItDetails = () => {
    let content = fs.readFileSync(dataFilesDir + "/GDC/ncit_details.js").toString();
    content = content.replace(/}{/g, ",");
    return JSON.parse(content);
};

// const readICDCMapping = () => {
//     let content = fs
//         .readFileSync(dataFilesDir + "/ICDC/ICDC_Mappings.json")
//         .toString();
//     content = content.replace(/}{/g, ",");
//     return JSON.parse(content);
// };

const readCTDCMapping = () => {
    let content = fs
        .readFileSync(dataFilesDir + "/CTDC/CTDC_Mappings.json")
        .toString();
    content = content.replace(/}{/g, ",");
    return JSON.parse(content);
};


const readCTDCyamlFiles = () => {
    let jsonData = {};
    let result = undefined;
    let mpJson = yaml.load(dataFilesDir + "/CTDC/ctdc_model_properties_file.yaml");
    jsonData.mpData = mpJson;
    let mJson = yaml.load(dataFilesDir + "/CTDC/ctdc_model_file.yaml");
    jsonData.mData = mJson;
    result = generateICDCorCTDCData(jsonData);

    let nodenewlist = [];
    let propnewlist = [];
    for (let key in mJson.Nodes) {
        nodenewlist.push(key)
    }
    for (let key in mpJson.PropDefinitions) {
        propnewlist.push(key)
    }
    return result
};

// const readICDCyamlFilesNew = () => {
//     let jsonData = {};
//     let result = undefined;
//     let mpJson = yaml.load(dataFilesDir + "/ICDC/icdc-model-props_new.yml");
//     jsonData.mpData = mpJson;
//     let mJson = yaml.load(dataFilesDir + "/ICDC/icdc-model_new.yml");
//     jsonData.mData = mJson;
//     result = generateNewICDCorCTDCData(jsonData);
//     //console.dir(JSON.stringify(result, null, 4))
//     //console.dir(JSON.stringify(mpJson, null, 4))
//     let nodenewlist = [];
//     let propnewlist = [];
//      for (let key in mJson.Nodes) {
//      //console.log(" line 53 key node name ", key)
//     nodenewlist.push(key)
//     }
//     for (let key in mpJson.PropDefinitions) {
// //         let propnode ={}
// //         let prop = mpJson.PropDefinitions[key]
// //         if(Array.isArray(prop["Type"])){
// //             console.log(prop["Type"])
// //             propnode.name = key
// //             propnode.value = prop["Type"]
// // console.log("line 81 ")
// //             console.dir(propnode)
// //         }
//         propnewlist.push(key)
//     }

//     return result;
// };
  
const build_ctdc = (dict) => {

    let allProperties = [];
    let unloaded_ncits = [];
    let allTerm = {};

    let syns = readNCItDetails();
    let ctdc_mapping = readCTDCMapping();
 

    for (let node_name in dict) {
        // loop through each node
        let properties = dict[node_name].properties;

        let mapping_dict = {};
        // check existing icdc_mapping
        if (ctdc_mapping[node_name] && ctdc_mapping[node_name].properties) {
            ctdc_mapping[node_name].properties.forEach(prop => {
                mapping_dict[prop.p_name] = prop;
            });
        }

        // loop through each node-prop
        for (var prop in properties) {
            let entry = {};
            let p = {};
            let values = [];
            let ncits = [];
            let entryRaw = properties[prop];
            let mappingEntryRaw = mapping_dict[prop];

            p.source = "icdc";
            p.category = dict[node_name].category;
            p.node = {};
            p.node.n = dict[node_name].id;
            p.node.d = dict[node_name].description || "";
            p.prop = {};
            p.prop.n = prop;
            p.prop.d = entryRaw.description;
            p.id = p.prop.n + "/" + p.node.n + "/" + p.category;

            if (["string", "number", "integer", "boolean", "TBD", "list", "datetime"].indexOf(entryRaw.type) > -1) {
                p.type = entryRaw.type;
            }
            else if (Array.isArray(entryRaw.type)) {
                let arr = entryRaw.type;
                if (arr.length == 1 && arr[0].indexOf('http') == 0) {
                    //this is a reference to other http resource
                    p.type = arr[0];
                }
                else {
                    //p.enum should have the following format:
                    //enum:[
                    //  {
                    //    n: "Abdomen, NOS",
                    //    icdo: {
                    //        c: "C76.2", 
                    //        have: ["C76", "C76.2"],
                    //        s: [
                    //          {n: "Abdomen, NOS", t: "PT"},
                    //          {n: "Abdominal wall, NOS", t: "RT"},
                    //          ...
                    //        ]
                    //      },
                    //    ncit: [
                    //      {
                    //        c: "C12664", 
                    //        s: [
                    //          {n: "ABDOMINAL CAVITY", t: "PT", src: "CDISC"},
                    //          ...
                    //        ]
                    //      },
                    //      ...
                    //    ]
                    //  },
                    //  ...
                    //]
                    p.type = "enum";
                    //add values and ncit codes
                    p.enum = [];
                    let values_dict = {};
                    if (mappingEntryRaw && mappingEntryRaw.values) {
                        mappingEntryRaw.values.forEach(entry => {
                            values_dict[entry.v_name.toLowerCase()] = entry;
                        });
                    }

                    entryRaw.type.forEach(v => {
                        let tmp = {};
                        tmp.n = v;
                        let v_lowcase = v.toLowerCase();
                        tmp.ncit = [];
                        if (values_dict[v_lowcase] && values_dict[v_lowcase].v_n_code && values_dict[v_lowcase].v_n_code.trim() != "") {
                            let dict = {};
                            dict.c = values_dict[v_lowcase].v_n_code.trim();
                            dict.l = (syns[values_dict[v_lowcase].v_n_code] ? syns[values_dict[v_lowcase].v_n_code].label : "");
                            let synonyms = (syns[values_dict[v_lowcase].v_n_code] ? syns[values_dict[v_lowcase].v_n_code].synonyms : []);
                            if (syns[values_dict[v_lowcase].v_n_code] == undefined) {
                                console.log("Don't have the ncit data for:" + dict.c);
                                if (unloaded_ncits.indexOf(dict.c) == -1) {
                                    unloaded_ncits.push(dict.c);
                                }
                            }
                            if (synonyms.length > 0) {
                                dict.s = [];
                                synonyms.forEach(s => {
                                    dict.s.push({
                                        n: s.termName,
                                        t: s.termGroup,
                                        src: s.termSource
                                    });
                                });
                            }
                            tmp.ncit.push(dict);
                            ncits.push(dict.c.toLowerCase());
                        }
                        p.enum.push(tmp);
                        values.push(v_lowcase);
                    });
                    values = _.uniq(values.concat(Object.keys(values_dict)));
                    ncits = _.uniq(ncits);
                }
            }
            else {
                if (entryRaw.type && entryRaw.type.value_type) {
                    //this is a reference to other http resource
                  //  console.log(" line 520 units ", entryRaw.type.units);
                  //  console.log(" line 520 type ", entryRaw.type.value_type);
                    if (!entryRaw.type.units) logger.info(" line 520 all ", entryRaw);
                 //   logger.info(" line 521 units ", entryRaw.type.units);
                  //  logger.info(" line 521 type ", entryRaw.type.value_type);
                    if (entryRaw.type.value_type === 'list') {
                        p.type = entryRaw.type.value_type + " units " + entryRaw.type.item_type.join('/');
                    } else {
                        p.type = entryRaw.type.value_type + " units " + entryRaw.type.units.join('/');
                    }

                } else {
                    p.type = "object";
                }

            }

            if (mappingEntryRaw && mappingEntryRaw.p_n_code) {
                /*
                p.cde = {};
                p.cde.id = mappingEntryRaw.p_n_code;
                //p.cde.v = entry.termDef.cde_version;
                p.cde.url = "https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&ns=ncit&code=" + p.cde.id;
                p.cde.src = 'NCIt';
                */
                p.prop.ncit = [];
                let tmp = {};
                tmp.c = mappingEntryRaw.p_n_code.toUpperCase();
                tmp.l = (tmp.c !== '' && syns[tmp.c] ? syns[tmp.c].label : "");
                let synonyms = (tmp.c !== '' && syns[tmp.c] ? syns[tmp.c].synonyms : []);
                if (syns[tmp.c] == undefined) {
                    console.log("Don't have the ncit data for:" + tmp.c);
                    if (unloaded_ncits.indexOf(tmp.c) == -1) {
                        unloaded_ncits.push(tmp.c);
                    }
                }
                if (synonyms.length > 0) {
                    tmp.s = [];
                    synonyms.forEach(s => {
                        tmp.s.push({
                            n: s.termName,
                            t: s.termGroup,
                            src: s.termSource
                        });
                    });
                }
                p.prop.ncit.push(tmp);
            }

            //building typeahead index, need to collect from properties, CDE ID, values, NCIt codes
            //collect properties
            if (p.prop.n in allTerm) {
                // if exist, then check if have the same type
                let t = allTerm[p.prop.n];
                if (t.indexOf('property') === -1) {
                    t.push('property');
                }
            } else {
                let t = [];
                t.push('property');
                allTerm[p.prop.n] = t;
            }

            //collect values
            if (values.length > 0) {
                values.forEach(function (em) {
                    if (em in allTerm) {
                        // if exist, then check if have the same type
                        let t = allTerm[em];
                        if (t.indexOf("value") == -1) {
                            t.push("value");
                        }
                    } else {
                        let t = [];
                        t.push("value");
                        allTerm[em] = t;
                    }
                });
            }

            //collect properties' NCIt codes
            if (p.prop.ncit) {
                let ncits = p.prop.ncit;
                ncits.forEach(n => {
                    let em = n.c.trim().toLowerCase();
                    if (em in allTerm) {
                        //if exist, then check if have the same type
                        let t = allTerm[em];
                        if (t.indexOf("ncit code") == -1) {
                            t.push("ncit code");
                        }
                    } else {
                        let t = [];
                        t.push("ncit code");
                        allTerm[em] = t;
                    }
                });
            }

            //collect values' NCIt codes
            if (ncits.length > 0) {
                ncits.forEach(em => {
                    if (em == undefined || em == '') return;
                    if (em in allTerm) {
                        //if exist, then check if have the same type
                        let t = allTerm[em];
                        if (t.indexOf("ncit code") == -1) {
                            t.push("ncit code");
                        }
                    } else {
                        let t = [];
                        t.push("ncit code");
                        allTerm[em] = t;
                    }
                });
            }

            allProperties.push(p);
        }
    }

    return allProperties 
}

const build_ctdc_new = async (dict) => {

    let build = {};

    let ctdc_mapping = readCTDCMapping();

    let new_ctdc_mapping = await readExcelFile();

    for (let node_name in dict) {

        let properties = dict[node_name].properties;
        
        let mapping_dict = {};
        // check existing icdc_mapping
        if (ctdc_mapping[node_name] && ctdc_mapping[node_name].properties) {
            ctdc_mapping[node_name].properties.forEach(prop => {
                mapping_dict[prop.p_name] = prop;
            });
        }
        
        let n = {};
        let node_lowcase = node_name.toLowerCase();
        if(new_ctdc_mapping[node_lowcase]){
            n.n_n_code = new_ctdc_mapping[node_lowcase].ncit;
            n.n_PT = new_ctdc_mapping[node_lowcase].pt;
            n.properties = [];
        } else {
            n.n_n_code = "";
            n.n_PT = "";
            n.properties = [];
        }
        
        prop_loop:
        for (let prop in properties) { 
            let p = {};
            let prop_lowcase = prop.toLowerCase();

            if(new_ctdc_mapping[prop_lowcase]) {
                p.p_name = prop;
                p.p_n_code = new_ctdc_mapping[prop_lowcase].ncit;
                p.p_PT = new_ctdc_mapping[prop_lowcase].pt;
                p.values = [];
            } else {
                p.p_name = prop;
                p.p_n_code = "";
                p.p_PT = "";
                p.values = [];
            }

            let entryRaw = properties[prop];
            let mappingEntryRaw = mapping_dict[prop];


            if (["string", "number", "integer", "boolean", "TBD", "list", "datetime"].indexOf(entryRaw.type) > -1) {
                //propeties without enums
                //continue prop_loop;
            } else if (Array.isArray(entryRaw.type)) {
                let arr = entryRaw.type;
                if (arr.length === 1 && arr[0].indexOf('http') === 0) {
                    //this is a reference to other http resource
                    //continue prop_loop;
                } else {
                    entryRaw.type.forEach(value => {
                        
                        let v = {};
                        let v_lowcase = value.toLowerCase();

                        if(new_ctdc_mapping[v_lowcase]) {
                            v.v_name = value;
                            v.v_n_code = new_ctdc_mapping[v_lowcase].ncit;
                            v.v_PT = new_ctdc_mapping[v_lowcase].pt;
                        } else {
                            v.v_name = value;
                            v.v_n_code = "";
                            v.v_PT = "";
                        }
                        p.values.push(v);
                    });

                }

            }
            n.properties.push(p);
        };

        build[node_name] = n;
        console.log(node_name);
        console.log(n)
    }

    return build;
}


const readExcelFile = async () => {

    let file_path = path.join(
        __dirname,
        "data_files",
        "CTDC",
        "CTDC_Terminology.xlsx"
      );

    const workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(file_path.replace(/\\/g, "/"));
    let worksheet = workbook.worksheets[0];

    let ctdc_mapping = {}

    worksheet.eachRow(function (row, rowNumber) {
        let item = row.values;
        ctdc_mapping[item[6].toLowerCase()] = {name: item[6], ncit: item[3], pt: item[4]}
    });

    //console.log(ctdc_mapping);
    return (ctdc_mapping);
}

const writeNewMappingFile = async (data) => {

    let output_file_path = path.join(
        __dirname,
        "data_files",
        "CTDC",
        "New_CTDC_Mappings.json"
      );

      fs.writeFileSync(output_file_path, JSON.stringify(data), (err) => {
        if (err) return logger.error(err);
      });

}

const createCTDCDataMapping = async () => {
    const ctdcdata = readCTDCyamlFiles();

    let result = await build_ctdc_new(ctdcdata);

    writeNewMappingFile(result);

    //console.log(result);

    //let ctdc_mapping = readCTDCMapping();

    //let new_ctdc_mapping = readExcelFile();

    //let new_nodes_names = [];
    // result.forEach((v) => {

    //     let node_name = v.node.n;
        
    //     // console.log(new_nodes_names.indexOf(node_name));
    //     //console.log(node_name);
    //     // console.log(icdc_mapping[node_name] === undefined); 
    //     //console.log(icdc_mapping[node_name]); 

    //     if(new_nodes_names.indexOf(node_name) === -1 && ctdc_mapping[node_name] === undefined){
    //         new_nodes_names.push(node_name);
    //         ctdc_mapping[node_name] = {"n_n_code": "", "n_PT": "", "properties": []}
    //         console.log(ctdc_mapping[node_name]);
    //     }
    // })

   //console.log(new_nodes_names);
}




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

const convert2Title = (name) => {
    let tmp = name.split("_");
    let result = [];
    tmp.forEach((term) => {
        let char = term.charAt(0);
        result.push(char.toUpperCase() + term.substring(1));
    });
    return result.join(" ");
};

function test() {
    createCTDCDataMapping();
    // readICDCyamlFiles();

}

test();
