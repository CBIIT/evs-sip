const cache = require("../../components/cache");
const config = require("../../config");

/**
 * DataRetriever abstract class
 * 
 * @property {object} _source The details of the data source
 */
const DataRetriever = class {
  _source = {};

  /**
   * Constructor
   * 
   * @param {object} _source The details of the data source
   */
  constructor(source) {
    this._source = source;
  }

  /**
   * Retrieves data
   * 
   * @param {object} filters A mapping of filters
   * 
   * @returns object[]
   */
  get = async (filters) => {
    const category = filters.category;
    const dict = this._source.dict;
    const node = filters.node;
    const prop = filters.prop;
    const cacheVarName = [dict, category, node, prop].filter(Boolean).join('-');
    let results = cache.getValue(cacheVarName);

    // No cached results, so get new results
    if (results === undefined) {
      console.log(`Generating ${dict} Dictionary Data...`);
      results = await this.retrieve(filters);
      cache.setValue(cacheVarName, results, config.item_ttl);
      console.log(`Cached ${Object.keys(results).length} results as ${cacheVarName}.`);
    } else {
      console.log(`Found ${Object.keys(results).length} results cached as ${cacheVarName}.`);
    }

    return results;
  };

  /**
   * To be implemented by subclass
   * 
   * @param {object} filters A mapping of filters
   * 
   * @returns object[]
   */
  retrieve = async (filters) => {
    console.log('Should be implemented by subclass');
  };
};

module.exports = DataRetriever;
