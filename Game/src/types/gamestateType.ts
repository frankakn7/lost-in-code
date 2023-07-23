import {UserStateType} from "./userStateType";

export type GamestateType = {
    rootNode: {
        currentRoom: string;
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
        history: string[][];
    };
    achievements: {
        taskCounter: number;
        unlocked: string[];
    };
    user: UserStateType
};
