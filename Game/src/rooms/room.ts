import * as Phaser from "phaser";
import { TilemapConfig } from "../types/tilemapConfig";
import { Player } from "../objects/Player";
import PlayerTexture from "../assets/player.png";
import ShadowTexture from "../assets/shadow.png"
import Mask from "../assets/mask.png";
import { GameObjectMap } from "../gameobjects";

import DoorTexture from "../assets/gameobjects/door.png";
import EngineTexture from "../assets/gameobjects/engine.png";
import LockerTexture from "../assets/gameobjects/locker.png"
import InteractiveObject from "../objects/interactiveObject";
import storyJson from "../story_management/storyFormatExample.json";
import StoryManager from "../story_management/storyManager";
import PlayView from "../views/playView";
import TaskObject from "../objects/taskObjects";



/**
 * A class representing the different room scenes in the game
 */
export default class RoomScene extends Phaser.Scene {
    /**
     * Configuration of tilemap data for the room
     */
    private tilemapConfig: TilemapConfig;
    public player : Player;
    private vision;
    private fow;
    private _roomId;
    private _playerDefaultX = 32*4;
    private _playerDefaultY = 32*4;
    private _nextRoom = "hangar";

    private _interactiveObjects = [];
    private _taskObjects = [];
    // private controls;

    private _playView;
    
    /**
     * Room constructor
     * @param tilemapConfig config for loading the tilemaps
     * @param settingsConfig normal setting config for scenes
     */
    constructor(
        tilemapConfig: TilemapConfig,
        roomId: string,
        playView : PlayView
        // settingsConfig?: string | Phaser.Types.Scenes.SettingsConfig
    ) {
        super("Room_" + roomId);
        this.tilemapConfig = tilemapConfig;
        
        this._playView = playView;
        this._roomId = roomId;
    }

    public preload() {
        /**
         * Load the files
         */
        const tilemapJson = this.tilemapConfig.tilemapJson;
        this.load.tilemapTiledJSON("tilemap" + this._roomId, tilemapJson);
        this.load.image("playerTexture", PlayerTexture);
        this.load.image("shadowTexture", ShadowTexture);
        this.load.image("mask", Mask);
        this.load.image("door", DoorTexture);
        this.load.image("engine", EngineTexture);
        this.load.image("locker", LockerTexture);
    }

    public getRoomId() {
        return this._roomId;
    }

    public create() {
        /**
         * Create and add the layers of the tilemap
         */
        
        const tilemap = this.make.tilemap({ key: "tilemap" + this._roomId });
        const tileset = tilemap.addTilesetImage(this.tilemapConfig.tilesetName, "tilesetImage");
        const floorLayer = tilemap.createLayer(this.tilemapConfig.floorLayer, tileset);
        const collisionLayer = tilemap.createLayer(this.tilemapConfig.collisionLayer, tileset);
        collisionLayer.setCollisionByExclusion([-1], true, false);
        collisionLayer.setDepth(4);


        /**
         * Double the scale of the layers (doubling size of maps)
         */
        // floorLayer.setScale(2);
        // collisionLayer.setScale(2);
        /**
         * Add the collision to all elements in the collisionlayer
         */
        collisionLayer.setCollisionByExclusion([0], true, false);

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
        // TODO This is the worst code ever written you shouldnt be using this.scene x 4
        this.player = new Player(this, this._playerDefaultX, this._playerDefaultY, "playerTexture", this._playView);
        this.physics.add.collider(this.player, collisionLayer);
        // this.physics.world.enable(this.player);
        
        // this.physics.add.existing(this.player);
        this.add.existing(this.player);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0, 0, tilemap.widthInPixels, tilemap.heightInPixels);
        this.cameras.main.setZoom(5, 5);



        // Instantiate GameObjects
    
        tilemap.objects[0].objects.forEach(obj => {
            if (!obj.properties) return;
            let gameobjectID = "";
            obj.properties.forEach(p => {
                if (p["name"] == "gameobject_id") gameobjectID = p["value"];
            });
            if (!(gameobjectID in GameObjectMap)) { return; }
            
            

            let x = Math.ceil(obj.x / 32) * 32;
            let y = Math.ceil(obj.y / 32) * 32;
            
            let params = GameObjectMap[gameobjectID].params
            let texture = params.texture;
            
            let newObj = new GameObjectMap[gameobjectID].class(this, this, x, y, params);
            this.add.existing(newObj);
            this.physics.add.collider(this.player, newObj);
            this._interactiveObjects.push(newObj);
            if (newObj instanceof TaskObject) {
                this._taskObjects.push(newObj);
            }

            // const door = new InteractiveObject(this, 32*5, 32*5, "door");
            // this.add.existing(door);
            // this.physics.add.collider(this.player, door);
        });

        const width = this.scale.width
        const height = this.scale.height;


        // TODO Put fow stuff into separate methods
        // create fow
        this.fow = this.make.renderTexture({
            width,
            height
        }, true);

        this.fow.fill(0x074e67, 0.8);

        // TODO Make this actually render and use instead for the fow
        // this.fow.draw(door);
        this.fow.draw(floorLayer);
        this.vision = this.make.image({
            x: this.player.x,
            y: this.player.y - 16,
            key: 'mask',
            add: false
        });
        this.vision.scale = 2.;

        this.fow.mask = new Phaser.Display.Masks.BitmapMask(this, this.vision);
        this.fow.mask.invertAlpha = true;


        this.fow.setTint(0x141932);
        this.fow.setDepth(5);
    }
    
    update (time, delta){
        if (this.vision) {
            this.vision.x = this.player.x;
            this.vision.y = this.player.y - 16;
            this.fow.setX(this.player.x);
            this.fow.setY(this.player.y);
        }

        
            // update the camera controls every frame
    //     this.controls.update(delta);
        
        // TODO Would not be required if player was registered properly
        
    }

    public getPlayView() {
        return this._playView;
    }

    public setPlayerPosition(x, y) {
        if (this.player == undefined) {
            this._playerDefaultX = x;
            this._playerDefaultY = y;
        } else this.player.setPosition(x, y);

        return this;
    }

    public setNextRoom(roomId: string) {
        this._nextRoom = roomId;
        return this;
    }

    public getNextRoom() {
        return this._nextRoom;
    }

    public saveAll() {
        let res = []
        this._taskObjects.forEach(o => {
            res.push(o.isFinished());
        });
        return res;
    }
}
