import { GameObjectMap } from "../gameobjects";
import InteractiveObject from "../classes/objects/interactiveObject";
import RoomScene from "../classes/room";
import TaskObject from "../classes/objects/taskObjects";
import ClueObject from "../classes/objects/clueObject";

import { gameController } from "../main";
import {globalEventBus} from "../helpers/globalEventBus";
import {GameEvents} from "../types/gameEvents";

export default class RoomManager {
    private _interactiveObjects: InteractiveObject[] = [];
    private _taskObjects: TaskObject[] = [];
    private _clueObjects: ClueObject[] = [];

    private _roomScene: RoomScene;

    private _roomId: string;

    constructor(roomScene: RoomScene, roomId: string) {
        this._roomScene = roomScene;
        this._roomId = roomId;
    }

    /**
     * Instantiate GameObjects based on tilemap data.
     */
    public instantiateGameObjects(tilemap: Phaser.Tilemaps.Tilemap) {
        tilemap.objects[0].objects.forEach((tilemapObject: Phaser.Types.Tilemaps.TiledObject) => {
            let newGameObject = this.convertTilemapObject(tilemapObject);

            // Perform a null check to ensure that the newObj is active and attached to the scene.
            if (!newGameObject) {
                return;
            }
            this.addObjectToLists(newGameObject);

            // Add the game object to the scene.
            this._roomScene.add.existing(newGameObject);

            // Set up collision detection between the player and the game object.
            this._roomScene.physics.add.collider(this._roomScene.player, newGameObject);
        });

        // Set the finished status for task objects based on the onStartupFinishedTaskObjects array.
        for (let taskObject of this._taskObjects) {
            if (gameController.gameStateManager.room.finishedTaskObjects.includes(taskObject.id)) {
                taskObject.setIsFinished(true);
            }
        }
    }

    /**
     * Gets the number of task objects present in the room.
     * @returns {number} The count of task objects in the room.
     */
    public getTaskObjectCount() {
        // Return the number of task objects present in the room.
        return this._taskObjects.length;
    }

    /**
     * Calculates and gets the number of finished task objects in the room.
     * @returns {number} The count of finished task objects in the room.
     */
    public getFinishedTaskObjectsCount() {
        return this._taskObjects.filter(obj => obj.isFinished()).length;
    }

    /**
     * If all tasks are completed, it unlocks the door and emits events to notify about the unlocked door.
     * If the room's ID is "bridge," it emits an event to signal that the game has finished.
     */
    public checkIfRoomFinished() {
        if (this.checkIfDoorShouldUnlock()) {
            // If all tasks are finished, perform further actions based on the room's ID.
            if (this._roomId != "bridge") {
                gameController.gameStateManager.setDoorUnlocked(true);
                globalEventBus.emit(GameEvents.DOOR_UNLOCKED, this._roomId);
                globalEventBus.emit(GameEvents.BROADCAST_NEWS, "Door unlocked!");
            } else {
                globalEventBus.emit(GameEvents.GAME_FINISHED);
            }
        }
    }

    public checkIfDoorShouldUnlock(): boolean {
        return this._taskObjects.every((taskObject) => taskObject.isFinished());
    }

    private addObjectToLists(newGameObject: InteractiveObject) {
        this._interactiveObjects.push(newGameObject);
        if (newGameObject instanceof TaskObject) {
            this._taskObjects.push(newGameObject);
        }
        if (newGameObject instanceof ClueObject) {
            this._clueObjects.push(newGameObject);
        }
    }

    private convertTilemapObject(tilemapObject: Phaser.Types.Tilemaps.TiledObject): InteractiveObject {
        let gameObjectType = "";
        let objectId = 0;

        if (!tilemapObject.properties) return;

        tilemapObject.properties.forEach((p) => {
            if (p.name == "gameobject_type") gameObjectType = p.value;
            if (p.name == "object_id") objectId = p.value;
        });

        // Check if the gameobjectType exists in the GameObjectMap.
        if (!(gameObjectType in GameObjectMap)) {
            return;
        }

        // Calculate the position (x, y) for the game object based on the tilemap data.
        let x = Math.ceil(tilemapObject.x / 32) * 32 - 32;
        let y = Math.ceil(tilemapObject.y / 32) * 32 - 32;

        // Get the parameters and texture for the game object.
        let gameObjectParams = GameObjectMap[gameObjectType].params;
        let texture = gameObjectParams.texture;

        let newObject = this.createObject(
            gameObjectType,
            objectId,
            this._roomScene,
            this._roomScene,
            x,
            y,
            gameObjectParams,
            tilemapObject.properties,
        );

        return newObject
    }

    private createObject(
        gameObjectType: string,
        objectId: number,
        scene: Phaser.Scene,
        roomScene: RoomScene,
        x: number,
        y: number,
        params,
        properties,
    ): InteractiveObject {
        if (GameObjectMap[gameObjectType]) {
            let NewClass = GameObjectMap[gameObjectType].class;
            return new NewClass(objectId, this._roomScene, this._roomScene, x, y, params, properties);
        }
        // throw new Error("Invalid gameobjectType");
        console.error("Invalid gameObjectType: " + gameObjectType);
    }
}
