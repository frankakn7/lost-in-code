export type GamestateType = {
    hats: {
        unlockedHats: string[];
        selectedHat: string;
    };
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
};
