import {globalEventBus} from "../helpers/globalEventBus";
import {achievements} from "../constants/achievements";
import WorldViewScene from "../scenes/worldViewScene";

import {gameController} from "../main";
import * as Events from "events";
import {GameEvents} from "../types/gameEvents";
import {debugHelper} from "../helpers/debugHelper";

/**
 * Achievement manager, handles the achievement flow, loading from json, saving to game state,
 */
export default class AchievementManager {

    private _achievements = achievements;  // Stores the achievements from the 'achievements' file.

    private _sessionStartDate = Date.now();

    /**
     * Creates an instance of the Achievement Manager.
     * @param {WorldViewScene} worldViewScene - The WorldViewScene instance that serves as the root of the game scene hierarchy.
     */
    constructor() {
        // Listen for the "taskmanager_task_correct" event emitted by the Task Manager.
        // When a task is correctly completed, call the _onTaskmanagerCorrect method.
        globalEventBus.on(GameEvents.TASKMANAGER_TASK_CORRECT, ((duration) => {
            this._onTaskmanagerCorrect(duration)
        }).bind(this));

        // Listen for the "taskmanager_task_incorrect" event emitted by the Task Manager.
        // When a task is answered incorrectly, call the _onTaskManagerIncorrect method.
        globalEventBus.on(GameEvents.TASKMANAGER_TASK_INCORRECT,
            this._onTaskManagerIncorrect.bind(this));

        // Listen for the "door_was_unlocked" event emitted when a door is unlocked in a room.
        // Call the _checkForLevelAchievement method to check for level-related achievements.
        globalEventBus.on(GameEvents.DOOR_UNLOCKED, ((room) => {
            this._checkForLevelAchievement(room)
        }).bind(this));
    }

    /**
     * Handles the event when a task is correctly completed.
     * Updates the task-related statistics and checks for task-related achievements.
     * @param {number} duration - The duration it took to complete the task.
     */
    private _onTaskmanagerCorrect(duration) {
        // Increment the total number of tasks completed.
        gameController.gameStateManager.achievements.taskCounter++;

        // Increment the current streak of correctly completed tasks.
        gameController.gameStateManager.achievements.currentStreak++;

        // Update the longest streak of correctly completed tasks, if applicable.
        if (gameController.gameStateManager.achievements.currentStreak > gameController.gameStateManager.achievements.longestStreak) gameController.gameStateManager.achievements.longestStreak = gameController.gameStateManager.achievements.currentStreak;

        // If the task completion duration is greater than zero, update the fastest task completion time.
        console.log("### DURATION")
        console.log(duration)
        if (duration > 0) {
            if (duration < gameController.gameStateManager.achievements.fastestTaskTimeInMilli) {
                gameController.gameStateManager.achievements.fastestTaskTimeInMilli = duration;
            }
        }

        // Check for task-related achievements based on the updated statistics.
        this._checkForTaskAchievement();
    }

    private _onTaskManagerIncorrect() {
        gameController.gameStateManager.achievements.currentStreak = 0;
        gameController.gameStateManager.achievements.incorrectCounter++;
    }

    private _checkForTaskAchievement() {
        let key = "tasks_" + gameController.gameStateManager.achievements.taskCounter.toString();
        if (achievements[key]) {
            if (gameController.gameStateManager.achievements.unlocked.includes(key)) return;
            this._unlock(key);
        }
    }

    private _checkForLevelAchievement(roomId: string) {
        let key = "level_" + roomId;
        if (achievements[key]) {
            if (gameController.gameStateManager.achievements.unlocked.includes(key)) return;
            this._unlock(key);
        }
    }

    private _unlock(achievementKey) {
        if (gameController.gameStateManager.achievements.unlocked.includes(achievementKey)) return;
        let achievement = achievements[achievementKey];
        globalEventBus.emit(GameEvents.BROADCAST_NEWS, achievement.text)
        globalEventBus.emit(GameEvents.BROADCAST_ACHIEVEMENT, achievements[achievementKey]);

        gameController.gameStateManager.achievements.unlocked.push(achievementKey);
        debugHelper.logString("earned achievement: "+achievementKey)
    }

    get badgesEarned(): number {
        return gameController.gameStateManager.achievements.unlocked.length;
    }

    get sessionStartDate(): number {
        return this._sessionStartDate;
    }
}