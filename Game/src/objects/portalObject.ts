import * as Phaser from "phaser";
import InteractiveObject from "./interactiveObject";
import PlayView from "../views/playView";
import RoomScene from "../rooms/room";
import {globalEventBus} from "../helpers/globalEventBus";

export default class PortalObject extends InteractiveObject {
    private _emitter;

    constructor(
        scene: Phaser.Scene,
        room: RoomScene,
        x: number,
        y: number,
        params,
        properties
    ) {
        super(scene, room, x, y, params, properties);

        const shape = new Phaser.Geom.Line(0, 0, 0, this.height);
        const shape1 = new Phaser.Geom.Rectangle(0, 0, this.width, this.height);
        this._emitter = this.scene.add.particles(this.x, this.y, 'flares', {
            frame: { frames: ['red'], cycle: true},
            speed: 1,
            blendMode: 'ADD',
            lifespan: 800,
            quantity: 4,
            scale: { start: 0.2, end: 0.1 }
        });

        this._emitter.setDepth(11);

        this._emitter.addEmitZone({type: 'edge', source: shape, total: 1, quantity: 64});

        this.unlock = this.unlock.bind(this);
        globalEventBus.once("door_was_unlocked", this.unlock);
    }

    private unlock() {
        this._emitter.setVisible(false);
    }

    public interact(): void {
        if (this.room.getDoorUnlocked()) {
            console.log("Open Door");
            this.room.getPlayView().getToRoomViaId(this.room.getNextRoom());
            this.room.cameras.main.fadeOut(1000, 0, 0, 0)
        }
    }
}