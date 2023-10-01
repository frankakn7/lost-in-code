import * as Phaser from "phaser";
import { TilemapConfig } from "../types/tilemapConfig";
import { Player } from "./Player";

import { globalEventBus } from "../helpers/globalEventBus";

import { gameController } from "../main";
import { SceneKeys } from "../types/sceneKeys";
import { GameEvents } from "../types/gameEvents";
import RoomManager from "../managers/roomManager";
import FogOfWar from "./fogOfWar";

/**
 * A class representing the different room scenes in the game
 */
export default class RoomScene extends Phaser.Scene {
    private _tilemapConfig: TilemapConfig; // Config for loading the tilemaps
    public player: Player; // The player object

    private vision; // The vision of the player
    private _fow; // The fog of war

    private _roomId; // The id of the room

    private _playerDefaultX = 32 * 4; // The default x position of the player
    private _playerDefaultY = 32 * 4; // The default y position of the player

    private _nextRoom = "hangar"; // The next room to load

    private _timeUntilStoryStartsInRoom = 2500; // The time until the story starts in the room
    private _timeSinceRoomEnter = 0; // The time since the room was entered

    private _tilemap: Phaser.Tilemaps.Tilemap;
    private _tileset: Phaser.Tilemaps.Tileset;

    private _roomManager: RoomManager;

    /**
     * Room constructor
     * @param tilemapConfig config for loading the tilemaps
     * @param roomId the room id of this room
     */
    constructor(tilemapConfig: TilemapConfig, roomId: string) {
        super(SceneKeys.ROOM_SCENE_KEY_IDENTIFIER + roomId);
        this._tilemapConfig = tilemapConfig;

        this._roomId = roomId;

        this._roomManager = new RoomManager(this, this._roomId);
    }

    /**
     * Preload the assets
     */
    public preload() {
        /**
         * Load the files
         */
        const tilemapJson = this._tilemapConfig.tilemapJson;
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
        this._tilemap = this.make.tilemap({ key: "tilemap" + this._roomId });
        this._tileset = this._tilemap.addTilesetImage(this._tilemapConfig.tilesetName, "tilesetImage");
        const floorLayer = this._tilemap.createLayer(this._tilemapConfig.floorLayer, this._tileset);
        const collisionLayer = this._tilemap.createLayer(this._tilemapConfig.collisionLayer, this._tileset);
        collisionLayer.setCollisionByExclusion([-1], true, false);
        collisionLayer.setDepth(2);

        // Set collision for the collision layer, excluding tiles with a value of 0.
        collisionLayer.setCollisionByExclusion([0], true, false);

        // Create and position the player sprite using the Player class.
        //TODO save player x and y in gamestate and load it from there
        this.player = new Player(this, this._playerDefaultX, this._playerDefaultY, "playerTexture");
        this.physics.add.collider(this.player, collisionLayer);

        // Add the player to the scene and make the camera follow the player.
        this.add.existing(this.player);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0, 0, this._tilemap.widthInPixels, this._tilemap.heightInPixels + 130);
        this.cameras.main.setZoom(5, 5);
        this.cameras.main.fadeIn(2000, 0, 0, 0);

        this._roomManager.instantiateGameObjects(this._tilemap);

        this._fow = new FogOfWar(this,0,0,this.scale.width,this.scale.height,this.player,true)

        // Emit an event for hats unlock check and another for room entrance.
        this.events.emit("hats_unlock_check");
        globalEventBus.emit(GameEvents.ROOM_ENTERED);

        if (this._roomManager.checkIfDoorShouldUnlock()) {
            gameController.gameStateManager.setDoorUnlocked(true);
            globalEventBus.emit(GameEvents.SAVE_GAME);
        }
    }

    /**
     * The update method of the Room class.
     * This function is called on every frame update and is used to update various aspects of the room.
     * @param {number} time - The current timestamp.
     * @param {number} delta - The delta time between the current and previous frame.
     */
    update(time, delta) {
        // Update the position of the Fog of war
        this._fow.updatePosition();

        // Check if the room's story has been played, and if not, start it after a specific time delay.
        if (!gameController.storyManager.checkIfRoomStoryPlayed(this._roomId)) {
            this._timeSinceRoomEnter += delta;
            if (this._timeSinceRoomEnter > this._timeUntilStoryStartsInRoom) {
                gameController.chatSceneController.openStoryChatView();
            }
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
     * (Needed as functiion for the roomMap)
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

    get roomManager(): RoomManager {
        return this._roomManager;
    }
}
