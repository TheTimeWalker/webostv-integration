import { DEVICE_STATES, EVENTS, STATUS_CODES } from "./lib/api_definitions";
import uc from "./ucLib";
import { TV } from "webos-tv/lib/webos-tv";
import MediaPlayer, { ATTRIBUTES, COMMANDS, DEVICECLASSES, FEATURES, STATES } from "./lib/entities/media_player";
import fs from "fs";
import { PointerInputSocket } from "webos-tv/lib/sockets";

let checkDelay = 10000;
let tv: TV;
let tvPointer: PointerInputSocket;
let auth = { ip: "", mac: "", token: "", deviceId: "" };

const connectTv = async () => {
  try {
    console.log("connecting to tv");
    await tv.authenticate(auth.token);
    console.log("authenticated");
    uc.configuredEntities.updateEntityAttributes(auth.deviceId, new Map([[ATTRIBUTES.STATE, STATES.ON]]));
    const sw = await tv.getCurrentSWInformation();
    tv.connection.addEventListener("close", () => {
      uc.configuredEntities.updateEntityAttributes(auth.deviceId, new Map([[ATTRIBUTES.STATE, STATES.OFF]]));
    });
    tv.connection.addEventListener("message", ({ data }) => {
      const { id, payload = {} } = JSON.parse(data.toString());
      console.log(id, payload);
    });
    console.log(sw);
    tvPointer = await tv.getPointerInputSocket();
  } catch (err) {
    console.log(err);
    setTimeout(() => connectTv(), checkDelay);
    uc.configuredEntities.updateEntityAttributes(auth.deviceId, new Map([[ATTRIBUTES.STATE, STATES.OFF]]));
  }
};

try {
  const rawAuth = fs.readFileSync("auth.json", "utf8");
  auth = JSON.parse(rawAuth);
  tv = new TV(auth.ip);
  console.log(auth);
  connectTv();
} catch (err) {
  console.log(err);
}

uc.init(__dirname + "/webos-driver.json");

uc.on(EVENTS.CONNECT, async () => {
  await uc.setDeviceState(DEVICE_STATES.CONNECTED);
});

uc.on(EVENTS.DISCONNECT, async () => {
  await uc.setDeviceState(DEVICE_STATES.DISCONNECTED);
});

uc.on(EVENTS.SUBSCRIBE_ENTITIES, async (entityIds: string[]) => {
  // the integration will configure entities and subscribe for entity update events
  // the UC library automatically adds the subscribed entities
  // from available to configured
  // you can act on this event if you need for your device handling
  entityIds.forEach((entityId) => {
    console.log(`Subscribed entity: ${entityId}`);
  });
});

uc.on(EVENTS.UNSUBSCRIBE_ENTITIES, async (entityIds: string[]) => {
  // when the integration unsubscribed from certain entity updates,
  // the UC library automatically remove the unsubscribed entities
  // from configured
  // you can act on this event if you need for your device handling
  entityIds.forEach((entityId) => {
    console.log(`Unsubscribed entity: ${entityId}`);
  });
});

uc.on(EVENTS.SETUP_DRIVER, async (wsHandle, setupData: { address: string; mac: string }) => {
  console.log("Setting up driver. Setup data: " + JSON.stringify(setupData));
  await uc.acknowledgeCommand(wsHandle);

  const tv = new TV(setupData.address);
  const token = await tv.authenticate();
  console.log("got token", token);
  const sw = await tv.getCurrentSWInformation();
  const volume = await tv.getVolume();

  const data = JSON.stringify({
    ip: setupData.address,
    mac: setupData.mac,
    token: token,
    deviceId: sw.device_id
  });
  fs.writeFileSync("auth.json", data);

  // implement interactive setup flow, this is just a simulated example
  // ...
  const webOsTvEntity = new MediaPlayer(
    sw.device_id,
    sw.product_name,
    [
      FEATURES.ON_OFF,
      FEATURES.VOLUME_UP_DOWN,
      FEATURES.MUTE,
      FEATURES.UNMUTE,
      FEATURES.MENU,
      FEATURES.HOME,
      FEATURES.DPAD,
      FEATURES.SOURCE
    ],
    // @ts-ignore
    new Map([
      [ATTRIBUTES.STATE, STATES.ON],
      [ATTRIBUTES.VOLUME, volume.volume || 0],
      [ATTRIBUTES.MUTED, volume.muted]
    ]),
    DEVICECLASSES.TV
  );

  // add entity as available
  // this is important, so the core knows what entities are available
  uc.availableEntities.addEntity(webOsTvEntity);

  console.log("Driver setup completed!");
  await uc.driverSetupComplete(wsHandle);
});

