import * as Phaser from "phaser";
import QuestionViewScene from "./questionView/questionViewScene";
import TaskManager from "../managers/taskManager";

import MenuViewScene from "./menuViewScene";

import {HatMap} from "../constants/hatMap";
import HatViewScene from "./hatViewScene";

import {GameStateType} from "../types/gameStateType";
import {globalEventBus} from "../helpers/globalEventBus";
import ApiHelper from "../helpers/apiHelper";
import ChapterManager, {ChapterType} from "../managers/chapterManager";
import DocViewScene from "./docView/docViewScene";

import NewsPopupScene from "./newsPopupScene";
import AchievementManager from "../managers/achievementManager";

import User from "../classes/user";
import EvaluationViewScene from "./evaluationViewScene";
import {UserType} from "../types/userType";
import RoomSceneController from "../controllers/roomSceneController";

import {gameController} from "../main";

import UiScene from "./uiScene";
import {SceneKeys} from "../types/sceneKeys";


/**
 * Represents the view in which the rooms and player are explorable (default playing view)
 */
export default class WorldViewScene extends Phaser.Scene {

    private taskQueue: Array<() => void> = [];

    /**
     * Called when the scene is woken up from being paused.
     * Processes tasks in the task queue, executing them one by one.
     */
    onWake() {
        // Execute all tasks in the queue
        while (this.taskQueue.length > 0) {
            const task = this.taskQueue.shift();
            if (task) {
                task();
            }
        }
    }

    queueTask(task: () => void) {
        this.taskQueue.push(task);
    }

    /**
     * Constructs the WorldViewScene scene, responsible for setting up the entire game.
     * @param {any} userData - Data related to the user, such as ID and username.
     * @param {GameStateType} state - The state of the game, indicating the progress and data of the user's playthrough.
     */
    constructor() {
        super(SceneKeys.WORLD_VIEW_SCENE_KEY);
    }

    /**
     * Initializes the WorldViewScene scene and sets up various components of the game.
     * Called during the scene's creation and initialization.
     */
    public create() {
        // gameController.roomSceneController.currentRoomScene = this._roomSceneController.roomMap.get(gameController.gameStateManager.currentRoom);

        // Set up event listeners for wake and sleep events of the WorldViewScene scene.
        this.events.on('wake', this.onWake, this);
        // this.events.on('sleep', () => {
        //     console.log("SLEEPING WORLD VIEW")
        // })

    }


    /**
     * Update function called every frame during the game loop.
     * @param time - The current game time in milliseconds.
     * @param delta - The time elapsed since the last frame in milliseconds.
     */
    public update(time: number, delta: number): void {

        // Handle pause button press to pause the game and open the menu.
        if (gameController.buttonStates.phonePressed) {
            gameController.buttonStates.phonePressed = false;

            // Launch the menu scene and pause the game.
            // this.scene.launch(this.menuView);
            gameController.menuSceneController.startMenuScene();
            // this.pauseOrResumeGame(true);
            // gameController.masterSceneController.sleepWorldViewScenes();
        }

    }

    /**
     * Pauses or resumes the game by pausing or resuming the current room and the control pad.
     * @param pause
     */
    // public pauseOrResumeGame: Function = (pause) => {
    //     //TODO perhaps fix problem with being able to move now in background
    //     if (pause) {
    //         this._roomSceneController.currentRoomScene.scene.pause();
    //         this._uiScene.scene.sleep()
    //         // this.controlPad.scene.pause();
    //     } else {
    //         this._roomSceneController.currentRoomScene.scene.resume();
    //         this._uiScene.scene.wake()
    //         // this.controlPad.scene.resume();
    //     }
    // }
}
