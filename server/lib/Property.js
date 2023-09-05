/**
 * Models a node's property
 * TODO describe _termDef
 * 
 * @property {string} _description A description of the property
 * @property {object} _enumDef Definitions of the property's values
 * @property {string} _name The property's name
 * @property {object} _termDef Idk
 * @property {string} _type The property's type
 * @property {string[]} _values The values that the property can have
 * @property {object} json Implemented by a getter
 * @property {object} graphJson Implemented by a getter
 * @method _determineType
 */
const Property = class {
  _description;
  _enumDef;
  _name;
  _termDef;
  _type;
  _values;

  /**
   * Constructor
   * 
   * @param {object} schema The JSON read from the property's YAML file
   */
  constructor(schema) {
    this._description = schema.description;
    this._enumDef = schema.enumDef;
    this._name = schema.name;
    this._termDef = schema.termDef;

    // Set the property's type
    this._determineType(schema);
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
        if (schema.deprecated_enum) {
          this._values = schema.enum.filter(value => !schema.deprecated_enum.includes(value));
        }
        this._values = this._values.map(item => String(item).replace(/\n/g, ' '));
      } else if (schema.hasOwnProperty('oneOf')) {
        const types = [];

        // Gather the possible types
        schema.oneOf.forEach(e => {
          // Skip elements that don't specify a type
          if (!e.hasOwnProperty('type')) {
            return;
          }

          types.push(e.type);
        });

        types.sort();
        this._type = types.reduce((finalType, currType) => {
          return `${finalType} | ${currType}`;
        });
      } else {
        // TODO handle other cases
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
   * 
   * @returns object
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

  /**
   * The property's JSON representation for graph use
   * 
   * @returns object
   */
  get graphJson() {
    const json = {
      description: this._description,
      enum: this._values,
      enumDef: this._enumDef,
      termDef: this._termDef,
      type: this._type,
    }

    return json;
  }
};

module.exports = Property;
