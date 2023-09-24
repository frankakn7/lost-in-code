import {UserStateType} from "./userStateType";

export type GameStateType = {
    currentRoomId: string;
    gameFinished: boolean;
    room: {
        finishedTaskObjects: boolean[];
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
        answeredQuestionIds: number[],
        chapterNumber: number,
        performanceIndex: number
        repairedObjectsThisChapter: number,
        selectedHat: string,
        unlockedHats: string[],
        username: string
    }
};
