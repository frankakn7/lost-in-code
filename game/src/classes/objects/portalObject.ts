import * as Phaser from "phaser";
import InteractiveObject from "./interactiveObject";
import WorldViewScene from "../../scenes/worldViewScene";
import RoomScene from "../room";
import {globalEventBus} from "../../helpers/globalEventBus";
import Clock = Phaser.Time.Clock;
import {gameController} from "../../main";
import {GameEvents} from "../../types/gameEvents";

/**
 * PortalObject is a subclass of InteractiveObject that represents an object that can be interacted with to get to the next room.
 */
export default class PortalObject extends InteractiveObject {
    private _emitter; // Stores the particle emitter for the object.

    /**
     * Creates an instance of PortalObject.
     * @param id
     * @param scene
     * @param room
     * @param x
     * @param y
     * @param params
     * @param properties
     */
    constructor(
        id:number,
        scene: Phaser.Scene,
        room: RoomScene,
        x: number,
        y: number,
        params,
        properties
    ) {
        super(id, scene, room, x, y, params);

        const shape = new Phaser.Geom.Line(0, 0, 0, this.height);
        const shape1 = new Phaser.Geom.Rectangle(0, 0, this.width, this.height);

        // Set up particle emitter
        this._emitter = this.scene.add.particles(this.x, this.y, 'flares', {
            frame: { frames: ['red'], cycle: true},
            speed: 1,
            blendMode: 'ADD',
            lifespan: 800,
            quantity: 4,
            scale: { start: 0.2, end: 0.1 }
        });

        this._emitter.setDepth(6);

        this._emitter.addEmitZone({type: 'edge', source: shape, total: 1, quantity: 64});

        if(gameController.gameStateManager.room.doorUnlocked){
            this.unlock();
        }else{
            this.unlock = this.unlock.bind(this);
            globalEventBus.once(GameEvents.DOOR_UNLOCKED, this.unlock);
        }
    }

    private unlock() {
        this._emitter.setVisible(false);
    }

    public interact(): void {
        // Check if the door is unlocked
        console.log("Interacted with door")
        if (gameController.gameStateManager.room.doorUnlocked) {
            // Fade out the camera and then change the room
            // this.room.worldViewScene.getToRoomViaId(this.room.getNextRoom());
            this.room.cameras.main.fadeOut(1000, 0, 0, 0)
            setTimeout(() => gameController.roomSceneController.changeRoomSceneViaId(this.room.nextRoom), 1000);
        }
    }
}