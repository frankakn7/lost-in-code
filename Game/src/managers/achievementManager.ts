import {globalEventBus} from "../helpers/globalEventBus";
import {achievements} from "../constants/achievements";
import RootNode from "../views/rootNode";


export default class AchievementManager {

    private _tasksCounter = 0;
    private _incorrectCounter = 0;
    private _currentStreak = 0;
    private _longestStreak = 0;
    private _fastestTaskTime = 0;
    public unlocked = [];

    private _achievements = achievements;

    private _rootNode : RootNode;

    constructor(rootNode: RootNode) {
        this._rootNode = rootNode;
        this.loadData();


        globalEventBus.on("taskmanager_task_correct", ((duration) => {
            this._onTaskmanagerCorrect(duration)
        }).bind(this));


        globalEventBus.on("taskmanager_task_incorrect",
            this._onTaskManagerIncorrect.bind(this));

        globalEventBus.on("door_was_unlocked", ((room) => {this._checkForLevelAchievement(room)}).bind(this));
    }

    private _onTaskmanagerCorrect(duration) {
        this._tasksCounter++;
        this._currentStreak++;

        if (this._currentStreak > this._longestStreak) this._longestStreak = this._currentStreak;

        if (duration > 0) {
            if (duration < this._fastestTaskTime) {
                this._fastestTaskTime = duration;
            }
        }

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
        this.unlocked = this._rootNode.getState().achievements.unlocked;
        this._tasksCounter = this._rootNode.getState().achievements.taskCounter;
        this._incorrectCounter = this._rootNode.getState().achievements.incorrectCounter;
        this._currentStreak = this._rootNode.getState().achievements.currentStreak;
        this._longestStreak = this._rootNode.getState().achievements.longestStreak;
        this._fastestTaskTime = this._rootNode.getState().achievements.fastestTaskTime;
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