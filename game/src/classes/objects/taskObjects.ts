

import * as Phaser from "phaser";
import InteractiveObject from "./interactiveObject";
import RoomScene from "../room";
import { globalEventBus } from "../../helpers/globalEventBus";
import {gameController} from "../../main";
import {GameEvents} from "../../types/gameEvents";

/**
 * TaskObject is a subclass of InteractiveObject that represents an object that can be interacted with to complete a task.
 * It extends InteractiveObject and provides additional functionality for task-related interactions and status.
 *
 * @class TaskObject
 * @extends InteractiveObject
 */
export default class TaskObject extends InteractiveObject {
    protected _isOpenRightNow: boolean = false; // Stores whether the object is currently open.
    protected _subscribed: boolean = false; // Stores whether the object is currently subscribed to the taskmanager_task_correct event.
    protected _isStoryObject: boolean = false; // Stores whether the object is a story object.

    protected _isFinished = false; // Stores whether the object is finished.
    protected _emitter : Phaser.GameObjects.Particles.ParticleEmitter; // Stores the particle emitter for the object.


    private _redParticleEmitterConfig: Phaser.Types.GameObjects.Particles.ParticleEmitterConfig = {
        frame: { frames: ['red'], cycle: true},
        speed: 2,
        blendMode: 'ADD',
        lifespan: 5000,
        quantity: 1,
        scale: { start: 0.5, end: 0.1 },
        frequency: 800,
    }
    private _greenParticleEmitterConfig: Phaser.Types.GameObjects.Particles.ParticleEmitterConfig = {...this._redParticleEmitterConfig, frame: {frames: ['green'], cycle: true}}

    /**
     * Creates an instance of TaskObject.
     * @param id
     * @param scene
     * @param room
     * @param x
     * @param y
     * @param params
     * @param properties
     */
    constructor(
        id: number,
        scene: Phaser.Scene,
        room: RoomScene,
        x: number,
        y: number,
        params,
        properties
    ) {
        super(id, scene, room, x, y, params);
        this.setDone = this.setDone.bind(this);
        this.setClosed = this.setClosed.bind(this);
        this._isStoryObject = params.isStoryObject

        properties.forEach(p => {
            if (p["name"] == "is_story" && p["value"] == true) this._isStoryObject = true;
        });

        const shape = new Phaser.Geom.Rectangle(0, 0, this.width, this.height);
        this._emitter = this.scene.add.particles(this.x, this.y, 'flares', this._redParticleEmitterConfig);

        if (this.isFinished()) {
            this._setEmitterToDone();
        }

        
        this._emitter.setDepth(11);
        
        this._emitter.addEmitZone({type: 'random', source: shape, total: 1});
    }

    /**
     * Function to be executed when player interacts with the task object.
     * It opens the question view and subscribes to events for task completion/failure.
     */
    public interact(){
        //TODO: Build general interactivity function
        
        if(!this._isFinished && !this._isOpenRightNow){
            // console.log("Interacted with ");
            this._isOpenRightNow = true;
            globalEventBus.once(GameEvents.TASKMANAGER_OBJECT_FINISHED, this.setDone);
            globalEventBus.once(GameEvents.TASKMANAGER_OBJECT_FAILED, this.setClosed);
            gameController.questionSceneController.openQuestionView();
        }

    }

    /**
     * Function to be executed when the task associated with the object fails.
     * It resets the object's status and unsubscribes from task-related events.
     */
    public setClosed(){
        this._isOpenRightNow = false;
        globalEventBus.off(GameEvents.TASKMANAGER_OBJECT_FINISHED,this.setDone);
    }

    /**
     * Function to be executed when the task associated with the object is completed successfully.
     * It updates the object's status, emits events, and opens the story chat view if it is a story object.
     */
    public setDone() {

        globalEventBus.off(GameEvents.TASKMANAGER_OBJECT_FAILED, this.setClosed);
        if (!this._isFinished) {
            this.setIsFinished(true);

            gameController.gameStateManager.room.finishedTaskObjects.push(this._id)
            // gameController.gameStateManager.room.finishedTaskObjects.push(true)
            this._setEmitterToDone();

            globalEventBus.emit(GameEvents.SAVE_GAME)
            globalEventBus.emit(GameEvents.OBJECT_REPAIRED)
            if (this._isStoryObject) {
                // this.room.getPlayView().pullNextStoryBit(this.room.getRoomId());
                // this.room.worldViewScene.openStoryChatView();
                gameController.chatSceneController.openStoryChatView();
            }
            
            this.room.roomManager.checkIfRoomFinished();
        }

    }

    /**
     * Sets the particle emitter to show the "done" effect when the task is completed.
     */
    private _setEmitterToDone() {
        this._emitter.setConfig(this._greenParticleEmitterConfig);
    }

    /**
     * Checks if the task associated with the object is finished.
     * @returns {boolean} Whether the task is finished or not.
     */
    public isFinished() {
        // console.log(this._isFinished);
        return this._isFinished;
    }

    /**
     * Sets the status of the object according to its task.
     * @param finished
     */
    public setIsFinished(finished:boolean) {
        this._isFinished = finished;

        if (finished) {
            this._setEmitterToDone();
        }
    }
}