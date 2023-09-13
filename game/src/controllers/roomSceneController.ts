import RoomScene from "../classes/room";
import tilesetPng from "../assets/tileset/station_tilemap.png";
import hangarJson from "../assets/tilemaps/hangar.json";
import commonRoomJson from "../assets/tilemaps/common.json";
import engineJson from "../assets/tilemaps/engine.json";
import labJson from "../assets/tilemaps/laboratory.json";
import bridgeJson from "../assets/tilemaps/bridge.json";
import WorldViewScene from "../scenes/worldViewScene";
import {gameController} from "../main";

export default class RoomSceneController {

    private _currentRoomScene: RoomScene; // The currently displayed room.
    private _roomMap = new Map<string, RoomScene>;

    private _worldViewScene: WorldViewScene;

    constructor(worldViewScene: WorldViewScene) {
        this._worldViewScene = worldViewScene;

        this.setupRoomScenes();

        // Add each RoomScene to the game as a separate scene using the roomMap.
        this.roomMap.forEach((value, key) => {
            this._worldViewScene.scene.add(key, this.roomMap.get(key));
        })
    }

    get currentRoomScene(): RoomScene {
        return this._currentRoomScene;
    }

    set currentRoomScene(value: RoomScene) {
        this._currentRoomScene = value;
    }

    get roomMap(): Map<any, any> {
        return this._roomMap;
    }

    set roomMap(value: Map<any, any>) {
        this._roomMap = value;
    }

    public setupRoomScenes(){
        // Create and set up the various RoomScene instances for different rooms in the game.
        // Each RoomScene represents a specific room in the game with its tilemap, layers, and player position.
        console.log("### SETUP ROOM SCENES")
        console.log(this._worldViewScene)
        this._roomMap.set("hangar", new RoomScene({
            tilesetImage: tilesetPng,
            tilesetName: "spac2",
            tilemapJson: hangarJson,
            floorLayer: "Floor",
            collisionLayer: "Walls",
            objectsLayer: "Objects"
        }, "hangar", this._worldViewScene).setNextRoom("commonRoom").setPlayerPosition(32 * 12, 32 * 3));
        this._roomMap.set("commonRoom", new RoomScene({
            tilesetImage: tilesetPng,
            tilesetName: "spac2",
            tilemapJson: commonRoomJson,
            floorLayer: "Floor",
            collisionLayer: "Walls",
            objectsLayer: "Objects"
        }, "commonRoom", this._worldViewScene).setNextRoom("engine").setPlayerPosition(32 * 2, 32 * 10));
        this._roomMap.set("engine", new RoomScene({
            tilesetImage: tilesetPng,
            tilesetName: "spac2",
            tilemapJson: engineJson,
            floorLayer: "Floor",
            collisionLayer: "Walls",
            objectsLayer: "Objects"
        }, "engine", this._worldViewScene).setNextRoom("laboratory").setPlayerPosition(32 * 2, 32 * 10));
        this._roomMap.set("laboratory", new RoomScene({
            tilesetImage: tilesetPng,
            tilesetName: "spac2",
            tilemapJson: labJson,
            floorLayer: "Floor",
            collisionLayer: "Walls",
            objectsLayer: "Objects"
        }, "laboratory", this._worldViewScene).setNextRoom("bridge").setPlayerPosition(32 * 2, 32 * 10));
        this._roomMap.set("bridge", new RoomScene({
            tilesetImage: tilesetPng,
            tilesetName: "spac2",
            tilemapJson: bridgeJson,
            floorLayer: "Floor",
            collisionLayer: "Walls",
            objectsLayer: "Objects"
        }, "bridge", this._worldViewScene).setPlayerPosition(32 * 2, 32 * 10));
    }

    /**
     * Navigates the player to a new room in the game based on the provided room ID.
     * @param {string} id - The ID of the room to navigate to.
     */
    public getToRoomViaId(id: string) {
        let nextRoom = this.roomMap.get(id);
        this._worldViewScene.scene.stop(this.currentRoomScene)

        // Initialize the 'finishedTaskObjects' property of the game state for the next room.
        // The 'finishedTaskObjects' property is an array that tracks the completion status of tasks in the room.
        // It is set to an array of false values with the length equal to the number of task objects in the next room.
        gameController.gameStateManager.room.finishedTaskObjects = Array(nextRoom.getTaskObjectCount()).fill(false);

        // Launch the next room scene to activate it.
        this._worldViewScene.scene.launch(this.roomMap.get(id));

        this.currentRoomScene = nextRoom;

    }
}