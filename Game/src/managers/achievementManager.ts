import {globalEventBus} from "../helpers/globalEventBus";
import {achievements} from "../constants/achievements";


export default class AchievementManager {
    public tasksCounter = 16;
    private _achievements = achievements;
    public unlocked = [ "tasks_5", "tasks_10"];

    constructor() {
        globalEventBus.on("taskmanager_task_correct",
            (() => {this.tasksCounter++; this._checkForTaskAchievement()}).bind(this));
    }

    private _checkForTaskAchievement() {
        let key = "tasks_" + this.tasksCounter.toString();
        if (achievements[key]) {
            if (this.unlocked.includes(key)) return;
            let achievement = achievements[key];
            globalEventBus.emit("broadcast_news", achievement.text)
            globalEventBus.emit("broadcast_achievement", achievements[key]);

            this.unlocked.push(key);
            console.log("Earned achievement: " + key);
        }
    }

    private _unlockAchievement(achievementId) {

    }
}