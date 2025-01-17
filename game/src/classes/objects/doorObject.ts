import TaskObject from "./taskObjects";
import RoomScene from "../room";

export default class DoorObject extends TaskObject {
    constructor(id: number, scene: Phaser.Scene, room: RoomScene, x: number, y: number, params, properties) {
        super(id, scene, room, x, y, params, properties);
    }

    protected preUpdate(time: number, delta: number) {
        if (this.isFinished()) {
            this.setVisible(false);
            this._emitter.setVisible(false);
            this.body.enable = false;
        }
    }
}
