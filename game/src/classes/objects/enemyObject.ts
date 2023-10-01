import * as Phaser from "phaser";
import TaskObject from "./taskObjects";
import RoomScene from "../room";

export default class EnemyObject extends TaskObject {
    private _breathCalcHelperVar = 0;

    constructor(
        id: number,
        scene: Phaser.Scene,
        room: RoomScene,
        x: number,
        y: number,
        params,
        properties
    ) {
        super(id, scene, room, x, y, params, properties);
        // TODO Remove this

        this._emitter.visible = false;
    }

    protected preUpdate(time: number, delta: number) {
        super.preUpdate(time, delta);
        this.updateBreathAnimation(delta, 230, 20);
    }

    private updateBreathAnimation(delta: number, breathSpeed: number, breathScope: number) {
        // Breathing animation

        this._breathCalcHelperVar += delta / breathSpeed;
        let fac = (Math.sin(this._breathCalcHelperVar) / breathScope);
        this.scaleY = 1 + fac;
        this.setOrigin(0.5, 1);


    }
}

