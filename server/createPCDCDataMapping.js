const fs = require("fs");
const path = require("path");
const Excel = require("exceljs");
const logger = require('./components/logger');


const readExcelFile = async () => {

  let file_path = path.join(
      __dirname,
      "data_files",
      "PCDC",
      "PCDC_Terminology.xlsx"
    );

  const workbook = new Excel.Workbook();
  await workbook.xlsx.readFile(file_path.replace(/\\/g, "/"));
  let worksheet = workbook.worksheets[0];

  let id = '';
  let data = {}

  worksheet.eachRow(function (row, rowNumber) {
      let item = row.values;
      let project = item[1];
      let lowerNode = item[3].replace(" Table", "").replace(/[^a-zA-Z0-9_]/g, "_").toLowerCase();
      let node = item[3];
      let node_nc = item[2];
      let pt = item[7];
      let p_desc = item[9];
      let ncit = item[4];
      let p_type = item[14];
      if(p_type === 'code' || p_type === 'string' || p_type === 'number'){
        id = project + "/" + lowerNode + "/" + pt;
        data[id] = {
          pj: project,
          n: node,
          nc: node_nc,
          p: pt,
          pc: ncit,
          pd: p_desc,
          pt: p_type === 'code' ? 'enum': p_type,
          v: []};
      }
      if(p_type === ''){
        data[id].v.push({n: pt, nt: ncit});
      }
  });
  //console.log(data);

  return (data);
}

const build_pcdc = (data) => {

  let result = {};
  for(let key in data){
    let project = data[key].pj;
    let lowerNode = data[key].n.replace(" Table", "").replace(/[^a-zA-Z0-9_]/g, "_").toLowerCase();
    console.log(lowerNode);
    if(result[project] === undefined){
      result[project] = {};
      if(result[project][lowerNode] === undefined){

        let n = {};
        n.n_n_code = data[key].nc;
        n.n_PT = data[key].n;
        n.properties = [];

        result[project][lowerNode] = n;
      }
    } else {
      let n = {};
      n.n_n_code = data[key].nc;
      n.n_PT = data[key].n;
      n.properties = [];

      result[project][lowerNode] = n;
    }
  }

  for (let key in data) {
    let project = data[key].pj;
    let lowerNode = data[key].n.replace(" Table", "").replace(/ /g, "_").replace(/ /g, "_").toLowerCase();
    let values = [];
    data[key].v.forEach((v) => {
      values.push({
        "v_name": v.n,
        "v_n_code": v.nt,
        "v_PT": ""
      })
    })
    let p = {
      "p_name": data[key].p,
      "p_n_code": data[key].pc,
      "p_desc": data[key].pd,
      "p_type": data[key].pt,
      "values": values
    }
    result[project][lowerNode].properties.push(p)
  }

  return(result);
};


const writeNewMappingFile = async (data) => {

  let output_file_path = path.join(
      __dirname,
      "data_files",
      "PCDC",
      "new-pcdc-model-all.json"
    );

    fs.writeFileSync(output_file_path, JSON.stringify(data, null, 2), (err) => {
      if (err) return logger.error(err);
    });

}


const readPCDCMapping = async () => {
  let pcdcData = await readExcelFile();

  let result = build_pcdc(pcdcData);

  writeNewMappingFile(result);
}

function test() {
  readPCDCMapping();
}

test();
