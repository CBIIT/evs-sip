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
  get = (filters) => {
    console.log('Should be implemented by subclass');
  }
};

module.exports = DataRetriever;
