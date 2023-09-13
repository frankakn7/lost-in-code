import {globalEventBus} from "../helpers/globalEventBus";
import {achievements} from "../constants/achievements";
import WorldViewScene from "../scenes/worldViewScene";

/**
 * Achievement manager, handles the achievement flow, loading from json, saving to game state,
 */
export default class AchievementManager {

    private _tasksCounter = 0; // Stores the number of tasks completed.
    private _incorrectCounter = 0; // Stores the number of incorrectly answered tasks.
    private _currentStreak = 0; // Stores the current streak of correct tasks.
    private _longestStreak = 0; // Stores the longest streak of correct tasks.
    private _fastestTaskTime = 0; // Stores the fastest time to complete a task.
    public unlocked = []; // Stores the IDs of the unlocked achievements.

    private _achievements = achievements;  // Stores the achievements from the 'achievements' file.

    private _worldViewScene : WorldViewScene; // The root node of the game or application.

    /**
     * Creates an instance of the Achievement Manager.
     * @param {WorldViewScene} worldViewScene - The WorldViewScene instance that serves as the root of the game scene hierarchy.
     */
    constructor(worldViewScene: WorldViewScene) {
        this._worldViewScene = worldViewScene;
        this.loadData();


        // Listen for the "taskmanager_task_correct" event emitted by the Task Manager.
        // When a task is correctly completed, call the _onTaskmanagerCorrect method.
        globalEventBus.on("taskmanager_task_correct", ((duration) => {
            this._onTaskmanagerCorrect(duration)
        }).bind(this));

        // Listen for the "taskmanager_task_incorrect" event emitted by the Task Manager.
        // When a task is answered incorrectly, call the _onTaskManagerIncorrect method.
        globalEventBus.on("taskmanager_task_incorrect",
            this._onTaskManagerIncorrect.bind(this));

        // Listen for the "door_was_unlocked" event emitted when a door is unlocked in a room.
        // Call the _checkForLevelAchievement method to check for level-related achievements.
        globalEventBus.on("door_was_unlocked", ((room) => {this._checkForLevelAchievement(room)}).bind(this));
    }

    /**
     * Handles the event when a task is correctly completed.
     * Updates the task-related statistics and checks for task-related achievements.
     * @param {number} duration - The duration it took to complete the task.
     */
    private _onTaskmanagerCorrect(duration) {
        // Increment the total number of tasks completed.
        this._tasksCounter++;

        // Increment the current streak of correctly completed tasks.
        this._currentStreak++;

        // Update the longest streak of correctly completed tasks, if applicable.
        if (this._currentStreak > this._longestStreak) this._longestStreak = this._currentStreak;

        // If the task completion duration is greater than zero, update the fastest task completion time.
        if (duration > 0) {
            if (duration < this._fastestTaskTime) {
                this._fastestTaskTime = duration;
            }
        }

        // Check for task-related achievements based on the updated statistics.
        this._checkForTaskAchievement();
    }

    private _onTaskManagerIncorrect() {
        this._currentStreak = 0;
        this._incorrectCounter++;
    }

    private _checkForTaskAchievement() {
        let key = "tasks_" + this._tasksCounter.toString();
        if (achievements[key]) {
            if (this.unlocked.includes(key)) return;
            this._unlock(key);
        }
    }

    private _checkForLevelAchievement(roomId: string) {
        let key = "level_" + roomId;
        if (achievements[key]) {
            if (this.unlocked.includes(key)) return;
            this._unlock(key);
        }
    }

    private _unlock(achievementKey) {
        if (this.unlocked.includes(achievementKey)) return;
        let achievement = achievements[achievementKey];
        globalEventBus.emit("broadcast_news", achievement.text)
        globalEventBus.emit("broadcast_achievement", achievements[achievementKey]);

        this.unlocked.push(achievementKey);
        console.log("Earned achievement: " + achievementKey);
    }

    public saveAll() {
        return {
            taskCounter: this._tasksCounter,
            incorrectCounter: this._incorrectCounter,
            currentStreak: this._currentStreak,
            longestStreak: this._longestStreak,
            fastestTaskTime: this._fastestTaskTime,
            unlocked: this.unlocked,
        }
    }


    public loadData() {
        this.unlocked = this._worldViewScene.gameStateManager.achievements.unlocked;
        this._tasksCounter = this._worldViewScene.gameStateManager.achievements.taskCounter;
        this._incorrectCounter = this._worldViewScene.gameStateManager.achievements.incorrectCounter;
        this._currentStreak = this._worldViewScene.gameStateManager.achievements.currentStreak;
        this._longestStreak = this._worldViewScene.gameStateManager.achievements.longestStreak;
        this._fastestTaskTime = this._worldViewScene.gameStateManager.achievements.fastestTaskTime;
    }

    get tasksCounter(): number {
        return this._tasksCounter;
    }
    get longestStreak(): number {
        return this._longestStreak;
    }
    get incorrectCounter(): number {
        return this._incorrectCounter;
    }

    get badgesEarned(): number {
        return this.unlocked.length;
    }

    get fastestTaskTime(): number {
        return this._fastestTaskTime;
    }
}