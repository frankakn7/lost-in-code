import RoomScene from "../classes/room";
import tilesetPng from "../assets/tileset/station_tilemap.png";
import hangarJson from "../assets/tilemaps/hangar.json";
import commonRoomJson from "../assets/tilemaps/common.json";
import engineJson from "../assets/tilemaps/engine.json";
import labJson from "../assets/tilemaps/laboratory.json";
import bridgeJson from "../assets/tilemaps/bridge.json";

export const roomMap: Map<string,RoomScene> = new Map<string, RoomScene>()

roomMap.set("hangar", new RoomScene({
    tilesetImage: tilesetPng,
    tilesetName: "spac2",
    tilemapJson: hangarJson,
    floorLayer: "Floor",
    collisionLayer: "Walls",
    objectsLayer: "Objects"
}, "hangar").setNextRoom("commonRoom").setPlayerPosition(32 * 12, 32 * 3));
roomMap.set("commonRoom", new RoomScene({
    tilesetImage: tilesetPng,
    tilesetName: "spac2",
    tilemapJson: commonRoomJson,
    floorLayer: "Floor",
    collisionLayer: "Walls",
    objectsLayer: "Objects"
}, "commonRoom").setNextRoom("engine").setPlayerPosition(32 * 2, 32 * 10));
roomMap.set("engine", new RoomScene({
    tilesetImage: tilesetPng,
    tilesetName: "spac2",
    tilemapJson: engineJson,
    floorLayer: "Floor",
    collisionLayer: "Walls",
    objectsLayer: "Objects"
}, "engine").setNextRoom("laboratory").setPlayerPosition(32 * 2, 32 * 10));
roomMap.set("laboratory", new RoomScene({
    tilesetImage: tilesetPng,
    tilesetName: "spac2",
    tilemapJson: labJson,
    floorLayer: "Floor",
    collisionLayer: "Walls",
    objectsLayer: "Objects"
}, "laboratory").setNextRoom("bridge").setPlayerPosition(32 * 2, 32 * 10));
roomMap.set("bridge", new RoomScene({
    tilesetImage: tilesetPng,
    tilesetName: "spac2",
    tilemapJson: bridgeJson,
    floorLayer: "Floor",
    collisionLayer: "Walls",
    objectsLayer: "Objects"
}, "bridge").setPlayerPosition(32 * 2, 32 * 10));