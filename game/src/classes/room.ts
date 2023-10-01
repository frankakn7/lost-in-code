import * as Phaser from "phaser";
import {TilemapConfig} from "../types/tilemapConfig";
import {Player} from "./objects/Player";
import PlayerTexture from "../assets/player.png";
import ShadowTexture from "../assets/shadow.png"
import Mask from "../assets/mask.png";
import {GameObjectMap} from "../gameobjects";

import TaskObject from "./objects/taskObjects";
import {globalEventBus} from "../helpers/globalEventBus";

import ClueObject from "./objects/clueObject";
import {gameController} from "../main";
import {SceneKeys} from "../types/sceneKeys";
import {GameEvents} from "../types/gameEvents";



/**
 * A class representing the different room scenes in the game
 */
export default class RoomScene extends Phaser.Scene {
    private tilemapConfig: TilemapConfig; // Config for loading the tilemaps
    public player: Player; // The player object
    private vision; // The vision of the player
    private fow; // The fog of war
    private _roomId; // The id of the room
    private _playerDefaultX = 32 * 4; // The default x position of the player
    private _playerDefaultY = 32 * 4; // The default y position of the player
    private _nextRoom = "hangar"; // The next room to load

    //TODO make this into room manager
    private _interactiveObjects = []; // The interactive objects in the room
    private _taskObjects: TaskObject[] = []; // The task objects in the room
    private _clues = []; // The clues in the room
    // private _onStartupFinishedTaskObjects = [false, false, false, false]; // The task objects that are finished on startup due to load

    private _timeUntilStoryStartsInRoom = 2500; // The time until the story starts in the room
    private _timeSinceRoomEnter = 0; // The time since the room was entered

    /**
     * Room constructor
     * @param tilemapConfig config for loading the tilemaps
     * @param roomId the room id of this room
     */
    constructor(
        tilemapConfig: TilemapConfig,
        roomId: string,
    ) {
        super(SceneKeys.ROOM_SCENE_KEY_IDENTIFIER + roomId);
        this.tilemapConfig = tilemapConfig;

        this._roomId = roomId;
    }

    /**
     * Preload the assets
     */
    public preload() {
        /**
         * Load the files
         */
        const tilemapJson = this.tilemapConfig.tilemapJson;
        this.load.tilemapTiledJSON("tilemap" + this._roomId, tilemapJson);
    }

    get roomId() {
        return this._roomId;
    }

    /**
     * Creates and sets up the Room.
     * Initializes the tilemap with floor and collision layers.
     * Creates and positions the player and other game objects based on the tilemap data.
     * Sets up collision detection for the player with the collision layer.
     * Initializes the Fog of War (FOW) for the room.
     * Emits events for hats unlock check and room entrance.
     * Checks if tasks are finished and unlocks the door if needed.
     */
    public create() {

        // Create and add the tilemap layers for the room.
        const tilemap = this.make.tilemap({key: "tilemap" + this._roomId});
        const tileset = tilemap.addTilesetImage(this.tilemapConfig.tilesetName, "tilesetImage");
        const floorLayer = tilemap.createLayer(this.tilemapConfig.floorLayer, tileset);
        const collisionLayer = tilemap.createLayer(this.tilemapConfig.collisionLayer, tileset);
        collisionLayer.setCollisionByExclusion([-1], true, false);
        collisionLayer.setDepth(2);


        // Set collision for the collision layer, excluding tiles with a value of 0.
        collisionLayer.setCollisionByExclusion([0], true, false);


        // Create and position the player sprite using the Player class.
        //TODO save player x and y in gamestate and load it from there
        this.player = new Player(this, this._playerDefaultX, this._playerDefaultY, "playerTexture");
        this.physics.add.collider(this.player, collisionLayer);
        this.player.setCanMove(false);


        // Add the player to the scene and make the camera follow the player.
        this.add.existing(this.player);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0, 0, tilemap.widthInPixels, tilemap.heightInPixels + 130);
        this.cameras.main.setZoom(5, 5);
        this.cameras.main.fadeIn(2000, 0, 0, 0);


        // Instantiate GameObjects based on tilemap data.
        tilemap.objects[0].objects.forEach(obj => {
            // Check if the object has properties.
            if (!obj.properties) return;
            let gameobjectType = "";
            let objectId: number = 0;
            obj.properties.forEach(p => {
                if (p["name"] == "gameobject_type") gameobjectType = p["value"];
                if (p["name"] == "object_id") objectId = p["value"];
            });

            // Check if the gameobjectType exists in the GameObjectMap.
            if (!(gameobjectType in GameObjectMap)) {
                return;
            }


            // Calculate the position (x, y) for the game object based on the tilemap data.
            let x = (Math.ceil(obj.x / 32) * 32) - 32;
            let y = (Math.ceil(obj.y / 32) * 32) - 32;

            // Get the parameters and texture for the game object.
            let params = GameObjectMap[gameobjectType].params
            let texture = params.texture;

            // Create a new instance of the game object based on its class from the GameObjectMap.
            let newObj = new GameObjectMap[gameobjectType].class(objectId, this, this, x, y, params, obj.properties);

            // Perform a null check to ensure that the newObj is active and attached to the scene.
            if (!newObj.active && newObj.scene == null) {
                return;
            }

            // Add the newly created game object to the lists for interactive objects, task objects, and clue objects.
            this._interactiveObjects.push(newObj);
            if (newObj instanceof TaskObject) {
                this._taskObjects.push(newObj);
            }
            if (newObj instanceof ClueObject) {
                this._clues.push(newObj);
            }

            // Add the game object to the scene.
            this.add.existing(newObj);

            // Set up collision detection between the player and the game object.
            this.physics.add.collider(this.player, newObj);
        });

