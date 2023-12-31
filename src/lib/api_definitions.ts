export const DEVICE_STATES = {
  CONNECTED: "CONNECTED",
  CONNECTING: "CONNECTING",
  DISCONNECTED: "DISCONNECTED",
  ERROR: "ERROR"
};

export const STATUS_CODES = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
};

/**
 * WebSocket integration API request / response messages.
 *
 * @type {Readonly<{GET_ENTITY_STATES: string, SUBSCRIBE_EVENTS: string, GET_DEVICE_STATE: string, AUTHENTICATION: string, GET_AVAILABLE_ENTITIES: string, GET_DRIVER_VERSION: string, UNSUBSCRIBE_EVENTS: string, ENTITY_COMMAND: string, SETUP_DRIVER: string, GET_DRIVER_METADATA: string, SET_DRIVER_USER_DATA: string}>}
 */
export const MESSAGES = Object.freeze({
  AUTHENTICATION: "authentication",
  GET_DRIVER_VERSION: "get_driver_version",
  GET_DEVICE_STATE: "get_device_state",
  GET_AVAILABLE_ENTITIES: "get_available_entities",
  GET_ENTITY_STATES: "get_entity_states",
  SUBSCRIBE_EVENTS: "subscribe_events",
  UNSUBSCRIBE_EVENTS: "unsubscribe_events",
  ENTITY_COMMAND: "entity_command",
  GET_DRIVER_METADATA: "get_driver_metadata",
  SETUP_DRIVER: "setup_driver",
  SET_DRIVER_USER_DATA: "set_driver_user_data"
});

/**
 * WebSocket integration API event messages.
 *
 * @type {Readonly<{ENTER_STANDBY: string, EXIT_STANDBY: string, ABORT_DRIVER_SETUP: string, DRIVER_VERSION: string, ENTITY_STATES: string, DRIVER_METADATA: string, ENTITY_CHANGE: string, DRIVER_SETUP_CHANGE: string, AVAILABLE_ENTITIES: string, CONNECT: string, DISCONNECT: string, DEVICE_STATE: string}>}
 */
export const MSG_EVENTS = Object.freeze({
  CONNECT: "connect",
  DISCONNECT: "disconnect",
  ENTER_STANDBY: "enter_standby",
  EXIT_STANDBY: "exit_standby",
  DRIVER_VERSION: "driver_version",
  DEVICE_STATE: "device_state",
  AVAILABLE_ENTITIES: "available_entities",
  ENTITY_STATES: "entity_states",
  ENTITY_CHANGE: "entity_change",
  DRIVER_METADATA: "driver_metadata",
  DRIVER_SETUP_CHANGE: "driver_setup_change",
  ABORT_DRIVER_SETUP: "abort_driver_setup"
});

/**
 * Library events.
 *
 * @type {Readonly<{SETUP_DRIVER_ABORT: symbol, ENTITY_ATTRIBUTES_UPDATED: symbol, ENTITY_COMMAND: symbol, SETUP_DRIVER: symbol, SUBSCRIBE_ENTITIES: symbol, SETUP_DRIVER_USER_DATA: symbol, CONNECT: symbol, UNSUBSCRIBE_ENTITIES: symbol, SETUP_DRIVER_USER_CONFIRMATION: symbol, DISCONNECT: symbol,  ENTER_STANDBY: symbol,  EXIT_STANDBY: symbol}>}
 */
export const EVENTS = Object.freeze({
  ENTITY_COMMAND: Symbol("entity_command"),
  ENTITY_ATTRIBUTES_UPDATED: Symbol("entity_attributes_updated"),
  SUBSCRIBE_ENTITIES: Symbol("subscribe_entities"),
  UNSUBSCRIBE_ENTITIES: Symbol("unsubscribe_entities"),
  SETUP_DRIVER: Symbol("setup_driver"),
  SETUP_DRIVER_USER_DATA: Symbol("setup_driver_user_data"),
  SETUP_DRIVER_USER_CONFIRMATION: Symbol("setup_driver_user_confirmation"),
  SETUP_DRIVER_ABORT: Symbol("setup_driver_abort"),
  CONNECT: Symbol("connect"),
  DISCONNECT: Symbol("disconnect"),
  ENTER_STANDBY: Symbol("enter_standby"),
  EXIT_STANDBY: Symbol("exit_standby")
});

export const EVENT_CATEGORY = Object.freeze({
  DEVICE: "DEVICE",
  ENTITY: "ENTITY"
});
