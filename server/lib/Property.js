/**
 * Models a node's property
 * 
 * @property {string} _description A description of the property
 * @property {string} _name The property's name
 * @property {string} _type The property's type
 * @property {string[]} _values The values that the property can have
 * @method _determineType
 */
const Property = class {
  _description;
  _name;
  _type;
  _values;

  /**
   * Constructor
   * 
   * @param {object} schema The JSON read from the property's YAML file
   */
  constructor(schema) {
    this._determineType(schema);
    this._name = schema.name;
    this._description = schema.description;
  }

  /**
   * Figures out what type the property should be and sets it
   * 
   * @param {object} schema The JSON from the property's YAML
   */
  _determineType = (schema) => {
    if (!schema.type) {
      if (schema.hasOwnProperty('enum')) {
        this._type = 'enum';
        this._values = schema.enum;
      } else {
        // TODO handle things like oneOf
      }
    } else { // Type is explicitly specified
      if (schema.type === 'array') { // Handle arrays
        // Obtain list of permissible values, if it exists
        if (schema.hasOwnProperty('items')) {
          this._values = schema.items.enum;
        } else {
          this._values = [];
        }
      }

      this._type = schema.type;
    }
  };

  /**
   * The property's JSON representation
   */
  get json() {
    const json = {
      property_name: this._name,
      property_description: this._description,
      type: this._type,
      values: this._values,
    };

    return json;
  }
};

module.exports = Property;
