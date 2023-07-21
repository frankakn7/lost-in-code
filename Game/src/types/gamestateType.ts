import {UserStateType} from "./userStateType";

export type GamestateType = {
    playView: {
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
    };
    user: UserStateType
};
