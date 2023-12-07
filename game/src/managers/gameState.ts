import { SupportedLanguages } from "../types/supportedLanguages";
import {gameController} from "../main";

export class GameState {
    gameFinished: boolean;
    room: {
        id: string;
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
        fastestTaskTimeInMilli: number;
        totalPlayTimeInMilli: number;
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
    curriculum: {
        maxChapterNumber: number;
        progLang: SupportedLanguages;
    };

    initialiseDefault() {
        this.gameFinished = false;
        this.room = {
            id: "hangar",
            finishedTaskObjects: [],
            doorUnlocked: false,
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
            fastestTaskTimeInMilli: 6000 * 1000, //100 minutes
            totalPlayTimeInMilli: 0,
            unlocked: [],
        };
        this.user = {
            newChapter: true,
            answeredQuestionIds: [],
            chapterNumber: 1,
            performanceIndex: 1,
            repairedObjectsThisChapter: 0,
            selectedHat: "None",
            unlockedHats: [],
            username: "Peter",
        };
        this.curriculum = {
            maxChapterNumber: 1,
            progLang: SupportedLanguages.PHP,
        };
    }

    initialise(progLang: SupportedLanguages, existingGameState?: GameState) {
        this.initialiseDefault();
        if (!existingGameState) return;

        this.gameFinished = existingGameState.gameFinished ?? this.gameFinished;
        this.room = { ...this.room, ...existingGameState.room };
        this.story = { ...this.story, ...existingGameState.story };
        this.achievements = { ...this.achievements, ...existingGameState.achievements };
        this.user = { ...this.user, ...existingGameState.user };
        this.curriculum = { ...this.curriculum, ...existingGameState.curriculum, progLang: progLang};
    }

    constructor(progLang: SupportedLanguages, existingGameState?: GameState) {
        this.initialise(progLang, existingGameState);
    }

    changeRoom(newRoomId: string) {
        this.room.id = newRoomId;
        this.room.doorUnlocked = false;
        this.room.finishedTaskObjects = [];
    }

    addUnlockedHats(hatId) {
        this.user.unlockedHats.push(hatId);
    }

    increaseRepairedObjectsThisChapter() {
        this.user.repairedObjectsThisChapter++;
    }

    increaseChapterNumber() {
        if (this.user.chapterNumber < this.curriculum.maxChapterNumber) {
            this.user.chapterNumber++;
        }
    }

    addAnsweredQuestionIds(id) {
        if (!this.user.answeredQuestionIds.includes(id)) {
            this.user.answeredQuestionIds.push(id);
        }
    }

    setDoorUnlocked(unlocked: boolean) {
        this.room.doorUnlocked = unlocked;
    }

    calculateNewPlayTime(){
        this.achievements.totalPlayTimeInMilli += Date.now() - gameController.timestampSinceLastSaveOrReload;
        gameController.resetTimeSinceLastSaveOrReload();
    }
}