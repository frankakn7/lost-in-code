import * as Phaser from "phaser";
import InteractiveObject from "./interactiveObject";
import PlayView from "../views/playView";
import RoomScene from "../rooms/room";

export default class DoorTaskObject extends InteractiveObject {
    constructor(
        scene: Phaser.Scene,
        room: RoomScene,
        x: number,
        y: number,
        params
    ) {
        super(scene, room, x, y, params);
    }

    public interact(): void {
        console.log("Open Door");
        this.room.getPlayView().getToRoomViaId(this.room.getNextRoom());
        
    }
}