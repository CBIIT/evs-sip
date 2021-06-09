const baseUrl = "./api/search";
//const baseUrl = "http://localhost:3000/api/search";

export const apiSuggest = async (keyword) => {
  let encoded_keyword = keyword.replace(/\+/g, "%2B").replace(/&/g, "%26");
  const response = await fetch(`${baseUrl}/suggest?keyword=${encoded_keyword}`);
  return response.json();
};

export const apiSearchAll = async (keyword, match, options, dataSources) => {
  const opts = `${match}${options.syns === true ? `,syn,n_syn,p_syn` : ``}${options.desc === true ? `,desc` : ``}`;
  let sources = [];
  for(let key in dataSources){
    if(dataSources[key]){
      sources.push(key);
    }
  }
  let encoded_keyword = keyword.replace(/\+/g, "%2B").replace(/&/g, "%26");
  const response = await fetch(`${baseUrl}/all/p?keyword=${encoded_keyword}&options=${opts}&sources=${sources.join()}`);
  return response.json();
};

export const apiGetGDCDataById = async(id) => {
  const response = await fetch(`${baseUrl}/p/local/vs?id=${id}`);
  return response.json();
};

export const apiGetGDCDictionary = async () => {
  const response = await fetch(`${baseUrl}/graph/gdc`);
  return response.json();
};

export const apiGetICDCDictionary = async () => {
  const response = await fetch(`${baseUrl}/graph/icdc`);
  return response.json();
};

export const apiGetCTDCDictionary = async () => {
  const response = await fetch(`${baseUrl}/graph/ctdc`);
  return response.json();
};

export const apiGetPCDCDictionary = async (project) => {
  let p = project === undefined ? "" : project;
  const response = await fetch(`${baseUrl}/graph/pcdc?project=${p}`);
  return response.json();
};

export const apiGetPropertyValues = async (id) => {
  const response = await fetch(`${baseUrl}/graph/p/vs?id=${id}`);
  return response.json();
};

//Reports API's
export const compareAllWithGDCDictionary = async(type ='all', page='1', pageSize='25', search='') => {
  const response = await fetch(`${baseUrl}/compareAllWithGDCDictionary?type=${type}&page=${page}&pageSize=${pageSize}&searchText=${search}`);
  return response.json();
};

export const exportCompareResult = async(type ='all', search='') => {
  const response = await fetch(`${baseUrl}/exportCompareResult?type=${type}&searchText=${search}`);
  //return response.json();

  return response.blob();
};

export const exportAllCompareResult = async() => {
  const response = await fetch(`${baseUrl}/exportAllCompareResult`);
  //return response.json();

  return response.blob();
};
