import Entity from "./entity";

/**
 * Sensor entity states.
 *
 * @type {{UNAVAILABLE: string, UNKNOWN: string, ON: string}}
 */
export const STATES = {
  UNAVAILABLE: "UNAVAILABLE",
  UNKNOWN: "UNKNOWN",
  ON: "ON"
};

/**
 * Sensor entity features.
 *
 * @type {{}}
 */
export const FEATURES = {};

/**
 * Sensor entity attributes.
 *
 * @type {{UNIT: string, STATE: string, VALUE: string}}
 */
export const ATTRIBUTES = {
  STATE: "state",
  VALUE: "value",
  UNIT: "unit"
};

/**
 * Sensor entity commands.
 *
 * @type {{}}
 */
export const COMMANDS = {};

/**
 * Sensor entity device classes.
 *
 * @type {{BATTERY: string, ENERGY: string, VOLTAGE: string, HUMIDITY: string, TEMPERATURE: string, CUSTOM: string, POWER: string, CURRENT: string}}
 */
export const DEVICECLASSES = {
  CUSTOM: "custom",
  BATTERY: "battery",
  CURRENT: "current",
  ENERGY: "energy",
  HUMIDITY: "humidity",
  POWER: "power",
  TEMPERATURE: "temperature",
  VOLTAGE: "voltage"
};

/**
 * Sensor entity options.
 *
 * @type {{CUSTOM_UNIT: string, DECIMALS: string, NATIVE_UNIT: string, MAX_VALUE: string, MIN_VALUE: string}}
 */
export const OPTIONS = {
  CUSTOM_UNIT: "custom_unit",
  NATIVE_UNIT: "native_unit",
  DECIMALS: "decimals",
  MIN_VALUE: "min_value",
  MAX_VALUE: "max_value"
};

/**
 * See {@link https://github.com/unfoldedcircle/core-api/blob/main/doc/entities/entity_sensor.md sensor entity documentation}
 * for more information.
 */
export default class Sensor extends Entity {
  /**
   * Constructs a new sensor entity.
   *
   * @param {string} id The entity identifier. Must be unique inside the integration driver.
   * @param {string|Map} name The human-readable name of the entity. Either a string, which will be mapped to english, or a Map containing multiple language strings.
   * @param {string[]} features Optional entity features.
   * @param {Map} attributes Optional entity attribute Map holding the current state.
   * @param {string} deviceClass Optional device class.
   * @param {object} options Further options. See entity documentation.
   * @param {string} area Optional area or room.
   */
  constructor(id, name, features, attributes, deviceClass = undefined, options = null, area = undefined) {
    super(id, name, Entity.TYPES.SENSOR, features, attributes, deviceClass, options, area);

    console.debug(`Sensor entity created with id: ${this.id}`);
  }
}
