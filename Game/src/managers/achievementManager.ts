import {globalEventBus} from "../helpers/globalEventBus";
import {achievements} from "../constants/achievements";
import RootNode from "../views/rootNode";


export default class AchievementManager {
    public tasksCounter = 16;
    private _achievements = achievements;
    public unlocked = [ "tasks_5", "tasks_10"];
    private _rootNode : RootNode;

    constructor(rootNode: RootNode) {
        this._rootNode = rootNode;
        this.loadData();
        globalEventBus.on("taskmanager_task_correct",
            (() => {this.tasksCounter++; this._checkForTaskAchievement()}).bind(this));

        globalEventBus.on("door_was_unlocked", ((room) => {this._checkForLevelAchievement(room)}).bind(this));
    }

    private _checkForTaskAchievement() {
        let key = "tasks_" + this.tasksCounter.toString();
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
            taskCounter: this.tasksCounter,
            unlocked: this.unlocked
        }
    }

    public loadData() {
        this.unlocked = this._rootNode.getState().achievements.unlocked;
        this.tasksCounter = this._rootNode.getState().achievements.taskCounter;
    }
}