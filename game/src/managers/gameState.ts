import {GameStateType} from "../types/gameStateType";
import {Game} from "phaser";

export class GameState {
    gameFinished: boolean;
    room: {
        id: string,
        finishedTaskObjects: number[];
        doorUnlocked: boolean;
    };
    story: {
        hangar: string[];
        commonRoom: string[];
        engine: string[];
        laboratory: string[];
        bridge: string[];
        history: string[][];
    };
    achievements: {
        taskCounter: number;
        incorrectCounter: number;
        currentStreak: number;
        longestStreak: number;
        fastestTaskTime: number;
        unlocked: string[];
    };
    user: {
        newChapter: boolean;
        answeredQuestionIds: number[];
        chapterNumber: number;
        performanceIndex: number;
        repairedObjectsThisChapter: number;
        selectedHat: string;
        unlockedHats: string[];
        username: string;
    };

    initialiseEmpty() {
        this.gameFinished = false
        this.room = {
            id: "hangar",
            finishedTaskObjects: [],
            doorUnlocked: false
        };
        this.story = {
            hangar: [],
            commonRoom: [],
            engine: [],
            laboratory: [],
            bridge: [],
            history: [[]],
        };
        this.achievements = {
            taskCounter: 0,
            incorrectCounter: 0,
            currentStreak: 0,
            longestStreak: 0,
            fastestTaskTime: 0,
            unlocked: [],
        };
        this.user = {
            newChapter: false,
            answeredQuestionIds: [],
            chapterNumber: 1,
            performanceIndex: 1,
            repairedObjectsThisChapter: 0,
            selectedHat: "None",
            unlockedHats: [],
            username: "Peter"
        };
    }

    initialiseExisting(existingGameState: GameState) {
        // this.currentRoomId = existingGameState.currentRoomId;
        this.gameFinished = existingGameState.gameFinished;
        this.room = existingGameState.room;
        this.story = existingGameState.story;
        this.achievements = existingGameState.achievements;
        this.user = existingGameState.user;
    }

    constructor(existingGameState?: GameState) {
        if (existingGameState) {
            this.initialiseExisting(existingGameState);
        } else {
            this.initialiseEmpty();
        }
    }

    changeRoom(newRoomId: string){
        this.room.id = newRoomId;
        this.room.doorUnlocked = false;
        this.room.finishedTaskObjects = [];
    }

    addUnlockedHats(hatId) {
        this.user.unlockedHats.push(hatId);
    }

    increaseRepairedObjectsThisChapter() {
        this.user.repairedObjectsThisChapter ++;
    }

    increaseChapterNumber() {
        this.user.chapterNumber ++;
    }

    addAnsweredQuestionIds(id) {
        if(!this.user.answeredQuestionIds.includes(id)){
            this.user.answeredQuestionIds.push(id);
        }
    }

    setDoorUnlocked(unlocked: boolean){
        this.room.doorUnlocked = unlocked;
    }
}