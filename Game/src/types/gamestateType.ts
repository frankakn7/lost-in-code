import {UserStateType} from "./userStateType";

export type GamestateType = {
    rootNode: {
        currentRoom: string;
        gameFinished: boolean;
    };
    room: {
        finishedTaskObjects: boolean[];
    };
    story: {
        hangar: string[];
        commonRoom: string[];
        engine: string[];
        laboratory: string[];
        bridge: string[];
    };
    achievements: {
        taskCounter: number;
        incorrectCounter: number;
        currentStreak: number;
        longestStreak: number;
        fastestTaskTime: number;
        unlocked: string[];
    };
    user: UserStateType
};
