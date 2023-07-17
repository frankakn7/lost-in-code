

import * as Phaser from "phaser";
import InteractiveObject from "./interactiveObject";
import RoomScene from "../rooms/room";
import { globalEventBus } from "../globalEventBus";

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
        this.setDone = this.setDone.bind(this);
        this._isStoryObject = params.isStoryObject

        properties.forEach(p => {
            if (p["name"] == "story_id") this._isStoryObject = true;
        });
    }


    public interact(){
        //TODO: Build general interactivity function
        if(!this._isFinished){
            console.log("Interacted with "+this);
            this._isOpenRightNow = true;
            globalEventBus.once('taskmanager_object_finished', this.setDone);
            this.room.getPlayView().openQuestionView();      
        }

    }

    public update(...args: any[]): void {
        //TODO: Also turn off event if not finished
        // if (this._isOpenRightNow && !this._subscribed) {
        //     this.scene.events.on("taskmanager_object_finished", this.setDone);
        //     this._subscribed = true;
        // }
        // if (!this._isOpenRightNow && this._subscribed) {
        //     this.scene.events.off("taskmanager_object_finished", this.setDone);
        //     this._subscribed = false;
        // }
    }

    public setDone() {
        console.log(this)
        if (!this._isFinished) {
            if (this._isStoryObject) {
                this._isFinished = true;
                this.room.getPlayView().pullNextStoryBit(this.room.getRoomId());
                this.room.getPlayView().openChatView();
            }
        }
        
    }

    public isFinished() {
        return this._isFinished;
    }
}