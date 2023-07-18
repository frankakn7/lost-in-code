import DoorObject from "./objects/doorObject";
import HatObject from "./objects/hatObject";
import InteractiveObject from "./objects/interactiveObject";
import TaskObject from "./objects/taskObjects";

export const GameObjectMap = {
    door: {
        class: DoorObject,
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
    },
    barrel: {
        class: TaskObject,
        params: {
            texture: "barrel",
            width: 32,
            height: 32,
            isStoryObject: false
        }
    },
    crate: {
        class: TaskObject,
        params: {
            texture: "crate",
            width: 32,
            height: 32,
            isStoryObject: false,
            
        }
    },
    crate2: {
        class: TaskObject,
        params: {
            texture: "crate2",
            width: 32,
            height: 32,
            isStoryObject: false,
            
        }
    },
    
    crate4: {
        class: TaskObject,
        params: {
            texture: "crate4",
            width: 64,
            height: 40,
            isStoryObject: false
        }
    },

    computer: {
        class: TaskObject,
        params: {
            texture: "computer",
            width: 32,
            height: 32,
            isStoryObject: false
        }
    },
    
    cannon: {
        class: TaskObject,
        params: {
            texture: "cannon",
            width: 32,
            height: 32,
            isStoryObject: false
        }
    }
}