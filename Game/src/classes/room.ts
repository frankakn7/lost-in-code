import * as Phaser from "phaser";
import { TilemapConfig } from "../types/tilemapConfig";
import { Player } from "./objects/Player";
import PlayerTexture from "../assets/player.png";
import ShadowTexture from "../assets/shadow.png"
import Mask from "../assets/mask.png";
import { GameObjectMap } from "../gameobjects";

import DoorTexture from "../assets/gameobjects/door.png";
import EngineTexture from "../assets/gameobjects/engine.png";
import EngineBrokenTexture from "../assets/gameobjects/engineBroken.png";
import LockerTexture from "../assets/gameobjects/locker.png"
import BarrelTexture from "../assets/gameobjects/barrel.png";
import CrateTexture from "../assets/gameobjects/crate.png";
import Crate2Texture from "../assets/gameobjects/crate2.png";
import Crate4Texture from "../assets/gameobjects/crate4.png";
import ComputerTexture from "../assets/gameobjects/computer.png";
import CannonTexture from "../assets/gameobjects/cannon.png";
import TableSeatLeftTexture from "../assets/gameobjects/tableSeatLeft.png";
import TableSeatRightTexture from "../assets/gameobjects/tableSeatRight.png";
import FirstAidKitTexture from "../assets/gameobjects/firstAidKit.png";
import BedTexture from "../assets/gameobjects/bed.png";
import DoorSingleTexture from "../assets/gameobjects/doorSingle.png";
import DoorDoubleTexture from "../assets/gameobjects/doorDouble.png";
import EnemyTexture from "../assets/gameobjects/enemy.png";

