const MultiYamlDataRetriever = require('./MultiYamlDataRetriever');

/**
 * DataConnection class
 * 
 * @property {object} _types The types of valid data sources
 */
const DataConnection = class {
  _retriever;
  _types = {
    multiYaml: MultiYamlDataRetriever,
  };

  /**
   * Constructor
   * 
   * @param {object} type The type of data source
   */
  constructor(type) {
    // Check whether type is valid
    if (!this._types[type]) {
      console.log(`Invalid type ${type}. Cannot create DataConnection`);
      return;
    }

    // Make the DataRetriever
    this._retriever = new this._types[type]();
  }

  /**
   * Getter for retriever
   * 
   * @returns object
   */
  get retriever() {
    return this._retriever;
  }
};

module.exports = DataConnection;