

import * as Phaser from "phaser";
import InteractiveObject from "./interactiveObject";
import RoomScene from "../rooms/room";

export default class TaskObject extends InteractiveObject {
    private _isOpenRightNow: boolean = false;
    private _subscribed: boolean = false;
    private _isStoryObject: boolean = false;

    constructor(
        scene: Phaser.Scene,
        room: RoomScene,
        x: number,
        y: number,
        params
    ) {
        super(scene, room, x, y, params);
        this._isStoryObject = params.isStoryObject
    }


    public interact(){
        //TODO: Build general interactivity function
        console.log("Interacted with "+this);        
    }

    public update(...args: any[]): void {
        if (this._isOpenRightNow && !this._subscribed) {
            this.scene.events.on("taskmanager_object_finished", this.setDone);
            this._subscribed = true;
        }
        if (!this._isOpenRightNow && this._subscribed) {
            this.scene.events.off("taskmanager_object_finished", this.setDone);
            this._subscribed = false;
        }
    }

    public setDone() {
        this._isOpenRightNow = true;
        if (this._isStoryObject) {
            this.room.getPlayView().pullNextStoryBit();
        }
    }
}