import InteractiveObject from "./objects/interactiveObject";
import storyJson from "../managers/story_management/storyFormatExample.json";
import StoryManager from "../managers/story_management/storyManager";
import RootNode from "../views/rootNode";
import TaskObject from "./objects/taskObjects";
import {globalEventBus} from "../helpers/globalEventBus";
import EnemyObject from "./objects/enemyObject";



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
    private _onStartupFinishedTaskObjects = [false, false, false, false];
    // private controls;

    private _rootNode;
    private _doorUnlocked = false;

    private _timeUntilStoryStartsInRoom = 2500;
    private _timeSinceRoomEnter = 0;
    private _roomStoryPlayed = false;
    
    /**
     * Room constructor
     * @param tilemapConfig config for loading the tilemaps
     * @param settingsConfig normal setting config for scenes
     */
    constructor(
        tilemapConfig: TilemapConfig,
        roomId: string,
        rootNode : RootNode
        // settingsConfig?: string | Phaser.Types.Scenes.SettingsConfig
    ) {
        super("Room_" + roomId);
        this.tilemapConfig = tilemapConfig;
        
        this._rootNode = rootNode;
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
        
        this.load.image("barrel", BarrelTexture);
        this.load.image("crate2", Crate2Texture);
        this.load.image("crate", CrateTexture);
        this.load.image("crate4", Crate4Texture);
        this.load.image("computer", ComputerTexture);
        this.load.image("cannon", CannonTexture);
        this.load.image("tableseatleft", TableSeatLeftTexture);
        this.load.image("tableseatright", TableSeatRightTexture);
        this.load.image("firstaidkittexture", FirstAidKitTexture);
        this.load.image("bed", BedTexture);
        this.load.image("doorSingle", DoorSingleTexture);
        this.load.image("doorDouble", DoorDoubleTexture);
        this.load.image("engineBroken", EngineBrokenTexture);
        this.load.image("enemy", EnemyTexture);

    }

    public getRoomId() {
        return this._roomId;
    }

    public create() {
        /**
         * Create and add the layers of the tilemap
         */
        this.loadData();
        
        const tilemap = this.make.tilemap({ key: "tilemap" + this._roomId });
        const tileset = tilemap.addTilesetImage(this.tilemapConfig.tilesetName, "tilesetImage");
        const floorLayer = tilemap.createLayer(this.tilemapConfig.floorLayer, tileset);
        const collisionLayer = tilemap.createLayer(this.tilemapConfig.collisionLayer, tileset);
        collisionLayer.setCollisionByExclusion([-1], true, false);
        collisionLayer.setDepth(2);


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
        this.player = new Player(this, this._playerDefaultX, this._playerDefaultY, "playerTexture", this._rootNode);
        this.physics.add.collider(this.player, collisionLayer);
        this.player.setCanMove(false);
        // this.physics.world.enable(this.player);
        
        // this.physics.add.existing(this.player);
        this.add.existing(this.player);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0, 0, tilemap.widthInPixels, tilemap.heightInPixels + 130);
        this.cameras.main.setZoom(5, 5);
        this.cameras.main.fadeIn(2000, 0, 0, 0);



        // Instantiate GameObjects
    
        tilemap.objects[0].objects.forEach(obj => {
            if (!obj.properties) return;
            let gameobjectID = "";
            obj.properties.forEach(p => {
                if (p["name"] == "gameobject_id") gameobjectID = p["value"];
            });
            if (!(gameobjectID in GameObjectMap)) { return; }
            
            

            let x = (Math.ceil(obj.x / 32) * 32) - 32;
            let y = (Math.ceil(obj.y / 32) * 32) - 32;
            
            let params = GameObjectMap[gameobjectID].params
            let texture = params.texture;
            
            let newObj = new GameObjectMap[gameobjectID].class(this, this, x, y, params, obj.properties);

            // The ultimate null check
            if (!newObj.active && newObj.scene == null) {
                return;
            }
            
            this._interactiveObjects.push(newObj);
            if (newObj instanceof TaskObject) {
                this._taskObjects.push(newObj);
            }

            this.add.existing(newObj);
            
            
            this.physics.add.collider(this.player, newObj);
            
            // const door = new InteractiveObject(this, 32*5, 32*5, "door");
            // this.add.existing(door);
            // this.physics.add.collider(this.player, door);
            //this._rootNode.hatView.loadSelectedHat();
        });

        for(let i = 0; i < this._taskObjects.length; i++) {
            this._taskObjects[i].setIsFinished(this._onStartupFinishedTaskObjects[i]);
        }

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
        this.fow.setDepth(10);

        this.events.emit("hats_unlock_check");
        globalEventBus.emit("room_entered");

        //this.checkIfDoorUnlocked(); ---> Broadcastet door unlocked
        //UNLOCKS DOOR IF LOADING FROM GAMESTATE
        let res = true;
        this._taskObjects.forEach((obj) => {
            if (!obj.isFinished()) res = false;
        });

        if (!res) return;

        this.setDoorUnlocked(true);
        globalEventBus.emit("save_game");
    }
    
    update (time, delta){
        if (this.vision) {
            this.vision.x = this.player.x;
            this.vision.y = this.player.y - 16;
            this.fow.setX(this.player.x);
            this.fow.setY(this.player.y);
        }

        if (!this._roomStoryPlayed) {
            this._timeSinceRoomEnter += delta;
            if (this._timeSinceRoomEnter > this._timeUntilStoryStartsInRoom) {
                this._roomStoryPlayed = true;
                this.getRootNode().openStoryChatView();
                this.player.setCanMove(true);
            }
        }

        
            // update the camera controls every frame
    //     this.controls.update(delta);
        
        // TODO Would not be required if player was registered properly
        
    }

    public getRootNode() {
        return this._rootNode;
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
        let res = {finishedTaskObjects: []}
        this._taskObjects.forEach(o => {
            res.finishedTaskObjects.push(o.isFinished());
        });
        return res;
    }

    public loadData() {
        this.setDoorUnlocked(this.getRootNode().getState().room.doorUnlocked);
        this._onStartupFinishedTaskObjects = this.getRootNode().getState().room.finishedTaskObjects;
    }

    public setDoorUnlocked(locked) {
        this._doorUnlocked = locked;
    }

    public getDoorUnlocked() {

        return this._doorUnlocked;
    }

    public checkIfDoorUnlocked() {
        let res = true;
        this._taskObjects.forEach((obj) => {
            if (!obj.isFinished()) res = false;
        });

        if (!res) return;

        this.setDoorUnlocked(true);
        globalEventBus.emit("door_was_unlocked", this._roomId);
        globalEventBus.emit("broadcast_news", "Door unlocked!");
    }

    public getTaskObjectCount() {
        return this._taskObjects.length;
    }

    public getFinishedTaskObjectsCount() {
        let c = 0;
        this._taskObjects.forEach(obj => {
           if (obj.isFinished()) c++;
        });
        return c;
    }
}
