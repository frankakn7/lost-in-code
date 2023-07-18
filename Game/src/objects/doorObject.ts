import TaskObject from "./taskObjects";
import RoomScene from "../rooms/room";
import {visibility} from "html2canvas/dist/types/css/property-descriptors/visibility";

export default class DoorObject extends TaskObject {
    constructor(
        scene: Phaser.Scene,
        room: RoomScene,
        x: number,
        y: number,
        params,
        properties
    ) {
        super(scene, room, x, y, params, properties);
    }

    protected preUpdate(time: number, delta: number) {
        if(this.isFinished()) {
            this.setVisible(false);
            this._emitter.setVisible(false);
        }
    }
}