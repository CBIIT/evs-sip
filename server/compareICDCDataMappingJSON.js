const fs = require("fs");
const path = require("path");

const dataFilesDir = path.join(__dirname, "data_files");

const readICDCMapping = () => {
  let content = fs
      .readFileSync(dataFilesDir + "/ICDC/ICDC_Mappings.json")
      .toString();
  content = content.replace(/}{/g, ",");
  return JSON.parse(content);
};


const readNewICDCMapping = () => {
  let content = fs
      .readFileSync(dataFilesDir + "/ICDC/New_ICDC_Mappings.json")
      .toString();
  content = content.replace(/}{/g, ",");
  return JSON.parse(content);
};

const build_icdc_prop = (icdcmapping) => {
  const allProp = {};
  
  for (let key in icdcmapping) {

    if (icdcmapping[key].properties !== undefined && icdcmapping[key].properties.length > 0) {

      icdcmapping[key].properties.forEach(prop => {
        allProp[prop.p_name] = prop
      });
    }
  }

  return allProp;
}


const build_icdc_value = (icdcmapping) => {
  const allValues = {};
  
  for (let key in icdcmapping) {

    if (icdcmapping[key].properties !== undefined && icdcmapping[key].properties.length > 0) {

      icdcmapping[key].properties.forEach(prop => {
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

const compareICDCMapping = () => {
  const icdcmapping = readICDCMapping();
  const newicdcmapping = readNewICDCMapping();


  const output_file_icdc = path.join(__dirname, 'data_files', 'icdc_data_mapping_comp.csv');

  const outputStream = fs.createWriteStream(output_file_icdc, { flags: 'a' });

  outputStream.write("Subset Label, ICDC Term, ICDC New Term, NCIT code, new NCIT code\n");

  const icdc_prop = build_icdc_prop(icdcmapping);

  const new_icdc_prop = build_icdc_prop(newicdcmapping);

  const icdc_value = build_icdc_value(icdcmapping);

  const new_icdc_value = build_icdc_value(newicdcmapping);

  for (let key in newicdcmapping) {
    if(icdcmapping[key] !== undefined){
        //outputStream.write("node," + key + "," + key + "," + icdcmapping[key].n_n_code + "," + newicdcmapping[key].n_n_code + "\n");
        //console.log("node," + key + "," + key + "," + icdcmapping[key].n_n_code + "," + newicdcmapping[key].n_n_code + "\n");
        if(icdcmapping[key].n_n_code !== newicdcmapping[key].n_n_code) {
          //console.log("ICDC Node Terminology," + key + "," + key + "," + icdcmapping[key].n_n_code + "," + newicdcmapping[key].n_n_code + "\n");
          outputStream.write("ICDC Node Terminology," + key + "," + key + "," + icdcmapping[key].n_n_code + "," + newicdcmapping[key].n_n_code + "\n");
        }
    }else {
        //outputStream.write("node, no match," + key + ", ," + newicdcmapping[key].n_n_code + "\n");
        //console.log("ICDC Node Terminology, no match," + key + ", ," + newicdcmapping[key].n_n_code + "\n");
        outputStream.write("ICDC Node Terminology, no match," + key + ", ," + newicdcmapping[key].n_n_code + "\n");
    }
  } //end for loop in content

  for (let key in icdcmapping) {
      if(newicdcmapping[key] === undefined){
        //console.log("ICDC Node Terminology," + key + "no match," + icdcmapping[key].n_n_code + ", \n");
        outputStream.write("ICDC Node Terminology," + key + "no match," + icdcmapping[key].n_n_code + ", \n");
      }
  }


  for (let key in new_icdc_prop) {
    if(icdc_prop[key] !== undefined){
        //outputStream.write("node," + key + "," + key + "," + icdcmapping[key].n_n_code + "," + newicdcmapping[key].n_n_code + "\n");
        //console.log("prop," + key + "," + key + "," + icdc_prop[key].p_n_code + "," + new_icdc_prop[key].p_n_code + "\n");

        if(icdc_prop[key].p_n_code !== new_icdc_prop[key].p_n_code) {
          //console.log("ICDC Property Terminology," + key + "," + key + "," + icdc_prop[key].p_n_code + "," + new_icdc_prop[key].p_n_code + "\n");
          outputStream.write("ICDC Property Terminology," + key + "," + key + "," + icdc_prop[key].p_n_code + "," + new_icdc_prop[key].p_n_code + "\n");
        }
    }else {
        //outputStream.write("node, no match," + key + ", ," + newicdcmapping[key].n_n_code + "\n");
        //console.log(new_icdc_prop[key]);
        //console.log("ICDC Property Terminology, no match," + key + ", ," + new_icdc_prop[key].p_n_code + "\n");
        outputStream.write("ICDC Property Terminology, no match," + key + ", ," + new_icdc_prop[key].p_n_code + "\n");
    }
  } //end for loop in content

  for (let key in icdc_prop) {
      if(new_icdc_prop[key] === undefined){
        //outputStream.write("node," + key + "no match ," + icdcmapping[key].n_n_code + ", \n");
        //console.log("ICDC Property Terminology," + key + ",no match," + icdc_prop[key].p_n_code + ", \n");
        outputStream.write("ICDC Property Terminology," + key + ",no match," + icdc_prop[key].p_n_code + ", \n");
      }
  }


  for (let key in new_icdc_value) {
    if(icdc_value[key] !== undefined){
        //outputStream.write("node," + key + "," + key + "," + icdcmapping[key].n_n_code + "," + newicdcmapping[key].n_n_code + "\n");
        //console.log("prop," + key + "," + key + "," + icdc_prop[key].p_n_code + "," + new_icdc_prop[key].p_n_code + "\n");
        //console.log("Value," + icdc_value[key].v_name  + "," + new_icdc_value[key].v_name  + "," + icdc_value[key].v_n_code + "," + new_icdc_value[key].v_n_code + "\n"); 

        if(icdc_value[key].v_n_code !== new_icdc_value[key].v_n_code) {
          //console.log("ICDC Value Terminology," + icdc_value[key].v_name  + "," + new_icdc_value[key].v_name  + "," + icdc_value[key].v_n_code + "," + new_icdc_value[key].v_n_code + "\n");
          outputStream.write("ICDC Value Terminology,'" + icdc_value[key].v_name  + "','" + new_icdc_value[key].v_name  + "'," + icdc_value[key].v_n_code + "," + new_icdc_value[key].v_n_code + "\n");
        }
    } else {
        //outputStream.write("node, no match," + key + ", ," + newicdcmapping[key].n_n_code + "\n");
        //console.log("ICDC Value Terminology, no match," + new_icdc_value[key].v_name + ", ," + new_icdc_value[key].v_n_code + "\n");
        outputStream.write("ICDC Value Terminology, no match,'" + new_icdc_value[key].v_name + "', ," + new_icdc_value[key].v_n_code + "\n");
    }
  } //end for loop in content

  for (let key in icdc_value) {
      if(new_icdc_value[key] === undefined){
        //outputStream.write("node," + key + "no match ," + icdcmapping[key].n_n_code + ", \n");
        //console.log("ICDC Value Terminology," + icdc_value[key].v_name + ", no match," + icdc_value[key].v_n_code + ", \n");
        outputStream.write("ICDC Value Terminology,'" + icdc_value[key].v_name + "', no match," + icdc_value[key].v_n_code + ", \n");
      }
  }


  //const result = buildCompareCtdcMapping(icdcmapping, newicdcmapping);

  //console.log(result);
  outputStream.end();

}

function test() {
  compareICDCMapping();
  // readICDCyamlFiles();

}

test();
