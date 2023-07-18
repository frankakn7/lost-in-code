

import * as Phaser from "phaser";
import InteractiveObject from "./interactiveObject";
import RoomScene from "../rooms/room";
import { globalEventBus } from "../globalEventBus";

export default class TaskObject extends InteractiveObject {
    protected _isOpenRightNow: boolean = false;
    protected _subscribed: boolean = false;
    protected _isStoryObject: boolean = false;

    protected _isFinished = false;
    protected _emitter : Phaser.GameObjects.Particles.ParticleEmitter;
    

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
            if (p["name"] == "is_story" && p["value"] == true) this._isStoryObject = true;
        });

        const shape = new Phaser.Geom.Rectangle(0, 0, this.width, this.height);
        this._emitter = this.scene.add.particles(this.x, this.y, 'flares', { 
            frame: { frames: ['red'], cycle: true},
            speed: 2,
            blendMode: 'ADD',
            lifespan: 5000,
            quantity: 1,
            scale: { start: 0.5, end: 0.1 },
            frequency: 800,
        });
        
        
        this._emitter.setDepth(11);
        
        this._emitter.addEmitZone({type: 'random', source: shape, total: 1});
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
        if (!this._isFinished) {
            if (this._isStoryObject) {
                this.setIsFinished(true);
                this.room.getPlayView().pullNextStoryBit(this.room.getRoomId());
                this.room.getPlayView().openChatView();
                this._emitter.setConfig({ 
                    frame: { frames: ['green'], cycle: true},
                    speed: 2,
                    blendMode: 'ADD',
                    lifespan: 5000,
                    quantity: 1,
                    scale: { start: 0.5, end: 0.1 },
                    frequency: 1000,
                });
            }
        }
        
    }

    public isFinished() {
        return this._isFinished;
    }

    public setIsFinished(finished) {
        this._isFinished = finished;
    }
}