        // Set the finished status for task objects based on the onStartupFinishedTaskObjects array.
        for (let taskObject of this._taskObjects) {
            if(gameController.gameStateManager.room.finishedTaskObjects.includes(taskObject.id)){
                taskObject.setIsFinished(true);
            }
        }

        // Set up the Fog of War (FOW) for the room.
        this._setupFOW();

        // Emit an event for hats unlock check and another for room entrance.
        this.events.emit("hats_unlock_check");
        globalEventBus.emit(GameEvents.ROOM_ENTERED);


        // Check if the door should be unlocked.
        let res = true;
        this._taskObjects.forEach((obj) => {
            if (!obj.isFinished()) res = false;
        });

        if (!res) return;

        gameController.gameStateManager.setDoorUnlocked(true);
        globalEventBus.emit(GameEvents.SAVE_GAME);
    }


    /**
     * Sets up the Fog of War (FOW) effect for the room.
     * The FOW is created using a render texture with a mask applied to it.
     * The FOW appears as a dark, semi-transparent overlay that hides unexplored areas.
     * The player's vision is represented by a circular mask that reveals the area around the player.
     */
    private _setupFOW() {
        // Get the width and height of the room's scale (viewport size).
        const width = this.scale.width;
        const height = this.scale.height;


        // Create the FOW render texture with the same width and height as the room.
        this.fow = this.make.renderTexture({
            width,
            height
        }, true);

        // Fill the FOW with a dark blue color (semi-transparent).
        this.fow.fill(0x074e67, 0.8);

        // Create the player's vision as an image representing a circular mask.
        // The mask is positioned above the player's sprite and is twice the size.
        this.vision = this.make.image({
            x: this.player.x,
            y: this.player.y - 16,
            key: 'mask',
            add: false
        });
        this.vision.scale = 2.;

        // Apply a BitmapMask to the FOW using the circular vision mask.
        this.fow.mask = new Phaser.Display.Masks.BitmapMask(this, this.vision);
        this.fow.mask.invertAlpha = true;

        // Set a tint for the FOW to give it a darker appearance.
        this.fow.setTint(0x141932);

        // Set the depth of the FOW to ensure it appears above other elements in the scene.
        this.fow.setDepth(10);
    }

    /**
     * The update method of the Room class.
     * This function is called on every frame update and is used to update various aspects of the room.
     * @param {number} time - The current timestamp.
     * @param {number} delta - The delta time between the current and previous frame.
     */
    update(time, delta) {
        // Update the position of the player's vision (circular mask) to follow the player.
        if (this.vision) {
            this.vision.x = this.player.x;
            this.vision.y = this.player.y - 16;
            this.fow.setX(this.player.x);
            this.fow.setY(this.player.y);
        }

        // Check if the room's story has been played, and if not, start it after a specific time delay.
        if (!gameController.storyManager.checkIfRoomStoryPlayed(this._roomId)) {
            this._timeSinceRoomEnter += delta;
            if (this._timeSinceRoomEnter > this._timeUntilStoryStartsInRoom) {
                gameController.chatSceneController.openStoryChatView();
                this.player.setCanMove(true);
            }
        } else {
            // If the room's story has been played, enable the player's movement.
            this.player.setCanMove(true);
        }
    }

    /**
     * Sets the position of the player in the room.
     * If the player object has not been created yet, it sets the default position for the player.
     * If the player object exists, it directly sets the player's position to the specified coordinates.
     * @param {number} x - The x-coordinate for the player's position.
     * @param {number} y - The y-coordinate for the player's position.
     * @returns {Room} The current instance of the Room class.
     */
    public setPlayerPosition(x, y) {
        if (this.player == undefined) {
            this._playerDefaultX = x;
            this._playerDefaultY = y;
        } else this.player.setPosition(x, y);

        return this;
    }

    /**
     * Sets the ID of the next room that the player should transition to.
     * @param {string} roomId - The ID of the next room to transition to.
     * @returns {Room} The current instance of the Room class.
     */
    public setNextRoom(roomId: string) {
        this._nextRoom = roomId;
        return this;
    }

    get nextRoom(): string {
        return this._nextRoom;
    }

    /**
     * Checks if all tasks in the room are finished and performs further actions accordingly.
     * If all tasks are completed, it unlocks the door and emits events to notify about the unlocked door.
     * If the room's ID is "bridge," it emits an event to signal that the game has finished.
     */
    public checkIfRoomFinished() {
        // Check if all tasks in the room are finished.
        let res = true;
        this._taskObjects.forEach((obj) => {
            if (!obj.isFinished()) res = false;
        });

        // If not all tasks are finished, return without further actions.
        if (!res) return;

        // If all tasks are finished, perform further actions based on the room's ID.
        if (this._roomId != "bridge") {
            gameController.gameStateManager.setDoorUnlocked(true)
            globalEventBus.emit(GameEvents.DOOR_UNLOCKED, this._roomId);
            globalEventBus.emit(GameEvents.BROADCAST_NEWS, "Door unlocked!");
        } else {
            globalEventBus.emit(GameEvents.GAME_FINISHED);
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
        let c = 0;
        this._taskObjects.forEach(obj => {
            if (obj.isFinished()) c++;
        });
        return c;
    }


}
