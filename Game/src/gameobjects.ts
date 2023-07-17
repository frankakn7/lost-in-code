import DoorTaskObject from "./objects/doorObject";
import HatObject from "./objects/hatObject";
import InteractiveObject from "./objects/interactiveObject";
import TaskObject from "./objects/taskObjects";

export const GameObjectMap = {
    door: {
        class: DoorTaskObject,
        params: {
            texture: "door",
            width: 18,
            height: 64
        }
    },
    hat: {
        class: HatObject,
        params: {
            texture: "sorcerersHat",
            hat_id: "sorcerersHat",
            width: 32,
            height: 32
        }
    },
    engine: {
        class: TaskObject,
        params: {
            texture: "engine",
            width: 60,
            height: 60,
            isStoryObject: false
        }
    },
    locker: {
        class: TaskObject,
        params: {
            texture: "locker",
            width: 80,
            height: 40,
            isStoryObject: false
        }
    }
}