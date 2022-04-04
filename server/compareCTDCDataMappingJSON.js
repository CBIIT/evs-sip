const fs = require("fs");
const path = require("path");

const dataFilesDir = path.join(__dirname, "data_files");

const readICDCMapping = () => {
  let content = fs
      .readFileSync(dataFilesDir + "/CTDC/CTDC_Mappings.json")
      .toString();
  content = content.replace(/}{/g, ",");
  return JSON.parse(content);
};


const readNewICDCMapping = () => {
  let content = fs
      .readFileSync(dataFilesDir + "/CTDC/New_CTDC_Mappings.json")
      .toString();
  content = content.replace(/}{/g, ",");
  return JSON.parse(content);
};

const build_ctdc_prop = (ctdcmapping) => {
  const allProp = {};
  
  for (let key in ctdcmapping) {

    if (ctdcmapping[key].properties !== undefined && ctdcmapping[key].properties.length > 0) {

      ctdcmapping[key].properties.forEach(prop => {
        allProp[prop.p_name] = prop
      });
    }
  }

  return allProp;
}


const build_ctdc_value = (ctdcmapping) => {
  const allValues = {};
  
  for (let key in ctdcmapping) {

    if (ctdcmapping[key].properties !== undefined && ctdcmapping[key].properties.length > 0) {

      ctdcmapping[key].properties.forEach(prop => {
        //allProp[prop.p_name] = prop

        if (prop.values !== undefined && prop.values.length > 0) {

          prop.values.forEach(value => {

            let v_lowcase = value.v_name.toLowerCase();
            allValues[v_lowcase] = value;
          });
        }
      });
    }
  }

  return allValues;
}

