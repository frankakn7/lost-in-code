import * as Phaser from "phaser";
import {GameStateType} from "../types/gameStateType";
import {gameController} from "../main";
import {SceneKeys} from "../types/sceneKeys";


/**
 * Represents the view in which the rooms and player are explorable (default playing view)
 */
export default class WorldViewScene extends Phaser.Scene {

    private taskQueue: Array<() => void> = [];

    // /**
    //  * Called when the scene is woken up from being paused.
    //  * Processes tasks in the task queue, executing them one by one.
    //  */
    // onWake() {
    //     // Execute all tasks in the queue
    //
    // }

    queueTask(task: () => void) {
        this.taskQueue.push(task);
    }

    /**
     * Constructs the WorldViewScene scene, responsible for setting up the entire game.
     */
    constructor() {
        super(SceneKeys.WORLD_VIEW_SCENE_KEY);
    }

    /**
     * Initializes the WorldViewScene scene and sets up various components of the game.
     * Called during the scene's creation and initialization.
     */
    public create() {
        // Set up event listeners for wake and sleep events of the WorldViewScene scene.
        // this.events.on('wake', this.onWake, this);
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
            gameController.menuSceneController.startMenuScene();
        }

        while (this.taskQueue.length > 0) {
            const task = this.taskQueue.shift();
            if (task) {
                task();
            }
        }
    }
}