uc.on(EVENTS.SETUP_DRIVER_USER_DATA, async (wsHandle, userData: { address: string; mac: string }) => {
  console.log("Received user input for driver setup: " + JSON.stringify(userData));
  await uc.acknowledgeCommand(wsHandle);

  const tv = new TV(userData.address);
  const token = await tv.authenticate();
  console.log("got token", token);
  const sw = await tv.getCurrentSWInformation();
  const volume = await tv.getVolume();

  const data = JSON.stringify({
    ip: userData.address,
    mac: userData.mac,
    token: token,
    deviceId: sw.device_id
  });
  fs.writeFileSync("auth.json", data);

  // implement interactive setup flow, this is just a simulated example
  // ...
  const webOsTvEntity = new MediaPlayer(
    sw.device_id,
    sw.product_name,
    [
      FEATURES.ON_OFF,
      FEATURES.VOLUME_UP_DOWN,
      FEATURES.MUTE,
      FEATURES.UNMUTE,
      FEATURES.MENU,
      FEATURES.HOME,
      FEATURES.DPAD,
      FEATURES.SOURCE
    ],
    // @ts-ignore
    new Map([
      [ATTRIBUTES.STATE, STATES.ON],
      [ATTRIBUTES.VOLUME, volume.volume || 0],
      [ATTRIBUTES.MUTED, volume.muted]
    ]),
    DEVICECLASSES.TV
  );

  // add entity as available
  // this is important, so the core knows what entities are available
  uc.availableEntities.addEntity(webOsTvEntity);

  console.log("Driver setup completed!");
  await uc.driverSetupComplete(wsHandle);
});

// when a command request arrives from the core, handle the command
// in this example we just update the entity, but in reality, you'd turn on the light with your integration
// and handle the events separately for updating the configured entities
uc.on(EVENTS.ENTITY_COMMAND, async (wsHandle, entityId, entityType, cmdId, params) => {
  console.log(`ENTITY COMMAND: ${entityId} ${entityType} ${cmdId} ${params ? JSON.stringify(params) : ""}`);

  // get the entity from the configured ones
  const entity = uc.configuredEntities.getEntity(entityId);
  if (entity == null) {
    console.log("Entity not found");
    await uc.acknowledgeCommand(wsHandle, STATUS_CODES.NOT_FOUND);
    return;
  }

  try {
    switch (cmdId) {
      case COMMANDS.ON:
        await TV.turnOn(auth.ip, auth.mac);
        checkDelay = 1000;
        uc.configuredEntities.updateEntityAttributes(entity.id, new Map([[ATTRIBUTES.STATE, STATES.ON]]));
        break;
      case COMMANDS.OFF:
        await tv.turnOff();
        checkDelay = 10000;
        setTimeout(() => connectTv(), checkDelay);
        uc.configuredEntities.updateEntityAttributes(entity.id, new Map([[ATTRIBUTES.STATE, STATES.OFF]]));
        break;
      case COMMANDS.MUTE_TOGGLE: {
        const muted = await tv.toggleMute();
        uc.configuredEntities.updateEntityAttributes(entity.id, new Map([[ATTRIBUTES.MUTED, muted]]));
        break;
      }
      case COMMANDS.MUTE:
        await tv.mute();
        uc.configuredEntities.updateEntityAttributes(entity.id, new Map([[ATTRIBUTES.MUTED, true]]));
        break;
      case COMMANDS.UNMUTE:
        await tv.unmute();
        uc.configuredEntities.updateEntityAttributes(entity.id, new Map([[ATTRIBUTES.MUTED, false]]));
        break;
      case COMMANDS.CURSOR_LEFT:
        tvPointer.press("LEFT");
        break;
      case COMMANDS.CURSOR_UP:
        tvPointer.press("UP");
        break;
      case COMMANDS.CURSOR_RIGHT:
        tvPointer.press("RIGHT");
        break;
      case COMMANDS.CURSOR_DOWN:
        tvPointer.press("DOWN");
        break;
      case COMMANDS.CURSOR_ENTER:
        tvPointer.press("ENTER");
        break;
      case COMMANDS.VOLUME_UP: {
        const volume = await tv.volumeUp();
        uc.configuredEntities.updateEntityAttributes(entity.id, new Map([[ATTRIBUTES.VOLUME, volume.volume]]));
        break;
      }
      case COMMANDS.VOLUME_DOWN: {
        const volume = await tv.volumeDown();
        uc.configuredEntities.updateEntityAttributes(entity.id, new Map([[ATTRIBUTES.VOLUME, volume.volume]]));
        break;
      }
      case COMMANDS.MENU:
        tvPointer.press("MENU");
        break;
      default:
        await uc.acknowledgeCommand(wsHandle, 404);
        return;
    }
    await uc.acknowledgeCommand(wsHandle);
  } catch (err) {
    console.log(err);
    await uc.acknowledgeCommand(wsHandle, 500);
  }
});