const compareCTDCMapping = () => {
  const ctdcmapping = readICDCMapping();
  const newctdcmapping = readNewICDCMapping();


  const output_file_ctdc = path.join(__dirname, 'data_files', 'ctdc_data_mapping_comp.csv');

  const outputStream = fs.createWriteStream(output_file_ctdc, { flags: 'a' });

  outputStream.write("Subset Label, CTDC Term, CTDC New Term, NCIT code, new NCIT code\n");

  const ctdc_prop = build_ctdc_prop(ctdcmapping);

  const new_ctdc_prop = build_ctdc_prop(newctdcmapping);

  const ctdc_value = build_ctdc_value(ctdcmapping);

  const new_ctdc_value = build_ctdc_value(newctdcmapping);

  for (let key in newctdcmapping) {
    if(ctdcmapping[key] !== undefined){
        //outputStream.write("node," + key + "," + key + "," + ctdcmapping[key].n_n_code + "," + newctdcmapping[key].n_n_code + "\n");
        //console.log("node," + key + "," + key + "," + ctdcmapping[key].n_n_code + "," + newctdcmapping[key].n_n_code + "\n");
        if(ctdcmapping[key].n_n_code !== newctdcmapping[key].n_n_code) {
          //console.log("CTDC Node Terminology," + key + "," + key + "," + ctdcmapping[key].n_n_code + "," + newctdcmapping[key].n_n_code + "\n");
          outputStream.write("CTDC Node Terminology," + key + "," + key + "," + ctdcmapping[key].n_n_code + "," + newctdcmapping[key].n_n_code + "\n");
        }
    }else {
        //outputStream.write("node, no match," + key + ", ," + newctdcmapping[key].n_n_code + "\n");
        //console.log("CTDC Node Terminology, no match," + key + ", ," + newctdcmapping[key].n_n_code + "\n");
        outputStream.write("CTDC Node Terminology, no match," + key + ", ," + newctdcmapping[key].n_n_code + "\n");
    }
  } //end for loop in content

  for (let key in ctdcmapping) {
      if(newctdcmapping[key] === undefined){
        //console.log("CTDC Node Terminology," + key + "no match," + ctdcmapping[key].n_n_code + ", \n");
        outputStream.write("CTDC Node Terminology," + key + "no match," + ctdcmapping[key].n_n_code + ", \n");
      }
  }


  for (let key in new_ctdc_prop) {
    if(ctdc_prop[key] !== undefined){
        //outputStream.write("node," + key + "," + key + "," + ctdcmapping[key].n_n_code + "," + newctdcmapping[key].n_n_code + "\n");
        //console.log("prop," + key + "," + key + "," + ctdc_prop[key].p_n_code + "," + new_ctdc_prop[key].p_n_code + "\n");

        if(ctdc_prop[key].p_n_code !== new_ctdc_prop[key].p_n_code) {
          //console.log("CTDC Property Terminology," + key + "," + key + "," + ctdc_prop[key].p_n_code + "," + new_ctdc_prop[key].p_n_code + "\n");
          outputStream.write("CTDC Property Terminology," + key + "," + key + "," + ctdc_prop[key].p_n_code + "," + new_ctdc_prop[key].p_n_code + "\n");
        }
    }else {
        //outputStream.write("node, no match," + key + ", ," + newctdcmapping[key].n_n_code + "\n");
        //console.log("CTDC Property Terminology, no match," + key + ", ," + new_ctdc_prop[key].p_n_code + "\n");
        outputStream.write("CTDC Property Terminology, no match," + key + ", ," + new_ctdc_prop[key].p_n_code + "\n");
    }
  } //end for loop in content

  for (let key in ctdc_prop) {
      if(new_ctdc_prop[key] === undefined){
        //outputStream.write("node," + key + "no match ," + ctdcmapping[key].n_n_code + ", \n");
        //console.log("CTDC Property Terminology," + key + "no match," + ctdc_prop[key].p_n_code + ", \n");
        outputStream.write("CTDC Property Terminology," + key + "no match," + ctdc_prop[key].p_n_code + ", \n");
      }
  }


  for (let key in new_ctdc_value) {
    if(ctdc_value[key] !== undefined){
        //outputStream.write("node," + key + "," + key + "," + ctdcmapping[key].n_n_code + "," + newctdcmapping[key].n_n_code + "\n");
        //console.log("prop," + key + "," + key + "," + ctdc_prop[key].p_n_code + "," + new_ctdc_prop[key].p_n_code + "\n");
        //console.log("Value," + ctdc_value[key].v_name  + "," + new_ctdc_value[key].v_name  + "," + ctdc_value[key].v_n_code + "," + new_ctdc_value[key].v_n_code + "\n"); 

        if(ctdc_value[key].v_n_code !== new_ctdc_value[key].v_n_code) {
          //console.log("CTDC Value Terminology," + ctdc_value[key].v_name  + "," + new_ctdc_value[key].v_name  + "," + ctdc_value[key].v_n_code + "," + new_ctdc_value[key].v_n_code + "\n");
          outputStream.write("CTDC Value Terminology," + ctdc_value[key].v_name  + "," + new_ctdc_value[key].v_name  + "," + ctdc_value[key].v_n_code + "," + new_ctdc_value[key].v_n_code + "\n");
        }
    } else {
        //outputStream.write("node, no match," + key + ", ," + newctdcmapping[key].n_n_code + "\n");
        //console.log("CTDC Value Terminology, no match," + new_ctdc_value[key].v_name + ", ," + new_ctdc_value[key].v_n_code + "\n");
        outputStream.write("CTDC Value Terminology, no match," + new_ctdc_value[key].v_name + ", ," + new_ctdc_value[key].v_n_code + "\n");
    }
  } //end for loop in content

  for (let key in ctdc_value) {
      if(new_ctdc_value[key] === undefined){
        //outputStream.write("node," + key + "no match ," + ctdcmapping[key].n_n_code + ", \n");
        //console.log("CTDC Value Terminology," + ctdc_value[key].v_name + ", no match," + ctdc_value[key].v_n_code + ", \n");
        outputStream.write("CTDC Value Terminology," + ctdc_value[key].v_name + ", no match," + ctdc_value[key].v_n_code + ", \n");
      }
  }


  //const result = buildCompareCtdcMapping(ctdcmapping, newctdcmapping);

  //console.log(result);
  outputStream.end();

}

function test() {
  compareCTDCMapping();
  // readICDCyamlFiles();

}

test();
