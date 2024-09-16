import { makeDrone } from "../entities/enemyDrone.js";
import { makePlayer } from "../entities/player.js";
import { setBackgroundColor, setCameraControls, setCameraZones, setMapColliders } from "./roomUtils.js";
import { state } from "../state/globalStateManager.js";
import { makeBoss } from "../entities/enemyBoss.js";
import { makeCartridge } from "../entities/healthCartridge.js";
import { healthBar } from "../ui/healthBar.js";


export function room1(k, roomData) {
  setBackgroundColor(k, "#a2aed5");

  k.camScale(4);
  k.camPos(170, 100);
  k.setGravity(1000);

  const roomLayers = roomData.layers;

  const map = k.add([k.pos(0, 0), k.sprite("room1")]);
  const colliders = [];
  const positions = [];
  const cameras = [];

  for (const layer of roomLayers) {
    if (layer.name === "cameras") {
      cameras.push(...layer.objects);
    }


    if (layer.name === "positions") {
      positions.push(...layer.objects);
      continue;
    }

    if (layer.name === "colliders") {
      colliders.push(...layer.objects);
    }
  }

  setMapColliders(k, map, colliders);
  setCameraZones(k, map, cameras);

  const player = map.add(makePlayer(k));
  setCameraControls(k, player, map, roomData);

  for (const position of positions) {
    if (position.name === "player") {
      player.setPosition(position.x, position.y);
      player.setControls();
      player.setEvents();
      player.enablePassthrough();
      continue;
    }

    if (position.type === "drone") {
      const drone = map.add(makeDrone(k, k.vec2(position.x, position.y)));
      drone.setBehavior();
      drone.setEvents();
      continue;
    }

    if (position.name === "boss" && !state.current().isBossDefeated) {
      const boss = map.add(makeBoss(k, k.vec2(position.x, position.y)));
      boss.setBehavior();
      boss.setEvents();
      continue;
    }

    if (position.type === "cartridge") {
      map.add(makeCartridge(k, k.vec2(position.x, position.y)));
    }
  }

  healthBar.setEvents();
  healthBar.trigger("update");
  k.add(healthBar);
}