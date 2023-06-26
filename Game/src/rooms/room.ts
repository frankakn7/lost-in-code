import * as Phaser from "phaser";
import { TilemapConfig } from "../types/tilemapConfig";
import PlayerPng from "../assets/player.png"
import { Player } from "../types/player/Player";

/**
 * A class representing the different room scenes in the game
 */
export default class RoomScene extends Phaser.Scene {
    /**
     * Configuration of tilemap data for the room
     */
    private tilemapConfig: TilemapConfig;
    
    // private controls;
    
    

    /**
     * Room constructor
     * @param tilemapConfig config for loading the tilemaps
     * @param settingsConfig normal setting config for scenes
     */
    constructor(
        tilemapConfig: TilemapConfig,
        settingsConfig?: string | Phaser.Types.Scenes.SettingsConfig
    ) {
        super(settingsConfig);
        this.tilemapConfig = tilemapConfig;
    }

    public preload() {
        /**
         * Load the files
         */
        this.load.image("tilesetImage", this.tilemapConfig.tilesetImage);
        const tilemapJson = this.tilemapConfig.tilemapJson;
        this.load.tilemapTiledJSON("tilemap", tilemapJson);
        this.load.image("playerTexture", PlayerPng);
    }

    public create() {
        /**
         * Create and add the layers of the tilemap
         */
        const tilemap = this.make.tilemap({ key: "tilemap" });
        const tileset = tilemap.addTilesetImage(this.tilemapConfig.tilesetName, "tilesetImage");
        const floorLayer = tilemap.createLayer(this.tilemapConfig.floorLayer, tileset);
        const collisionLayer = tilemap.createLayer(this.tilemapConfig.collisionLayer, tileset);
        
        /**
         * Double the scale of the layers (doubling size of maps)
         */
        floorLayer.setScale(2);
        collisionLayer.setScale(2);
        /**
         * Add the collision to all elements in the collisionlayer
         */
        collisionLayer.setCollisionByExclusion([-1], true, false);

        /**
         * Camera Movement for testing the scene loading
         */

        // const cursors = this.input.keyboard.createCursorKeys();

        // const controlConfig = {
        //     camera: this.cameras.main,
        //     left: cursors.left,
        //     right: cursors.right,
        //     up: cursors.up,
        //     down: cursors.down,
        //     acceleration: 0.04,
        //     drag: 0.0005,
        //     maxSpeed: 0.7
        // };

        // this.controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);
    }
    
    update (time, delta){
            // update the camera controls every frame
    //     this.controls.update(delta);
        
        // TODO Would not be required if player was registered properly
        
    }
}
