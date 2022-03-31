const fs = require("fs");
const path = require("path");
const Excel = require("exceljs");

// const readExcelFile = async () => {

//   let file_path = path.join(
//       __dirname,
//       "data_files",
//       "PCDC",
//       "PCDC_Terminology.xlsx"
//     );

//   const workbook = new Excel.Workbook();
//   await workbook.xlsx.readFile(file_path.replace(/\\/g, "/"));
//   let worksheet = workbook.worksheets[0];

//   //let id = '';
//   let prop = '';
//   //let data = {}
//   let data = [];
//   worksheet.eachRow(function (row, rowNumber) {
//       let item = row.values;
//       let project = item[1];
//       //let lowerNode = item[3].replace(" Table", "").replace(/ /g, "_").toLowerCase();
//       let node = item[3];
//       let pt = item[7];
//       let ncit = item[4];
//       if(item[14] === 'code'){
//         //id = project + "/" + lowerNode + "/" + prop;
//         prop = item[7];
//         //data[id] = {pj: project, n: node, p: prop, v: []};
//       }
//       if(item[14] === ''){
//         //data[id].v.push(pt);
//         data.push({pj: project, n: node, p: prop, v: pt, nt: ncit})
//       }
//   });

//   return (data);
// }


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
  let prop = '';
  let data = {}
  //let data = [];
  worksheet.eachRow(function (row, rowNumber) {
      let item = row.values;
      let project = item[1];
      let lowerNode = item[3].replace(" Table", "").replace(/ /g, "_").toLowerCase();
      let node = item[3];
      let pt = item[7];
      let ncit = item[4];
      if(item[14] === 'code'){
        id = project + "/" + lowerNode + "/" + prop;
        prop = item[7];
        data[id] = {pj: project, n: node, p: prop, v: []};
      }
      if(item[14] === ''){
        data[id].v.push({n: pt, nt: ncit});
        //data.push({pj: project, n: node, p: prop, v: pt, nt: ncit})
      }
  });

  return (data);
}

const repeatedProp = (data) => {
  let props = [];
  let propsConflict = [];
  let result = {}

  for(let key in data){
    let prop = data[key].p;
    if (props.indexOf(prop) === -1) {
      props.push(prop);
    } else {
      if (propsConflict.indexOf(prop) === -1) {
        propsConflict.push(prop);
        //result[key] = data[key];
      }
    }
  }

  for(let key in data){
    let prop = data[key].p;
    if(propsConflict.indexOf(prop) !== -1){
      result[key] = data[key];
    }
  }

  return (result);
}


const readPCDCMapping = async () => {
  let pcdcData = await readExcelFile();

  let newPcdcData = repeatedProp(pcdcData);


  const output_file_pcdc = path.join(__dirname, 'data_files', 'pcdc_data_prop.csv');

  const outputStream = fs.createWriteStream(output_file_pcdc, { flags: 'a' });

  outputStream.write("Project, Node, Property, Value, NCIT code\n");


  for (let key in newPcdcData) {
    //outputStream.write("CTDC Node Terminology," + key + "no match," + ctdcmapping[key].n_n_code + ", \n");
    newPcdcData[key].v.forEach( value => {
      outputStream.write( newPcdcData[key].pj + "," + newPcdcData[key].n  + "," + newPcdcData[key].p  + ",'" +  value.n  + "'," + value.nt + "\n");
      //console.log( newPcdcData[key].pj + "," + newPcdcData[key].n  + "," + newPcdcData[key].p  + ",'" +  value.n  + "'," + value.nt + "\n");
    });
    //outputStream.write( newPcdcData[key].pj + "," + data.n  + "," + data.p  + "," +  data.v  + "," + data.nt + "\n");
  }

  //outputStream.end();
}

function test() {
  readPCDCMapping();
}

test();
