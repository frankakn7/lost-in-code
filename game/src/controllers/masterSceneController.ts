import ChatViewScene from "../scenes/chatViewScene";
import {gameController} from "../main";
import Phaser, {Scene} from "phaser";
import {SceneKeys} from "../types/sceneKeys";
import EvaluationViewScene from "../scenes/evaluationViewScene";

enum SceneStates {
    ADDED,
    RUNNNING,
    SLEEPING,
    STOPPED
}

export default class MasterSceneController {

    private _sceneStates: { [key: string]: SceneStates } = {};

    prepScenesForChat() {
        for (let key in this._sceneStates) {
            if (this._sceneStates[key] === SceneStates.RUNNNING && (key !== SceneKeys.STORY_CHAT_VIEW_SCENE_KEY && key !== SceneKeys.SINGLE_TEXT_CHAT_VIEW_SCENE_KEY)) {
                this.sleepScene(key);
            }
        }
    }

    startScene(key: string, data?: object) {
        // console.log(this._sceneStates)
        gameController.startScene(key, data)
        this._sceneStates[key] = SceneStates.RUNNNING;
    }

    addScene(key: string, scene: Phaser.Scene) {
        if(!this.sceneExists(key)){
            gameController.addScene(key, scene);
            this._sceneStates[key] = SceneStates.ADDED;
        }
    }

    sleepScene(key: string) {
        gameController.sleepScene(key)
        this._sceneStates[key] = SceneStates.SLEEPING;
    }

    sleepAllScenes(){
        for (let key in this._sceneStates) {
            if(this._sceneStates[key] === SceneStates.RUNNNING){
                this.sleepScene(key)
                this._sceneStates[key] = SceneStates.SLEEPING
            }
        }
        // console.log(this._sceneStates)
    }

    wakeScene(key: string) {
        if(this._sceneStates[key] === SceneStates.SLEEPING){
            gameController.wakeScene(key)
            this._sceneStates[key] = SceneStates.RUNNNING;
        }
    }

    stopScene(key: string) {
        gameController.stopScene(key)
        this._sceneStates[key] = SceneStates.STOPPED;
    }

    removeScene(key: string) {
        gameController.removeScene(key)
        delete this._sceneStates[key]
    }

    sceneExists(sceneKey: string): boolean {
        return sceneKey in this._sceneStates;
    }

    isSceneRunning(sceneKey: string): boolean {
        return this._sceneStates[sceneKey] === SceneStates.RUNNNING || false;
    }

    isSceneSleeping(key: string): boolean {
        return this.sceneExists(key) && this._sceneStates[key] === SceneStates.SLEEPING;
    }
}