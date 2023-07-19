import PortalObject from "./objects/portalObject";
import HatObject from "./objects/hatObject";
import InteractiveObject from "./objects/interactiveObject";
import TaskObject from "./objects/taskObjects";
import DoorObject from "./objects/doorObject";
import EnemyObject from "./objects/enemyObject";

export const GameObjectMap = {
    door: {
        class: PortalObject,
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
        class: InteractiveObject,
        params: {
            texture: "engine",
            width: 60,
            height: 60,
            isStoryObject: false
        }
    },
    engineBroken: {
        class: TaskObject,
        params: {
            texture: "engineBroken",
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
            width: 35,
            height: 35,
            isStoryObject: false
        }
    },

    tableSeatLeft: {
        class: TaskObject,
        params: {
            texture: "tableseatleft",
            width: 32,
            height: 32,
            isStoryObject: true
        }
    },

    tableSeatRight: {
        class: InteractiveObject,
        params: {
            texture: "tableseatright",
            width: 32,
            height: 32,
            isStoryObject: false
        }
    },

    firstAidKit: {
        class: TaskObject,
        params: {
            texture: "firstaidkittexture",
            width: 32,
            height: 32,
            isStoryObject: false
        }

    },

    bed: {
        class: TaskObject,
        params: {
            texture: "bed",
            width: 32,
            height: 64,
            isStoryObject: true
        }

    },

    doorSingle: {
        class: DoorObject,
        params: {
            texture: "doorSingle",
            width: 32,
            height: 32,
            isStoryObject: false
        }
    },

    doorDouble: {
        class: DoorObject,
        params: {
            texture: "doorDouble",
            width: 64,
            height: 32,
            isStoryObject: false
        }
    },

    enemy: {
        class: EnemyObject,
        params: {
            texture: "enemy",
            width: 5,
            height: 5,
            isStoryObject: false
        }
    }
}