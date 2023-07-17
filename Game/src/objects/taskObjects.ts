

import * as Phaser from "phaser";
import InteractiveObject from "./interactiveObject";
import RoomScene from "../rooms/room";

export default class TaskObject extends InteractiveObject {
    private _isOpenRightNow: boolean = false;
    private _subscribed: boolean = false;
    private _isStoryObject: boolean = false;

    private _isFinished = false;

    constructor(
        scene: Phaser.Scene,
        room: RoomScene,
        x: number,
        y: number,
        params,
        properties
    ) {
        super(scene, room, x, y, params, properties);
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
        if (!this.isFinished) {
            if (this._isStoryObject) {
                this._isFinished = true;
                this.room.getPlayView().pullNextStoryBit();
            }
        }
        
    }

    public isFinished() {
        return this._isFinished;
    }
}